import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies as nextCookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = nextCookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const url = new URL(req.url);
  const filePath = url.searchParams.get("file");
  const studentIdParam = url.searchParams.get("student_id");

  let studentId: string | undefined;

  if (studentIdParam) {
    studentId = studentIdParam;
  } else {
    const session = await getServerSession({ req, ...authOptions });
    studentId = (session?.user as { studentId?: string })?.studentId;
  }

  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (filePath) {
    const normalizedPath = filePath.replace(/^\/+/, "");
    const { data, error } = await supabase.storage
      .from("student.documents")
      .createSignedUrl(normalizedPath, 60 * 10);

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: "Could not generate signed URL" }, { status: 404 });
    }

    return NextResponse.json({ url: data.signedUrl });
  }

  const { data: profile, error } = await supabase
    .from("student_profile")
    .select("student_id, skills, expertise, educations, certs, portfolio, introduction, career_goals, contact_info, short_bio, uploaded_resume_url, experiences")
    .eq("student_id", studentId)
    .single();

  //console.log("[GET student-profile] studentId:", studentId, "error:", error, "profile:", profile);

  let effectiveProfile = profile;
  if (error || !profile) {
    const { error: upsertError } = await supabase
      .from("student_profile")
      .upsert({ student_id: studentId }, { onConflict: "student_id" });
    //console.log("[GET student-profile] upsert error:", upsertError);
    if (upsertError) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    const { data: newProfile } = await supabase
      .from("student_profile")
      .select("student_id, skills, expertise, educations, certs, portfolio, introduction, career_goals, contact_info, short_bio, uploaded_resume_url, experiences")
      .eq("student_id", studentId)
      .single();
    //console.log("[GET student-profile] newProfile after upsert:", newProfile);
    effectiveProfile = newProfile;
  }

  let uploaded_resume_url: string[] = [];
  if (effectiveProfile?.uploaded_resume_url) {
    if (Array.isArray(effectiveProfile.uploaded_resume_url)) {
      uploaded_resume_url = effectiveProfile.uploaded_resume_url;
    } else if (typeof effectiveProfile.uploaded_resume_url === "string") {
      uploaded_resume_url = [effectiveProfile.uploaded_resume_url];
    }
  }

  const profileWithAchievements = {
    ...effectiveProfile,
    achievements: effectiveProfile?.certs,
    uploaded_resume_url,
    student_id: effectiveProfile?.student_id,
    experiences: effectiveProfile?.experiences,
  };

  return NextResponse.json(profileWithAchievements);
}
