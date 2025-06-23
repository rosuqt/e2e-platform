import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()
  const { data, error } = await supabase
    .from('job_postings')
    .update({ deleted: true })
    .eq('id', id)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}
