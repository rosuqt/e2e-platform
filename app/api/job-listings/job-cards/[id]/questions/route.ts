import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const params = await context.params
  const jobId = params.id
  const { data, error } = await supabase
    .from("application_questions")
    .select("id, question, type, auto_reject, correct_answer")
    .eq("job_id", jobId)

  if (error) {
    console.error("Supabase error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "No questions found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
