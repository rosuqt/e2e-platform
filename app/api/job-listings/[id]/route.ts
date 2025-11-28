import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  const session = await getServerSession(authOptions);
  const studentId = session?.user?.studentId;

  const { data, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", id)
    .single();

  let skillsMatched: number | null = null;
  if (studentId && id) {
    const { data: matchData } = await supabase
      .from("job_matches")
      .select("skills_matched")
      .eq("job_id", id)
      .eq("student_id", studentId)
      .single();
    if (matchData && typeof matchData.skills_matched === "number") {
      skillsMatched = matchData.skills_matched;
    }
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ ...data, skills_matched: skillsMatched });
}

