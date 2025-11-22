import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

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

export async function GET() {
  const supabase = getAdminSupabase()

  const top = await getTopSkills(supabase)
  const needed = Math.max(0, 7 - top.length)
  const random = await getRandomDbSkills(supabase, needed)

  const combined = [...top, ...random]
  const skillCounts = combined.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const uniqueSkills = [...new Set(combined)].slice(0, 7)

  console.log("API Response:", {
    skills: uniqueSkills.map(skill => ({
      name: skill,
      count: skillCounts[skill]
    })),
    source: {
      topCount: top.length,
      randomCount: random.length
    }
  })

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
