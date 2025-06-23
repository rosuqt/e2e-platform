import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const student_id = req.nextUrl.searchParams.get("student_id")
  if (!student_id) return NextResponse.json({ error: "Missing student_id" }, { status: 400 })

  const supabase = getAdminSupabase()

  const { data: profileData, error: profileError } = await supabase
    .from("student_profile")
    .select("profile_img")
    .eq("student_id", student_id)
    .maybeSingle()

  const { data: regData, error: regError } = await supabase
    .from("registered_students")
    .select("course, year")
    .eq("id", student_id)
    .maybeSingle()


  //console.log("Supabase student_profile data:", profileData)
  //console.log("Supabase registered_students data:", regData)

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })
  if (regError) return NextResponse.json({ error: regError.message }, { status: 500 })

  return NextResponse.json({
    profile_img: profileData?.profile_img || null,
    course: regData?.course || null,
    year: regData?.year || null
  })
}
