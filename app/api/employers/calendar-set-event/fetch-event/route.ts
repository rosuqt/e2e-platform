//FETCH REQUEST HOPEFULLY
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import supabase from "../../../../../lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employerId =
      (session.user as any).employerId ?? (session.user as any).id;

    const { data, error } = await supabase
      .from("employer_calendar")
      .select("*")
      .eq("employer_id", employerId)
      .order("event_start", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, events: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
