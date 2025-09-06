import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from("test_cases")
    .select("tester_name", { count: "exact" })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const counts: Record<string, number> = {}
  data?.forEach((row: { tester_name: string }) => {
    const name = row.tester_name
    counts[name] = (counts[name] || 0) + 1
  })

  return NextResponse.json(counts)
}
