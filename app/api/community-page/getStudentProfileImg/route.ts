import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  if (!studentId) {
    return new Response(JSON.stringify({ error: "Missing studentId" }), { status: 400 });
  }

  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("student_profile")
    .select("profile_img")
    .eq("student_id", studentId)
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!data) {
    return new Response(JSON.stringify({ avatar: null, error: "Student not found" }), { status: 404 });
  }

  const profileImgPath = data.profile_img;
  if (!profileImgPath) {
    return new Response(JSON.stringify({ avatar: null }), { status: 200 });
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase
    .storage
    .from("user.avatars")
    .createSignedUrl(profileImgPath, 60 * 60);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    return new Response(JSON.stringify({ avatar: null, error: signedUrlError?.message }), { status: 200 });
  }

  return new Response(JSON.stringify({ avatar: signedUrlData.signedUrl }), { status: 200 });
}
