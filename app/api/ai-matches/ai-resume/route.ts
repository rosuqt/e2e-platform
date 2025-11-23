import { NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { student_id, file_url, file_name, file_size, file_type, parsed_text } = await req.json()
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const prompt = `
Extract the following from this resume:
- skills (array): ONLY soft skills (e.g., communication, leadership, teamwork, adaptability, etc.)
- expertise (array, with confidence): ONLY hard skills (e.g., programming languages like JavaScript, Python, tools like AWS, Excel, etc.)
- experience (array: years, company, jobType, jobTitle)
- education (array: level, years, degree, school, acronym(make sure to use only letters acronym no full words. maximum the acronym letters to only 5 letters))
- certificates or achievements (array: title, issuer, category, issueDate, description; category is "Award" if not clear)
- summary (short paragraph)
- resources (array: skill, title, url, level)
Return as JSON:
{
  skills: [{ name, confidence }],
  expertise: [{ name, confidence }],
  parsed_experience: [{ years, company, jobType, jobTitle }],
  parsed_education: [{ level, years, degree, school, acronym }],
  parsed_certificates: [{ title, issuer, category, issueDate, description }],
  summary: "",
  resources: [{ skill, title, url, level }]
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
    skills?: { name: string; confidence: number }[]
    expertise?: { name: string; confidence: number }[]
    parsed_experience?: { years: string; company: string; jobType: string; jobTitle: string }[]
    parsed_education?: { level: string; years: string; degree: string; school: string; acronym: string }[]
    parsed_certificates?: { title: string; issuer: string; category?: string; issueDate?: string; description?: string }[]
    summary?: string
    resources?: { skill: string; title: string; url: string; level: string }[]
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
    if (Array.isArray(parsed.parsed_certificates)) {
      parsed.parsed_certificates = parsed.parsed_certificates.map(cert => ({
        ...cert,
        category: cert.category || "Award"
      }));
    }
    if (Array.isArray(parsed.parsed_experience)) {
      parsed.parsed_experience = parsed.parsed_experience.filter(
        (exp: { years?: string; company?: string; jobType?: string; jobTitle?: string }) =>
          typeof exp === "object" &&
          exp !== null &&
          "jobTitle" in exp &&
          "company" in exp &&
          "years" in exp
      );
    }
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
        parsed_skills: parsed.skills ?? [],
        parsed_expertise: parsed.expertise ?? [],
        parsed_experience: parsed.parsed_experience ?? [],
        parsed_education: parsed.parsed_education ?? [],
        parsed_certificates: parsed.parsed_certificates ?? [],
        summary: parsed.summary ?? "",
        resources: parsed.resources ?? [],
        ai_model: "gpt-4-turbo"
      }
    ])
  if (error) {
    return NextResponse.json({ error: "Database insertion failed", details: error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
