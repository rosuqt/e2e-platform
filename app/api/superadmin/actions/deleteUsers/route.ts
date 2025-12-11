import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { id, table } = await req.json()
  if (!id || !table) return NextResponse.json({ error: "Missing id or table" }, { status: 400 })

  const allowedTables = [
    "registered_students",
    "registered_employers",
    "registered_admins",
    "registered_companies",
  ]
  if (!allowedTables.includes(table)) return NextResponse.json({ error: "Invalid table" }, { status: 400 })

  const { error } = await supabase.from(table).delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
