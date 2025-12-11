import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized: No session" }, { status: 401 })
  }
  const student_id = (session.user as { studentId?: string }).studentId
  if (!student_id) {
    return NextResponse.json({ error: "Unauthorized: No studentId in session.user" }, { status: 401 })
  }

  const { course, yearLevel, section, jobType, remoteOption, unrelatedJobRecommendations, isAlumni } = await req.json()

  const { error } = await supabase
    .from("registered_students")
    .upsert([{
      id: student_id,
      course,
      year: yearLevel,
      section,
      is_alumni: !!isAlumni,
    }], { onConflict: "id" })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { error: jobPrefError } = await supabase
    .from("s_job_pref")
    .upsert([{
      id: student_id,
      student_id,
      job_type: jobType,
      remote_options: remoteOption,
      unrelated_jobs: unrelatedJobRecommendations,
    }], { onConflict: "id" })

  if (jobPrefError) {
    return NextResponse.json({ error: jobPrefError.message }, { status: 500 })
  }

  const educations = [{
    level: "College",
    years: isAlumni ? "Graduated" : "Present",
    degree: "BS - Information Technology",
    school: "STI College Alabang",
    acronym: "STI",
    iconColor: "#facc15"
  }];

  // Generate username
  let username = "";
  type UserSession = { first_name?: string; last_name?: string };
  const userSession = session.user as UserSession;
  if (userSession && userSession.first_name && userSession.last_name) {
    const sanitize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const base = `${sanitize(userSession.first_name)}-${sanitize(userSession.last_name)}`;
    let candidate = base;
    let suffix = 1;
    while (true) {
      const { data: existing } = await supabase
        .from("student_profile")
        .select("username")
        .eq("username", candidate)
        .maybeSingle();
      if (!existing) {
        username = candidate;
        break;
      }
      candidate = `${base}${suffix}`;
      suffix++;
    }
  }

  const { error: profileError } = await supabase
    .from("student_profile")
    .insert([{
      student_id,
      educations,
      username: username || null
    }]);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  console.log("Inserted student_profile for:", student_id, "educations:", educations, "username:", username);

  return NextResponse.json({ success: true, student_id })
}
