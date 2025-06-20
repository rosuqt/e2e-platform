import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const student_id = req.nextUrl.searchParams.get("student_id")
  if (!student_id) return NextResponse.json({ error: "Missing student_id" }, { status: 400 })

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("student_profile")
    .select("profile_img")
    .eq("student_id", student_id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ profile_img: data?.profile_img || null })
}
