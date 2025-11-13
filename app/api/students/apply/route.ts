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
    achievements,
  } = body

  const safePortfolio =
    Array.isArray(portfolio)
      ? portfolio
          .map((item: string) =>
            typeof item === "string" && /^https?:\/\//.test(item) ? item : item
          )
          .join(", ")
      : typeof portfolio === "string"
      ? portfolio
      : null;

  const safeApplicationAnswers =
    application_answers && typeof application_answers === "object"
      ? application_answers
      : {};

  const safeAchievements =
    Array.isArray(achievements)
      ? achievements
          .map((item: string) =>
            typeof item === "string" && /^https?:\/\//.test(item) ? item : item
          )
          .join(", ")
      : typeof achievements === "string"
      ? achievements
      : null;

  const requiredFields = [
    "student_id",
    "job_id",
    "experience_years",
    "resume",
    "terms_accepted",
    "first_name",
    "last_name",
    "email",
    "phone",
    "address",
    "application_answers"
  ];

  const missingFields = requiredFields.filter((field) => {
    if (field === "terms_accepted") return typeof body[field] !== "boolean";
    if (field === "application_answers") return typeof body[field] !== "object" || body[field] === null;
    return !body[field] || typeof body[field] !== "string";
  });

  if (missingFields.length > 0) {
    console.error("Missing or invalid required fields:", missingFields, "Body:", body)
    return NextResponse.json(
      { error: `Missing or invalid required fields: ${missingFields.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const { data: insertData, error } = await supabase.from("applications").insert([{
      student_id, 
      job_id,
      experience_years,
      portfolio: safePortfolio,
      achievements: safeAchievements,
      resume,
      cover_letter,
      terms_accepted,
      first_name,
      last_name,
      email,
      phone,
      address,
      application_questions,
      application_answers: safeApplicationAnswers,
      describe_proj: project_description,
    }]).select('application_id')

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    const application_id = insertData?.[0]?.application_id
    if (application_id) {
      await supabase.from('activity_log').insert([
        {
          application_id,
          student_id,
          job_id,
          type: 'new',
          message: 'New application submitted!',
        },
      ])

      const { data: existingMetrics } = await supabase
        .from('job_metrics')
        .select('total_applicants')
        .eq('job_id', job_id)
        .single()

      if (existingMetrics) {
        await supabase
          .from('job_metrics')
          .update({ total_applicants: existingMetrics.total_applicants + 1 })
          .eq('job_id', job_id)
      } else {
        await supabase
          .from('job_metrics')
          .insert({ job_id, total_applicants: 1 })
      }

      const { error: historyError } = await supabase
        .from("job_metrics_history")
        .insert({
          job_id: job_id,
          action: "apply"
        })

      if (historyError) {
        console.error("Error inserting apply history:", historyError)
      }
    }
    
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
