import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { studentId } = await req.json()
  if (!studentId) return NextResponse.json({ exists: false })

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("quick-apply-pref")
    .select("*") 
    .eq("student_id", studentId)
    .single() 

  if (error) {
    console.error("Error fetching quick-apply-pref:", error)
    return NextResponse.json({ exists: false })
  }

  return NextResponse.json({ exists: !!data, studentId })
}
