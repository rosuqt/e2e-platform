import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const studentId = url.searchParams.get('studentId')
  if (!studentId) {
    return NextResponse.json({ count: 0 })
  }
  const supabase = getAdminSupabase()
  const { count, error } = await supabase
    .from('saved_jobs')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId)
  if (error) {
    return NextResponse.json({ count: 0 })
  }
  return NextResponse.json({ count: count ?? 0 })
}
