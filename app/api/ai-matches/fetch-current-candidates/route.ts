/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function POST(req: Request) {
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

  const { data: jobs, error: jobsError } = await supabase
    .from("job_postings")
    .select("id,job_title")
    .eq("employer_id", employerId);

  if (jobsError) {
    return NextResponse.json({ error: jobsError.message }, { status: 500 });
  }

  const jobIds = Array.isArray(jobs) ? jobs.map((j: any) => j.id).filter(Boolean) : [];
  if (!jobIds.length) {
    return NextResponse.json({ candidates: [] });
  }

  const { data: matches, error: matchesError } = await supabase
    .from("job_matches")
    .select("student_id, job_id, gpt_score, last_scored_at")
    .in("job_id", jobIds)
    .gte("gpt_score", 40);

  if (matchesError) {
    return NextResponse.json({ error: matchesError.message }, { status: 500 });
  }

  const studentIds = Array.isArray(matches) ? matches.map((m: any) => m.student_id).filter(Boolean) : [];
  if (!studentIds.length) {
    return NextResponse.json({ candidates: [] });
  }

  const { data: students, error: studentsError } = await supabase
    .from("registered_students")
    .select("id, email, first_name, last_name, year, section, course, address, is_alumni, user_id, student_profile(profile_img)")
    .in("id", studentIds);

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 });
  }

  const studentsMap = Array.isArray(students) ? Object.fromEntries(students.map((s: any) => [s.id, s])) : {};

  const results = await Promise.all(
    matches.map(async (m: any) => {
      const student = studentsMap[m.student_id] || {};
      let profileImgUrl = "";
      const imgPath = student?.student_profile?.profile_img;
      if (imgPath) {
        const { data } = await supabase.storage
          .from("user.avatars")
          .createSignedUrl(imgPath, 60 * 60);
        if (data?.signedUrl) profileImgUrl = data.signedUrl;
      }
      return {
        student_id: m.student_id,
        job_id: m.job_id,
        gpt_score: m.gpt_score,
        last_scored_at: m.last_scored_at,
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        email: student.email || "",
        year: student.year || "",
        section: student.section || "",
        course: student.course || "",
        address: student.address || "",
        is_alumni: student.is_alumni || false,
        user_id: student.user_id || "",
        profile_img_url: profileImgUrl,
        job_title: (jobs.find((j: any) => j.id === m.job_id)?.job_title) || "",
      };
    })
  );

  return NextResponse.json({ candidates: results });
}
