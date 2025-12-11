import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import supabase from "@/lib/supabase"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: invites, error } = await supabase
    .from("job_invitations")
    .select(`
      *,
      is_favorite,
      job_id,
      registered_students (
        id,
        first_name,
        last_name,
        email,
        year,
        section,
        course,
        address,
        is_alumni
      )
    `)
    .eq("employer_id", session.user.employerId)
    .order("invited_at", { ascending: false })

  if (error) {
    console.error("displayInvites error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const adminSupabase = getAdminSupabase()
  async function getSignedUrl(bucket: string, path: string | null | undefined) {
    if (!path) return null
    const filePath = path === "default.png" ? "default.png" : path
    const { data, error } = await adminSupabase.storage.from(bucket).createSignedUrl(filePath, 60 * 60)
    return error ? null : data?.signedUrl || null
  }

  const results = await Promise.all(
    (invites || []).map(async (invite) => {
      const student = invite.registered_students
      let profile = null
      let avatarUrl = null
      let coverUrl = null
      let matchScore = 0
      let jobTitle = ""
      let employerName = ""
      let companyName = ""
      if (student?.id && invite.job_id) {
        const { data: profileData } = await supabase
          .from("student_profile")
          .select("profile_img, cover_image")
          .eq("student_id", student.id)
          .maybeSingle()
        profile = profileData
        avatarUrl = await getSignedUrl("user.avatars", profile?.profile_img)
        coverUrl = await getSignedUrl("user.covers", profile?.cover_image)

        const { data: matchData } = await supabase
          .from("job_matches")
          .select("gpt_score")
          .eq("student_id", student.id)
          .eq("job_id", invite.job_id)
          .maybeSingle()
        matchScore = matchData?.gpt_score ?? 0

        const { data: jobData } = await supabase
          .from("job_postings")
          .select("job_title")
          .eq("id", invite.job_id)
          .maybeSingle()
        jobTitle = jobData?.job_title ?? ""
      }

      let employerFirstName = ""
      let employerLastName = ""
      let companyId = ""
      const { data: employerData } = await supabase
        .from("registered_employers")
        .select("first_name, last_name, company_id")
        .eq("id", invite.employer_id)
        .maybeSingle()
      if (employerData) {
        employerFirstName = employerData.first_name || ""
        employerLastName = employerData.last_name || ""
        companyId = employerData.company_id || ""
      }
      employerName = [employerFirstName, employerLastName].filter(Boolean).join(" ").trim()

      if (companyId) {
        const { data: companyData } = await supabase
          .from("registered_companies")
          .select("company_name")
          .eq("id", companyId)
          .maybeSingle()
        companyName = companyData?.company_name || ""
      }

      return {
        ...invite,
        is_favorite: invite.is_favorite ?? false,
        job_id: invite.job_id,
        student_id: student.id,
        student: {
          ...student,
          avatarUrl,
          coverUrl
        },
        matchScore,
        jobTitle,
        employerName,
        companyName
      }
    })
  )

  console.log("displayInvites results:", results)
  return NextResponse.json({ invitations: results })
}
