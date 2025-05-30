import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const job_id = req.nextUrl.searchParams.get("job_id")
  if (!job_id) return NextResponse.json([], { status: 200 })

  const { data: questions, error: qErr } = await supabase
    .from("application_questions")
    .select("id, question, type, auto_reject")
    .eq("job_id", job_id)
    .order("id")

  if (qErr || !questions || questions.length === 0) return NextResponse.json([], { status: 200 })

  const questionIds = questions.map(q => q.id)
  const { data: options } = await supabase
    .from("question_options")
    .select("id, question_id, option_value")
    .in("question_id", questionIds)

  type Option = { id: string; question_id: string; option_value: string }
  const optionsByQ = (options as Option[] | null || []).reduce((acc: Record<string, Option[]>, opt) => {
    if (!acc[opt.question_id]) acc[opt.question_id] = []
    acc[opt.question_id].push(opt)
    return acc
  }, {})

  const result = questions.map(q => ({
    ...q,
    options: q.type === "text" ? undefined : optionsByQ[q.id] || []
  }))

  return NextResponse.json(result)
}
