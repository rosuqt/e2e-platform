import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"

export async function POST(req: Request) {
  await new Promise((res) => setTimeout(res, 2000))
  const { application_id, action, message } = await req.json()
  if (
    !application_id ||
    !["shortlist", "reject", "interview_scheduled", "offer_sent", "hired", "offer_updated"].includes(action)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  let status = ""
  let logType = ""
  let logMessage = ""
  if (action === "shortlist") {
    status = "shortlisted"
    logType = "shortlisted"
    logMessage = "Applicant was shortlisted"
  } else if (action === "reject") {
    status = "rejected"
    logType = "rejected"
    logMessage = "Applicant was rejected"
  } else if (action === "interview_scheduled") {
    status = "Interview Scheduled"
    logType = "interview"
    logMessage = "Interview scheduled"
  } else if (action === "offer_sent") {
    status = "offer_sent"
    logType = "offer sent"
    logMessage = "Your job offer has been sent to the applicant!"
  } else if (action === "hired") {
    status = "hired"
    logType = "hired"
    logMessage = "You have successfully hired the applicant!"
  } else if (action === "offer_updated") {
    logType = "offer_updated"
    logMessage = message || "Job offer has been updated"
  }
  if (status) {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("application_id", application_id)
    if (error) {
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }
  }
  const { data: appRow } = await supabase
    .from("applications")
    .select("student_id, job_id")
    .eq("application_id", application_id)
    .single()
  const session = await getServerSession(authOptions)
  const employerId = (session?.user as { employerId?: string })?.employerId || null
  await supabase.from("activity_log").insert({
    application_id,
    student_id: appRow?.student_id || null,
    job_id: appRow?.job_id || null,
    employer_id: employerId,
    type: logType,
    message: logMessage,
  })
  return NextResponse.json({ success: true, status })
}
