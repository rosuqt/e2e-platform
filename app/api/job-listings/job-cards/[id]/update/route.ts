import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await context.params
    const body = await request.json()
    console.log('Update jobId:', jobId)
    console.log('Update payload:', body)

    const { data, error } = await supabase
      .from("job_postings")
      .update(body)
      .eq("id", jobId)
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
