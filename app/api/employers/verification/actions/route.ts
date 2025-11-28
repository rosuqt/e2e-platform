import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Missing or invalid id/status" }, { status: 400 })
  }
  const supabase = getAdminSupabase()
  const { data: verification, error: verificationError } = await supabase
    .from("employer_verifications")
    .select("employer_id, company_name")
    .eq("id", id)
    .single()
  if (verificationError || !verification) {
    return NextResponse.json({ error: "Verification not found" }, { status: 404 })
  }
  if (status === "rejected") {
    await supabase
      .from("registered_employers")
      .update({ is_archived: true })
      .eq("id", verification.employer_id)
  }
  if (status === "approved") {
    await supabase
      .from("registered_employers")
      .update({ verify_status: "full" })
      .eq("id", verification.employer_id)
    await supabase
      .from("registered_companies")
      .update({ verify_status: "full" })
      .eq("company_name", verification.company_name)
  }
  const { error: updateError } = await supabase
    .from("employer_verifications")
    .update({ status })
    .eq("id", id)
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
