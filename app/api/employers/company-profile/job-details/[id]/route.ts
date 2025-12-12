import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { employerId?: string } | undefined
  if (!user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const supabase = getAdminSupabase()
  const { data: job, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", context.params.id)
    .single()
  if (error || !job) {
    return NextResponse.json(
      { error: "Job not found", hint: error?.message || error },
      { status: 404 }
    )
  }
  return NextResponse.json(job)
}
