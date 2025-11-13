import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const supabase = getAdminSupabase()
  
  try {
    const body = await req.json()
    console.log("Request body:", body)
    
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

    const requiredFields = ['application_id', 'mode', 'date', 'time', 'student_id', 'employer_id']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields)
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 })
    }

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
        employer_id,
        status: "Pending"
      }])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    await supabase
      .from("applications")
      .update({ status: "waitlisted" })
      .eq("application_id", application_id)

    const { data: applicationData } = await supabase
      .from("applications")
      .select("job_id")
      .eq("application_id", application_id)
      .single()

    if (applicationData?.job_id) {
      const { data: existingMetric } = await supabase
        .from("job_metrics")
        .select("*")
        .eq("job_id", applicationData.job_id)
        .single()

      if (existingMetric) {
        await supabase
          .from("job_metrics")
          .update({ interviews: existingMetric.interviews + 1 })
          .eq("job_id", applicationData.job_id)
      } else {
        await supabase
          .from("job_metrics")
          .insert({ job_id: applicationData.job_id, interviews: 1 })
      }
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (parseError) {
    console.error("Request parsing error:", parseError)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
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
    employer_id,
    status
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
      employer_id,
      ...(status && { status })
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

