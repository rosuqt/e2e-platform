import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../lib/authOptions'
import { getAdminSupabase } from '@/lib/supabase'

interface ExtendedUser {
  employerId: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as ExtendedUser
    if (!session?.user || !user.employerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = getAdminSupabase()
    const { data: draft, error } = await supabase
      .from('job_drafts')
      .select('*')
      .eq('id', id)
      .eq('employer_id', user.employerId)
      .single()

    if (error) {
      console.error('Error fetching draft:', error)
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    return NextResponse.json(draft)
  } catch (error) {
    console.error('Error in GET /api/job-listings/drafts/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as ExtendedUser
    if (!session?.user || !user.employerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    const { data: existingDraft, error: fetchError } = await supabase
      .from('job_drafts')
      .select('id')
      .eq('id', id)
      .eq('employer_id', user.employerId)
      .single()

    if (fetchError || !existingDraft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }
    const updateData: Record<string, unknown> = {
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
      application_questions,
      updated_at: new Date().toISOString()
    }

    if (application_deadline) {
      updateData.application_deadline = application_deadline
    }

    const { data: updatedDraft, error: updateError } = await supabase
      .from('job_drafts')
      .update(updateData)
      .eq('id', id)
      .eq('employer_id', user.employerId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating draft:', updateError)
      return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 })
    }

    return NextResponse.json(updatedDraft)
  } catch (error) {
    console.error('Error in PUT /api/job-listings/drafts/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as ExtendedUser
    if (!session?.user || !user.employerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = getAdminSupabase()
    const { error } = await supabase
      .from('job_drafts')
      .delete()
      .eq('id', id)
      .eq('employer_id', user.employerId)

    if (error) {
      console.error('Error deleting draft:', error)
      return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/job-listings/drafts/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

