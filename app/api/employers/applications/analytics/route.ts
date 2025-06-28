import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);

  const employerId = (session?.user as { employerId?: string; sub?: string })?.employerId || (session?.user as { sub?: string })?.sub;
  // console.log("employerId from session:", employerId);

  if (!session?.user?.role || session.user.role !== "employer" || !employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminSupabase();

  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select("id, job_title, paused, application_deadline, created_at")
    .eq("employer_id", employerId);

  // console.log("jobs fetched:", jobs);

  if (jobsError) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }

  const jobIds = jobs.map(j => j.id);
  // console.log("jobIds:", jobIds);

  let totalApplicants = 0;
  let totalApplicantsThisMonth = 0;
  let totalApplicantsLastMonth = 0;
  let newToday = 0;
  let interviewsScheduled = 0;
  let topPerformingJob = null;

  if (jobIds.length > 0) {
    const { data: applications, error: appsError } = await supabase
      .from("applications")
      .select("application_id, job_id, applied_at, status")
      .in("job_id", jobIds);

    // console.log("applications fetched:", applications);

    if (appsError) {
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }

    totalApplicants = applications.length;

    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    totalApplicantsThisMonth = applications.filter(app => {
      const applied = new Date(app.applied_at);
      return applied >= firstDayThisMonth && applied <= now;
    }).length;

    totalApplicantsLastMonth = applications.filter(app => {
      const applied = new Date(app.applied_at);
      return applied >= firstDayLastMonth && applied <= lastDayLastMonth;
    }).length;
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

  const now = new Date();
  const activeJobs = jobs.filter(j =>
    (j.paused !== true) &&
    (
      !j.application_deadline ||
      new Date(j.application_deadline) > now
    )
  ).length;

  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday as start of week

  const newJobsThisWeek = jobs.filter(j => {
    if (!j.created_at) return false;
    const created = new Date(j.created_at);
    return created >= startOfWeek;
  }).length;

  // console.log("totalApplicants:", totalApplicants, "newToday:", newToday, "activeJobs:", activeJobs, "interviewsScheduled:", interviewsScheduled, "topPerformingJob:", topPerformingJob);

  return NextResponse.json({
    totalApplicants,
    totalApplicantsThisMonth,
    totalApplicantsLastMonth,
    newToday,
    activeJobs,
    interviewsScheduled,
    topPerformingJob,
    newJobsThisWeek,
  });
}


