/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get("studentId") || session?.user?.studentId
  if (!studentId) return new Response("Unauthorized", { status: 401 })

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("dtr_jobs")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const jobs = (data ?? []).map((job: any) => ({
    id: job.id,
    jobTitle: job.job_title,
    company: job.company_name,
    totalHours: job.total_hours,
    startDate: job.start_date,
    externalApplication: job.external_application,
    createdAt: job.created_at,
  }))

  return new Response(JSON.stringify({ jobs }), { status: 200 })
}
