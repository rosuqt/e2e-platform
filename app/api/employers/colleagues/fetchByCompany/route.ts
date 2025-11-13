import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const companyName = req.nextUrl.searchParams.get("company_name")
  const employerId = req.nextUrl.searchParams.get("employer_id")

  if (companyName) {
    const { data, error } = await supabase
      .from("registered_employers")
      .select("id, first_name, last_name, email, company_admin")
      .eq("company_name", companyName)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
  }

  if (employerId) {
    const { data, error } = await supabase
      .from("employer_profile")
      .select("profile_img")
      .eq("employer_id", employerId)
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ profile_img: data?.profile_img })
  }

  return NextResponse.json({ error: "Missing company_name or employer_id" }, { status: 400 })
}
