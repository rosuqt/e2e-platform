import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../../lib/authOptions"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  const url = req.url || ""
  const limitMatch = url.match(/limit=(\d+)/)
  let limit = 24
  if (limitMatch) {
    limit = parseInt(limitMatch[1], 10)
  }
  const supabase = getAdminSupabase()
  const { data: employers, error } = await supabase
    .from("registered_employers")
    .select("id, first_name, last_name, company_name, job_title, user_id, employer_profile(profile_img, cover_image)")
    .limit(48)
  if (error || !employers) return NextResponse.json({ employers: [] })

  type EmployerRow = {
    id: string
    first_name: string | null
    last_name: string | null
    company_name: string | null
    job_title: string | null
    user_id: string | null
    employer_profile?: { profile_img?: string | null, cover_image?: string | null }
  }

  const sorted = [...employers as EmployerRow[]].sort((a, b) => {
    const hasA = a.employer_profile?.profile_img ? 1 : 0
    const hasB = b.employer_profile?.profile_img ? 1 : 0
    return hasB - hasA
  })

  const mapped = await Promise.all(
    sorted.slice(0, limit).map(async (e) => {
      let avatar = "/placeholder.svg?height=100&width=100"
      let cover = ""
      const profileImg = e.employer_profile?.profile_img
      const coverImg = e.employer_profile?.cover_image
      if (profileImg) {
        const { data, error } = await supabase.storage
          .from("user.avatars")
          .createSignedUrl(profileImg, 60 * 60)
        if (!error && data?.signedUrl) avatar = data.signedUrl
      }
      if (coverImg) {
        const { data, error } = await supabase.storage
          .from("user.covers")
          .createSignedUrl(coverImg, 60 * 60)
        if (!error && data?.signedUrl) {
          cover = data.signedUrl
        }
      }
      // fallback to default_cover.jpg if no cover or failed to get signed URL
      if (!cover) {
        const { data: fallbackData, error: fallbackError } = await supabase.storage
          .from("app.images")
          .createSignedUrl("default_cover.jpg", 60 * 60)
        if (!fallbackError && fallbackData?.signedUrl) {
          cover = fallbackData.signedUrl
        }
      }
      return {
        id: e.id,
        first_name: e.first_name,
        last_name: e.last_name,
        company_name: e.company_name,
        job_title: e.job_title,
        user_id: e.user_id,
        avatar,
        cover,
      }
    })
  )

  return NextResponse.json({ employers: mapped })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  const employerId = _req.nextUrl.searchParams.get("employerId")
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (studentId && employerId) {
    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("student_follows_employers")
      .select("id")
      .eq("student_id", studentId)
      .eq("employer_id", employerId)
      .single()
    if (error || !data) return NextResponse.json({ status: null })
    return NextResponse.json({ status: "Following" })
  }
  return NextResponse.json({ status: null })
}
