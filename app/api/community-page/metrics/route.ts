import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

const reactionMetrics = ["upvote", "heart", "haha", "wow", "dislike"]
const allowedMetrics = [
  ...reactionMetrics,
  "saved",
  "shared",
  "approved",
  "not_recommended",
  "view",
]

export async function POST(req: NextRequest) {
  try {
    const { job_id, student_id, metric, action } = await req.json()

    let metricKey = metric
    if (metric === "like") metricKey = "heart"
    if (metric === "tried") metricKey = "approved"

    if (
      !job_id ||
      !student_id ||
      !metricKey ||
      (metric !== "view" && !["add", "remove"].includes(action)) ||
      !allowedMetrics.includes(metricKey)
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const { data: existing } = await supabase
      .from("metrics_community_jobs")
      .select("id, views")
      .eq("job_id", job_id)
      .eq("student_id", student_id)
      .maybeSingle();

    if (metric === "view") {
      if (!existing) {
        await supabase
          .from("metrics_community_jobs")
          .insert([{ job_id, student_id, views: 1 }]);
      } else if (existing.views === 0 || existing.views == null) {
        await supabase
          .from("metrics_community_jobs")
          .update({ views: 1 })
          .eq("id", existing.id);
      }
      return NextResponse.json({ success: true, view: true })
    }

    const value = action === "add"
    const updateObj: Record<string, boolean | null> = {}

    if (reactionMetrics.includes(metricKey)) {
      reactionMetrics.forEach(r => updateObj[r] = false)
      if (value) updateObj[metricKey] = true
    } else {
      updateObj[metricKey] = value
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from("metrics_community_jobs")
        .update(updateObj)
        .eq("id", existing.id)
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, updated: true })
    } else {
      const insertObj = {
        job_id,
        student_id,
        ...updateObj,
        viewed_at: new Date().toISOString(),
      }
      const { error: insertError } = await supabase
        .from("metrics_community_jobs")
        .insert(insertObj)
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, inserted: true })
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}
