import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const company_id = searchParams.get("company_id")
  if (!company_id) return NextResponse.json({ count: 0 })
  const supabase = getAdminSupabase()
  const { count } = await supabase
    .from("registered_branches")
    .select("id", { count: "exact", head: true })
    .eq("company_id", company_id)
  return NextResponse.json({ count: count ?? 0 })
}
