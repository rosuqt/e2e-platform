import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const employer_id = searchParams.get("employer_id")
  if (!employer_id) {
    return NextResponse.json({ error: "Missing employer_id" }, { status: 400 })
  }
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_employers")
    .select("company_id")
    .eq("id", employer_id)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Employer not found" }, { status: 404 })
  }
  return NextResponse.json({ company_id: data.company_id })
}
