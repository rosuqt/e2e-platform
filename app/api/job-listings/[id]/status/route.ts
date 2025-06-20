import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const { paused } = await request.json()
  const { data, error } = await supabase
    .from("job_postings")
    .update({ paused })
    .eq("id", id)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}
