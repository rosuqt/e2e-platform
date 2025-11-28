import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()
  const { id, title, company, link, status, description, hashtags } = body

  if (!id || !title || !company || !link || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const { error } = await supabase
    .from("community_jobs")
    .update({
      title,
      company,
      link,
      status,
      description,
      hashtags,
    })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
