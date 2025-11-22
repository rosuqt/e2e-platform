import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = getAdminSupabase()
  const { data: matches, error } = await supabase
    .from("job_matches")
    .select("job_id, gpt_score")
    .eq("student_id", studentId)
    .gte("gpt_score", 30)
    .lte("gpt_score", 100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const jobIds = matches.map(m => m.job_id).filter(Boolean)
  if (jobIds.length === 0) return NextResponse.json({ jobs: [] })

  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select("*")
    .in("id", jobIds)

  if (jobsError) return NextResponse.json({ error: jobsError.message }, { status: 500 })

  const jobsWithScore = jobs.map(job => {
    const match = matches.find(m => m.job_id === job.id)
    return { ...job, gpt_score: match?.gpt_score }
  })

  jobsWithScore.sort((a, b) => {
    const aScore = typeof a.gpt_score === "number" ? a.gpt_score : -Infinity;
    const bScore = typeof b.gpt_score === "number" ? b.gpt_score : -Infinity;
    if (aScore === -Infinity && bScore === -Infinity) return 0;
    if (aScore === -Infinity) return 1;
    if (bScore === -Infinity) return -1;
    return bScore - aScore;
  });

  return NextResponse.json({ jobs: jobsWithScore })
}
