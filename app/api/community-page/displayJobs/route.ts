import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
  "http://localhost:3000"

async function getAvatarUrl(student_id: string) {
  if (!student_id) return null
  const { data: profile, error } = await supabase
    .from("student_profile")
    .select("profile_img")
    .eq("student_id", student_id)
    .maybeSingle()
  if (error || !profile?.profile_img) return null

  const apiUrl = `${BASE_URL}/api/students/get-signed-url`
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket: "user.avatars", path: profile.profile_img }),
  })
  if (!res.ok) return null
  const { signedUrl } = await res.json()
  return signedUrl || null
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const studentId = url.searchParams.get("studentId")
  const { data: jobs, error } = await supabase
    .from("community_jobs")
    .select("*, student:student_id (first_name, last_name, course, id)")
  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
  let metricsMap: Record<string, any> = {}
  if (studentId) {
    const { data: metrics } = await supabase
      .from("metrics_community_jobs")
      .select("*")
      .eq("student_id", studentId)
    metricsMap = Object.fromEntries(
      (metrics ?? []).map((m: any) => [m.job_id, m])
    )
  }

  // Fetch view counts for all jobs
  const jobIds = (jobs ?? []).map((job: any) => job.id)
  let viewCounts: Record<string, number> = {}
  let shareCounts: Record<string, number> = {}
  if (jobIds.length > 0) {
    const { data: viewsData } = await supabase
      .from("metrics_community_jobs")
      .select("job_id")
      .in("job_id", jobIds)
    if (viewsData) {
      viewsData.forEach((row: any) => {
        viewCounts[row.job_id] = (viewCounts[row.job_id] || 0) + 1
      })
    }
    const { data: sharesData } = await supabase
      .from("metrics_community_jobs")
      .select("job_id, shared")
      .in("job_id", jobIds)
      .eq("shared", true)
    if (sharesData) {
      sharesData.forEach((row: any) => {
        shareCounts[row.job_id] = (shareCounts[row.job_id] || 0) + 1
      })
    }
  }

  const jobsWithPostedBy = await Promise.all(
    (jobs ?? []).map(async (job: any) => {
      let avatarUrl = null
      if (job.student?.id) {
        avatarUrl = await getAvatarUrl(job.student.id)
      }
      const metric = metricsMap[job.id] ?? {}

      let saved = false
      if (studentId) {
        const { data: savedData } = await supabase
          .from("student_saved_jobs")
          .select("job_id")
          .eq("student_id", studentId)
          .eq("job_id", job.id)
          .maybeSingle()
        saved = !!savedData
      }

      return {
        ...job,
        postedBy: {
          name: job.student
            ? [job.student.first_name, job.student.last_name].filter(Boolean).join(" ")
            : "Unknown",
          role: job.student?.course ?? "Unknown",
          course: job.student?.course,
          avatar: avatarUrl,
        },
        userUpvoted: !!metric.upvote,
        userLiked: !!metric.heart,
        saved,
        dislike: !!metric.dislike,
        haha: !!metric.haha,
        wow: !!metric.wow,
        userTried: !!metric.approved,
        notRecommended: !!metric.not_recommended,
        viewCount: viewCounts[job.id] || 0,
        shareCount: shareCounts[job.id] || 0,
      }
    })
  )
  return NextResponse.json({ jobs: jobsWithPostedBy })
}
