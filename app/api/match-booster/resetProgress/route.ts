import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { studentId } = await req.json()
  if (!studentId) return NextResponse.json({ ok: false })
  const supabase = getAdminSupabase()
  await supabase
    .from("student_skill_progress")
    .delete()
    .eq("student_id", studentId)
  return NextResponse.json({ ok: true })
}
