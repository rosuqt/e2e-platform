import { NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { student_id, file_url, file_name, file_size, file_type, parsed_text } = await req.json()
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const prompt = `
Extract the following from this resume:
- skills (array, with confidence)
- experience (array: company, role, years)
- education (array: degree, school)
- certificates (array: name, confidence)
- summary (short paragraph)
Return as JSON:
{
  parsed_skills: [{ name, confidence }],
  parsed_experience: [{ company, role, years }],
  parsed_education: [{ degree, school }],
  parsed_certificates: [{ title, issuer, description }],
  summary: ""
}
Resume text:
${parsed_text}
`
  let aiRes, aiContent = ""
  try {
    aiRes = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    })
    aiContent = aiRes.choices[0].message.content ?? ""
  } catch (err) {
    return NextResponse.json({ error: "OpenAI API error", details: String(err) }, { status: 500 })
  }
  type ParsedResume = {
    parsed_skills?: { name: string; confidence: number }[]
    parsed_experience?: { company: string; role: string; years: number }[]
    parsed_education?: { degree: string; school: string }[]
    parsed_certificates?: { name: string; confidence: number }[]
    summary?: string
  }
  let parsed: ParsedResume = {}
  try {
    let cleanContent = aiContent.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```/, "").replace(/```$/, "").trim();
    }
    parsed = JSON.parse(cleanContent)
  } catch {
    return NextResponse.json({ error: "AI parsing failed", aiContent }, { status: 500 })
  }
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from("parsed_resumes")
    .insert([
      {
        student_id,
        resume_file_url: file_url,
        file_name,
        file_size,
        file_type,
        parsed_text,  
        parsed_skills: parsed.parsed_skills ?? [],
        parsed_experience: parsed.parsed_experience ?? [],
        parsed_education: parsed.parsed_education ?? [],
        parsed_certificates: parsed.parsed_certificates ?? [],
        summary: parsed.summary ?? "",
        ai_model: "gpt-4-turbo"
      }
    ])
  if (error) {
    return NextResponse.json({ error: "Database insertion failed", details: error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
