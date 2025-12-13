import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { id, is_archived, target } = await req.json()
  
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  
  const archiveValue = typeof is_archived === "boolean" ? is_archived : true

 
  const table =
    target === "employer"
      ? "registered_employers"
      : target === "student"
        ? "registered_students"
        : target === "company"
          ? "registered_companies"
          : "registered_admins"

  const updateData = { is_archived: archiveValue }

  const { error } = await supabase
    .from(table)
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, is_archived: archiveValue })
}