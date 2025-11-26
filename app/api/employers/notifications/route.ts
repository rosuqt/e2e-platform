import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user_id = (session.user as any).employerId ?? session.user.employerId;

    // FETCH 
    const [activityRes, accessRes, offerRes] = await Promise.all([
      supabase
        .from("applications")
        .select("application_id, job_id, first_name, last_name, status, applied_at, job_postings!inner(id, job_title, employer_id)")
        .eq("job_postings.employer_id", user_id),

      supabase
        .from("team_access")
        .select("id, company_id, edit_company_profile, can_view, created_at, updated_at")
        .eq("employer_id", user_id),

      supabase
        .from("job_offers")
        .select("id, applicant_name, job_title, created_at, updated_at ,accept_status")
        .eq("employer_id", user_id),
    ]);

    // UNIFY
    const combined = [
      ...(activityRes.data ?? []).map(item => ({
        source: "applications",
        external_id: item.application_id,
        user_id,
        title: `${item.first_name} ${item.last_name}'s application for ${item.job_postings.job_title}.`,
        content: `Status: ${item.status}`,
        created_at: item.applied_at,
        updated_at: item.applied_at,
      })),

      ...(accessRes.data ?? []).map(item => ({
        source: "job_team_access",
        external_id: item.id,
        user_id,
        title: `Your Current Team Access.`,
        content: `Company ID: ${item.company_id}, Can View: ${item.can_view}`,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),

      ...(offerRes.data ?? []).map(item => ({
        source: "job_offers",
        external_id: item.id,
        user_id,
        title: `The Job Offer of ${item.job_title} for ${item.applicant_name}`,
        content: `Is currently: ${item.accept_status === "accepted" ? "Accepted" : item.accept_status === "rejected" ? "Rejected": "Pending"}`,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
      
    ];

    combined.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    // GET EXISTING NOTIFICATIONS
    const { data: existing, error: existingError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user_id);

    if (existingError) throw existingError;

    // UPDATE
    for (const entry of combined) {
      const match = existing.find(
        e =>
          e.source === entry.source &&
          e.external_id === entry.external_id
      );

      const entryUpdated = new Date(entry.updated_at).getTime();
      const matchUpdated = match ? new Date(match.updated_at).getTime() : null;

      if (!match) {
        // INSERT new notification
        await supabase.from("notifications").insert({
          user_id,
          source: entry.source,
          external_id: entry.external_id,
          title: entry.title,
          content: entry.content,
          date: entry.created_at,
          read: false,
        });
      } else if (entryUpdated !== matchUpdated) {
        // UPDATE existing notification only if updated_at changed
        await supabase
          .from("notifications")
          .update({
            title: entry.title,
            content: entry.content,
            date: entry.updated_at,
            updated_at: new Date().toISOString(),
          })
          .eq("id", match.id);
      }
    }

    // RETURN
    const { data: finalNotifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user_id)
      .order("date", { ascending: false });

    return NextResponse.json({ success: true, notifications: combined });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to generate notifications" },
      { status: 500 }
    );
  }
}
