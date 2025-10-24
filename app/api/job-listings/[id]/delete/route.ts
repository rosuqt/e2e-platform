import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function PATCH(req: NextRequest, params: Promise<{ params: { id: string } }>) {
  const { params: { id } } = await params
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
   
 

