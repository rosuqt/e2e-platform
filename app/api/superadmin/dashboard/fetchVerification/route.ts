import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_companies")
    .select("verify_status")

  if (error || !Array.isArray(data)) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
  }

  const statusCounts = {
    basic: 0,
    standard: 0,
    full: 0
  }

  data.forEach(row => {
    if (row.verify_status === "basic") statusCounts.basic += 1
    else if (row.verify_status === "standard") statusCounts.standard += 1
    else if (row.verify_status === "full") statusCounts.full += 1
  })

  return NextResponse.json({
    pending: statusCounts.basic,
    partiallyCompleted: statusCounts.standard,
    approved: statusCounts.full
  })
}
