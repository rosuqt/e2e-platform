import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

async function getResourcesForSkills(
  supabase: ReturnType<typeof getAdminSupabase>,
  selectedSkills: string[]
): Promise<
  {
    skill_id: string
    name: string
    description: string | null
    title: string
    url: string
    level: string
  }[]
> {
  const { data, error } = await supabase
    .from("skills_match_booster")
    .select("id, name, description, resource_titles, resource_urls, resource_levels")
    .or(
      selectedSkills
        .map(skill => `name.ilike.%${skill}%`)
        .join(",")
    )

  if (error) return []

  return (data || []).flatMap(row => {
    const titles = Array.isArray(row.resource_titles) ? row.resource_titles : []
    const urls = Array.isArray(row.resource_urls) ? row.resource_urls : []
    const levels = Array.isArray(row.resource_levels) ? row.resource_levels : []
    return titles.map((title: string, i: number) => ({
      skill_id: row.id,
      name: row.name,
      description: row.description,
      title,
      url: urls[i] || "",
      level: levels[i] || ""
    }))
  })
}

export async function POST(req: Request) {
  const supabase = getAdminSupabase()
  const body = await req.json()
  const { selectedSkills } = body

  if (!Array.isArray(selectedSkills) || selectedSkills.length === 0) {
    return NextResponse.json({ error: "Invalid or empty skills array" }, { status: 400 })
  }

  const resources = await getResourcesForSkills(supabase, selectedSkills)

  return NextResponse.json({ resources }, { status: 200 })
}
