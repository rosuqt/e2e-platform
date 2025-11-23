import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";

export async function GET() {
  try {
    //Get User ID
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user_id =
      typeof session.user === "object" && session.user !== null && "employerId" in session.user
        ? (session.user as { employerId?: string }).employerId
        : undefined;

    // Fetch from multiple tables in parallel
    const [activityRes, offerRes] = await Promise.all([
      supabase.from("activity_log").select("id, employer_id, student_id, job_id, type, message, created_at").eq("student_id", user_id),
      supabase.from("job_offers").select("id, created_at") .eq("student_id", user_id),
    ]);
    
    // Check for errors
    if (activityRes.error ||offerRes.error) {
      throw new Error(
        activityRes.error?.message ||
        offerRes.error?.message
      );
    }

    // Return combined JSON
    return NextResponse.json({
      activity: activityRes.data,
      offer: offerRes.data,
    })

  } catch (err: unknown) {
    const message =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message ?? ""
        : "";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

