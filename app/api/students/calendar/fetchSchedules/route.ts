import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId")
  if (!studentId) return NextResponse.json([], { status: 200 })

  const { data, error } = await supabase
    .from("interview_schedules")
    .select("*")
    .eq("student_id", studentId)

  if (error) return NextResponse.json([], { status: 200 })

  const schedulesWithJobTitle = await Promise.all(
    (data ?? []).map(async (schedule) => {
      let jobTitle = null
      if (schedule.application_id) {
        const { data: application } = await supabase
          .from("applications")
          .select("job_id")
          .eq("application_id", schedule.application_id)
          .maybeSingle()
        if (application?.job_id) {
          const { data: job } = await supabase
            .from("job_postings")
            .select("job_title")
            .eq("id", application.job_id)
            .maybeSingle()
          if (job?.job_title) {
            jobTitle = job.job_title
          }
        }
      }
      return { ...schedule, job_title: jobTitle }
    })
  )

  return NextResponse.json(schedulesWithJobTitle)
}
