import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { data, error } = await supabase
    .from("interview_practice_history")
    .select("*")
    .eq("student_id", studentId)
    .order("finished_at", { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ history: data })
}
