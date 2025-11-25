import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()
  const { jobId } = body

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
  }

  const { error } = await supabase
    .from("community_jobs")
    .delete()
    .eq("id", jobId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
