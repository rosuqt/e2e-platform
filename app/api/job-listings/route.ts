import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  let employerId: string | undefined;

  if (session?.user && typeof session.user === "object") {
    if ("employerId" in session.user && typeof (session.user as Record<string, unknown>).employerId === "string") {
      employerId = (session.user as Record<string, unknown>).employerId as string;
    } else if ("id" in session.user && typeof (session.user as Record<string, unknown>).id === "string") {
      employerId = (session.user as Record<string, unknown>).id as string;
    }
  }

  if (!employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("employer_id", employerId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
