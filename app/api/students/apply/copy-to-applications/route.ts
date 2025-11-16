import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { studentId, jobId } = await req.json()
  if (!studentId || !jobId) return NextResponse.json({ success: false, message: "Missing studentId or jobId" })

  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from("quick-apply-pref")
    .select("*")
    .eq("student_id", studentId)
    .eq("job_id", jobId)
    .maybeSingle()

  if (error) {
    console.error("Error fetching quick-apply-pref:", error)
    return NextResponse.json({ success: false, message: "Error fetching quick-apply-pref" })
  }

  if (!data) {
    return NextResponse.json({ success: false, message: "No matching quick-apply-pref found" })
  }

  const { error: insertError } = await supabase
    .from("applications")
    .insert({
      student_id: data.student_id,
      job_id: data.job_id,
      experience_years: data.experience_years,
      portfolio: data.portfolio,
      resume: data.resume,
      cover_letter: data.cover_letter,
      terms_accepted: data.terms_accepted,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      application_questions: data.application_questions,
      application_answers: data.application_answers,
      describe_proj: data.describe_proj,
      status: data.status,
      achievements: data.achievements,
      recruiters_notes: data.recruiters_notes,
      is_archived: data.is_archived,
      is_invited: data.is_invited,
    })

  if (insertError) {
    console.error("Error inserting into applications:", insertError)
    return NextResponse.json({ success: false, message: "Error inserting into applications" })
  }

  return NextResponse.json({ success: true, message: "Row copied to applications successfully" })
}
