import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  console.log("POST /api/ai-matches/embeddings/job called")
  try {
    const { job_id } = await req.json()

    const { data: job } = await supabase
      .from("job_postings")
      .select("job_title, job_description, ai_skills, tags, must_have_qualifications, nice_to_have_qualifications")
      .eq("id", job_id)
      .single()

    if (!job)
      return NextResponse.json({ error: "Job not found" }, { status: 404 })

   const combinedText = `
  Job Title: ${job.job_title || ""}
  Description: ${job.job_description || ""}
  AI Skills: ${(job.ai_skills || []).join(", ")}
  Tags: ${(job.tags || []).join(", ")}
  Must Have: ${(job.must_have_qualifications || []).join(", ")}
  Nice To Have: ${(job.nice_to_have_qualifications || []).join(", ")}
`.replace(/\s+/g, " ")


    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: combinedText,
    })

    const vector = embeddingResponse.data[0].embedding

    console.log("Job embedding vector:", vector)

    const updateRes = await supabase
      .from("job_postings")
      .update({ embedding: vector })
      .eq("id", job_id)

    console.log("Supabase update response:", updateRes)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create job embedding" }, { status: 500 })
  }
}
