import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Missing studentId" }, { status: 400 })
  }
  const body = await req.json()
  const { progress } = body
  if (!Array.isArray(progress) || progress.length === 0) {
    return NextResponse.json({ error: "Invalid progress data" }, { status: 400 })
  }
  const supabase = getAdminSupabase()
  for (const item of progress) {
    if (!item.skill_id) continue
    if (!Array.isArray(item.completed_levels)) continue
    await supabase
      .from("student_skill_progress")
      .upsert({
        student_id: studentId,
        skill_id: item.skill_id,
        progress: { completed_levels: item.completed_levels }
      }, { onConflict: "student_id,skill_id" })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
