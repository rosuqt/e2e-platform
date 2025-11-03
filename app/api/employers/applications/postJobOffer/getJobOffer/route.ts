import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const application_id = req.nextUrl.searchParams.get("application_id")
  if (!application_id) {
    return NextResponse.json({ error: "Missing application_id" }, { status: 400 })
  }
  let adminSupabase
  try {
    adminSupabase = getAdminSupabase()
  } catch (e) {
    console.error("Failed to get admin supabase client:", e)
    return NextResponse.json({ error: "Supabase admin client error" }, { status: 500 })
  }
  const { data, error } = await adminSupabase
    .from("job_offers")
    .select("*")
    .eq("application_id", application_id)
    .order("updated_at", { ascending: false })
    .limit(1)
  if (error) {
    console.error("Supabase error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const offer = Array.isArray(data) && data.length > 0 ? data[0] : null
  console.log("job_offers data:", offer)
  return NextResponse.json({ offer })
}
