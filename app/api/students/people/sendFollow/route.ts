import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"

export async function POST(req: NextRequest) {
  const { employerId } = await req.json()
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId || !employerId) return NextResponse.json({ error: "Missing IDs" }, { status: 400 })
  const { error } = await supabase
    .from("student_follows_employers")
    .insert({ student_id: studentId, employer_id: employerId })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ status: "Following" })
}

export async function DELETE(req: NextRequest) {
  const { employerId } = await req.json()
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId || !employerId) return NextResponse.json({ error: "Missing IDs" }, { status: 400 })
  const { error } = await supabase
    .from("student_follows_employers")
    .delete()
    .eq("student_id", studentId)
    .eq("employer_id", employerId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ status: "Follow" })
}
