import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { studentId, jobId } = await req.json()

    const validStudent = studentId !== undefined && studentId !== null && String(studentId).trim() !== ""
    const validJob = jobId !== undefined && jobId !== null && String(jobId).trim() !== ""
    if (!validStudent || !validJob) {
      return NextResponse.json({ success: false, message: "Missing studentId or jobId" }, { status: 400 })
    }

    const sid = studentId
    const jid = jobId
    const supabase = getAdminSupabase()

    let { data: qa, error: qaError } = await supabase
      .from("quick-apply-pref")
      .select("*")
      .eq("student_id", sid)
      .eq("job_id", jid)
      .maybeSingle()

    if (!qa && !qaError) {
      const retry = await supabase
        .from("quick-apply-pref")
        .select("*")
        .eq("student_id", sid)
        .maybeSingle()
      qa = retry.data
      qaError = retry.error
    }

    if (qaError) {
      return NextResponse.json({ success: false, message: "Error fetching quick-apply-pref", details: qaError.message }, { status: 500 })
    }

    if (!qa) {
      return NextResponse.json({ success: false, message: "No quick-apply profile found" }, { status: 404 })
    }

    const existing = await supabase
      .from("applications")
      .select("application_id, student_id, job_id, status")
      .eq("student_id", sid)
      .eq("job_id", jid)
      .maybeSingle()

    if (existing.data) {
      return NextResponse.json({ success: true, created: false, application: existing.data }, { status: 200 })
    }

    const payload = {
      student_id: qa.student_id ?? sid,
      job_id: jid,
      experience_years: qa.experience_years ?? "",
      portfolio: qa.portfolio ?? null,
      resume: qa.resume ?? "",
      cover_letter: qa.cover_letter ?? null,
      terms_accepted: qa.terms_accepted ?? true,
      first_name: qa.first_name ?? "",
      last_name: qa.last_name ?? "",
      email: qa.email ?? "",
      phone: qa.phone ?? "",
      address: qa.address ?? "",
      application_questions: qa.application_questions ?? null,
      application_answers: qa.application_answers ?? {},
      describe_proj: qa.describe_proj ?? null,
      status: qa.status ?? undefined,
      achievements: qa.achievements ?? null,
      recruiters_notes: qa.recruiters_notes ?? null,
      is_archived: qa.is_archived ?? false,
      is_invited: qa.is_invited ?? false,
    }

    const { data: inserted, error: insertError } = await supabase
      .from("applications")
      .insert(payload)
      .select("application_id, student_id, job_id, status")
      .single()

    if (insertError) {
      return NextResponse.json({ success: false, message: "Error inserting application", details: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, created: true, application: inserted }, { status: 201 })
  } catch (e: unknown) {
    const message = typeof e === "object" && e !== null && "message" in e ? (e as { message?: string }).message ?? "" : ""
    return NextResponse.json({ success: false, message: "Invalid request", details: message }, { status: 400 })
  }
}
