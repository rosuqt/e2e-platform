import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const data = await req.json()
  const {
    username,
    password,
    firstName,
    middleName,
    lastName,
    suffix,
    department,
  } = data

  if (!username || !password || !firstName || !lastName || !department) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  const { data: existing } = await supabase
    .from("ojt_coordinators")
    .select("id")
    .eq("username", username)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data: inserted, error } = await supabase
    .from("ojt_coordinators")
    .insert([
      {
        username,
        password: hashedPassword,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        suffix,
        department,
        status: "active",
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ coordinator: inserted }, { status: 201 })
}
