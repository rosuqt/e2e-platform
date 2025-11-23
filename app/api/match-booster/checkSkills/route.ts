import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"

async function getTopSkills(supabase: ReturnType<typeof getAdminSupabase>): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_top_ai_skills", {
    limit_count: 7
  })
  if (error || !Array.isArray(data)) return []
  return data.filter((s: unknown) => typeof s === "string") as string[]
}

async function getRandomDbSkills(supabase: ReturnType<typeof getAdminSupabase>, limit: number): Promise<string[]> {
  if (limit <= 0) return []
  const { data, error } = await supabase.rpc("get_random_ai_skills", {
    limit_count: limit
  })
  if (error || !Array.isArray(data)) return []
  return data.filter((s: unknown) => typeof s === "string") as string[]
}

export async function GET(/* req: NextRequest */) {
  const supabase = getAdminSupabase()
  const session = await getServerSession(authOptions)
  let studentSkills: string[] = []
  let studentExpertise: string[] = []
  const studentId = session?.user?.studentId
  if (studentId) {
    const { data: profile } = await supabase
      .from("student_profile")
      .select("skills, expertise")
      .eq("student_id", studentId)
      .maybeSingle()
    if (profile?.skills && Array.isArray(profile.skills)) {
      studentSkills = profile.skills
    }
    if (profile?.expertise && Array.isArray(profile.expertise)) {
      studentExpertise = profile.expertise
    }
  }

  const top = await getTopSkills(supabase)
  const needed = Math.max(0, 7 - top.length)
  const random = await getRandomDbSkills(supabase, needed)
  const combined = [...top, ...random]
  const filtered = combined.filter(skill => 
    !studentSkills.includes(skill) && !studentExpertise.includes(skill)
  )
  const skillCounts = filtered.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const uniqueSkills = [...new Set(filtered)].slice(0, 7)

  return NextResponse.json(
    {
      skills: uniqueSkills.map(skill => ({
        name: skill,
        count: skillCounts[skill]
      })),
      source: {
        topCount: top.length,
        randomCount: random.length
      }
    },
    { status: 200 }
  )
}
