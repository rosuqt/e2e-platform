import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { action, studentId, companyId } = await req.json()
  const supabase = getAdminSupabase()

  if (action === "follow") {
    const { error } = await supabase
      .from("student_follows_companies")
      .upsert([{ student_id: studentId, company_id: companyId }], { onConflict: "student_id,company_id" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "unfollow") {
    const { error } = await supabase
      .from("student_follows_companies")
      .delete()
      .eq("student_id", studentId)
      .eq("company_id", companyId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "favorite") {
    const { error } = await supabase
      .from("student_follows_companies")
      .update({ favorite: true })
      .eq("student_id", studentId)
      .eq("company_id", companyId)
      .neq("favorite", true)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "unfavorite") {
    const { error } = await supabase
      .from("student_follows_companies")
      .update({ favorite: false })
      .eq("student_id", studentId)
      .eq("company_id", companyId)
      .neq("favorite", false)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
