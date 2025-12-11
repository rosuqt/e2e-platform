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
    rememberDetails,
    country,
    city,
  } = body

  console.log("job_id received:", job_id)

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

  const addressArr =
    Array.isArray(address) && address.length === 2
      ? address
      : [country || "", city || ""]

  const missingFields = [
    !student_id ? "student_id" : null,
    (
      job_id === undefined ||
      job_id === null ||
      (typeof job_id === "string" && job_id.trim().length === 0) ||
      (typeof job_id === "number" && isNaN(job_id))
    ) ? "job_id" : null,
    !experience_years ? "experience_years" : null,
    !resume ? "resume" : null,
    typeof terms_accepted !== "boolean" ? "terms_accepted" : null,
    !first_name ? "first_name" : null,
    !last_name ? "last_name" : null,
    !email ? "email" : null,
    !phone ? "phone" : null,
    (!addressArr[0] || !addressArr[1]) ? "address" : null,
    typeof application_answers !== "object" || application_answers === null ? "application_answers" : null,
  ].filter(Boolean)

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
      address: addressArr,
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

      if (rememberDetails === true && student_id) {
        const { data: quickPref } = await supabase
          .from("quick-apply-pref")
          .select("application_id")
          .eq("student_id", student_id)
          .eq("job_id", job_id)
          .single()

        if (quickPref && quickPref.application_id) {
          await supabase
            .from("quick-apply-pref")
            .update({
              experience_years,
              portfolio: safePortfolio ? JSON.stringify(safePortfolio) : null,
              resume,
              cover_letter,
              terms_accepted,
              first_name,
              last_name,
              email,
              phone,
              address: addressArr,
              application_questions,
              application_answers: JSON.stringify(safeApplicationAnswers),
              describe_proj: project_description,
              achievements: safeAchievements ? JSON.stringify(safeAchievements) : null,
              applied_at: new Date().toISOString(),
              status: "New",
              is_archived: false,
              is_invited: false,
            })
            .eq("application_id", quickPref.application_id)
        } else {
          await supabase
            .from("quick-apply-pref")
            .insert([{
              student_id,
              job_id,
              experience_years,
              portfolio: safePortfolio ? JSON.stringify(safePortfolio) : null,
              resume,
              cover_letter,
              terms_accepted,
              first_name,
              last_name,
              email,
              phone,
              address: addressArr,
              application_questions,
              application_answers: JSON.stringify(safeApplicationAnswers),
              describe_proj: project_description,
              achievements: safeAchievements ? JSON.stringify(safeAchievements) : null,
              status: "New",
              is_archived: false,
              is_invited: false,
            }])
        }
      }

      if (body.saveAddress === true && student_id && addressArr[0] && addressArr[1]) {
        await supabase
          .from("registered_students")
          .update({ address: addressArr })
          .eq("id", student_id)
      }
    }
    
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
