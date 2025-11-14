/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { student_id } = await req.json();

  const { data: matches, error } = await supabase
    .from("job_matches")
    .select("job_id, gpt_score, last_scored_at")
    .eq("student_id", student_id);

  if (error) {
    console.error("job_matches fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!matches || matches.length === 0) {
    return NextResponse.json({ matches: [] });
  }

  const jobIds = matches.map((m: any) => m.job_id).filter(Boolean);
  if (!Array.isArray(jobIds) || jobIds.length === 0) {
    return NextResponse.json({ matches: [] });
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select("id, job_title, company_id")
    .in("id", jobIds);

  if (jobsError) {
    console.error("job_postings fetch error:", jobsError);
    return NextResponse.json({ error: jobsError.message }, { status: 500 });
  }

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return NextResponse.json({ matches: [] });
  }

  const companyIds = jobs.map((j: any) => j.company_id).filter(Boolean);
  let companies: any[] = [];
  if (Array.isArray(companyIds) && companyIds.length > 0) {
    const { data: companiesData, error: companiesError } = await supabase
      .from("registered_companies")
      .select("id, company_name")
      .in("id", companyIds);

    if (companiesError) {
      console.error("registered_companies fetch error:", companiesError);
      return NextResponse.json({ error: companiesError.message }, { status: 500 });
    }
    companies = Array.isArray(companiesData) ? companiesData : [];
  }

  const jobsMap = Array.isArray(jobs) ? Object.fromEntries(jobs.map((j: any) => [j.id, j])) : {};
  const companiesMap = Array.isArray(companies) ? Object.fromEntries(companies.map((c: any) => [c.id, c.company_name])) : {};

  const enrichedMatches = matches.map((m: any) => {
    const job = jobsMap[m.job_id] || {};
    const companyName = companiesMap[job.company_id] || "";
    return {
      job_id: m.job_id,
      gpt_score: m.gpt_score,
      last_scored_at: m.last_scored_at,
      job_title: job.job_title || "",
      company_id: job.company_id || "",
      company_name: companyName,
    };
  });

  return NextResponse.json({ matches: enrichedMatches });
}
