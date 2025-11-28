import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { studentId, jobId } = await req.json()
  if (!studentId || !jobId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("job_invitations")
    .select("id")
    .eq("student_id", studentId)
    .eq("job_id", jobId)
    .eq("employer_id", session.user.employerId)
    .maybeSingle()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ invited: !!data })
}
