import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET() {

  const session = await getServerSession(authOptions);

  const employerId = (session?.user as { company_id?: string })?.company_id;

  if (!session?.user?.role || session.user.role !== "employer" || !employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminSupabase();

  const companyId = employerId;

  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select("id, job_title")
    .eq("company_id", companyId);

  if (jobsError) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }

  const jobIds = jobs.map(j => j.id);
  let totalApplicants = 0;
  let newToday = 0;
  let interviewsScheduled = 0;
  let topPerformingJob = null;

  if (jobIds.length > 0) {
    const { data: applications, error: appsError } = await supabase
      .from("applications")
      .select("application_id, job_id, applied_at, status")
      .in("job_id", jobIds);

    if (appsError) {
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }

    totalApplicants = applications.length;
    const today = new Date();
    newToday = applications.filter(app => {
      const created = new Date(app.applied_at);
      return created.toDateString() === today.toDateString();
    }).length;
    interviewsScheduled = applications.filter(app => app.status === "interview").length;

    const jobApplicantCounts: Record<string, number> = {};
    applications.forEach(app => {
      jobApplicantCounts[app.job_id] = (jobApplicantCounts[app.job_id] || 0) + 1;
    });
    let topJobId = null;
    let maxApplicants = 0;
    for (const [jobId, count] of Object.entries(jobApplicantCounts)) {
      if (count > maxApplicants) {
        maxApplicants = count;
        topJobId = jobId;
      }
    }
    if (topJobId) {
      const topJob = jobs.find(j => j.id === topJobId);
      topPerformingJob = {
        title: topJob?.job_title || "",
        applicants: maxApplicants,
        views: 0,
        applicationsRate: "0%", 
      };
    }
  }

  const activeJobs = jobs.length;

  return NextResponse.json({
    totalApplicants,
    newToday,
    activeJobs,
    interviewsScheduled,
    topPerformingJob,
  });
}
