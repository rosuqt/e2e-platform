import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { skillIds } = await req.json()
  console.log("fetchSkillNames received skillIds:", skillIds)
  const supabase = getAdminSupabase()
  const allSkills = await supabase
    .from("skills_match_booster")
    .select("id, name")
  if (!Array.isArray(skillIds) || skillIds.length === 0) return NextResponse.json({ names: [] })
  const { data, error, status } = await supabase
    .from("skills_match_booster")
    .select("name, id")
    .in("id", skillIds)
  if (error || !data) return NextResponse.json({ names: [] })
  const names = data.map((row: any) => row.name)
  console.log("fetchSkillNames returning names:", names)
  return NextResponse.json({ names })
}
