/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 401 })
  const studentId = session.user?.studentId
  if (!studentId) return new Response(JSON.stringify({ error: "Missing studentId" }), { status: 400 })

  const supabase = getAdminSupabase()
  const { data: jobs } = await supabase.from("dtr_jobs").select("id").eq("student_id", studentId)
  if (jobs && jobs.length > 0) {
    const jobIds = jobs.map((j: any) => j.id)
    await supabase.from("dtr_logs").delete().in("job_id", jobIds)
    await supabase.from("dtr_jobs").delete().in("id", jobIds)
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
