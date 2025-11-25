import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { action, studentId, employerId } = await req.json()
  const supabase = getAdminSupabase()

  if (action === "follow") {
    const { error } = await supabase
      .from("student_follows_employers")
      .upsert([{ student_id: studentId, employer_id: employerId }], { onConflict: "student_id,employer_id" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "unfollow") {
    const { error } = await supabase
      .from("student_follows_employers")
      .delete()
      .eq("student_id", studentId)
      .eq("employer_id", employerId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "favorite") {
    const { error } = await supabase
      .from("student_follows_employers")
      .update({ favorite: true })
      .eq("student_id", studentId)
      .eq("employer_id", employerId)
      .neq("favorite", true)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "unfavorite") {
    const { error } = await supabase
      .from("student_follows_employers")
      .update({ favorite: false })
      .eq("student_id", studentId)
      .eq("employer_id", employerId)
      .neq("favorite", false)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
