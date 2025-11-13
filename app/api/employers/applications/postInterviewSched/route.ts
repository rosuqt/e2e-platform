import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const supabase = getAdminSupabase()
  const body = await req.json()
  const {
    application_id,
    mode,
    platform,
    address,
    team,
    date,
    time,
    notes,
    summary,
    student_id,
    employer_id
  } = body

  const { data, error } = await supabase
    .from("interview_schedules")
    .insert([{
      application_id,
      mode,
      platform,
      address,
      team,
      date,
      time,
      notes,
      summary,
      student_id,
      employer_id
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await supabase
    .from("applications")
    .update({ status: "waitlisted" })
    .eq("application_id", application_id)

  return NextResponse.json({ data }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const supabase = getAdminSupabase()
  const body = await req.json()
  const {
    id,
    application_id,
    mode,
    platform,
    address,
    team,
    date,
    time,
    notes,
    summary,
    student_id,
    employer_id
  } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing interview schedule id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("interview_schedules")
    .update({
      application_id,
      mode,
      platform,
      address,
      team,
      date,
      time,
      notes,
      summary,
      student_id,
      employer_id
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await supabase
    .from("applications")
    .update({ status: "waitlisted" })
    .eq("application_id", application_id)

  return NextResponse.json({ data }, { status: 200 })
}

export async function GET(req: NextRequest) {
  const supabase = getAdminSupabase()
  const { searchParams } = new URL(req.url)
  const application_id = searchParams.get('application_id')
  if (!application_id) {
    return NextResponse.json({ error: 'Missing application_id' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('interview_schedules')
    .select('*')
    .eq('application_id', application_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ data: data || null }, { status: 200 })
}

