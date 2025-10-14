import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employerId = (session.user as { employerId?: string }).employerId;
    if (!employerId) {
      return NextResponse.json({ error: "Employer ID not found" }, { status: 400 });
    }

    const body = await request.json();
    const { id, deadline, removeDeadline } = body;

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const { data: job, error: fetchError } = await supabase
      .from("job_postings")
      .select("id, employer_id")
      .eq("id", id)
      .eq("employer_id", employerId)
      .single();

    if (fetchError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updateData: {
      paused: boolean;
      application_deadline?: string | null;
    } = {
      paused: false,
      ...(removeDeadline && { application_deadline: null }),
      ...(deadline && { application_deadline: deadline }),
    };

    const { error: updateError } = await supabase
      .from("job_postings")
      .update(updateData)
      .eq("id", id)
      .eq("employer_id", employerId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reopening job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
