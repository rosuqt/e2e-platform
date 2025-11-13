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
    .select(`*, application_answers, resume, achievements, portfolio, job_postings (*, registered_employers:employer_id (company_name), remote_options)`)
    .in("job_id", jobIds)

  if (applicantsError) {
    console.error(applicantsError)
    return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
  }

  const studentIds = (applicants || []).map(app => app.student_id).filter(Boolean)
  const { data: profiles, error: profilesError } = await supabase
    .from("student_profile")
    .select("student_id, skills, educations, expertise, contact_info")
    .in("student_id", studentIds)

  if (profilesError) {
    console.error(profilesError)
    return NextResponse.json({ error: "Failed to fetch student profiles" }, { status: 500 })
  }

  const profileMap = Object.fromEntries((profiles || []).map(p => [p.student_id, p]))

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

  const applicantsWithJobTitle = (applicants || []).map(app => {
    const achievementsArr = parseArrayField(app.achievements)
    const portfolioArr = parseArrayField(app.portfolio)
    const profile = profileMap[app.student_id] || {}
    let contactInfo = { email: "", phone: "", socials: [], countryCode: "" }
    if (profile.contact_info && typeof profile.contact_info === "object") {
      contactInfo = {
        email: profile.contact_info.email || "",
        phone: profile.contact_info.phone || "",
        socials: profile.contact_info.socials || [],
        countryCode: profile.contact_info.countryCode || "",
      }
    } else {
      contactInfo = {
        email: app.personal_email || app.email || "",
        phone: app.personal_phone || app.phone || "",
        socials: [],
        countryCode: app.country_code || "",
      }
    }
    return {
      ...app,
      job_title: app.job_postings?.job_title,
      company_name: app.job_postings?.registered_employers?.company_name,
      company_logo_image_path: app.job_postings?.registered_employers?.company_logo_image_path,
      remote_options: app.job_postings?.remote_options,
      skills: profile.skills || [],
      education: profile.educations || [],
      expertise: profile.expertise || [],
      achievements: achievementsArr.length > 0
        ? achievementsArr
        : parseArrayField(app.job_postings?.achievements),
      portfolio: portfolioArr.length > 0
        ? portfolioArr
        : parseArrayField(app.job_postings?.portfolio),
      raw_achievements: app.achievements as string | string[] | Record<string, unknown> | null | undefined,
      raw_portfolio: app.portfolio as string | string[] | Record<string, unknown> | null | undefined,
      contactInfo
    }
  })

  return NextResponse.json({ applicants: applicantsWithJobTitle })
}
