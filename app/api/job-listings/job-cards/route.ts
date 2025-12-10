import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    let employerId: string | undefined;

    if (session?.user && typeof session.user === "object") {
      if ("employerId" in session.user && typeof (session.user as Record<string, unknown>).employerId === "string") {
        employerId = (session.user as Record<string, unknown>).employerId as string;
      } else if ("id" in session.user && typeof (session.user as Record<string, unknown>).id === "string") {
        employerId = (session.user as Record<string, unknown>).id as string;
      }
    }

    if (!employerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        id,
        job_title,
        location,
        remote_options,
        work_type,
        recommended_course,
        job_description,
        job_summary,
        must_have_qualifications,
        nice_to_have_qualifications,
        application_deadline,
        max_applicants,
        perks_and_benefits,
        verification_tier,
        created_at,
        responsibilities,
        paused,
        company_id,
        tags,
        ai_skills,
        is_archived,
        registered_companies (
          company_name
        )
      `)
      .eq('employer_id', employerId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error); // log error for debugging
      return NextResponse.json({ error: error.message, details: error, supabaseHint: error.hint }, { status: 500 });
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Unexpected data format from Supabase", data }, { status: 500 });
    }

    const jobIds = data.map((job) => job.id);

    type JobStats = {
      views: number;
      total_applicants: number;
      qualified_applicants: number;
      interviews: number;
    };
    const jobStats: Record<string, JobStats> = {};
    if (jobIds.length > 0) {
      const { data: statsData, error: statsError } = await supabase
        .from("job_metrics")
        .select("job_id, views, total_applicants, qualified_applicants, interviews")
        .in("job_id", jobIds);

      if (!statsError && Array.isArray(statsData)) {
        for (const stat of statsData) {
          jobStats[stat.job_id] = {
            views: stat.views ?? 0,
            total_applicants: stat.total_applicants ?? 0,
            qualified_applicants: stat.qualified_applicants ?? 0,
            interviews: stat.interviews ?? 0,
          };
        }
      }
    }

    const now = new Date();
    const jobs = data
      .filter(
        job =>
          job &&
          typeof job.id !== "undefined" &&
          typeof job.job_title === "string"
      )
      .map((job) => {
        const status = "Active";
        let closing = "";
        if (job.application_deadline) {
          const deadline = new Date(job.application_deadline);
          const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          closing = diff > 0 ? `${diff} days left` : "Closed";
        }
        let posted = "";
        if (job.created_at) {
          const created = new Date(job.created_at);
          const diff = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          posted = diff > 0 ? `${diff} days ago` : "Today";
        }
        const stats = jobStats[job.id] || {
          views: 0,
          total_applicants: 0,
          qualified_applicants: 0,
          interviews: 0,
        };
        return {
          id: job.id,
          title: job.job_title ?? "",
          status,
          closing,
          type: job.work_type ?? "",  
          posted,
          recommended_course: job.recommended_course ?? "",
          paused: job.paused ?? false,
          views: stats.views,
          total_applicants: stats.total_applicants,
          qualified_applicants: stats.qualified_applicants,
          interviews: stats.interviews,
          tags: Array.isArray(job.tags) ? job.tags : [],
        };
      });

    return NextResponse.json(Array.isArray(jobs) ? jobs : []);
  } catch (err: unknown) {
    let message = "Unknown error";
    let stack = undefined;
    if (err instanceof Error) {
      message = err.message;
      stack = err.stack;
    }
    return NextResponse.json(
      { error: "Unexpected error", message, stack },
      { status: 500 }
    );
  }
}
