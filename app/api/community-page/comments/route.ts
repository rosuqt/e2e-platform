import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const jobId = url.searchParams.get("jobId")
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("community_job_comments")
    .select("id, job_id, student_id, comment_text, created_at, updated_at, student:student_id (first_name, last_name, course, id, profile:student_profile(profile_img))")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  function isCommentRow(
    comment: unknown
  ): comment is {
    id: string
    job_id: string
    student_id: string
    comment_text: string
    created_at: string
    updated_at?: string
    student?: {
      first_name?: string
      last_name?: string
      course?: string
      id?: string
      profile?: { profile_img?: string }[]
    }
  } {
    return (
      typeof comment === "object" &&
      comment !== null &&
      typeof (comment as { id: unknown }).id === "string" &&
      typeof (comment as { job_id: unknown }).job_id === "string" &&
      typeof (comment as { student_id: unknown }).student_id === "string" &&
      typeof (comment as { comment_text: unknown }).comment_text === "string" &&
      typeof (comment as { created_at: unknown }).created_at === "string"
    )
  }

  const comments = await Promise.all(
    (data ?? [])
      .filter(isCommentRow)
      .map(async (comment) => {
        let avatarUrl = null

        let studentObj: unknown = comment.student
        if (Array.isArray(studentObj)) {
          studentObj = studentObj[0]
        }

        const profileImg =
          studentObj && typeof studentObj === "object" &&
          Array.isArray((studentObj as { profile?: { profile_img?: string }[] }).profile) &&
          (studentObj as { profile?: { profile_img?: string }[] }).profile!.length > 0
            ? (studentObj as { profile?: { profile_img?: string }[] }).profile![0].profile_img
            : undefined
        if (profileImg) {
          const apiUrl = `${BASE_URL}/api/students/get-signed-url`
          const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bucket: "user.avatars", path: profileImg }),
          })
          if (res.ok) {
            const json = await res.json()
            avatarUrl = json.signedUrl || null
          }
        }
        return {
          ...comment,
          postedBy: {
            name: studentObj && typeof studentObj === "object"
              ? [
                  (studentObj as { first_name?: string }).first_name,
                  (studentObj as { last_name?: string }).last_name,
                ].filter(Boolean).join(" ")
              : "Unknown",
            role: studentObj && typeof studentObj === "object"
              ? (studentObj as { course?: string }).course ?? "Unknown"
              : "Unknown",
            course: studentObj && typeof studentObj === "object"
              ? (studentObj as { course?: string }).course
              : undefined,
            avatar: avatarUrl ?? null,
          },
        }
      })
  )
  return NextResponse.json({ comments })
}

export async function POST(req: Request) {
  const { job_id, student_id, comment_text } = await req.json()
  if (!job_id || !student_id || !comment_text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("community_job_comments")
    .insert([{ job_id, student_id, comment_text }])
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ comment: data })
}

export async function PUT(req: Request) {
  const { id, student_id, comment_text } = await req.json()
  if (!id || !student_id || !comment_text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const { data: existing, error: fetchError } = await supabase
    .from("community_job_comments")
    .select("student_id")
    .eq("id", id)
    .single()
  if (fetchError || !existing || existing.student_id !== student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  const { data, error } = await supabase
    .from("community_job_comments")
    .update({ comment_text, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ comment: data })
}

export async function DELETE(req: Request) {
  const { id, student_id } = await req.json()
  if (!id || !student_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const { data: existing, error: fetchError } = await supabase
    .from("community_job_comments")
    .select("student_id")
    .eq("id", id)
    .single()
  if (fetchError || !existing || existing.student_id !== student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  const { error } = await supabase
    .from("community_job_comments")
    .delete()
    .eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
