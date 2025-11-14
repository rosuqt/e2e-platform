import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { studentId } = await req.json()
  if (!studentId) return NextResponse.json({ exists: false })

  const supabase = getAdminSupabase()
  const { data } = await supabase
    .from("quick-apply-pref")
    .select("id")
    .eq("student_id", studentId)
    .maybeSingle()

  return NextResponse.json({ exists: !!data })
}
