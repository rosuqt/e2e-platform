import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../../lib/authOptions"

export async function POST(req: NextRequest) {
  const { companyId } = await req.json()
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId || !companyId) return NextResponse.json({ error: "Missing IDs" }, { status: 400 })
  const { error } = await supabase
    .from("student_follows_companies")
    .insert({ student_id: studentId, company_id: companyId })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ status: "Following" })
}

export async function DELETE(req: NextRequest) {
  const { companyId } = await req.json()
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId || !companyId) return NextResponse.json({ error: "Missing IDs" }, { status: 400 })
  const { error } = await supabase
    .from("student_follows_companies")
    .delete()
    .eq("student_id", studentId)
    .eq("company_id", companyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ status: "Follow" })
}

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId")
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (studentId && companyId) {
    const { data, error } = await supabase
      .from("student_follows_companies")
      .select("id")
      .eq("student_id", studentId)
      .eq("company_id", companyId)
      .single()
    if (error || !data) return NextResponse.json({ status: null })
    return NextResponse.json({ status: "Following" })
  }
  return NextResponse.json({ status: null })
}
