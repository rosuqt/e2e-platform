import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const supabase = getAdminSupabase()
  const { searchParams } = new URL(req.url)
  const application_id = searchParams.get('application_id')
  const student_id = searchParams.get('student_id')

  let query = supabase
    .from('activity_log')
    .select(`
      id,
      message,
      type,
      created_at,
      application_id,
      job_id,
      student_id,
      applications:application_id(job_id, job_postings:job_id(job_title)),
      student:student_id (first_name, last_name),
      job_postings:job_id(job_title)
    `)
    .order('created_at', { ascending: false })

  if (application_id) {
    query = query.eq('application_id', application_id)
  } else if (student_id) {
    query = query.eq('student_id', student_id)
  } else {
    query = query.limit(10)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'No data returned from Supabase' }, { status: 500 })
  }

  type SupabaseActivity = {
    id: string
    message: string
    type: string
    created_at: string
    application_id?: string
    job_id?: string
    student_id?: string
    applications?: { job_title?: string } | { job_title?: string }[]
    student?: { first_name?: string; last_name?: string } | { first_name?: string; last_name?: string }[]
    job_postings?: { job_title?: string } | { job_title?: string }[]
  }

  const activity = (data as SupabaseActivity[] || []).map(item => {
    const studentObj = Array.isArray(item.student) ? item.student[0] : item.student || {}
    const applicationsObj = Array.isArray(item.applications) ? item.applications[0] : item.applications || {}
    const jobPostingsObj = Array.isArray(item.job_postings) ? item.job_postings[0] : item.job_postings || {}
    const name = [studentObj?.first_name, studentObj?.last_name].filter(Boolean).join(' ')
    const position = applicationsObj?.job_title || jobPostingsObj?.job_title || ''

    return {
      name,
      position,
      update: item.message,
      time: item.created_at,
      icon: item.type,
      application_id: item.application_id || '',
      type: item.type,
      created_at: item.created_at,
      message: item.message,
    }
  })

  return NextResponse.json(activity)
}
