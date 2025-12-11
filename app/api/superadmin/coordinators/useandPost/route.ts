import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const student_id = searchParams.get("student_id")
  if (!student_id) return NextResponse.json({ error: "Missing student_id" }, { status: 400 })

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("ojt_students")
    .select("hours")
    .eq("id", student_id)
    .single()

  if (error && error.details !== "The result contains 0 rows") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  // If no data, treat as 0 hours
  return NextResponse.json({ hours: data?.hours ?? 0 })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { student_id, hours } = body
  if (!student_id || typeof hours !== "number") {
    return NextResponse.json({ error: "Missing student_id or hours" }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from("ojt_students")
    .update({ hours })
    .eq("id", student_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
