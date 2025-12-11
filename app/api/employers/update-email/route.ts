import { NextResponse } from "next/server"
import supabase from "../../../../src/lib/supabase"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { newEmail } = body
  const token = await getToken({ req: request })
  const employerId = token?.employerId
  if (!employerId || !newEmail) {
    console.log("POST /api/employers/update-email 400 error:", { employerId, newEmail })
    return NextResponse.json({ error: "Missing employerId or newEmail" }, { status: 400 })
  }
  const { data: existing } = await supabase
    .from("registered_employers")
    .select("id")
    .eq("email", newEmail)
    .neq("id", employerId)
    .maybeSingle()
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 })
  }
  const { error } = await supabase
    .from("registered_employers")
    .update({ email: newEmail })
    .eq("id", employerId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
