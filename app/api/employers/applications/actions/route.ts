import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: Request) {
  await new Promise((res) => setTimeout(res, 2000))
  const { application_id, action } = await req.json()
  if (
    !application_id ||
    !["shortlist", "reject", "interview_scheduled"].includes(action)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  let status = ""
  if (action === "shortlist") status = "shortlisted"
  else if (action === "reject") status = "rejected"
  else if (action === "interview_scheduled") status = "Interview Scheduled"
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("application_id", application_id)
  if (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
  return NextResponse.json({ success: true, status })
}
