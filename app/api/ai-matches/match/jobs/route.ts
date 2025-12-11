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
      remote_options,
      work_type,
      recommended_course,
      job_description,
      job_summary,
      must_have_qualifications,
      nice_to_have_qualifications,
      application_deadline,
      max_applicants,
      perks_and_benefits,
      verification_tier,
      created_at,
      responsibilities,
      paused,
      tags,
      ai_skills,
      is_archived,
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
  // Filter out jobs that are paused or archived
  const jobsMap = new Map<string, any>()
  for (const job of jobs) {
    if (job.paused !== true && job.is_archived !== true) {
      jobsMap.set(job.id, job)
    }
  }

  const enrichedMatches = validMatches
    .filter((m: any) => {
      const job = jobsMap.get(m.job_id)
      return !!job
    })
    .map((m: any) => {
      const job = jobsMap.get(m.job_id)
      return {
        ...m,
        job_title: job?.job_title || "",
        company_id: job?.company_id || "",
        location: job?.location || "",
        company_name: job?.company?.company_name || "",
        company_logo_image_path: job?.company?.company_logo_image_path || "",
        remote_options: job?.remote_options || "",
        work_type: job?.work_type || "",
        recommended_course: job?.recommended_course || "",
        job_description: job?.job_description || "",
        job_summary: job?.job_summary || "",
        must_have_qualifications: job?.must_have_qualifications || [],
        nice_to_have_qualifications: job?.nice_to_have_qualifications || [],
        application_deadline: job?.application_deadline || "",
        max_applicants: job?.max_applicants ?? null,
        perks_and_benefits: job?.perks_and_benefits || [],
        verification_tier: job?.verification_tier || "",
        created_at: job?.created_at || "",
        responsibilities: job?.responsibilities || "",
        paused: job?.paused ?? false,
        tags: job?.tags || {},
        ai_skills: job?.ai_skills || [],
        is_archived: job?.is_archived ?? false
      }
    })

  return NextResponse.json({ matches: enrichedMatches })
}
