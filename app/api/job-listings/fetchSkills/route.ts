import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId")
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("job_postings")
    .select("ai_skills")
    .eq("id", jobId)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ai_skills: data?.ai_skills ?? [] })
}
