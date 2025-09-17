import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

type AgendaRow = {
  id: string
  application_id?: string
  mode: string
  platform?: string
  address?: string
  team?: string[]
  date: string
  time: string
  notes?: string
  summary?: string
  created_at?: string
  updated_at?: string
  student_id?: string
  employer_id?: string
  registered_students?: {
    first_name?: string
    last_name?: string
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const employer_id = searchParams.get("employer_id")
  if (!employer_id) return NextResponse.json({ agenda: [], interviewsScheduled: 0 })

  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const todayStr = `${yyyy}-${mm}-${dd}`

  const { data: allData, error: allError } = await supabase
    .from("interview_schedules")
    .select(`
      *,
      registered_students:student_id (
        first_name,
        last_name
      )
    `)
    .eq("employer_id", employer_id)
    .gte("date", todayStr)

  if (allError) return NextResponse.json({ agenda: [], interviewsScheduled: 0 })

  const interviewsScheduled = (allData as AgendaRow[] ?? []).length

  const agenda = (allData as AgendaRow[] ?? [])
    .filter(item => item.date === todayStr)
    .map((item) => ({
      ...item,
      student_name: item.registered_students
        ? `${item.registered_students.first_name ?? ""} ${item.registered_students.last_name ?? ""}`.trim()
        : ""
    }))

  return NextResponse.json({ agenda, interviewsScheduled })
}
