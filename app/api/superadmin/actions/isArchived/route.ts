import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const { error } = await supabase
    .from("registered_admins")
    .update({ is_archived: true })
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
