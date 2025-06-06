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
    .select("skills, expertise, educations, certs, introduction, career_goals, contact_info, short_bio")
    .eq("student_id", studentId)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
