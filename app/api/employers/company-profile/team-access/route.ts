import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies as nextCookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const company_id = searchParams.get("company_id")
  if (!company_id) {
    return NextResponse.json({ error: "Missing company_id" }, { status: 400 })
  }
  const cookieStore = nextCookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: employers, error } = await supabase
    .from("registered_employers")
    .select("id, first_name, last_name, email, company_admin")
    .eq("company_id", company_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const employerIds = (employers || []).map(emp => emp.id)
  const profileImgs: Record<string, string | null> = {}
  if (employerIds.length > 0) {
    const { data: profiles } = await supabase
      .from("employer_profile")
      .select("employer_id, profile_img")
      .in("employer_id", employerIds)
    if (profiles) {
      for (const prof of profiles) {
        profileImgs[prof.employer_id] = prof.profile_img || null
      }
    }
  }

  const { data: accessRows, error: accessError } = await supabase
    .from("team_access")
    .select("employer_id, edit_company_profile, can_view")
    .eq("company_id", company_id)

  if (accessError) {
    return NextResponse.json({ error: accessError.message }, { status: 500 })
  }

  const accessMap = new Map<string, { edit_company_profile: boolean; can_view: boolean }>()
  for (const row of accessRows || []) {
    accessMap.set(row.employer_id, {
      edit_company_profile: !!row.edit_company_profile,
      can_view: !!row.can_view,
    })
  }

  const members = (employers || []).map(emp => {
    const access = accessMap.get(emp.id) as { edit_company_profile?: boolean; can_view?: boolean } || {}
    return {
      id: emp.id,
      name: [emp.first_name, emp.last_name].filter(Boolean).join(" "),
      email: emp.email,
      canEdit: emp.company_admin ? true : !!access.edit_company_profile,
      canView: emp.company_admin ? true : !!access.can_view,
      avatarUrl: profileImgs[emp.id] ?? null,
      isAdmin: !!emp.company_admin,
    }
  })

  const { data: companyProfile } = await supabase
    .from("company_profile")
    .select("profile_access")
    .eq("company_id", company_id)
    .single()

  return NextResponse.json({
    members,
    profile_access: companyProfile?.profile_access || "restricted"
  })
}

export async function POST(req: Request) {
  const cookieStore = nextCookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  type MemberInput = {
    id: string
    canEdit: boolean
    canView: boolean
  }

  let body: { company_id?: string; members?: MemberInput[]; generalAccess?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { company_id, members, generalAccess } = body
  if (!company_id || !Array.isArray(members)) {
    return NextResponse.json({ error: "Missing company_id or members" }, { status: 400 })
  }

  if (generalAccess) {
    await supabase
      .from("company_profile")
      .update({ profile_access: generalAccess })
      .eq("company_id", company_id)

    if (generalAccess === "company") {

      const { data: companyEmployers } = await supabase
        .from("registered_employers")
        .select("id, company_admin")
        .eq("company_id", company_id)

      for (const emp of companyEmployers || []) {
        if (!emp.company_admin) {
          await supabase
            .from("team_access")
            .upsert(
              {
                company_id,
                employer_id: emp.id,
                edit_company_profile: true,
                can_view: true,
              },
              { onConflict: "company_id,employer_id" }
            )
        }
      }
      return NextResponse.json({ success: true })
    }
  }

  const { data: companyEmployers } = await supabase
    .from("registered_employers")
    .select("id, company_admin")
    .eq("company_id", company_id)

  const validEmployerIds = new Set((companyEmployers || []).map(e => e.id))
  const adminIds = new Set((companyEmployers || []).filter(e => e.company_admin).map(e => e.id))

  for (const m of members) {
    if (!m.id || adminIds.has(m.id) || !validEmployerIds.has(m.id)) continue
    await supabase
      .from("team_access")
      .upsert(
        {
          company_id,
          employer_id: m.id,
          edit_company_profile: !!m.canEdit,
          can_view: !!m.canView,
        },
        { onConflict: "company_id,employer_id" }
      )
  }

  return NextResponse.json({ success: true })
}
