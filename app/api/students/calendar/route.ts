import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import supabase from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { data, error } = await supabase
    .from("student_events")
    .select("*")
    .eq("student_id", studentId)
    .order("event_date", { ascending: true })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const { title, event_date, location, time_start, time_end, desc } = body
  if (!title || !event_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("student_events")
    .insert([
      {
        student_id: studentId,
        title,
        event_date,
        location,
        time_start,
        time_end,
        desc,
      }
    ])
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  await supabase
    .from("activity_log")
    .insert([
      {
        student_id: studentId,
        type: "event_posted",
        message: `You’ve added ${title} event!`
      }
    ])
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const { id, title, event_date, location, time_start, time_end, desc } = body
  if (!id || !title || !event_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("student_events")
    .update({
      title,
      event_date,
      location,
      time_start,
      time_end,
      desc,
    })
    .eq("id", id)
    .eq("student_id", studentId)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Missing event id" }, { status: 400 })
  }
  const { error } = await supabase
    .from("student_events")
    .delete()
    .eq("id", id)
    .eq("student_id", studentId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
