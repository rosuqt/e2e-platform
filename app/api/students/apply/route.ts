import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

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
    application_questions,
    application_answers,
    project_description,
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
    application_questions,
    application_answers,
    describe_proj: project_description,
  }])

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
