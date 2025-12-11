import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { id, is_archived, target } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const archiveValue = typeof is_archived === "boolean" ? is_archived : true

  // Support multiple caller types; default remains admins
  const table =
    target === "employer"
      ? "registered_employers"
      : "registered_admins"

  const { error } = await supabase
    .from(table)
    .update({ is_archived: archiveValue })
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, is_archived: archiveValue })
}
