import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) return NextResponse.json({ employers: [] })

  const supabase = getAdminSupabase()
  const { data: follows, error: followsError } = await supabase
    .from("student_follows_employers")
    .select("employer_id, favorite")
    .eq("student_id", studentId)

  if (followsError || !follows || follows.length === 0) {
    return NextResponse.json({ employers: [] })
  }

  const employerIds = follows.map(f => f.employer_id)
  const favoriteMap = new Map<string, boolean>()
  follows.forEach(f => favoriteMap.set(f.employer_id, !!f.favorite))

  const { data: employers, error: employersError } = await supabase
    .from("registered_employers")
    .select("id, first_name, last_name, company_name, job_title, user_id, employer_profile(profile_img, cover_image)")
    .in("id", employerIds)

  if (employersError || !employers) {
    return NextResponse.json({ employers: [] })
  }

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
    const favA = favoriteMap.get(a.id) ? 1 : 0
    const favB = favoriteMap.get(b.id) ? 1 : 0
    if (favB !== favA) return favB - favA
    const hasA = a.employer_profile?.profile_img ? 1 : 0
    const hasB = b.employer_profile?.profile_img ? 1 : 0
    return hasB - hasA
  })

  const mapped = await Promise.all(
    sorted.map(async (e) => {
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
        if (!error && data?.signedUrl) cover = data.signedUrl
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
        favorite: favoriteMap.get(e.id) ?? false
      }
    })
  )

  return NextResponse.json({ employers: mapped })
}
