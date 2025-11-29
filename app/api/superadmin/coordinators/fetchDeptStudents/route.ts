/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/authOptions"

const STATUS_HIERARCHY = [
  "rejected",
  "new",
  "shortlisted",
  "interview scheduled",
  "waitlisted",
  "hired",
]

function getHighestStatus(statuses: string[]) {
  let maxIdx = -1
  let result = ""
  for (const s of statuses) {
    const idx = STATUS_HIERARCHY.findIndex(
      (h) => h.toLowerCase() === String(s).toLowerCase()
    )
    if (idx > maxIdx) {
      maxIdx = idx
      result = s
    }
  }
  return result || "New"
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const department =
    (session?.user && typeof session.user === "object" && "department" in session.user
      ? (session.user as { department?: string }).department
      : undefined)

  if (!department) {
    return NextResponse.json({ error: "No department in session" }, { status: 401 })
  }

  const normalizedDept = department.replace(/\s+/g, "").toLowerCase()
  const supabase = getAdminSupabase()

  const { data: regData, error: regError } = await supabase
    .from("registered_students")
    .select("*")

  if (regError) {
    return NextResponse.json({ error: regError.message }, { status: 500 })
  }

  const filtered = (regData ?? []).filter((row: Record<string, unknown>) => {
    if (!row.course) return false
    if (row.is_alumni === true) return false
    const course = String(row.course).replace(/\s+/g, "").toLowerCase()
    return course === normalizedDept
  })

  const studentIds = filtered.map((row: { id: string }) => row.id)
  let applications: { student_id: string; status: string }[] = []
  if (studentIds.length > 0) {
    const { data: apps } = await supabase
      .from("applications")
      .select("student_id,status")
      .in("student_id", studentIds)
    applications = apps || []
  }

  let profileImgs: { student_id: string; profile_img: string | null }[] = []
  if (studentIds.length > 0) {
    const { data: imgs } = await supabase
      .from("student_profile")
      .select("student_id,profile_img")
      .in("student_id", studentIds)
    profileImgs = imgs || []
  }

  const imgMap = new Map<string, string | null>()
  for (const p of profileImgs) {
    imgMap.set(String(p.student_id), p.profile_img || null)
  }

  const statusMap = new Map<string, string>()
  for (const sid of studentIds) {
    const statuses = applications
      .filter((a) => String(a.student_id) === String(sid) && a.status)
      .map((a) => String(a.status))
    statusMap.set(String(sid), getHighestStatus(statuses))
  }

  const regResult = filtered.map((row: Record<string, unknown>) => ({
    ...row,
    status: statusMap.get(String(row.id)) || "New",
    profile_img: imgMap.get(String(row.id)) || null,
    source: "registered_students",
  }))

  const { data: ojtData, error: ojtError } = await supabase
    .from("ojt_students")
    .select("*")
    .eq("course", department)

  if (ojtError && typeof ojtError.message === "string") {
    return NextResponse.json({ error: ojtError.message }, { status: 500 })
  }

  if (!ojtData || ojtData.length === 0) {
    const { data: allOjtData } = await supabase
      .from("ojt_students")
      .select("*")
    console.log("ojt_students fallback data:", allOjtData)
    return NextResponse.json([
      ...regResult,
      ...(allOjtData ?? []).map((row: any) => ({
        id: row.id,
        name: row.full_name,
        studentId: row.student_id,
        email: row.email,
        year: row.year_level,
        status: row.ojt_status ?? row.status ?? "New",
        progress: row.hours ?? 0,
        company: row.company ?? "",
        employer: row.job_title ?? "",
        course: row.course ?? "",
        profile_img: null,
        section: row.section ?? "",
        application_id: null,
        student_id: row.student_id,
        source: "ojt_students",
        isOjt: true,
      }))
    ])
  }

  console.log("ojt_students data:", ojtData)

  const ojtResult = (ojtData ?? []).map((row: any) => ({
    id: row.id,
    name: row.full_name,
    studentId: row.student_id,
    email: row.email,
    year: row.year_level,
    status: row.ojt_status ?? row.status ?? "New",
    progress: row.hours ?? 0,
    company: row.company ?? "",
    employer: row.job_title ?? "",
    course: row.course ?? "",
    profile_img: null,
    section: row.section ?? "",
    application_id: null,
    student_id: row.student_id,
    source: "ojt_students",
    isOjt: true,
  }))

  return NextResponse.json([...regResult, ...ojtResult])
}
