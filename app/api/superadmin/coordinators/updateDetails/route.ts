import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = getAdminSupabase()
  const { id, ...fields } = body

  let result
  if (id) {
    const { error } = await supabase
      .from("ojt_students")
      .update(fields)
      .eq("id", id)
    result = error ? { error: error.message } : { success: true }
  } else {
    const { error } = await supabase
      .from("ojt_students")
      .upsert([fields])
    result = error ? { error: error.message } : { success: true }
  }
  return NextResponse.json(result)
}
