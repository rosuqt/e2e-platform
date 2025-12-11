import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const supabase = getAdminSupabase()

    const { data: applicants, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        first_name,
        last_name,
        email,
        applied_at,
        status,
        student_id
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 })
    }

    const studentIds = applicants?.map(a => a.student_id).filter(Boolean) || []
    const matchScores: Record<string, number> = {}
    if (studentIds.length) {
      const { data: matches } = await supabase
        .from('job_matches')
        .select('student_id, gpt_score')
        .eq('job_id', jobId)
        .in('student_id', studentIds)
      if (Array.isArray(matches)) {
        matches.forEach(m => {
          if (m.student_id) matchScores[m.student_id] = Number(m.gpt_score) || 0
        })
      }
    }

    const transformedApplicants = applicants?.map(applicant => ({
      id: applicant.application_id,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      applied_at: applicant.applied_at,
      match_score: matchScores[applicant.student_id] ?? null,
      profile_picture: null,
      status: applicant.status,
      student_id: applicant.student_id
    })) || []

    return NextResponse.json(transformedApplicants)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
