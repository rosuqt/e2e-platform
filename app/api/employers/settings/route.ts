import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  const employerId = session?.user?.employerId
  if (!employerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_employers")
    .select("id, first_name, middle_name, last_name, suffix, phone, email, verify_status")
    .eq("id", employerId)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const employerId = session?.user?.employerId
  if (!employerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { first_name, middle_name, last_name, suffix, phone, email } = body

  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from("registered_employers")
    .update({ first_name, middle_name, last_name, suffix, phone, email })
    .eq("id", employerId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
