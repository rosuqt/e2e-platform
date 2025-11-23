import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "No studentId in session" }, { status: 401 })
  }
  const adminSupabase = getAdminSupabase()
  const { data: profile, error: profileError } = await adminSupabase
    .from("student_profile")
    .select("profile_img")
    .eq("student_id", studentId)
    .maybeSingle()
  if (profileError || !profile?.profile_img) {
    return NextResponse.json({ error: "Profile image not found" }, { status: 404 })
  }
  const filePath = profile.profile_img
  const { data, error } = await adminSupabase.storage
    .from("user.avatars")
    .createSignedUrl(filePath, 60 * 60)
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 })
  }
  return NextResponse.json({ signedUrl: data.signedUrl })
}
