import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

type ApplicantRow = {
  id: number
  student_id: string
  job_id: number
  experience_years?: number
  created_at?: string
  status?: string
  match_score?: number
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  registered_students?: {
    first_name?: string
    last_name?: string
    course?: string
    year?: string
    section?: string
    email?: string
  }
  student_profile?: {
    profile_img?: string | null
  }
  job_postings?: {
    job_title?: string
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const job_id = searchParams.get("job_id")

  let query = supabase
    .from("applications")
    .select(`
      id,
      student_id,
      job_id,
      experience_years,
      created_at,
      status,
      match_score,
      first_name,
      last_name,
      email,
      phone,
      address,
      registered_students (
        first_name,
        last_name,
        course,
        year,
        section,
        email
      ),
      student_profile (
        profile_img
      ),
      job_postings (
        job_title
      )
    `)
    .order("created_at", { ascending: false })

  if (job_id && job_id !== "0") {
    query = query.eq("job_id", job_id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json([], { status: 200 })
  }

  const applicants = (data as ApplicantRow[] || []).map((app) => ({
    id: app.id,
    student_id: app.student_id,
    job_id: app.job_id,
    experience_years: app.experience_years,
    created_at: app.created_at,
    status: app.status || "new",
    match_score: app.match_score || null,
    first_name: app.first_name || app.registered_students?.first_name || "",
    last_name: app.last_name || app.registered_students?.last_name || "",
    email: app.email || app.registered_students?.email || "",
    profile_img: app.student_profile?.profile_img || null,
    job_title: app.job_postings?.job_title || "",
    location: app.address || "",
  }))

  return NextResponse.json(applicants)
}
