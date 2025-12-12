/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { employerId?: string } | undefined
  if (!user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const supabase = getAdminSupabase()
  const { data: employer, error: empError } = await supabase
    .from("registered_employers")
    .select("company_id")
    .eq("id", user.employerId)
    .single()
  if (empError || !employer?.company_id) {
    return NextResponse.json({ error: "No company found" }, { status: 404 })
  }
  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select(
      `
      id,
      job_title,
      work_type,
      location,
      application_deadline,
      created_at,
      registered_employers (
        first_name,
        last_name
      )
      `
    )
    .eq("company_id", employer.company_id)
    .order("created_at", { ascending: false })
  if (jobsError) {
    console.error("Supabase jobsError:", jobsError)
    return NextResponse.json(
      { error: "Error fetching jobs", hint: jobsError.message || jobsError.details || jobsError },
      { status: 500 }
    )
  }
  const jobsWithEmployer = (jobs ?? []).map((job) => {
    type Employer = { first_name?: string | null; last_name?: string | null }
    let employerObj: Employer | undefined
    if (Array.isArray(job.registered_employers)) {
      employerObj = job.registered_employers[0]
    } else if (job.registered_employers) {
      employerObj = job.registered_employers as Employer
    }
    // No destructuring of pay_type/pay_amount since they are not present
    return {
      ...job,
      employer_name: employerObj
        ? [employerObj.first_name, employerObj.last_name].filter(Boolean).join(" ")
        : null,
    }
  })
  return NextResponse.json(jobsWithEmployer)
}
