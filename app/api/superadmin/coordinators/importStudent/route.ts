/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const supabase = getAdminSupabase()
  const body = await req.json()
  const students: Array<{
    full_name: string
    email: string
    year_level?: string
    status?: string
    company?: string
    job_title?: string
    section?: string
    course?: string
    start_date?: string
    ojt_status?: string
    hours?: number
    documents?: any
    student_id?: string
  }> = body.students

  if (!Array.isArray(students)) {
    return NextResponse.json({ error: "Invalid students array" }, { status: 400 })
  }

  const emails = students.map(s => s.email)
  const { data: existing, error: fetchError } = await supabase
    .from("ojt_students")
    .select("email")
    .in("email", emails)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const existingEmails = new Set((existing ?? []).map((s: any) => s.email))
  const newStudents = students.filter(s => !existingEmails.has(s.email))

  if (newStudents.length === 0) {
    return NextResponse.json({ message: "No new students to import", imported: 0 })
  }

  const { error: insertError } = await supabase
    .from("ojt_students")
    .insert(
      newStudents.map(s => ({
        full_name: s.full_name,
        email: s.email,
        year_level: s.year_level ?? null,
        status: s.status ?? null,
        company: s.company ?? null,
        job_title: s.job_title ?? null,
        section: s.section ?? null,
        course: s.course ?? null,
        start_date: s.start_date ?? null,
        ojt_status: s.ojt_status ?? null,
        hours: s.hours ?? 0,
        documents: s.documents ?? [],
        student_id: s.student_id ?? null,
      }))
    )

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Students imported", imported: newStudents.length })
}
