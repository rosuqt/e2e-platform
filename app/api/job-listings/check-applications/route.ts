import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('job_id')

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      )
    }

    const supabase = getAdminSupabase()

    const { data, error } = await supabase
      .from('applications')
      .select('application_id')
      .eq('job_id', jobId)
      .limit(1)

    if (error) {
      console.error("Error checking applications:", error)
      return NextResponse.json(
        { error: "Failed to check applications" },
        { status: 500 }
      )
    }

    const hasApplications = data && data.length > 0

    return NextResponse.json({
      hasApplications,
      count: hasApplications ? 1 : 0
    })

  } catch (error) {
    console.error("Error in check-applications route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
