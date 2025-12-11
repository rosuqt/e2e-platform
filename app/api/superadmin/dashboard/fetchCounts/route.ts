import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const supabase = getAdminSupabase()
  const tables = [
    "registered_students",
    "registered_employers",
    "registered_admins",
    "registered_companies"
  ]
  const results = await Promise.all(
    tables.map(table =>
      supabase.from(table).select("*", { count: "exact", head: true })
    )
  )
  return NextResponse.json({
    totalStudents: results[0].count ?? 0,
    totalEmployers: results[1].count ?? 0,
    totalAdmins: results[2].count ?? 0,
    totalCompanies: results[3].count ?? 0
  })
}
