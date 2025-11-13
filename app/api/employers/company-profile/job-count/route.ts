import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const company_id = req.nextUrl.searchParams.get("company_id")
  if (!company_id) {
    return NextResponse.json({ error: "Missing company_id" }, { status: 400 })
  }
  const supabase = getAdminSupabase()
  const { count, error } = await supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true })
    .eq("company_id", company_id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ count: count ?? 0 })
}
