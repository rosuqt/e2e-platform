import { NextRequest } from "next/server"
import { getAdminSupabase } from "../../../../src/lib/supabase"

export async function POST(req: NextRequest) {
  const { studentId } = await req.json()
  if (!studentId) {
    return new Response(JSON.stringify({ error: "Missing studentId" }), { status: 400 })
  }
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("job_matches")
    .select("gpt_score")
    .eq("student_id", studentId)
    .not("gpt_score", "is", null)
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
  const scores = Array.isArray(data) ? data.map(row => Number(row.gpt_score)).filter(n => !isNaN(n) && n >= 30) : []
  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
  return new Response(JSON.stringify({ average: avg, scores }), { status: 200 })
}
