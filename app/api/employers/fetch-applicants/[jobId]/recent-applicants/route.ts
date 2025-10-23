import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params
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
      console.error('Error fetching recent applicants:', error)
      return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 })
    }

    const transformedApplicants = applicants?.map(applicant => ({
      id: applicant.application_id,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      applied_at: applicant.applied_at,
      match_score: Math.floor(Math.random() * 30) + 70,
      profile_picture: null,
      status: applicant.status,
      student_id: applicant.student_id
    })) || []

    return NextResponse.json(transformedApplicants)

  } catch (error) {
    console.error('Error in recent applicants API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
        