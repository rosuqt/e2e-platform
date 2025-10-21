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

      const supabase = getAdminSupabase()
      
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

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error tracking job metric:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

