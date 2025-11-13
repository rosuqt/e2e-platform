import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

type SessionUser = {
  employerId?: string
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser | undefined
  const { searchParams } = new URL(req.url)
  const employerID = searchParams.get("employerID") || user?.employerId
  if (!employerID) {
    return NextResponse.json({}, { status: 200 })
  }
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("employer_profile")
    .select("about,hiring_philosophy,contact_info,availability,short_bio,profile_img,cover_image")
    .eq("employer_id", employerID)
    .single()
  let registered_employer = null
  let registered_company = null
  if (!error) {
    console.log("employerID used for registered_employers query:", employerID)
    console.log("employerID value and type:", employerID, typeof employerID)


    const { data: emp, error: empError } = await supabase
      .from("registered_employers")
      .select("email,phone,country_code,company_id,company_email")
      .in("id", [employerID.trim()])
      .single()
    console.log("registered_employers query result:", emp)
    if (empError) {
      console.error("registered_employers query error:", empError)
    }
    if (emp) {
      registered_employer = emp as { email?: string; phone?: string; country_code?: string; company_id?: string; company_email?: string }
      if (emp.company_id) {
        const companyId = typeof emp.company_id === "string" ? emp.company_id.trim() : emp.company_id
        const { data: comp, error: compError } = await supabase
          .from("registered_companies")
          .select("company_website")
          .eq("id", companyId)
          .single()
        if (compError) {
          console.error("registered_companies query error:", compError)
        }
        if (comp) {
          registered_company = { company_website: comp.company_website }
        }
      }
      if (emp.email) data.profile_img = data.profile_img
      if (data.cover_image) data.cover_image = data.cover_image
    }
  }
  if (error) {
    return NextResponse.json({}, { status: 200 })
  }
  if (!data) {
    return NextResponse.json({}, { status: 200 })
  }
  return NextResponse.json({
    ...data,
    registered_employer,
    registered_company
  })
}
