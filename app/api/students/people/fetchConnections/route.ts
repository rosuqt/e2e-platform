import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import supabase from "@/lib/supabase"
import { getAdminSupabase } from "@/lib/supabase"

async function getStudentImageUrls(studentId: string) {
  const adminSupabase = getAdminSupabase()
  const { data: profile } = await adminSupabase
    .from("student_profile")
    .select("profile_img, cover_image")
    .eq("student_id", studentId)
    .single()
  let avatarUrl = null
  let coverUrl = null
  if (profile?.profile_img) {
    const { data } = await adminSupabase.storage
      .from("user.avatars")
      .createSignedUrl(profile.profile_img, 60 * 60)
    if (data?.signedUrl) avatarUrl = data.signedUrl
  }
  if (profile?.cover_image) {
    const { data } = await adminSupabase.storage
      .from("user.covers")
      .createSignedUrl(profile.cover_image, 60 * 60)
    if (data?.signedUrl) coverUrl = data.signedUrl
  }
  return { avatarUrl, coverUrl }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) {
    return new Response(JSON.stringify([]), { status: 401 })
  }
  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("status", "Friends")
    .or(`sender_id.eq.${studentId},receiver_id.eq.${studentId}`)
  if (error) {
    return new Response(JSON.stringify([]), { status: 500 })
  }
  const connections = await Promise.all((data ?? []).map(async row => {
    const otherId = row.sender_id === studentId ? row.receiver_id : row.sender_id
    let otherStudent = null
    let avatarUrl = null
    let coverUrl = null
    if (otherId) {
      const { data: student } = await supabase
        .from("registered_students")
        .select("id, first_name, last_name, year, section, course, email")
        .eq("id", otherId)
        .single()
      otherStudent = student
      if (student?.id) {
        const urls = await getStudentImageUrls(student.id)
        avatarUrl = urls.avatarUrl
        coverUrl = urls.coverUrl
      }
    }
    return {
      id: row.id,
      status: row.status,
      created_at: row.created_at,
      favorite: row.favorite,
      other: otherStudent
        ? {
            id: otherStudent.id,
            firstName: otherStudent.first_name,
            lastName: otherStudent.last_name,
            year: otherStudent.year,
            section: otherStudent.section,
            course: otherStudent.course,
            email: otherStudent.email,
            avatar: avatarUrl,
            cover: coverUrl,
          }
        : null,
    }
  }))
  return new Response(JSON.stringify(connections), { status: 200 })
}
