import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  console.log("studentId", studentId)
  if (!studentId) return NextResponse.json({ companies: [] })

  const supabase = getAdminSupabase()
  const { data: follows, error: followsError } = await supabase
    .from("student_follows_companies")
    .select("company_id, favorite")
    .eq("student_id", studentId)
  console.log("follows", follows)

  if (followsError || !follows || follows.length === 0) {
    return NextResponse.json({ companies: [] })
  }

  const companyIds = follows.map(f => f.company_id)
  const favoriteMap = new Map<string, boolean>()
  follows.forEach(f => favoriteMap.set(f.company_id, !!f.favorite))

  const { data: companies, error: companiesError } = await supabase
    .from("registered_companies")
    .select("id, company_name, company_industry, company_logo_image_path, address, suite_unit_floor, business_park_landmark, building_name, country_code")
    .in("id", companyIds)

  if (companiesError || !companies) {
    return NextResponse.json({ companies: [] })
  }

  const mapped = companies.map(c => {
    let logo = "/placeholder.svg?height=100&width=100"
    if (c.company_logo_image_path) {
      logo = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/company.logo/${c.company_logo_image_path}`
    }
    const locationParts = [
      c.suite_unit_floor,
      c.building_name,
      c.business_park_landmark,
      c.address,
      c.country_code
    ].filter(Boolean)
    const location = locationParts.join(", ")
    return {
      id: c.id,
      name: c.company_name,
      industry: c.company_industry,
      logo,
      favorite: favoriteMap.get(c.id) ?? false,
      location
    }
  })

  return NextResponse.json({ companies: mapped })
}
