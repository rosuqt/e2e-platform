import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  await new Promise((res) => setTimeout(res, 2000))
  const { application_id, action, message } = await req.json()
  const normalizedAction = typeof action === "string" ? action.toLowerCase() : ""
  if (
    !application_id ||
    !["shortlist", "reject", "interview_scheduled", "offer_sent", "hired", "offer_updated", "waitlist", "withdraw"].includes(normalizedAction)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const supabase = getAdminSupabase() 

  let status = ""
  let logType = ""
  let logMessage = ""
  if (normalizedAction === "shortlist") {
    status = "shortlisted"
    logType = "shortlisted"
    logMessage = "Applicant was shortlisted"
  } else if (normalizedAction === "reject") {
    status = "rejected"
    logType = "rejected"
    logMessage = "Applicant was rejected"
  } else if (normalizedAction === "interview_scheduled") {
    status = "Interview Scheduled"
    logType = "interview"
    logMessage = "Interview scheduled"
  } else if (normalizedAction === "offer_sent") {
    status = "offer_sent"
    logType = "offer sent"
    logMessage = "Your job offer has been sent to the applicant!"
  } else if (normalizedAction === "hired") {
    status = "hired"
    logType = "hired"
    logMessage = "You have successfully hired the applicant!"
  } else if (normalizedAction === "offer_updated") {
    logType = "offer_updated"
    logMessage = message || "Job offer has been updated"
  } else if (normalizedAction === "waitlist") {
    status = "waitlisted"
    logType = "waitlisted"
    logMessage = "Applicant was waitlisted after interview"
  } else if (normalizedAction === "withdraw") {
    status = "withdrawn"
    logType = "withdrawn"
    logMessage = message || "Applicant withdrew the application"
  }
  if (status) {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("application_id", application_id)
    if (error) {
      return NextResponse.json({ error: "Failed to update status", details: error.message }, { status: 500 })
    }
  }

  const { data: appRow, error: fetchErr } = await supabase
    .from("applications")
    .select("application_id, student_id, job_id")
    .eq("application_id", application_id)
    .single()
  if (fetchErr) {
    return NextResponse.json({ error: "Failed to fetch application row", details: fetchErr.message }, { status: 500 })
  }

  const session = await getServerSession(authOptions)
  const employerId = (session?.user as { employerId?: string })?.employerId || null

  const payload = {
    application_id: appRow?.application_id ?? application_id,
    student_id: appRow?.student_id || null,
    job_id: appRow?.job_id || null,
    employer_id: employerId,
    type: logType,
    message: logMessage,
    created_at: new Date().toISOString(),
  }

  const { error: insertErr } = await supabase.from("activity_log").insert(payload)
  if (insertErr) {
    return NextResponse.json({ error: "Failed to write activity log", details: insertErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, status })
}
