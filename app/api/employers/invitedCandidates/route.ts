import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { studentId, jobId, message } = await req.json()
  console.log("POST /api/employers/invitedCandidates body:", { studentId, jobId, message })
  if (!studentId || !jobId || !message) {
    console.log("400 error: Missing fields", { studentId, jobId, message })
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("job_invitations")
    .insert({
      student_id: studentId,
      employer_id: session.user.employerId,
      job_id: jobId,
      message
    })
    .select()
    .single()
  if (error) {
    console.log("500 error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ invitation: data }, { status: 201 })
}
