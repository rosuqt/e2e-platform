import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

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

  const apiUrl = `${BASE_URL}/api/students/get-signed-url`;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket: "user.avatars", path: profileImgPath }),
  });
  if (!res.ok) {
    return new Response(JSON.stringify({ avatar: null, error: "Failed to get signed URL" }), { status: 200 });
  }
  const json = await res.json();
  if (!json.signedUrl) {
    return new Response(JSON.stringify({ avatar: null, error: "No signed URL returned" }), { status: 200 });
  }

  return new Response(JSON.stringify({ avatar: json.signedUrl }), { status: 200 });
}
