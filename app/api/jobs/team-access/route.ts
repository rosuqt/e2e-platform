import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

type JobTeamAccess = {
  job_id: string;
  employer_id: string;
  role: string;
  can_edit?: boolean;
  can_view?: boolean;
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("job_id")
  if (!jobId) {
    return NextResponse.json({ error: "Missing job_id" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("job_team_access")
    .select("*")
    .eq("job_id", jobId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data: data as JobTeamAccess[] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { job_id, employer_id, role, can_edit, can_view } = body
  if (!job_id || !employer_id || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("job_team_access")
    .upsert([
      {
        job_id,
        employer_id,
        role,
        can_edit: can_edit ?? (role !== "Viewer"),
        can_view: can_view ?? true,
      }
    ], { onConflict: "job_id,employer_id" })
    .select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data: (data as JobTeamAccess[])[0] })
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const { job_id, employer_id } = body
  if (!job_id || !employer_id) {
    return NextResponse.json({ error: "Missing job_id or employer_id" }, { status: 400 })
  }
  const { error } = await supabase
    .from("job_team_access")
    .delete()
    .eq("job_id", job_id)
    .eq("employer_id", employer_id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
