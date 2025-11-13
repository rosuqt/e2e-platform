import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { jobId, ai_skills } = await req.json()
  if (!jobId || !Array.isArray(ai_skills)) {
    return NextResponse.json({ error: "Missing jobId or ai_skills" }, { status: 400 })
  }
  const { error } = await supabase
    .from("job_postings")
    .update({ ai_skills })
    .eq("id", jobId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { jobId, skill } = await req.json()
  if (!jobId || !skill) {
    return NextResponse.json({ error: "Missing jobId or skill" }, { status: 400 })
  }
  const { data, error: fetchError } = await supabase
    .from("job_postings")
    .select("ai_skills")
    .eq("id", jobId)
    .single()
  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }
  const updatedSkills = (data?.ai_skills ?? []).filter((s: string) => s !== skill)
  const { error } = await supabase
    .from("job_postings")
    .update({ ai_skills: updatedSkills })
    .eq("id", jobId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, ai_skills: updatedSkills })
}
