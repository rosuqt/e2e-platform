import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId
  if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { skills, boosterPercent } = await req.json()
  if (!Array.isArray(skills) || typeof boosterPercent !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { data: profile, error: fetchProfileError } = await supabase
    .from("student_profile")
    .select("skills")
    .eq("student_id", studentId)
    .maybeSingle()

  if (fetchProfileError) return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })

  const existingSkills = Array.isArray(profile?.skills) ? profile.skills : []
  const mergedSkills = Array.from(new Set([...existingSkills, ...skills]))

  const { error: updateError } = await supabase
    .from("student_profile")
    .update({ skills: mergedSkills })
    .eq("student_id", studentId)

  if (updateError) return NextResponse.json({ error: "Failed to update skills" }, { status: 500 })

  const { data: matches, error: fetchError } = await supabase
    .from("job_matches")
    .select("id, gpt_score")
    .eq("student_id", studentId)

  if (fetchError) return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })

  if (!matches || matches.length === 0) return NextResponse.json({ success: true })

  const scores = matches.map(m => Number(m.gpt_score) || 0)
  const currentAvg = scores.reduce((a, b) => a + b, 0) / scores.length
  const totalBoost = boosterPercent * scores.length - scores.reduce((a, b) => a + b, 0)

  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)
  const range = maxScore - minScore || 1
  const weights = scores.map(s => (maxScore - s + 1) / (range + 1))
  const weightSum = weights.reduce((a, b) => a + b, 0)
  const boosts = weights.map(w => (w / weightSum) * totalBoost)
  const newScores = scores.map((s, i) => s + boosts[i])

  await Promise.all(
    matches.map((m, i) =>
      supabase
        .from("job_matches")
        .update({ gpt_score: Math.round(newScores[i]) })
        .eq("id", m.id)
    )
  )

  return NextResponse.json({ success: true })
}
