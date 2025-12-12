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
    const employer_id = (session.user as any).employerId ?? session.user.employerId;

    // Fetch notifications from activity_log for this employer
    const { data: activityData, error: activityError } = await supabase
      .from("activity_log")
      .select("*")
      .eq("employer_id", employer_id)
      .order("created_at", { ascending: false });

    if (activityError) throw activityError;

    // Collect unique student_ids
    const studentIds = [
      ...new Set(
        (activityData ?? [])
          .map((item: any) => item.student_id)
          .filter((id: string | null) => !!id)
      ),
    ];

    // Fetch student details if any student_ids exist
    let studentsMap: Record<string, any> = {};
    if (studentIds.length > 0) {
      const { data: students, error: studentsError } = await supabase
        .from("registered_students")
        .select("id, first_name, last_name, course, year, section")
        .in("id", studentIds);

      if (studentsError) throw studentsError;
      studentsMap = (students ?? []).reduce((acc: any, student: any) => {
        acc[student.id] = student;
        return acc;
      }, {});
    }

    // Collect unique job_ids from all activityData
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

    // Interview schedules for today or tomorrow (Philippines time)
    const nowPH = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );
    // Use PH timezone for today and tomorrow
    const todayPH = new Date(nowPH.getFullYear(), nowPH.getMonth(), nowPH.getDate());
    const tomorrowPH = new Date(todayPH);
    tomorrowPH.setDate(todayPH.getDate() + 1);
    // Always format as YYYY-MM-DD
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
      .select("id, date, time, mode, platform, address, notes, summary, student_id, status")
      .eq("employer_id", employer_id)
      .in("date", [todayStr, tomorrowStr]);

    console.log("PH Today:", todayStr, "Tomorrow:", tomorrowStr, "interview_schedules response:", { interviews, interviewsError });

    if (interviewsError) throw interviewsError;

    let interviewNotifications: any[] = [];
    if (interviews && interviews.length > 0) {
      // collect student ids from interviews
      const interviewStudentIds = [
        ...new Set(
          interviews.map((item: any) => item.student_id).filter((id: string | null) => !!id)
        ),
      ];
      let interviewStudentsMap: Record<string, any> = {};
      if (interviewStudentIds.length > 0) {
        const { data: interviewStudents, error: interviewStudentsError } = await supabase
          .from("registered_students")
          .select("id, first_name, last_name, course, year, section")
          .in("id", interviewStudentIds);
        if (interviewStudentsError) throw interviewStudentsError;
        interviewStudentsMap = (interviewStudents ?? []).reduce((acc: any, student: any) => {
          acc[student.id] = student;
          return acc;
        }, {});
      }
      interviewNotifications = await Promise.all(
        interviews.map(async (item: any) => {
          const student = item.student_id ? interviewStudentsMap[item.student_id] : null;
          const studentName = student ? `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() : "";
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
          // Format date as "Dec 12, 2025"
          const dateObj = new Date(item.date + "T00:00:00");
          const formattedDate = dateObj.toLocaleString("en-US", {
            timeZone: "Asia/Manila",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          // Format time as standard 12-hour time
          const [h, m, s] = item.time.split(":");
          const timeObj = new Date();
          timeObj.setHours(Number(h), Number(m), Number(s));
          const formattedTime = timeObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Manila",
          });

          // Store to activity_log if not already present
          let activityLogId: string | undefined = undefined;
          if (notifType) {
            const { data: existing, error: existingError } = await supabase
              .from("activity_log")
              .select("id")
              .eq("employer_id", employer_id)
              .eq("type", notifType)
              .eq("interview_id", item.id)
              .maybeSingle();
            if (!existing && !existingError) {
              const { data: inserted, error: insertError } = await supabase
                .from("activity_log")
                .insert([
                  {
                    employer_id,
                    type: notifType,
                    interview_id: item.id,
                    student_id: item.student_id,
                    message: `Interview scheduled with ${studentName}. on ${formattedDate} at ${formattedTime} (${item.mode}${item.platform ? " - " + item.platform : ""}${item.address ? " - " + item.address : ""})`,
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
            content: `Interview scheduled with ${studentName}. on ${formattedDate} at ${formattedTime} (${item.mode}${item.platform ? " - " + item.platform : ""}${item.address ? " - " + item.address : ""})`,
            title: notifTitle,
            created_at: item.date,
            updated_at: item.date,
            user_id: employer_id,
            type: notifType,
            student: student
              ? {
                  first_name: student.first_name ?? "",
                  last_name: student.last_name ?? "",
                  course: student.course ?? "",
                  year: student.year ?? "",
                  section: student.section ?? "",
                }
              : undefined,
            job_title: "",
            applicant_name: studentName,
            interview_status: item.status,
          };
        })
      );
      interviewNotifications = interviewNotifications.filter((notif: any) => notif.type);
    }

    // Map activity_log fields to frontend notification shape, including student and job details for all types
    const notifications = [
      ...(activityData ?? []).map((item: any) => {
        const student = item.student_id ? studentsMap[item.student_id] : null;
        const job = item.job_id ? jobsMap[item.job_id] : null;
        const jobTitle = job?.job_title || "";
        const studentObj = student
          ? {
              first_name: student.first_name ?? "",
              last_name: student.last_name ?? "",
              course: student.course ?? "",
              year: student.year ?? "",
              section: student.section ?? "",
            }
          : undefined;
        const applicantName =
          item.applicant_name ||
          (student ? `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() : "");
        return {
          id: item.id,
          content: student
            ? `${item.message} - Student: ${student.first_name ?? ""} ${student.last_name ?? ""} (${student.course ?? ""} ${student.year ?? ""}${student.section ? "-" + student.section : ""})`.trim()
            : item.message,
          title: item.type.charAt(0).toUpperCase() + item.type.slice(1),
          created_at: item.created_at,
          updated_at: item.created_at,
          user_id: item.employer_id,
          type: item.type,
          student: studentObj,
          job_title: jobTitle,
          applicant_name: applicantName,
        };
      }),
      ...interviewNotifications, // <-- interviewNotifications are already included here!
    ];

    // Sort all notifications by created_at/updated_at descending
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