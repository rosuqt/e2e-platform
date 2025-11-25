import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

type StudentRow = {
  id: string
  first_name: string | null
  last_name: string | null
  course: string | null
  year: string | null
  section: string | null
  user_id: string | null
}

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  const supabase = getAdminSupabase()

  const { data: me, error: meError } = await supabase
    .from("registered_students")
    .select("course, year, section")
    .eq("id", id)
    .single()                                                                 

  if (meError || !me) return NextResponse.json({ students: [] })

  const { course, year, section } = me

  let students: StudentRow[] = []

  // 1. Match all three: course, year, section
  const { data: allMatch } = await supabase
    .from("registered_students")
    .select("id, first_name, last_name, course, year, section, user_id")
    .neq("id", id)
    .eq("course", course)
    .eq("year", year)
    .eq("section", section)
    .limit(12)
  students = (allMatch ?? []) as StudentRow[]

  // 2. Match (course and year) OR (course and section), not already included
  if (students.length < 12) {
    const { data: partialMatch } = await supabase
      .from("registered_students")
      .select("id, first_name, last_name, course, year, section, user_id")
      .neq("id", id)
      .eq("course", course)
      .or(`year.eq.${year},section.eq.${section}`)
      .limit(24)

    const filtered = ((partialMatch ?? []) as StudentRow[]).filter(s =>
      !students.some(x => x.id === s.id)
    )
    students = students.concat(filtered.slice(0, 12 - students.length))
  }

  // 3. If still not enough, match only course
  if (students.length < 12) {
    const { data: courseMatch } = await supabase
      .from("registered_students")
      .select("id, first_name, last_name, course, year, section, user_id")
      .neq("id", id)
      .eq("course", course)
      .limit(24)

    const filtered = ((courseMatch ?? []) as StudentRow[]).filter(s =>
      !students.some(x => x.id === s.id)
    )
    students = students.concat(filtered.slice(0, 12 - students.length))
  }

  console.log("Suggested students:", students)

  return NextResponse.json({ students })
}

export async function GET(req: NextRequest) {
  const senderId = req.nextUrl.searchParams.get("senderId")
  const receiverId = req.nextUrl.searchParams.get("receiverId")
  if (senderId && receiverId) {
    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("friend_requests")
      .select("id, status")
      .eq("sender_id", senderId)
      .eq("receiver_id", receiverId)
      .single()
    if (error || !data) return NextResponse.json({ status: null })
    return NextResponse.json({ status: data.status ?? "Requested" })
  }

  const id = req.nextUrl.searchParams.get("id")
  const type = req.nextUrl.searchParams.get("type") 
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const supabase = getAdminSupabase()
  const { data: profile, error: profileError } = await supabase
    .from("student_profile")
    .select("profile_img, cover_image")
    .eq("student_id", id)
    .single()

  if (profileError || (!profile?.profile_img && !profile?.cover_image))
    return NextResponse.json({ error: "Profile image or cover image not found" }, { status: 404 })

  const filePath = type === "cover" ? profile.cover_image : profile.profile_img
  const bucket = type === "cover" ? "user.covers" : "user.avatars"

  if (!filePath)
    return NextResponse.json({ error: "Requested image not found" }, { status: 404 })

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 60 * 60)

  if (error || !data?.signedUrl)
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 })

  return NextResponse.json({ signedUrl: data.signedUrl })
}
