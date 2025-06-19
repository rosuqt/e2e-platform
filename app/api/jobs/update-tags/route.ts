import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { job_id, tags } = await req.json()
    if (!job_id || !Array.isArray(tags)) {
      return NextResponse.json({ error: "Missing job_id or tags" }, { status: 400 })
    }
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select("id")
      .eq("id", job_id)
      .single()
    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    const { data, error } = await supabase
      .from("job_postings")
      .update({ tags: tags })
      .eq("id", job_id)
      .select()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const job_id = searchParams.get("job_id")
    if (!job_id) {
      return NextResponse.json({ error: "Missing job_id" }, { status: 400 })
    }
    const { data, error } = await supabase
      .from("job_postings")
      .select("tags")
      .eq("id", job_id)
      .single()
    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Job not found" }, { status: 404 })
    }
    return NextResponse.json({ tags: data.tags || [] })
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 })
  }
}
