/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const student_id = session.user.studentId;

    const { data: activityData, error: activityError } = await supabase
      .from("activity_log")
      .select("*")
      .eq("student_id", student_id)
      .order("created_at", { ascending: false });

    if (activityError) throw activityError;

    const jobIds = [
      ...new Set(
        (activityData ?? [])
          .map((item: any) => item.job_id)
          .filter((id: string | null) => !!id)
      ),
    ];

    let jobsMap: Record<string, any> = {};
    if (jobIds.length > 0) {
      const { data: jobs, error: jobsError } = await supabase
        .from("job_postings")
        .select("id, job_title")
        .in("id", jobIds);

      if (jobsError) throw jobsError;
      jobsMap = (jobs ?? []).reduce((acc: any, job: any) => {
        acc[job.id] = job;
        return acc;
      }, {});
    }

    const employerIds = [
      ...new Set(
        (activityData ?? [])
          .map((item: any) => item.employer_id)
          .filter((id: string | null) => !!id)
      ),
    ];

    let employersMap: Record<string, any> = {};
    if (employerIds.length > 0) {
      const { data: employers, error: employersError } = await supabase
        .from("registered_companies")
        .select("id, company_name")
        .in("id", employerIds);

      if (employersError) throw employersError;
      employersMap = (employers ?? []).reduce((acc: any, emp: any) => {
        acc[emp.id] = emp;
        return acc;
      }, {});
    }

    const nowPH = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );
    const todayPH = new Date(nowPH.getFullYear(), nowPH.getMonth(), nowPH.getDate());
    const tomorrowPH = new Date(todayPH);
    tomorrowPH.setDate(todayPH.getDate() + 1);
    const formatDate = (d: Date) =>
      d.getFullYear().toString().padStart(4, "0") +
      "-" +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      d.getDate().toString().padStart(2, "0");

    const todayStr = formatDate(todayPH);
    const tomorrowStr = formatDate(tomorrowPH);

    const { data: interviews, error: interviewsError } = await supabase
      .from("interview_schedules")
      .select("id, date, time, mode, platform, address, notes, summary, employer_id, status")
      .eq("student_id", student_id)
      .in("date", [todayStr, tomorrowStr]);

    if (interviewsError) throw interviewsError;

    let interviewNotifications: any[] = [];
    if (interviews && interviews.length > 0) {
      const interviewEmployerIds = [
        ...new Set(
          interviews.map((item: any) => item.employer_id).filter((id: string | null) => !!id)
        ),
      ];
      let interviewEmployersMap: Record<string, any> = {};
      if (interviewEmployerIds.length > 0) {
        const { data: interviewEmployers, error: interviewEmployersError } = await supabase
          .from("registered_companies")
          .select("id, company_name")
          .in("id", interviewEmployerIds);
        if (interviewEmployersError) throw interviewEmployersError;
        interviewEmployersMap = (interviewEmployers ?? []).reduce((acc: any, emp: any) => {
          acc[emp.id] = emp;
          return acc;
        }, {});
      }
      interviewNotifications = await Promise.all(
        interviews.map(async (item: any) => {
          const employer = item.employer_id ? interviewEmployersMap[item.employer_id] : null;
          const companyName = employer ? employer.company_name : "";
          const isToday = item.date === todayStr;
          const isTomorrow = item.date === tomorrowStr;
          let notifType = "";
          let notifTitle = "";
          if (isToday) {
            notifType = "event_today";
            notifTitle = "Interview Today";
          } else if (isTomorrow) {
            notifType = "event_reminder";
            notifTitle = "Interview Tomorrow";
          }
          const dateObj = new Date(item.date + "T00:00:00");
          const formattedDate = dateObj.toLocaleString("en-US", {
            timeZone: "Asia/Manila",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const [h, m, s] = item.time.split(":");
          const timeObj = new Date();
          timeObj.setHours(Number(h), Number(m), Number(s));
          const formattedTime = timeObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Manila",
          });

          let activityLogId: string | undefined = undefined;
          if (notifType) {
            const { data: existing, error: existingError } = await supabase
              .from("activity_log")
              .select("id")
              .eq("student_id", student_id)
              .eq("type", notifType)
              .eq("interview_id", item.id)
              .maybeSingle();
            if (!existing && !existingError) {
              const { data: inserted, error: insertError } = await supabase
                .from("activity_log")
                .insert([
                  {
                    student_id,
                    type: notifType,
                    interview_id: item.id,
                    employer_id: item.employer_id,
                    message: `You have an interview with ${companyName} on ${formattedDate} at ${formattedTime} (${item.mode}${item.platform ? " - " + item.platform : ""}${item.address ? " - " + item.address : ""})`,
                  },
                ])
                .select("id")
                .maybeSingle();
              if (!insertError && inserted) {
                activityLogId = inserted.id;
              }
            } else if (existing) {
              activityLogId = existing.id;
            }
          }

          return {
            id: activityLogId ? activityLogId : `interview-${item.id}`,
            content: `You have an interview with ${companyName} on ${formattedDate} at ${formattedTime} (${item.mode}${item.platform ? " - " + item.platform : ""}${item.address ? " - " + item.address : ""})`,
            title: notifTitle,
            created_at: item.date,
            updated_at: item.date,
            user_id: student_id,
            type: notifType,
            company_name: companyName,
            interview_status: item.status,
          };
        })
      );
      interviewNotifications = interviewNotifications.filter((notif: any) => notif.type);
    }

    const notifications = [
      ...(activityData ?? []).map((item: any) => {
        const job = item.job_id ? jobsMap[item.job_id] : null;
        const jobTitle = job?.job_title || "";
        const employer = item.employer_id ? employersMap[item.employer_id] : null;
        const companyName = employer?.company_name || "a company";
        let content = "";
        let title = "";
        switch (item.type) {
          case "applications":
          case "new":
            title = `You applied for ${jobTitle}`;
            content = `Your application for ${jobTitle} was submitted.`;
            break;
          case "shortlisted":
            title = `Shortlisted for ${jobTitle}`;
            content = `You have been shortlisted for ${jobTitle}.`;
            break;
          case "interview":
            title = `Interview Scheduled for ${jobTitle}`;
            content = `An interview for ${jobTitle} has been scheduled.`;
            break;
          case "waitlisted":
            title = `Interview Completed for ${jobTitle}`;
            content = `You completed your interview for ${jobTitle}.`;
            break;
          case "offer_updated":
            title = `Offer Updated for ${jobTitle}`;
            content = `Your offer for ${jobTitle} has been updated.`;
            break;
          case "job_offers":
          case "offer sent":
            title = `Job Offer for ${jobTitle}`;
            content = `You received a job offer for ${jobTitle}.`;
            break;
          case "hired":
            title = `Hired for ${jobTitle}`;
            content = `Congratulations! You have been hired for ${jobTitle}.`;
            break;
          case "rejected":
            title = `Application Rejected for ${jobTitle}`;
            content = `Your application for ${jobTitle} was not successful.`;
            break;
          case "event_reminder":
            title = `Interview Tomorrow`;
            content = item.message;
            break;
          case "event_today":
            title = `Interview Today`;
            content = item.message;
            break;
          default:
            title = item.title || "Notification";
            content = item.message;
        }
        return {
          id: item.id,
          content,
          title,
          created_at: item.created_at,
          updated_at: item.created_at,
          user_id: item.student_id,
          type: item.type,
          company_name: "",
          job_title: jobTitle ?? "",
          source: item.type ?? "",
        };
      }),
      ...interviewNotifications.map((n: any) => ({
        ...n,
        company_name: "",
        job_title: n.job_title ?? "",
        source: n.type ?? "",
      })),
    ];

    notifications.sort((a, b) => {
      const aDate = new Date(a.updated_at ?? a.created_at).getTime();
      const bDate = new Date(b.updated_at ?? b.created_at).getTime();
      return bDate - aDate;
    });

    return NextResponse.json({ success: true, notifications });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}