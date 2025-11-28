import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const studentsParam = url.searchParams.get("students")
  const profileStudentId = url.searchParams.get("studentId")

  if (profileStudentId) {
    const supabase = getAdminSupabase()
    let { data, error } = await supabase
      .from("student_profile")
      .select("profile_img, contact_info,username")
      .eq("id", profileStudentId)
      .single()

    if (error || !data) {
      const fallback = await supabase
        .from("student_profile")
        .select("profile_img, contact_info,username")
        .eq("student_id", profileStudentId)
        .single()
      data = fallback.data
      error = fallback.error
    }

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  }

  if (studentsParam) {
    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("registered_students")
      .select("*")
      .eq("is_alumni", false)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ students: data }, { status: 200 })
  }

  if (url.searchParams.get("employers")) {
    const supabase = getAdminSupabase()
    const employerId = url.searchParams.get("employerId")
    if (employerId) {
      const { data, error } = await supabase
        .from("employer_profile")
        .select("profile_img")
        .eq("employer_id", employerId)
        .single()
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ profile_img: data?.profile_img }, { status: 200 })
    }
    const { data, error } = await supabase
      .from("registered_employers")
      .select("*, company_branch, registered_companies(company_website, company_logo_image_path), employer_profile(profile_img)")
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    type EmployerWithCompany = {
      [key: string]: unknown
      registered_companies?: { company_website?: string, company_logo_image_path?: string }
      employer_profile?: { profile_img?: string }
      company_website?: string
      profile_img?: string
      company_logo_image_path?: string
    }
    const employers = (data || []).map((emp: EmployerWithCompany) => ({
      ...emp,
      company_website: emp.registered_companies?.company_website || "",
      profile_img: emp.employer_profile?.profile_img || "",
      company_logo_image_path: emp.registered_companies?.company_logo_image_path || "",
    }))
    return NextResponse.json({ employers }, { status: 200 })
  }

  if (url.searchParams.get("allCompanies")) {
    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("registered_companies")
      .select("*")
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ companies: data }, { status: 200 })
  }

  if (url.searchParams.get("countEmployersByCompany")) {
    const supabase = getAdminSupabase()
    const { data: companies, error: companiesError } = await supabase
      .from("registered_companies")
      .select("company_name")
    if (companiesError) {
      return NextResponse.json({ error: companiesError.message }, { status: 500 })
    }
    const companyNames = (companies || []).map((c: { company_name: string }) => c.company_name)
    const { data: employers, error: employersError } = await supabase
      .from("registered_employers")
      .select("company_name")
      .in("company_name", companyNames)
    if (employersError) {
      return NextResponse.json({ error: employersError.message }, { status: 500 })
    }
    const count = employers ? employers.length : 0
    return NextResponse.json({ count }, { status: 200 })
  }

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_admins")
    .select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ coordinators: data }, { status: 200 })
}

