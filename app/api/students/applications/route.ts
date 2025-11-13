import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { authOptions } from "../../../../lib/authOptions"
import { getAdminSupabase } from "../../../../src/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  const studentId = (session?.user as { studentId?: string })?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select(`*, achievements, portfolio, application_answers, resume, job_postings (
      *, 
      registered_employers:employer_id (company_name,first_name,last_name,job_title,email,phone,country_code,verify_status), 
      remote_options, 
      registered_companies:company_id (company_logo_image_path)
    )`)
    .eq("student_id", studentId)

  if (applicationsError) {
    console.error(applicationsError)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }

  const employerIds = (applications || [])
    .map(app => app.job_postings?.employer_id)
    .filter(Boolean)

  const employerProfiles: { [employerId: string]: { profile_img?: string } } = {}
  if (employerIds.length > 0) {
    const { data: profiles } = await supabase
      .from("employer_profile")
      .select("employer_id, profile_img")
      .in("employer_id", employerIds)
    if (profiles) {
      for (const prof of profiles) {
        console.log("profile_img for employer_id", prof.employer_id, ":", prof.profile_img)
        employerProfiles[prof.employer_id] = { profile_img: prof.profile_img }
      }
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from("student_profile")
    .select("student_id, skills, educations, expertise")
    .eq("student_id", studentId)
    .single()

  if (profileError && profileError.code !== "PGRST116") {
    console.error(profileError)
    return NextResponse.json({ error: "Failed to fetch student profile" }, { status: 500 })
  }

  const applicationsWithJobTitle = (applications || []).map(app => {
    let notesArr = []
    if (app.notes) {
      try {
        notesArr = JSON.parse(app.notes)
      } catch {
        notesArr = []
      }
    }
    function parseArrayField(field: unknown): string[] {
      if (Array.isArray(field)) return field as string[]
      if (field && typeof field === "object" && field !== null) {
      
        const keys = Object.keys(field)
        if (keys.every(k => !isNaN(Number(k)))) {
          return keys
            .sort((a, b) => Number(a) - Number(b))
            .map(k => (field as Record<string, unknown>)[k] as string)
        }
        const values = Object.values(field as object)
        if (values.every(v => typeof v === "string")) return values as string[]
        return []
      }
      if (typeof field === "string") {
        try {
          const arr = JSON.parse(field)
          if (Array.isArray(arr)) return arr as string[]
        } catch {}
      }
      return []
    }
    console.log("RAW achievements:", app.achievements, "RAW portfolio:", app.portfolio)
    const achievementsArr = parseArrayField(app.achievements)
    const portfolioArr = parseArrayField(app.portfolio)
    return {
      ...app,
      job_title: app.job_postings?.job_title,
      company_name: app.job_postings?.registered_employers?.company_name,
      remote_options: app.job_postings?.remote_options,
      company_logo_image_path: app.job_postings?.registered_companies?.company_logo_image_path,
      profile_img: employerProfiles[app.job_postings?.employer_id]?.profile_img,
      skills: profile?.skills || [],
      education: profile?.educations || [],
      expertise: profile?.expertise || [],
      notes: Array.isArray(notesArr) ? notesArr.filter((n: { isEmployer?: boolean }) => n.isEmployer === false) : [],
      achievements: achievementsArr.length > 0
        ? achievementsArr
        : parseArrayField(app.job_postings?.achievements),
      portfolio: portfolioArr.length > 0
        ? portfolioArr
        : parseArrayField(app.job_postings?.portfolio),
    }
  })

  let applicationStatus = "Exploring Opportunities"
  if (applicationsWithJobTitle.length === 0) {
    applicationStatus = "Exploring Opportunities"
  } else {
    const statuses = applicationsWithJobTitle.map(a => (a.status || "").toLowerCase())
    if (statuses.every(s => s === "new")) {
      applicationStatus = "Actively Looking for Opportunities"
    } else if (statuses.some(s => s === "hired")) {
      applicationStatus = "Job landed"
    } else if (statuses.some(s => s === "interview scheduled" || s === "waitlisted")) {
      applicationStatus = "Application in progress"
    } else {
      applicationStatus = "Actively Looking for Opportunities"
    }
  }

  console.log("applicationsWithJobTitle profile_img:", applicationsWithJobTitle.map(a => a.profile_img))

  return NextResponse.json({ applications: applicationsWithJobTitle, applicationStatus })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const studentId = (session?.user as { studentId?: string })?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  
  if (body.jobId && body.applicationData) {
    const { jobId, applicationData } = body
    
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .insert({
        student_id: studentId,
        job_id: jobId,
        ...applicationData
      })
      .select()
      .single()

    if (applicationError) {
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }

    const adminSupabase = getAdminSupabase()
    const { data: existingMetric } = await adminSupabase
      .from("job_metrics")
      .select("*")
      .eq("job_id", jobId)
      .single()

    if (existingMetric) {
      await adminSupabase
        .from("job_metrics")
        .update({ total_applicants: existingMetric.total_applicants + 1 })
        .eq("job_id", jobId)
    } else {
      await adminSupabase
        .from("job_metrics")
        .insert({ job_id: jobId, total_applicants: 1 })
    }

    return NextResponse.json({ success: true, application })
  }

  const { applicationId, note } = body
  if (!applicationId || !note) {
    return NextResponse.json({ error: "Missing applicationId or note" }, { status: 400 })
  }

  const { data: app } = await supabase
    .from("applications")
    .select("notes")
    .eq("id", applicationId)
    .single()

  let notesArr = []
  if (app && app.notes) {
    try {
      notesArr = JSON.parse(app.notes)
    } catch {
      notesArr = []
    }
  }
  notesArr.push({
    note: note,
    date_added: new Date().toISOString(),
    isEmployer: false
  })

  const { error: updateError } = await supabase
    .from("applications")
    .update({ notes: JSON.stringify(notesArr) })
    .eq("id", applicationId)

  if (updateError) {
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
