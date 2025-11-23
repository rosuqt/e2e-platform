import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { skillIds } = await req.json()
  console.log("fetchSkillNames received skillIds:", skillIds)
  const supabase = getAdminSupabase()
  if (!Array.isArray(skillIds) || skillIds.length === 0) return NextResponse.json({ names: [] })
  const { data, error } = await supabase
    .from("skills_match_booster")
    .select("name, id")
    .in("id", skillIds)
  if (error || !data) return NextResponse.json({ names: [] })
  type SkillRow = { id: number; name: string }
  const names = (data as SkillRow[]).map(row => row.name)
  console.log("fetchSkillNames returning names:", names)
  return NextResponse.json({ names })
}
