// app/api/ratings/student/route.ts
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function POST(req: Request) {
  try {
    // ✅ 1. Get logged-in student
    const session = await getServerSession(authOptions);
    const studentId = (session?.user as { studentId?: string })?.studentId;
    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ 2. Extract body
    const body = await req.json();
    const { jobId, overall, recruiter, company } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Missing jobId" },
        { status: 400 }
      );
    }

    // ✅ 3. Fetch employer + company from job_postings
    const { data: jobResult, error: jobError } = await supabase
      .from("job_postings")
      .select("employer_id, company_id")
      .eq("id", jobId)
      .single();

    if (jobError || !jobResult) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    const { employer_id: employerId, company_id: companyId } = jobResult;

    // ✅ 4. Insert rating
    const { data: inserted, error: insertError } = await supabase
      .from("student_ratings")
      .insert([
        {
          student_id: studentId,
          job_id: jobId,
          employer_id: employerId,
          company_id: companyId,
          overall_rating: overall?.rating,
          overall_comment: overall?.comment,
          recruiter_rating: recruiter?.rating,
          recruiter_comment: recruiter?.comment,
          company_rating: company?.rating,
          company_comment: company?.comment,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    console.log("✅ Inserted rating:", inserted);
    return NextResponse.json({ success: true, rating: inserted });
  } catch (err: any) {
    console.error("🔥 DB ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
