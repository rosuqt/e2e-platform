import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const application_id = req.nextUrl.searchParams.get("application_id")
  const employer_id = req.nextUrl.searchParams.get("employer_id")
  const info = req.nextUrl.searchParams.get("info")

  const supabase = getAdminSupabase()

  if (application_id && !info) {
    const { data } = await supabase
      .from("applications")
      .select("recruiters_notes")
      .eq("application_id", application_id)
      .maybeSingle()
    return NextResponse.json(data?.recruiters_notes || [], { status: 200 })
  }

  if (employer_id && info === "employer") {
    const { data: employer } = await supabase
      .from("registered_employers")
      .select("first_name, last_name, job_title")
      .eq("id", employer_id)
      .maybeSingle()
    const { data: profile } = await supabase
      .from("employer_profile")
      .select("profile_img")
      .eq("employer_id", employer_id)
      .maybeSingle()
    return NextResponse.json(
      {
        ...employer,
        profile_img: profile?.profile_img || null
      },
      { status: 200 }
    )
  }


  return NextResponse.json([], { status: 200 })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { application_id, note } = await req.json()
  if (!application_id || !note) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  const supabase = getAdminSupabase()
  const { data } = await supabase
    .from("applications")
    .select("recruiters_notes")
    .eq("application_id", application_id)
    .maybeSingle()
  const notes = Array.isArray(data?.recruiters_notes) ? data.recruiters_notes : []
  notes.unshift(note)
  await supabase
    .from("applications")
    .update({ recruiters_notes: notes })
    .eq("application_id", application_id)
  return NextResponse.json({ ok: true }, { status: 200 })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { application_id, notes } = await req.json()
  if (!application_id || !Array.isArray(notes)) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  const supabase = getAdminSupabase()
  await supabase
    .from("applications")
    .update({ recruiters_notes: notes })
    .eq("application_id", application_id)
  return NextResponse.json({ ok: true }, { status: 200 })
}

