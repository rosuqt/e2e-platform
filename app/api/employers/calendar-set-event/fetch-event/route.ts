//FETCH REQUEST HOPEFULLY
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import supabase from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    type EmployerUser = { employerId?: string; id?: string };
    const user = session.user as EmployerUser;
    const employerId = user.employerId ?? user.id;

    const { data, error } = await supabase
      .from("employer_calendar")
      .select("*")
      .eq("employer_id", employerId)
      .order("event_start", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, events: data });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}