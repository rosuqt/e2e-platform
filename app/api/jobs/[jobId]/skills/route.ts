import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const jobId = url.pathname.split("/").filter(Boolean).at(-2);
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  try {
    const supabase = getAdminSupabase();
    const { data } = await supabase
      .from("job_skills")
      .select("skills")
      .eq("job_posting_id", jobId)
      .maybeSingle();

    if (!data) {
      return NextResponse.json({ skills: [] });
    }

    return NextResponse.json({ skills: data.skills || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

