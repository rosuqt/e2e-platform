import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const employerId = req.nextUrl.searchParams.get("employer_id")
  if (!employerId) {
    return NextResponse.json({ error: "Missing employer_id" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("registered_employers")
    .select("company_name")
    .eq("id", employerId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ company_name: data?.company_name })
}
