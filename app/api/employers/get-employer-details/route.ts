import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";

async function getEmployerIdAndRoleFromSession(req: NextRequest): Promise<{ employerId: string | null, role: string | null }> {
  const session = await getServerSession({ req, ...authOptions });
  const employerId = session?.user && typeof session.user === "object"
    ? (session.user as Record<string, unknown>)["employerId"] as string ?? null
    : null;
  const role = session?.user && typeof session.user === "object"
    ? (session.user as Record<string, unknown>)["role"] as string ?? null
    : null;
  return { employerId, role };
}

async function getEmployerDetails(employer_id: string) {
  const { data: employer, error } = await supabase
    .from("registered_employers")
    .select("id, first_name, last_name, email, job_title, verify_status")
    .eq("id", employer_id)
    .single();
  if (error || !employer) {
    return null;
  }
  return employer;
}

export async function GET(req: NextRequest) {
  const { employerId, role } = await getEmployerIdAndRoleFromSession(req);
  if (!employerId || role !== "employer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const details = await getEmployerDetails(employerId);
  if (!details) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 });
  }
  return NextResponse.json(details);
}
