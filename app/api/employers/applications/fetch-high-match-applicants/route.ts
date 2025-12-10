/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    let employerId = body?.employer_id;

    if (!employerId) {
      const session = await getServerSession(authOptions);
      employerId = (session?.user as { employerId?: string })?.employerId;
    }

    if (!employerId) {
      return NextResponse.json({ error: "Missing employer_id" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // Get jobs posted by employer
    const { data: jobs, error: jobsError } = await supabase
      .from("job_postings")
      .select("id,job_title")
      .eq("employer_id", employerId);

    if (jobsError) {
      console.error("Supabase job_postings error:", jobsError);
      return NextResponse.json({
        error: jobsError.message,
        supabase: jobsError,
        hint: "Error fetching job_postings"
      }, { status: 500 });
    }

    const jobIds = Array.isArray(jobs) ? jobs.map((j: any) => j.id).filter(Boolean) : [];
    if (!jobIds.length) {
      return NextResponse.json({ candidates: [] });
    }

    // Get applications for these jobs
    const { data: applications, error: appsError } = await supabase
      .from("applications")
      .select("student_id, job_id, status")
      .in("job_id", jobIds)
      .eq("is_archived", false);

    if (appsError) {
      console.error("Supabase applications error:", appsError);
      return NextResponse.json({
        error: appsError.message,
        supabase: appsError,
        hint: "Error fetching applications"
      }, { status: 500 });
    }
    if (!Array.isArray(applications) || applications.length === 0) {
      return NextResponse.json({ candidates: [] });
    }

    // Get match scores for these student-job pairs
    const { data: matches, error: matchesError } = await supabase
      .from("job_matches")
      .select("student_id, job_id, gpt_score, last_scored_at")
      .in("job_id", jobIds)
      .in("student_id", applications.map((a: any) => a.student_id))
      .gte("gpt_score", 40);

    if (matchesError) {
      console.error("Supabase job_matches error:", matchesError);
      return NextResponse.json({
        error: matchesError.message,
        supabase: matchesError,
        hint: "Error fetching job_matches"
      }, { status: 500 });
    }
    if (!Array.isArray(matches) || matches.length === 0) {
      return NextResponse.json({ candidates: [] });
    }

    // Get student profile info
    const { data: students, error: studentsError } = await supabase
      .from("registered_students")
      .select("id, user_id, is_alumni, first_name, last_name, email, year, section, course, address, student_profile(profile_img)")
      .in("id", applications.map((a: any) => a.student_id));

    if (studentsError) {
      console.error("Supabase registered_students error:", studentsError);
      return NextResponse.json({
        error: studentsError.message,
        supabase: studentsError,
        hint: "Error fetching registered_students"
      }, { status: 500 });
    }
    if (!Array.isArray(students)) {
      return NextResponse.json({ candidates: [] });
    }

    const studentsMap = Object.fromEntries(students.map((s: any) => [s.id, s]));

    // Compose results
    const results = await Promise.all(applications.map(async (app: any) => {
      const match = matches.find((m: any) => m.student_id === app.student_id && m.job_id === app.job_id);
      if (!match) return null;
      const student = studentsMap[app.student_id] || {};
      // Address normalization
      let address = "";
      if (Array.isArray(student.address)) {
        address = student.address.map((part: any) => String(part).trim()).join(", ");
      } else if (student.address && typeof student.address === "object") {
        address = Object.values(student.address).map((part: any) => String(part).trim()).join(", ");
      } else if (typeof student.address === "string") {
        address = student.address.trim();
        // Try to parse as JSON array if it looks like one
        if (address.startsWith("[") && address.endsWith("]")) {
          try {
            const arr = JSON.parse(address);
            if (Array.isArray(arr)) {
              address = arr.map((part: any) => String(part).trim()).join(", ");
            }
          } catch {
            // fallback: remove brackets
            address = address.replace(/^\[|\]$/g, "");
          }
        }
      }
      // Remove any remaining brackets
      address = address.replace(/^\[|\]$/g, "");

      // Generate signed URL for profile image
      let profileImgUrl = "";
      const imgPath = student.student_profile?.profile_img;
      if (imgPath) {
        const { data } = await supabase.storage
          .from("user.avatars")
          .createSignedUrl(imgPath, 60 * 60);
        if (data?.signedUrl) profileImgUrl = data.signedUrl;
      }

      return {
        student_id: app.student_id,
        job_id: app.job_id,
        gpt_score: match?.gpt_score ?? null,
        last_scored_at: match?.last_scored_at ?? null,
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        email: student.email || "",
        year: student.year || "",
        section: student.section || "",
        course: student.course || "",
        address,
        is_alumni: student.is_alumni || false,
        user_id: student.user_id || "",
        profile_img_url: profileImgUrl,
        job_title: (jobs.find((j: any) => j.id === app.job_id)?.job_title) || "",
        application_status: app.status,
      };
    }));

    // Sort by match score descending, take top 3
    const sorted = results
      .filter(r => r && r.gpt_score !== null)
      .sort((a, b) => ((b?.gpt_score ?? 0) - (a?.gpt_score ?? 0)))
      .slice(0, 3);

    return NextResponse.json({ candidates: sorted });
  } catch (err: any) {
    console.error("Unexpected error in fetch-high-match-applicants:", err);
    return NextResponse.json({
      error: err?.message || "Unknown error",
      stack: err?.stack,
      hint: "Unexpected error"
    }, { status: 500 });
  }
}
