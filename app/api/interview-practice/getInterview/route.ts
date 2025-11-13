import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const studentId = session?.user?.studentId;
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("interview_practice_history")
    .select("*")
    .eq("student_id", studentId)
    .eq("id", id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
