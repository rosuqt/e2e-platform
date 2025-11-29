import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    console.error("No session found")
    return Response.json({ count: 0, hiredCount: 0, newCount: 0 })
  }
  const department = session?.user?.department
  if (!department) {
    console.error("No department in session:", session)
    return Response.json({ count: 0, hiredCount: 0, newCount: 0 })
  }
  console.log("Department from session:", department)
  // Remove "BS-" prefix and trim
  const mainDept = department.replace(/^BS[-\s]*/i, '').trim()
  const supabaseAdmin = getAdminSupabase()
  const { data: students, error } = await supabaseAdmin
    .from("registered_students")
    .select("id, course")
    .ilike("course", `%${mainDept}%`)
  if (error) {
    console.error("Error fetching students:", error)
  }
  if (!students) {
    console.error("No students found for department:", department)
    return Response.json({ count: 0, hiredCount: 0, newCount: 0 })
  }
  console.log("Students fetched:", students.length, students)
  const studentIds = students.map(s => s.id)
  const statusCounts: Record<string, number> = {}
  if (studentIds.length > 0) {
    const { data: appData, error: appError } = await supabaseAdmin
      .from("applications")
      .select("status, student_id")
      .in("student_id", studentIds)
    if (appError) {
      console.error("Error fetching applications:", appError)
    }
    if (appData) {
      for (const app of appData) {
        const status = (app.status || "").toLowerCase()
        statusCounts[status] = (statusCounts[status] || 0) + 1
      }
    }
  } else {
    console.log("No student IDs found for department:", department)
  }
  console.log("Returning counts:", { count: students.length, statusCounts })
  return Response.json({
    count: students.length,
    statusCounts,
  })
}
