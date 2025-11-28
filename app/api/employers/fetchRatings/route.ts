import { NextResponse } from "next/server"
import supabase, { getAdminSupabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/authOptions"

export async function GET() {
  const session = await getServerSession(authOptions)
  const employerId = (session?.user as { employerId?: string })?.employerId
  if (!employerId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("student_ratings")
    .select(`
      id,
      student_id,
      job_id,
      employer_id,
      company_id,
      overall_rating,
      overall_comment,
      recruiter_rating,
      recruiter_comment,
      company_rating,
      company_comment,
      created_at,
      updated_at,
      job_postings(job_title),
      registered_students(first_name, last_name, email)
    `)
    .eq("employer_id", employerId)

  if (error) {
    console.error("Error fetching ratings:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  const adminSupabase = getAdminSupabase()
  const ratingsWithImg = await Promise.all(
    (data ?? []).map(async (r) => {
      let profileImgUrl
      // Fetch student profile_img separately
      let studentProfileImg: string | undefined
      if (r.student_id) {
        const { data: profileData, error: profileError } = await supabase
          .from("student_profile")
          .select("profile_img")
          .eq("student_id", r.student_id)
          .maybeSingle()
        if (!profileError && profileData && typeof profileData.profile_img === "string") {
          studentProfileImg = profileData.profile_img
        }
      }
      if (studentProfileImg && !/^https?:\/\//.test(studentProfileImg)) {
        try {
          const { data: signed, error: signedError } = await adminSupabase
            .storage
            .from("user.avatars")
            .createSignedUrl(studentProfileImg, 60 * 60)
          if (signed?.signedUrl && !signedError) {
            profileImgUrl = signed.signedUrl
          } else {
            profileImgUrl = "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg"
          }
        } catch {
          profileImgUrl = "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg"
        }
      } else if (studentProfileImg && /^https?:\/\//.test(studentProfileImg)) {
        profileImgUrl = studentProfileImg
      } else {
        profileImgUrl = "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg"
      }
      return {
        ...r,
        registered_students: {
          ...(!Array.isArray(r.registered_students) ? r.registered_students : {}),
          profile_img: profileImgUrl
        }
      }
    })
  )

  return NextResponse.json(ratingsWithImg)
}
