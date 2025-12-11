import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Pool } from "pg"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  const { data, error } = await supabase.from("sti_careers").select("*").order("posted_date", { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const counts: Record<string, number> = {}
  try {
    const result = await pool.query(
      `SELECT career_id, COUNT(*) AS count FROM public.sti_applications GROUP BY career_id`
    )
    for (const row of result.rows) {
      counts[row.career_id] = Number(row.count)
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch application counts" }, { status: 500 })
  }

  const careersWithCounts = (data || []).map(career => ({
    ...career,
    application_count: counts[career.id] || 0
  }))

  return NextResponse.json({ data: careersWithCounts })
}
