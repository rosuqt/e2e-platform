import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/authOptions"
import { getAdminSupabase } from "../../../../src/lib/supabase"


interface ExtendedUser {
  employerId: string
  company_id: string
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, draftId } = await request.json()

    if (action !== "publishFromDraft") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (!draftId) {
      return NextResponse.json({ error: "Draft ID is required" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const user = session.user as ExtendedUser
    
    console.log("Publishing draft:", { draftId, employerId: user.employerId })

    try {
      const { data: testConnection } = await supabase.from("job_drafts").select("id").limit(1)
      console.log("Supabase connection test:", testConnection ? "SUCCESS" : "FAILED")
    } catch (connectionError) {
      console.error("Supabase connection error:", connectionError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }
    
    const { data: draft, error: fetchError } = await supabase
      .from("job_drafts")
      .select("*")
      .eq("id", draftId)
      .eq("employer_id", user.employerId)
      .single()

    if (fetchError) {
      console.error("Error fetching draft:", fetchError)
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    console.log("Found draft:", draft)

    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/employers/post-a-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || ''
        },
        body: JSON.stringify({
          action: 'publishJob',
          data: {
            jobTitle: draft.job_title ?? "",
            location: draft.location ?? "",
            remoteOptions: draft.remote_options ?? "",
            workType: draft.work_type ?? "",
            recommendedCourse: draft.recommended_course ?? "",
            verificationTier: draft.verification_tier ?? "",
            jobDescription: draft.job_description ?? "",
            responsibilities: typeof draft.responsibilities === 'string' ? JSON.parse(draft.responsibilities) : (draft.responsibilities ?? [""]),
            mustHaveQualifications: Array.isArray(draft.must_have_qualifications) ? draft.must_have_qualifications : (draft.must_have_qualifications ? [draft.must_have_qualifications] : [""]),
            niceToHaveQualifications: Array.isArray(draft.nice_to_have_qualifications) ? draft.nice_to_have_qualifications : (draft.nice_to_have_qualifications ? [draft.nice_to_have_qualifications] : [""]),
            jobSummary: draft.job_summary ?? "",
            applicationDeadline: draft.application_deadline ? { date: draft.application_deadline.split(' ')[0], time: draft.application_deadline.split(' ')[1] || '00:00' } : { date: '', time: '' },
            maxApplicants: draft.max_applicants ?? "",
            perksAndBenefits: Array.isArray(draft.perks_and_benefits) ? draft.perks_and_benefits : (draft.perks_and_benefits ?? []),
            applicationQuestions: Array.isArray(draft.application_questions) ? draft.application_questions : (draft.application_questions ?? []),
            skills: Array.isArray(draft.skills) ? draft.skills : (draft.skills ?? []),
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Post job API error:", errorText)
        return NextResponse.json({ error: `Failed to publish job: ${errorText}` }, { status: 500 })
      }

      const result = await response.json()
      console.log("Job published successfully:", result)

      if (result?.jobId || result?.job_id) {
        const jobId = result.jobId ?? result.job_id
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/ai-matches/embeddings/job`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: jobId }),
        })
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/ai-matches/match/students`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: jobId }),
        })
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/ai-matches/rescore-job`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: jobId }),
        })
      }

      const { error: deleteError } = await supabase
        .from("job_drafts")
        .delete()
        .eq("id", draftId)
        .eq("employer_id", user.employerId)

      if (deleteError) {
        console.error("Failed to delete draft:", deleteError)
      }

      return NextResponse.json({ 
        success: true, 
        jobId: result.jobId,
        message: "Draft published successfully"
      })

    } catch (apiError) {
      console.error("Error calling post-a-job API:", apiError)
      return NextResponse.json({ error: `Failed to publish job: ${apiError}` }, { status: 500 })
    }

  } catch (error) {
    console.error("Error publishing draft:", error)
    return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 })
  }
}
