import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) return new Response("Unauthorized", { status: 401 })
  const body = await req.json()
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from("dtr_jobs")
    .insert([{
      student_id: studentId,
      job_id: body.job_id ?? null,
      applied_at: body.applied_at ?? null,
      status: body.status ?? null,
      job_title: body.job_title ?? body.jobTitle ?? null,
      work_type: body.work_type ?? null,
      remote_options: body.remote_options ?? null,
      employer_id: body.employer_id ?? null,
      company_id: body.company_id ?? null,
      employer_first_name: body.employer_first_name ?? null,
      employer_last_name: body.employer_last_name ?? null,
      company_name: body.company_name ?? body.company ?? null,
      total_hours: body.totalHours ?? null,
      start_date: body.startDate ?? null,
    }])
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
