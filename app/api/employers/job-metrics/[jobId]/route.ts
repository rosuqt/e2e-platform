import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "../../../../../src/lib/supabase"

async function updatePastInterviews(jobId: string) {
  const supabase = getAdminSupabase()
  
  const { data: pastInterviews } = await supabase
    .from("interview_schedules")
    .select(`
      id,
      date,
      time,
      applications!inner(job_id)
    `)
    .eq("applications.job_id", jobId)
    .lt("date", new Date().toISOString().split('T')[0])

  if (pastInterviews && pastInterviews.length > 0) {
    const { data: existingMetric } = await supabase
      .from("job_metrics")
      .select("*")
      .eq("job_id", jobId)
      .single()

    const pastInterviewCount = pastInterviews.length

    if (existingMetric) {
      const currentInterviews = existingMetric.interviews || 0
      if (pastInterviewCount > currentInterviews) {
        await supabase
          .from("job_metrics")
          .update({ interviews: pastInterviewCount })
          .eq("job_id", jobId)
      }
    } else {
      await supabase
        .from("job_metrics")
        .insert({ 
          job_id: jobId, 
          interviews: pastInterviewCount,
          views: 0,
          total_applicants: 0,
          qualified_applicants: 0
        })
    }
  }
}

async function calculateRealTimeMetrics(jobId: string) {
  const supabase = getAdminSupabase()
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(jobId)) {
    throw new Error("Invalid job ID format")
  }
  
  const { data: jobExists, error: jobExistsError } = await supabase
    .from("job_postings")
    .select("id")
    .eq("id", jobId)
    .single()
  
  if (jobExistsError || !jobExists) {
    throw new Error("Job not found")
  }
  
  const { data: applications } = await supabase
    .from("applications")
    .select("application_id, status")
    .eq("job_id", jobId)
  
  const { data: interviews } = await supabase
    .from("interview_schedules")
    .select(`
      id,
      applications!inner(job_id)
    `)
    .eq("applications.job_id", jobId)
  
  const totalApplicants = applications?.length || 0
  const qualifiedApplicants = applications?.filter(app => 
    app.status && !['rejected', 'withdrawn'].includes(app.status.toLowerCase())
  ).length || 0
  const interviewCount = interviews?.length || 0
  
  const metrics = {
    views: 0, 
    total_applicants: totalApplicants,
    qualified_applicants: qualifiedApplicants,
    interviews: interviewCount,
  }
  
  return metrics
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const { jobId } = await params
    
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(jobId)) {
      return NextResponse.json({ 
        error: `Invalid job ID format: ${jobId}. Expected UUID format.`,
        received_id: jobId,
        expected_format: "UUID (e.g., 123e4567-e89b-12d3-a456-426614174000)"
      }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    
    await updatePastInterviews(jobId)
    
    const { data: metrics, error } = await supabase
      .from("job_metrics")
      .select("views, total_applicants, qualified_applicants, interviews")
      .eq("job_id", jobId)
      .single()

    let response;
    
    if (error && error.code === "PGRST116") {
      try {
        response = await calculateRealTimeMetrics(jobId)
        
        await supabase
          .from("job_metrics")
          .insert({ 
            job_id: jobId, 
            views: response.views,
            total_applicants: response.total_applicants,
            qualified_applicants: response.qualified_applicants,
            interviews: response.interviews
          })
      } catch (calcError) {
        return NextResponse.json({ 
          error: calcError instanceof Error ? calcError.message : "Failed to calculate metrics",
          fallback_metrics: {
            views: 0, 
            total_applicants: 0, 
            qualified_applicants: 0, 
            interviews: 0
          }
        }, { status: 404 })
      }
    } else if (error) {
      try {
        response = await calculateRealTimeMetrics(jobId)
      } catch (calcError) {
        return NextResponse.json({ 
          error: "Job not found or metrics unavailable",
          database_error: error.message,
          calculation_error: calcError instanceof Error ? calcError.message : "Unknown error",
          fallback_metrics: {
            views: 0, 
            total_applicants: 0, 
            qualified_applicants: 0, 
            interviews: 0
          }
        }, { status: 404 })
      }
    } else {
      response = {
        views: metrics?.views || 0,
        total_applicants: metrics?.total_applicants || 0,
        qualified_applicants: metrics?.qualified_applicants || 0,
        interviews: metrics?.interviews || 0,
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error",
      error_type: error instanceof Error ? error.name : "Unknown",
      fallback_metrics: {
        views: 0, 
        total_applicants: 0, 
        qualified_applicants: 0, 
        interviews: 0
      }
    }, { status: 500 })
  }
}

