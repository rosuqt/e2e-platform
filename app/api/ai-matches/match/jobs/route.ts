/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { student_id } = await req.json()

  // 1. Get top matches from Supabase RPC
  const { data: matches, error } = await supabase
    .rpc('get_job_matches_for_student', { student_uuid: student_id })

  if (error) {
    console.error("Supabase RPC error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!Array.isArray(matches) || matches.length === 0) {
    return NextResponse.json({ matches: [] })
  }

  const validMatches = matches.filter(
    (m: any) => m && typeof m.job_id === "string" && typeof m.similarity === "number"
  )

  if (validMatches.length === 0) {
    return NextResponse.json({ matches: [] })
  }

  // 2. Prepare data for upsert
  const upsertData = validMatches.map((m: any) => ({
    student_id,
    job_id: m.job_id,
    match_score: m.similarity * 100, // convert 0-1 to 0-100
  }))

  // 3. Upsert into job_matches table
  const { error: upsertError } = await supabase
    .from("job_matches")
    .upsert(upsertData, { onConflict: "student_id,job_id" }) 

  if (upsertError) {
    console.error("Supabase upsert error:", upsertError)
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  // 4. Fetch job details and company info for each match
  const jobIds = validMatches.map((m: any) => m.job_id)
  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select(`
      id,
      job_title,
      company_id,
      location,
      pay_amount,
      pay_type,
      company:registered_companies (
        id,
        company_name,
        company_logo_image_path
      )
    `)
    .in("id", jobIds)

  if (jobsError) {
    console.error("Supabase jobs fetch error:", jobsError)
    return NextResponse.json({ error: jobsError.message }, { status: 500 })
  }

  // 5. Merge job details into matches
  const jobsMap = new Map<string, any>()
  for (const job of jobs) {
    jobsMap.set(job.id, job)
  }

  const enrichedMatches = validMatches.map((m: any) => {
    const job = jobsMap.get(m.job_id)
    return {
      ...m,
      job_title: job?.job_title || "",
      company_id: job?.company_id || "",
      location: job?.location || "",
      pay_amount: job?.pay_amount || "",
      pay_type: job?.pay_type || "",
      company_name: job?.company?.company_name || "",
      company_logo_image_path: job?.company?.company_logo_image_path || ""
    }
  })

  return NextResponse.json({ matches: enrichedMatches })
}
