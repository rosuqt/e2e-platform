import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  const employerId = (session?.user as { employerId?: string })?.employerId
  if (!employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select("id")
    .eq("employer_id", employerId)

  if (jobsError) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }

  const jobIds = jobs?.map(j => j.id)
  if (!jobIds || jobIds.length === 0) {
    return NextResponse.json({ applicants: [] })
  }

  const { data: applicants, error: applicantsError } = await supabase
    .from("applications")
    .select("*")
    .in("job_id", jobIds)

  if (applicantsError) {
    return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
  }

  return NextResponse.json({ applicants })
}
