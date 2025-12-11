/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { job_id } = await req.json()

  // 1. Get all student profiles
  const { data: students, error: studentsError } = await supabase
    .from("student_profile")
    .select("student_id, embedding")

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 })
  }

  // 2. Get job embedding
  const { data: job, error: jobError } = await supabase
    .from("job_postings")
    .select("id, embedding")
    .eq("id", job_id)
    .single()

  if (jobError || !job?.embedding) {
    return NextResponse.json({ error: "Job embedding not found" }, { status: 500 })
  }

  // 3. Calculate similarity for each student (example using pgvector cosine similarity)
  const { data: matches, error: matchError } = await supabase.rpc(
    "get_student_matches_for_job", // You need to create this function in Postgres
    { job_uuid: job_id }
  )

  if (matchError) {
    return NextResponse.json({ error: matchError.message }, { status: 500 })
  }

  // 4. Upsert matches into job_matches
  const validMatches = matches.filter(
    (m: any) => m && typeof m.student_id === "string" && typeof m.similarity === "number"
  )

  const upsertData = validMatches.map((m: any) => ({
    student_id: m.student_id,
    job_id,
    match_score: m.similarity * 100,
  }))

  const { error: upsertError } = await supabase
    .from("job_matches")
    .upsert(upsertData, { onConflict: "student_id,job_id" })

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  // 5. Fetch student details for each match
  const studentIds = validMatches.map((m: any) => m.student_id)
  const { data: studentDetails, error: detailsError } = await supabase
    .from("student_profile")
    .select("student_id, username, profile_img, short_bio, skills, expertise")
    .in("student_id", studentIds)

  if (detailsError) {
    return NextResponse.json({ error: detailsError.message }, { status: 500 })
  }

  // 6. Merge details into matches
  const detailsMap = new Map<string, any>()
  for (const s of studentDetails) {
    detailsMap.set(s.student_id, s)
  }

  const enrichedMatches = validMatches.map((m: any) => ({
    ...m,
    ...detailsMap.get(m.student_id)
  }))

  return NextResponse.json({ matches: enrichedMatches })
}
