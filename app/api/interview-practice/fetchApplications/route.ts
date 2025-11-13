import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  console.log("SESSION:", session)
  const studentId = (session?.user as { studentId?: string })?.studentId
  console.log("studentId:", studentId)
  if (!studentId) {
    return NextResponse.json({ jobTitles: [] }, { status: 401 })
  }
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("applications")
    .select("job_id,job_postings(job_title)")
    .eq("student_id", studentId)
  console.log("Supabase data:", data)
  console.log("Supabase error:", error)
  const jobTitles = Array.from(
    new Set(
      (data ?? [])
        .map(a => (a.job_postings as { job_title?: string } | null)?.job_title)
        .filter(Boolean)
    )
  )
  console.log("jobTitles:", jobTitles)
  return NextResponse.json({ jobTitles })
}
   