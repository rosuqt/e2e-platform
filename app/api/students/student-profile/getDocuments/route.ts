import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get("student_id");
  if (!student_id) {
    return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from("student_profile")
    .select("uploaded_resume_url, uploaded_cover_letter_url, certs")
    .eq("student_id", student_id)
    .single();

  if (error && error.code === "PGRST116") {
    return NextResponse.json({});
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  async function getSignedUrl(path: string | null | undefined) {
    if (!path) return null;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    console.log("Trying to sign:", "student.documents", cleanPath);
    const { data, error } = await supabase.storage
      .from("student.documents")
      .createSignedUrl(cleanPath, 60 * 60);
    if (error) {
      console.error("Supabase signed URL error:", error, "for path:", cleanPath);
      return null;
    }
    return data.signedUrl;
  }

  let resumeUrls: string[] = [];
  let coverLetterUrls: string[] = [];

  if (Array.isArray(profile?.uploaded_resume_url)) {
    resumeUrls = (
      await Promise.all(
        profile.uploaded_resume_url.map((path: string) => getSignedUrl(path))
      )
    ).filter((url): url is string => typeof url === "string" && url !== null);
  } else if (typeof profile?.uploaded_resume_url === "string" && profile.uploaded_resume_url) {
    const url = await getSignedUrl(profile.uploaded_resume_url);
    if (url) resumeUrls = [url];
  }

  if (Array.isArray(profile?.uploaded_cover_letter_url)) {
    coverLetterUrls = (
      await Promise.all(
        profile.uploaded_cover_letter_url.map((path: string) => getSignedUrl(path))
      )
    ).filter((url): url is string => typeof url === "string" && url !== null);
  } else if (typeof profile?.uploaded_cover_letter_url === "string" && profile.uploaded_cover_letter_url) {
    const url = await getSignedUrl(profile.uploaded_cover_letter_url);
    if (url) coverLetterUrls = [url];
  }

  let certsWithSignedUrls: Record<string, unknown>[] = [];
  if (Array.isArray(profile?.certs)) {
    certsWithSignedUrls = await Promise.all(
      profile.certs.map(async (cert: Record<string, unknown>) => {
        if (cert.attachmentUrl) {
          const signedUrl = await getSignedUrl(cert.attachmentUrl as string);
          return { ...cert, signedUrl };
        }
        return cert;
      })
    );
  }

  console.log({
    resumeUrls,
    coverLetterUrls,
    uploaded_resume_url: profile?.uploaded_resume_url,
    uploaded_cover_letter_url: profile?.uploaded_cover_letter_url,
  });

  return NextResponse.json({
    resumeUrls,
    coverLetterUrls,
    certs: certsWithSignedUrls,
    uploaded_resume_url: profile?.uploaded_resume_url,
    uploaded_cover_letter_url: profile?.uploaded_cover_letter_url,
  });
}

