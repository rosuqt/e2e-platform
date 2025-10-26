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
  const { error } = await supabase
    .from('job_postings')
    .delete()
    .eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}



