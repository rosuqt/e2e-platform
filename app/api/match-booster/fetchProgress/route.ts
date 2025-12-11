import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { studentId } = await req.json()
  if (!studentId) return NextResponse.json({ progress: [] })
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("student_skill_progress")
    .select("skill_id, progress")
    .eq("student_id", studentId)
  console.log("fetchProgress for studentId:", studentId, "result:", data)
  if (error) return NextResponse.json({ progress: [] })
  return NextResponse.json({ progress: data })
}
