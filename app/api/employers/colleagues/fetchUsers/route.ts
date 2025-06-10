import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const company_name = searchParams.get("company_name")
  if (!company_name) {
    return NextResponse.json({ error: "Missing company_name" }, { status: 400 })
  }
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_employers")
    .select("id,first_name,last_name,email,company_branch,job_title,company_role,company_email,company_admin,created_at,company_name,user_id")
    .eq("company_name", company_name)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let users = data ?? []
  if (users.length > 0) {
    const ids = users.map(u => u.id).filter(Boolean)
    const { data: profiles } = await supabase
      .from("employer_profile")
      .select("employer_id,profile_img,cover_image") 
      .in("employer_id", ids)
    const profileMap = new Map((profiles ?? []).map(p => [p.employer_id, p]))
    users = users.map(u => {
      const createdAt = u.created_at ? new Date(u.created_at) : null
      const joined = createdAt
        ? `${createdAt.toLocaleString("en-US", { month: "long" })}, ${createdAt.getFullYear()}`
        : null
      return {
        ...u,
        profile_img: profileMap.get(u.id)?.profile_img ?? null,
        cover_image: profileMap.get(u.id)?.cover_image ?? null,
        joined
      }
    })
  }

  return NextResponse.json({ data: users })
}
