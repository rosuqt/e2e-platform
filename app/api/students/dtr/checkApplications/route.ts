/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  console.log("DTR API studentId:", studentId)
  if (!studentId) {
    return new Response(JSON.stringify([]), { status: 200 })
  }
  const supabase = getAdminSupabase()
  const { data: applications, error } = await supabase
    .from("applications")
    .select("job_id, applied_at, status")
    .eq("student_id", studentId)
    .in("status", ["Hired", "hired"])
  console.log("DTR API applications:", applications, "error:", error)
  if (error || !applications || applications.length === 0) {
    return new Response(JSON.stringify([]), { status: 200 })
  }
  const results = []
  for (const app of applications) {
    const { data: job } = await supabase
      .from("jobs")
      .select("job_title, work_type, remote_options, employer_id, company_id")
      .eq("id", app.job_id)
      .maybeSingle()
    if (!job) continue
    const { data: employer } = await supabase
      .from("registered_employers")
      .select("first_name, last_name")
      .eq("id", job.employer_id)
      .maybeSingle()
    const { data: company } = await supabase
      .from("registered_companies")
      .select("company_name")
      .eq("id", job.company_id)
      .maybeSingle()
    results.push({
      job_id: app.job_id,
      applied_at: app.applied_at,
      status: app.status,
      job_title: job.job_title,
      work_type: job.work_type,
      remote_options: job.remote_options,
      employer_id: job.employer_id,
      company_id: job.company_id,
      employer_first_name: employer?.first_name ?? "",
      employer_last_name: employer?.last_name ?? "",
      company_name: company?.company_name ?? ""
    })
  }
  return new Response(JSON.stringify(results), { status: 200 })
}
