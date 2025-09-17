import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url)
  let id = url.pathname.split('/').filter(Boolean).pop()
  if (id && id === 'status') {
    const segments = url.pathname.split('/').filter(Boolean)
    id = segments.length > 1 ? segments[segments.length - 2] : undefined
  }
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const { paused } = body ?? {}
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!id || typeof paused !== 'boolean' || !uuidRegex.test(id)) {
    return NextResponse.json(
      { error: 'Missing or invalid id or paused value' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('job_postings')
    .update({ paused })
    .eq('id', id)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}
