import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

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
  status?: string
  registered_students?: {
    first_name?: string
    last_name?: string
  }
}

type ProcessedAgendaItem = AgendaRow & {
  student_name: string
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const employer_id = searchParams.get("employer_id")
  const range = searchParams.get("range") || "day"
  
  console.log("Agenda API called with:", { employer_id, range })
  
  if (!employer_id) return NextResponse.json({ agenda: [], interviewsScheduled: 0 })

  const supabase = getAdminSupabase()
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const todayStr = `${yyyy}-${mm}-${dd}`

  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 6)
  const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, "0")}-${String(nextWeek.getDate()).padStart(2, "0")}`

  console.log("Date range:", { todayStr, nextWeekStr })

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

  console.log("Supabase query result:", { 
    dataCount: allData?.length || 0, 
    error: allError,
    allData: allData?.map(item => ({ id: item.id, date: item.date, student_id: item.student_id }))
  })

  if (allError) {
    console.error("Supabase error:", allError)
    return NextResponse.json({ agenda: [], interviewsScheduled: 0 })
  }

  const interviewsScheduled = (allData as AgendaRow[] ?? []).length

  let agenda: ProcessedAgendaItem[]

  if (range === "week") {
    agenda = (allData as AgendaRow[] ?? [])
      .filter(item => {
        const itemInRange = item.date >= todayStr && item.date <= nextWeekStr
        console.log(`Item ${item.id}: date=${item.date}, inRange=${itemInRange}`)
        return itemInRange
      })
      .map((item): ProcessedAgendaItem => ({
        ...item,
        student_name: item.registered_students
          ? `${item.registered_students.first_name ?? ""} ${item.registered_students.last_name ?? ""}`.trim()
          : ""
      }))
      .sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date)
        }
        return a.time.localeCompare(b.time)
      })
  } else {
    agenda = (allData as AgendaRow[] ?? [])
      .filter(item => item.date === todayStr)
      .map((item): ProcessedAgendaItem => ({
        ...item,
        student_name: item.registered_students
          ? `${item.registered_students.first_name ?? ""} ${item.registered_students.last_name ?? ""}`.trim()
          : ""
      }))
  }

  console.log("Final agenda:", { 
    agendaCount: agenda.length, 
    interviewsScheduled,
    agendaItems: agenda.map(item => ({ id: item.id, date: item.date, student_name: item.student_name }))
  })

  return NextResponse.json({ agenda, interviewsScheduled })
}
