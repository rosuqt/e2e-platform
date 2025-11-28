import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .rpc("top_companies_by_applicants")

  if (Array.isArray(data) && !error) {
    return NextResponse.json({ companies: data })
  }

  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("job_id")

  if (appError || !Array.isArray(applications)) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }

  const jobIds = applications.map(a => a.job_id).filter(Boolean)
  if (jobIds.length === 0) {
    return NextResponse.json({ companies: [] })
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("registered_jobs")
    .select("id, company_id")
    .in("id", jobIds)

  if (jobsError || !Array.isArray(jobs)) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }

  const companyIds = jobs.map(j => j.company_id).filter(Boolean)
  if (companyIds.length === 0) {
    return NextResponse.json({ companies: [] })
  }

  const { data: companies, error: compError } = await supabase
    .from("registered_companies")
    .select("id, company_name")
    .in("id", companyIds)

  if (compError || !Array.isArray(companies)) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
  }

  const companyMap = Object.fromEntries(companies.map(c => [c.id, c.company_name]))
  const jobCompanyMap = Object.fromEntries(jobs.map(j => [j.id, j.company_id]))

  const countMap: Record<string, number> = {}
  applications.forEach(a => {
    const companyId = jobCompanyMap[a.job_id]
    if (companyId) {
      countMap[companyId] = (countMap[companyId] || 0) + 1
    }
  })

  const result = Object.entries(countMap)
    .map(([companyId, count]) => ({
      company_id: companyId,
      company_name: companyMap[companyId] || "",
      applicant_count: count
    }))
    .sort((a, b) => b.applicant_count - a.applicant_count)

  return NextResponse.json({ companies: result })
}
