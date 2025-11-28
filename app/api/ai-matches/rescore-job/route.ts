/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askGptForScore(studentText: string, jobText: string) {
  const system = `
You are an assistant that evaluates how well a candidate fits a job posting.
Return ONLY a single integer score from 0 to 100 (inclusive), where 100 is perfect fit.
Do not include any explanation or extra text — just the number.
`;
  const user = `
Candidate profile (key details):
${studentText}

Job posting:
${jobText}

Rate the candidate's fit for this job (0-100). Output only the integer score.
`;
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.0,
    max_tokens: 10
  });

  const raw = resp.choices?.[0]?.message?.content?.trim?.() ?? "";
  const num = parseInt(raw.match(/-?\d+/)?.[0] ?? "", 10);
  if (Number.isNaN(num)) {
    throw new Error("GPT returned non-numeric response: " + JSON.stringify(raw));
  }
  return Math.max(0, Math.min(100, num));
}

export async function POST(req: Request) {
  try {
    const { job_id, top_n = 10, score_all_students = false } = await req.json();

    if (!job_id) {
      return NextResponse.json({ error: "Missing job_id" }, { status: 400 });
    }

    // Get job details
    const { data: job } = await supabase
      .from("job_postings")
      .select("job_title, job_description, ai_skills, tags, must_have_qualifications, nice_to_have_qualifications")
      .eq("id", job_id)
      .single();

    const jobText = `
Job Title: ${job?.job_title || ""}
Description: ${job?.job_description || ""}
AI Skills: ${(job?.ai_skills || []).join?.(", ") || JSON.stringify(job?.ai_skills || [])}
Tags: ${JSON.stringify(job?.tags || [])}
Must have: ${(job?.must_have_qualifications || []).join?.(", ") || ""}
Nice to have: ${(job?.nice_to_have_qualifications || []).join?.(", ") || ""}
`.replace(/\s+/g, " ");

    let matches: any[] = [];
    if (score_all_students) {
      // Fetch all students
      const { data: students, error: studentsErr } = await supabase
        .from("student_profile")
        .select("student_id");
      if (studentsErr) throw studentsErr;
      matches = students.map((s: any) => ({ student_id: s.student_id, similarity: 0 }));
    } else {
      const { data: rpcMatches, error: rpcErr } = await supabase
        .rpc("get_student_matches_for_job", { job_uuid: job_id });
      if (rpcErr) throw rpcErr;
      matches = (rpcMatches || []).slice(0, top_n);
    }

    const results: Array<{ student_id: string; raw_similarity: number; gpt_score: number | null }> = [];
    const CONCURRENCY = 3;
    const queue = [...matches];

    async function worker() {
      while (queue.length) {
        const match = queue.shift();
        const student_id = match.student_id;

        // Get student profile
        const { data: student } = await supabase
          .from("student_profile")
          .select("introduction, career_goals, skills, expertise, certs, experiences, portfolio")
          .eq("student_id", student_id)
          .single();

        const { data: resume } = await supabase
          .from("parsed_resumes")
          .select("parsed_text")
          .eq("student_id", student_id)
          .single();

        const skills = Array.isArray(student?.skills) ? (student.skills.join(", ")) : JSON.stringify(student?.skills || []);
        const exp = (student?.experiences || []).map((e:any)=> `- ${e.jobTitle || ""} at ${e.company || ""} (${e.years || ""})`).join("\n");
        const certs = (student?.certs || []).map((c:any)=> `- ${c.title || ""} (${c.issuer || ""}) ${c.issueDate || ""}`).join("\n");
        const portfolio = (student?.portfolio || []).map((p:any)=> `- ${p.title}: ${p.description || ""}`).join("\n");
        const studentText = `
Introduction: ${student?.introduction || ""}
Career goals: ${student?.career_goals || ""}
Skills: ${skills}
Expertise: ${JSON.stringify(student?.expertise || [])}
Resume text: ${resume?.parsed_text || ""}
Experiences:
${exp}
Certificates/Achievements:
${certs}
Portfolio:
${portfolio}
`.replace(/\s+/g, " ");

        let gptScore;
        try {
          gptScore = await askGptForScore(studentText, jobText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          gptScore = null;
        }

        const up = {
          student_id,
          job_id,
          match_score: (match.similarity ?? 0) * 100,
          raw_similarity: match.similarity ?? 0,
          gpt_score: gptScore,
          last_scored_at: new Date().toISOString(),
        };

        await supabase.from("job_matches").upsert([up], { onConflict: "student_id,job_id" });

        results.push({ student_id, raw_similarity: match.similarity ?? 0, gpt_score: gptScore });
      }
    }

    const workers = Array.from({length: CONCURRENCY}).map(() => worker());
    await Promise.all(workers);

    return NextResponse.json({ ok: true, results });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}
