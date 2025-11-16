import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { studentId, jobId } = await req.json();

    if (!studentId || !jobId) {
      return NextResponse.json(
        { error: "Missing required fields: studentId or jobId" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("applications")
      .select("id")
      .eq("student_id", studentId)
      .eq("job_id", jobId)
      .maybeSingle();

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { exists: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ exists: !!data });
  } catch (err) {
    console.error("Unexpected error in check-apply-exist route:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
