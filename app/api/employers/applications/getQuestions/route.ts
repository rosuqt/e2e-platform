import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const job_id = searchParams.get("job_id")
  if (!job_id) {
    return NextResponse.json({ error: "Missing job_id" }, { status: 400 })
  }

  const { data: questions, error } = await supabase
    .from("application_questions")
    .select("*")
    .eq("job_id", job_id)

  if (error) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }

  return NextResponse.json({ questions })
}
