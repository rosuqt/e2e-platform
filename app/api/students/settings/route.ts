import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  const studentId = (session?.user as { studentId?: string })?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_students")
    .select(`
      *,
      student_profile(
        id,
        student_id,
        contact_info,
        profile_img,
        username
      ),
      s_job_pref(*)
    `)
    .eq("id", studentId)
    .maybeSingle()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const parsedData = data
  if (data?.student_profile && typeof data.student_profile.contact_info === "string") {
    try {
      parsedData.student_profile.contact_info = JSON.parse(data.student_profile.contact_info)
    } catch {}
  }
  if (parsedData?.s_job_pref && Array.isArray(parsedData.s_job_pref)) {
    parsedData.s_job_pref = parsedData.s_job_pref.map((pref: Record<string, unknown>) => {
      let job_type: string[] = [];
      let remote_options: string[] = [];
      if (typeof pref.job_type === "string") {
        try {
          const arr = JSON.parse(pref.job_type as string);
          if (Array.isArray(arr)) {
            job_type = arr.map(String);
          } else {
            job_type = (pref.job_type as string).split(",").map((s: string) => s.trim()).filter(Boolean);
          }
        } catch {
          job_type = (pref.job_type as string).split(",").map((s: string) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(pref.job_type)) {
        job_type = pref.job_type.map(String);
      }

      if (typeof pref.remote_options === "string") {
        try {
          const arr = JSON.parse(pref.remote_options as string);
          if (Array.isArray(arr)) {
            remote_options = arr.map(String);
          } else {
            remote_options = (pref.remote_options as string).split(",").map((s: string) => s.trim()).filter(Boolean);
          }
        } catch {
          remote_options = (pref.remote_options as string).split(",").map((s: string) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(pref.remote_options)) {
        remote_options = pref.remote_options.map(String);
      }

      return {
        ...pref,
        job_type,
        remote_options,
      };
    });
  }
  console.log("student_profile:", parsedData?.student_profile)
  return NextResponse.json(parsedData)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  const studentId = (session?.user as { studentId?: string })?.studentId
  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const supabase = getAdminSupabase()
  const body = await req.json()
  const { address, course, year, section, s_job_pref } = body

  const { error: studentError } = await supabase
    .from("registered_students")
    .update({
      address,
      course,
      year,
      section,
    })
    .eq("id", studentId)

  let jobPrefError = null
  if (s_job_pref) {
    const { job_type, remote_options, unrelated_jobs } = s_job_pref
    const { error } = await supabase
      .from("s_job_pref")
      .update({
        job_type: JSON.stringify(job_type),
        remote_options: JSON.stringify(remote_options),
        unrelated_jobs,
      })
      .eq("student_id", studentId)
    jobPrefError = error
  }

  if (studentError || jobPrefError) {
    return NextResponse.json({ error: studentError?.message || jobPrefError?.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
