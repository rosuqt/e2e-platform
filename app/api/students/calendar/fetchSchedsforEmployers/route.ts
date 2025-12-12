/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

// Placeholder: Replace with your actual session logic
async function getEmployerIdFromSession(req: NextRequest): Promise<string | null> {
  // ...your session logic here...
  return null // Replace with actual employer ID
}

export async function GET(req: NextRequest) {
  const employerId = await getEmployerIdFromSession(req)
  if (!employerId) return NextResponse.json([], { status:200 })

  // Get all job postings for this employer
  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select("id")
    .eq("employer_id", employerId)

  if (jobsError || !jobs?.length) return NextResponse.json([], { status:200 })

  const jobIds = jobs.map(j => j.id)

  // Get all applications for these jobs
  const { data: applications, error: appsError } = await supabase
    .from("applications")
    .select("application_id, job_id")
    .in("job_id", jobIds)

  if (appsError || !applications?.length) return NextResponse.json([], { status:200 })

  const applicationIds = applications.map(a => a.application_id)

  // Get all interview schedules for these applications
  const { data: schedules, error: schedsError } = await supabase
    .from("interview_schedules")
    .select("*")
    .in("application_id", applicationIds)

  if (schedsError || !schedules?.length) return NextResponse.json([], { status:200 })

  // Attach job_title to each schedule
  const jobIdToTitle: Record<string, string> = {}
  // Fetch job titles only once
  const { data: jobTitles } = await supabase
    .from("job_postings")
    .select("id, job_title")
    .in("id", jobIds)

  if (jobTitles) {
    for (const job of jobTitles) {
      jobIdToTitle[job.id] = job.job_title
    }
  }

  // Map application_id to job_id
  const appIdToJobId: Record<string, string> = {}
  for (const app of applications) {
    appIdToJobId[app.application_id] = app.job_id
  }

  const schedulesWithJobTitle = schedules.map(schedule => ({
    ...schedule,
    job_title: jobIdToTitle[appIdToJobId[schedule.application_id] || ""] || null
  }))

  return NextResponse.json(schedulesWithJobTitle)
}
