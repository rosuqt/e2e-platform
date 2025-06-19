import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const companyName = req.nextUrl.searchParams.get("company_name")
  const jobId = req.nextUrl.searchParams.get("job_id")
  if (jobId) {
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select("employer_id")
      .eq("id", jobId)
      .single()
    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    const { data, error } = await supabase
      .from("registered_employers")
      .select("id, first_name, last_name, email, company_admin, profile_img")
      .eq("id", job.employer_id)
      .single()
    if (error || !data) {
      return NextResponse.json({ error: "Employer not found" }, { status: 404 })
    }
    return NextResponse.json({ data })
  }
  if (!companyName) {
    return NextResponse.json({ error: "Missing company_name" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("registered_employers")
    .select("id, first_name, last_name, email, company_admin, profile_img")
    .eq("company_name", companyName)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}
