import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { authOptions } from "../../../../lib/authOptions"

export async function GET() {
  const session = await getServerSession(authOptions)
  const employerId = (session?.user as { employerId?: string })?.employerId
  if (!employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select("id")
    .eq("employer_id", employerId)

  if (jobsError) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }

  const jobIds = jobs?.map(j => j.id)
  if (!jobIds || jobIds.length === 0) {
    return NextResponse.json({ applicants: [] })
  }

  const { data: applicants, error: applicantsError } = await supabase
    .from("applications")
    .select(`*, application_answers, resume, job_postings (*)`)
    .in("job_id", jobIds)

  if (applicantsError) {
    console.error(applicantsError)
    return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
  }

  const studentIds = (applicants || []).map(app => app.student_id).filter(Boolean)
  const { data: profiles, error: profilesError } = await supabase
    .from("student_profile")
    .select("student_id, skills, educations, expertise")
    .in("student_id", studentIds)

  if (profilesError) {
    console.error(profilesError)
    return NextResponse.json({ error: "Failed to fetch student profiles" }, { status: 500 })
  }

  const profileMap = Object.fromEntries((profiles || []).map(p => [p.student_id, p]))

  const applicantsWithJobTitle = (applicants || []).map(app => ({
    ...app,
    job_title: app.job_postings?.job_title,
    skills: profileMap[app.student_id]?.skills || [],
    education: profileMap[app.student_id]?.educations || [],
    expertise: profileMap[app.student_id]?.expertise || [],
    // application_answers is already included from the select above
  }))




  return NextResponse.json({ applicants: applicantsWithJobTitle })
}
