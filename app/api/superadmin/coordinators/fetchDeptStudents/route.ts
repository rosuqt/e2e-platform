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
  const { data, error } = await supabase
    .from("registered_students")
    .select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const filtered = (data ?? []).filter((row: Record<string, unknown>) => {
    if (!row.course) return false
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

  const result = filtered.map((row: Record<string, unknown>) => ({
    ...row,
    status: statusMap.get(String(row.id)) || "New",
    profile_img: imgMap.get(String(row.id)) || null,
  }))

  return NextResponse.json(result)
}
