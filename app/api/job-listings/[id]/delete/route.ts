import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function PATCH(
  req: NextRequest
) {
  const url = new URL(req.url)
  const parts = url.pathname.split('/')
  const id = parts[parts.length - 2]
  if (!id) {
    return NextResponse.json({ error: 'Missing job id' }, { status: 400 })
  }

  const { error: invitationsError } = await supabase
    .from('job_invitations')
    .delete()
    .eq('job_id', id)

  if (invitationsError) {
    return NextResponse.json({ error: invitationsError.message, details: invitationsError }, { status: 400 })
  }

  const { error } = await supabase
    .from('job_postings')
    .delete()
    .eq('id', id)

  if (error) {
    if (error.code === '23503') {
      return NextResponse.json({
        error: "Deleting this job will also remove all related job invitations. Please confirm to proceed.",
        details: error
      }, { status: 400 })
    }
    return NextResponse.json({ error: error.message, details: error }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}



