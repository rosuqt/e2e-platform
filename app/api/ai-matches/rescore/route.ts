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
    const { student_id, top_n = 10 } = await req.json();

    const { data: usage } = await supabase
      .from("rescore_usage")
      .select("last_used_at")
      .eq("student_id", student_id)
      .single();

    const now = new Date();
    let alreadyRanToday = false;
    if (usage?.last_used_at) {
      const lastUsed = new Date(usage.last_used_at);
      const diffHours = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        alreadyRanToday = true;
      }
    }

    if (alreadyRanToday) {

      const { data: cachedMatches } = await supabase
        .from("job_matches")
        .select("job_id, raw_similarity, gpt_score, last_scored_at")
        .eq("student_id", student_id)
        .gte("last_scored_at", new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString());

      console.log(`[RESCORE] Usage for today already used for student_id=${student_id}. Not charged OpenAI tokens.`);
      return NextResponse.json({ ok: true, results: cachedMatches || [] });
    }

    await supabase
      .from("rescore_usage")
      .upsert([{ student_id, last_used_at: now.toISOString() }], { onConflict: "student_id" });

    console.log(`[RESCORE] Usage for today not used for student_id=${student_id}. Charged OpenAI tokens.`);

    const { data: matches, error: rpcErr } = await supabase
      .rpc("get_job_matches_for_student", { student_uuid: student_id });

    if (rpcErr) throw rpcErr;
    const topMatches = (matches || []).slice(0, top_n);

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

    const buildStudentText = () => {
      const skills = Array.isArray(student?.skills) ? (student.skills.join(", ")) : JSON.stringify(student?.skills || []);
      const exp = (student?.experiences || []).map((e:any)=> `- ${e.jobTitle || ""} at ${e.company || ""} (${e.years || ""})`).join("\n");
      const certs = (student?.certs || []).map((c:any)=> `- ${c.title || ""} (${c.issuer || ""}) ${c.issueDate || ""}`).join("\n");
      const portfolio = (student?.portfolio || []).map((p:any)=> `- ${p.title}: ${p.description || ""}`).join("\n");
      return `
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
    };

    const studentText = buildStudentText();

    const results: Array<{ job_id: string; raw_similarity: number; gpt_score: number | null }> = [];
    const CONCURRENCY = 3;
    const queue = [...topMatches];

    async function worker() {
      while (queue.length) {
        const jobMatch = queue.shift();
        const job_id = jobMatch.job_id;

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

        let gptScore;
        try {
          gptScore = await askGptForScore(studentText, jobText);
        } catch (err) {
          console.error("GPT scoring failed for", job_id, err);
          gptScore = null;
        }

        const up = {
          student_id,
          job_id,
          match_score: jobMatch.similarity * 100,
          raw_similarity: jobMatch.similarity,
          gpt_score: gptScore,
          last_scored_at: new Date().toISOString()
        };

        await supabase.from("job_matches").upsert([up], { onConflict: "student_id,job_id" });

        results.push({ job_id, raw_similarity: jobMatch.similarity, gpt_score: gptScore });
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
