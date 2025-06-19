import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const job_id = req.nextUrl.searchParams.get("job_id")
  if (!job_id) return NextResponse.json([], { status: 200 })

  const { data: questions, error: qErr } = await supabase
    .from("application_questions")
    .select("id, question, type, auto_reject,options")
    .eq("job_id", job_id)
    .order("id")

  if (qErr || !questions || questions.length === 0) return NextResponse.json([], { status: 200 })

  const result = questions.map(q => ({
    ...q,
    options: q.type === "text" ? [] : q.options || []
  }))

  return NextResponse.json(result)
}
