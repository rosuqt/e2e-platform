import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const { title, company, link, status, description, hashtags } = body
  const allowedStatus = ["applied", "found", "interesting", "hired"]
  if (!allowedStatus.includes(status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
  }
  const { error } = await supabase
    .from("community_jobs")
    .insert({
      student_id: session.user.studentId,
      title,
      company,
      link,
      status,
      description,
      hashtags,
    })
  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}
