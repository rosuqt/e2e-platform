import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";
import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const employerId = session?.user?.employerId;

  if (!employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: jobs, error } = await supabase
    .from("job_postings")
    .select(`
      id,
      job_title,
      work_type,
      location,
      application_deadline,
      created_at,
      max_applicants,
      paused,
      is_archived,
      verification_tier
    `)
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ jobs: jobs ?? [] });
}
