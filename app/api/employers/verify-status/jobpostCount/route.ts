import { NextResponse } from "next/server"
import supabase from "../../../../../src/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const employerId = searchParams.get("employerId")
  if (!employerId) {
    return NextResponse.json({ error: "Employer ID is required" }, { status: 400 })
  }
  const { count, error } = await supabase
    .from("job_postings")
    .select("id", { count: "exact", head: true })
    .eq("employer_id", employerId)
  if (error) {
    return NextResponse.json({ error: "Error counting job postings" }, { status: 500 })
  }
  return NextResponse.json({ count })
}
