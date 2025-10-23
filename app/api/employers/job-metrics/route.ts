import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "../../../../src/lib/supabase"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"

export async function POST(request: NextRequest) {
  try {
    const { jobId, action } = await request.json()
    
    if (!jobId || !action) {
      return NextResponse.json({ error: "Missing jobId or action" }, { status: 400 })
    }

    const supabase = getAdminSupabase()

    if (action === "view") {
      const session = await getServerSession(authOptions)
      let userId: string | null = null

      if (session?.user && typeof session.user === "object") {
        if ("studentId" in session.user && typeof (session.user as Record<string, unknown>).studentId === "string") {
          userId = (session.user as Record<string, unknown>).studentId as string
        } else if ("id" in session.user && typeof (session.user as Record<string, unknown>).id === "string") {
          userId = (session.user as Record<string, unknown>).id as string
        }
      }
      
      if (userId) {
        const { data: existingView } = await supabase
          .from("job_views")
          .select("*")
          .eq("job_id", jobId)
          .eq("user_id", userId)
          .single()

        if (existingView) {
          return NextResponse.json({ success: true, message: "Already viewed" })
        }

        const { error: viewError } = await supabase
          .from("job_views")
          .insert({
            job_id: jobId,
            user_id: userId,
            viewed_at: new Date().toISOString()
          })

        if (viewError) {
          console.error("Error inserting job view:", viewError)
        }
      }

      const { error: historyError } = await supabase
        .from("job_metrics_history")
        .insert({
          job_id: jobId,
          action: "view"
        })

      if (historyError) {
        console.error("Error inserting view history:", historyError)
      }

      return NextResponse.json({ success: true })
    }

    if (action === "click") {
      const { data: existingMetric, error: selectError } = await supabase
        .from("job_metrics")
        .select("total_clicks")
        .eq("job_id", jobId)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        console.error("Error selecting job metrics:", selectError)
        return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
      }

      if (existingMetric) {
        const { error: updateError } = await supabase
          .from("job_metrics")
          .update({ total_clicks: (existingMetric.total_clicks || 0) + 1 })
          .eq("job_id", jobId)

        if (updateError) {
          console.error("Error updating job clicks:", updateError)
          return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
        }
      } else {
        const { error: insertError } = await supabase
          .from("job_metrics")
          .insert({
            job_id: jobId,
            total_clicks: 1
          })

        if (insertError) {
          console.error("Error inserting job metrics:", insertError)
          return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
        }
      }

      const { error: historyError } = await supabase
        .from("job_metrics_history")
        .insert({
          job_id: jobId,
          action: "click"
        })

      if (historyError) {
        console.error("Error inserting click history:", historyError)
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error tracking job metric:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

