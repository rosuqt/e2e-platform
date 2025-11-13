/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { student_id } = await req.json()

    // 1. Fetch all needed fields from student_profile
    const { data: student, error } = await supabase
      .from("student_profile")
      .select("introduction, career_goals, skills, expertise, certs, experiences, portfolio")
      .eq("student_id", student_id)
      .single()

    if (error || !student)
      return NextResponse.json({ error: "No student data found" }, { status: 404 })

    // 2. Fetch parsed resume text (optional)
    const { data: resume } = await supabase
      .from("parsed_resumes")
      .select("parsed_text")
      .eq("student_id", student_id)
      .single()

    // 3. Process achievements (certs)
    const achievementsText = (student.certs || [])
      .map(
        (c: any) =>
          `Achievement: ${c.title || ""} by ${c.issuer || ""}. ${
            c.description || ""
          } (${c.category || ""}, ${c.issueDate || "no date"}).`
      )
      .join("\n")

    // 4. Process experience
    const experienceText = (student.experiences || [])
      .map(
        (e: any) =>
          `Experience: ${e.jobTitle || ""} at ${e.company || ""} (${e.jobType || ""}, ${
            e.years || ""
          }).`
      )
      .join("\n")

    // 5. Process portfolio
    const portfolioText = (student.portfolio || [])
      .map(
        (p: any) =>
          `Portfolio Project: ${p.title || ""}. ${p.description || ""}. Technologies: ${
            p.technologies || ""
          }`
      )
      .join("\n")

    // 6. Combine everything meaningfully
    const combinedText = `
      Introduction: ${student.introduction || ""}
      Career Goals: ${student.career_goals || ""}
      Skills: ${JSON.stringify(student.skills || [])}
      Expertise: ${JSON.stringify(student.expertise || [])}
      Resume: ${resume?.parsed_text || ""}
      Achievements: ${achievementsText}
      Experience: ${experienceText}
      Portfolio: ${portfolioText}
    `.replace(/\s+/g, " ")

    // 7. Generate embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: combinedText,
    })

    const vector = embeddingResponse.data[0].embedding
    console.log("Generated embedding vector:", vector)

    // 8. Store embedding back into student_profile
    const { data: updateData, error: updateError } = await supabase
      .from("student_profile")
      .update({ embedding: vector })
      .eq("student_id", student_id)
    console.log("Supabase update result:", { updateData, updateError })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create embedding" }, { status: 500 })
  }
}
