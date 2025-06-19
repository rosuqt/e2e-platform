import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const jobId = params.id
  const studentId = req.nextUrl.searchParams.get("studentId")

  if (!jobId || !studentId) {
    return NextResponse.json({ error: "Missing jobId or studentId" }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:job_listings(*)")
    .eq("job_id", jobId)
    .eq("student_id", studentId)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ saved: false, job: null })
  }

  return NextResponse.json({ saved: true, job: data.job })
}
