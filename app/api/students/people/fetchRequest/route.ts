import { NextResponse } from "next/server"
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
  if (!studentId) return NextResponse.json([], { status: 401 })

  const { data: requests, error } = await supabase
    .from("friend_requests")
    .select(`
      id,
      sender_id,
      status,
      created_at,
      favorite,
      registered_students!friend_requests_sender_id_fkey(id, first_name, last_name, year, section, course, email)
    `)
    .eq("receiver_id", studentId)
    .ilike("status", "requested")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase error:", error)
    return new Response(
      JSON.stringify({ error: error.message, supabaseError: error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  const formatted = await Promise.all((requests ?? []).map(async r => {
    const sender = Array.isArray(r.registered_students) ? r.registered_students[0] : r.registered_students
    let avatarUrl = null
    let coverUrl = null
    if (sender?.id) {
      const urls = await getStudentImageUrls(sender.id)
      avatarUrl = urls.avatarUrl
      coverUrl = urls.coverUrl
    }
    return {
      id: r.id,
      status: r.status,
      created_at: r.created_at,
      favorite: r.favorite,
      sender: sender
        ? {
            id: sender.id,
            firstName: sender.first_name,
            lastName: sender.last_name,
            year: sender.year,
            section: sender.section,
            course: sender.course,
            email: sender.email,
            avatar: avatarUrl,
            cover: coverUrl,
          }
        : null,
    }
  }))
  return NextResponse.json(formatted)
}
