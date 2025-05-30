import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    student_id,
    job_id,
    experience_years,
    portfolio,
    resume,
    cover_letter,
    terms_accepted,
    first_name,
    last_name,
    email,
    phone,
    address,
    linkedin_profile,
    application_questions,
    application_answers,
  } = body

  if (!student_id || !job_id) {
    return NextResponse.json({ error: "Missing student_id or job_id" }, { status: 400 })
  }

  const { error } = await supabase.from("applications").insert([{
    student_id,
    job_id,
    experience_years,
    portfolio,
    resume,
    cover_letter,
    terms_accepted,
    first_name,
    last_name,
    email,
    phone,
    address,
    linkedin_profile,
    application_questions,
    application_answers,
  }])

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
