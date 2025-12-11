import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("community_jobs")
    .select("hashtags");

  if (error || !data) {
    return NextResponse.json({}, { status: 500 });
  }

  const counts: Record<string, number> = {};
  for (const row of data) {
    if (Array.isArray(row.hashtags)) {
      for (const tag of row.hashtags) {
        if (typeof tag === "string" && tag.startsWith("#")) {
          counts[tag] = (counts[tag] || 0) + 1;
        }
      }
    }
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const result: Record<string, number> = {};
  for (const [tag, count] of sorted) {
    result[tag] = count;
  }

  return NextResponse.json(result);
}
