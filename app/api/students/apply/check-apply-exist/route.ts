/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { studentId, jobId } = await req.json();

    if (!studentId || !jobId) {
      return NextResponse.json({ error: "Missing studentId or jobId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("applications")
      .select("application_id")
      .eq("student_id", studentId)
      .eq("job_id", jobId)
      .limit(1);

    if (error) {
      return NextResponse.json({ error: "Error checking application" }, { status: 500 });
    }

    const exists = data && data.length > 0;
    const applicationId = exists ? data[0].application_id : null;

    return NextResponse.json({ exists, applicationId });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
