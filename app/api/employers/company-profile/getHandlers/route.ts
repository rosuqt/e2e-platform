import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { employerId?: string } | undefined
  if (!user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const supabase = getAdminSupabase()
  const { data: employer, error: empError } = await supabase
    .from("registered_employers")
    .select("company_id")
    .eq("id", user.employerId)
    .single()
  if (empError || !employer?.company_id) {
    return NextResponse.json({ error: "No company found" }, { status: 404 })
  }
  const { data: company, error: compError } = await supabase
    .from("registered_companies")
    .select(
      "id,company_name,company_branch,company_industry,company_size,company_website,verify_status,address,exact_address,company_logo_image_path,country_code,contact_email,contact_number"
    )
    .eq("id", employer.company_id)
    .single()
  if (compError || !company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 })
  }
  const { data: profile, error: profileError } = await supabase
    .from("company_profile")
    .select("mission,vision,core_values,founded,about,goals,hq_img,cover_img,hq_bio,achievements,founders,business_hours,slogan")
    .eq("company_id", employer.company_id)
    .single()
  if (profileError) {
    return NextResponse.json({ error: "Company profile not found" }, { status: 404 })
  }
  return NextResponse.json({ ...company, ...profile })
}
