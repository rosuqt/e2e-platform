import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_admins")
    .select("id, username, password, first_name, last_name, status,superadmin")
    .eq("username", username)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
  }

  const passwordMatch = await bcrypt.compare(password, data.password)
  if (!passwordMatch) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
  }

  if (data.status !== "active") {
    return NextResponse.json({ error: "Account is not active" }, { status: 403 })
  }

  return NextResponse.json({
    id: data.id,
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    status: data.status,
    superadmin: data.superadmin
  })
}
