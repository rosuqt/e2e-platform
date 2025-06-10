import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 })
  }

  type EmployerSessionUser = {
    id?: string
    employerId?: string
    employer_id?: string
    company_id?: string
    company_admin?: boolean
    [key: string]: unknown
  }
  const user = session.user as EmployerSessionUser

  const employerId = user.employerId || user.id || user.employer_id
  let companyId = user.company_id

  if (!companyId && employerId) {
    const supabase = getAdminSupabase()
    const { data } = await supabase
      .from("registered_employers")
      .select("company_id")
      .eq("id", employerId)
      .single()
    if (data?.company_id) {
      companyId = data.company_id
    }
  }

  let edit_company_profile = false
  let can_view = false
  let team_access = "none"
  let company_admin = false

  if (user.company_admin) {
    edit_company_profile = true
    can_view = true
    team_access = "editor"
    company_admin = true
  } else if (employerId && companyId) {
    const supabase = getAdminSupabase()
    const { data } = await supabase
      .from("team_access")
      .select("edit_company_profile, can_view")
      .eq("employer_id", employerId)
      .eq("company_id", companyId)
      .single()
    if (data) {
      edit_company_profile = !!data.edit_company_profile
      can_view = !!data.can_view
      team_access = edit_company_profile ? "editor" : can_view ? "viewer" : "none"
    }
  }

  return new Response(JSON.stringify({
    ...session.user,
    edit_company_profile,
    can_view,
    team_access,
    company_admin,
    company_id: companyId || null,
  }), { status: 200 })
}
