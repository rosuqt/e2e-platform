import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: Request) {
  const { studentId, jobId, action } = await req.json()
  if (!studentId || !jobId || !["save", "unsave"].includes(action)) {
    return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 })
  }

  if (action === "save") {
    const { error } = await supabase
      .from("student_saved_jobs")
      .upsert([{ student_id: studentId, job_id: jobId }], { onConflict: "student_id,job_id" })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } else {
    const { error } = await supabase
      .from("student_saved_jobs")
      .delete()
      .eq("student_id", studentId)
      .eq("job_id", jobId)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }
}
