import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const company_id = searchParams.get("company_id")
  if (!company_id) {
    return NextResponse.json({ error: "Missing company_id" }, { status: 400 })
  }
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_companies")
    .select("company_name")
    .eq("id", company_id)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Company not found" }, { status: 404 })
  }
  return NextResponse.json({ company_name: data.company_name })
}
