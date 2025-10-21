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
  
  console.log("Calculating real-time metrics for jobId:", jobId)
  
  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("application_id, status")
    .eq("job_id", jobId)
  
  console.log("Applications query result:", { applications, appError })
  
  const { data: interviews, error: interviewError } = await supabase
    .from("interview_schedules")
    .select(`
      id,
      applications!inner(job_id)
    `)
    .eq("applications.job_id", jobId)
  
  console.log("Interviews query result:", { interviews, interviewError })
  
  const totalApplicants = applications?.length || 0
  const qualifiedApplicants = applications?.filter(app => 
    app.status && !['rejected', 'withdrawn'].includes(app.status.toLowerCase())
  ).length || 0
  const interviewCount = interviews?.length || 0
  
  console.log("Calculated metrics:", {
    totalApplicants,
    qualifiedApplicants,
    interviewCount,
    viewCount: 0
  })
  
  return {
    views: 0, 
    total_applicants: totalApplicants,
    qualified_applicants: qualifiedApplicants,
    interviews: interviewCount,
  }
}

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params
    
    console.log("Job metrics API called for jobId:", jobId)
    
    if (!jobId) {
      console.log("Missing jobId in request")
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    
    console.log("Updating past interviews for jobId:", jobId)
    await updatePastInterviews(jobId)
    
    console.log("Fetching job metrics from database for jobId:", jobId)
    const { data: metrics, error } = await supabase
      .from("job_metrics")
      .select("views, total_applicants, qualified_applicants, interviews")
      .eq("job_id", jobId)
      .single()

    console.log("Database query result:", { metrics, error })

    let response;
    
    if (error && error.code === "PGRST116") {
      console.log("No metrics found in database, calculating real-time metrics")
      response = await calculateRealTimeMetrics(jobId)
      
      console.log("Inserting calculated metrics into database")
      const { error: insertError } = await supabase
        .from("job_metrics")
        .insert({ 
          job_id: jobId, 
          views: response.views,
          total_applicants: response.total_applicants,
          qualified_applicants: response.qualified_applicants,
          interviews: response.interviews
        })
      
      if (insertError) {
        console.error("Error inserting metrics:", insertError)
      }
    } else if (error) {
      console.error("Database error:", error)
      response = await calculateRealTimeMetrics(jobId)
    } else {
      response = {
        views: metrics?.views || 0,
        total_applicants: metrics?.total_applicants || 0,
        qualified_applicants: metrics?.qualified_applicants || 0,
        interviews: metrics?.interviews || 0,
      }
    }
    
    console.log("Final response being sent:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching job metrics:", error)
    
    try {
      console.log("Attempting fallback real-time calculation")
      const fallbackMetrics = await calculateRealTimeMetrics(params.jobId)
      console.log("Fallback metrics calculated:", fallbackMetrics)
      return NextResponse.json(fallbackMetrics)
    } catch (fallbackError) {
      console.error("Fallback calculation also failed:", fallbackError)
      return NextResponse.json({ 
        views: 0, 
        total_applicants: 0, 
        qualified_applicants: 0, 
        interviews: 0
      })
    }
  }
}
     