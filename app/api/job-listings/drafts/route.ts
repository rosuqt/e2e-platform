import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/authOptions'
import { getAdminSupabase } from '@/lib/supabase'

interface ExtendedUser {
  employerId: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as ExtendedUser
    if (!session?.user || !user.employerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getAdminSupabase()
    const { data: drafts, error } = await supabase
      .from('job_drafts')
      .select('*')
      .eq('employer_id', user.employerId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching drafts:', error)
      return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 })
    }

    return NextResponse.json({ data: drafts })
  } catch (error) {
    console.error('Error in GET /api/job-listings/drafts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as ExtendedUser
    if (!session?.user || !user.employerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      job_title,
      location,
      remote_options,
      work_type,
      pay_type,
      pay_amount,
      recommended_course,
      verification_tier,
      job_description,
      responsibilities,
      must_have_qualifications,
      nice_to_have_qualifications,
      job_summary,
      application_deadline,
      max_applicants,
      perks_and_benefits,
      application_questions
    } = body

    const supabase = getAdminSupabase()

    const draftData: Record<string, unknown> = {
      employer_id: user.employerId,
      job_title,
      location,
      remote_options,
      work_type,
      pay_type,
      pay_amount,
      recommended_course,
      verification_tier: verification_tier || 'basic',
      job_description,
      responsibilities,
      must_have_qualifications,
      nice_to_have_qualifications,
      job_summary,
      max_applicants: max_applicants ? parseInt(max_applicants) : null,
      perks_and_benefits,
      application_questions
    }

    if (application_deadline) {
      draftData.application_deadline = application_deadline
    }

    const { data: newDraft, error } = await supabase
      .from('job_drafts')
      .insert(draftData)
      .select()
      .single()

    if (error) {
      console.error('Error creating draft:', error)
      return NextResponse.json({ error: 'Failed to create draft' }, { status: 500 })
    }

    return NextResponse.json(newDraft, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/job-listings/drafts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
  
