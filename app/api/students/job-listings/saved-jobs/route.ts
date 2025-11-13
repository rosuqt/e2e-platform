import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/authOptions'
import { getAdminSupabase } from '@/lib/supabase'

type SessionUserWithStudentId = {
  studentId?: string
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as SessionUserWithStudentId | undefined
    if (!user?.studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const jobId = String(body.jobId)
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })
    }
    const supabase = getAdminSupabase()
    const { data: existing, error: checkError } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('student_id', user.studentId)
      .eq('job_id', jobId)
      .maybeSingle()
    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }
    if (existing) {
      return NextResponse.json({ success: true })
    }
    const { error } = await supabase.from('saved_jobs').insert({
      student_id: user.studentId,
      job_id: jobId,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as SessionUserWithStudentId | undefined
    if (!user?.studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const jobId = String(body.jobId)
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })
    }
    const supabase = getAdminSupabase()
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('student_id', user.studentId)
      .eq('job_id', jobId)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as SessionUserWithStudentId | undefined
    if (!user?.studentId) {
      return NextResponse.json({ jobs: [] })
    }

    const url = new URL(request.url)
    const limitParam = url.searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    const supabase = getAdminSupabase()
    let query = supabase
      .from('saved_jobs')
      .select('saved_at, job:job_postings(*, registered_companies:registered_companies(company_name,company_logo_image_path))')
      .eq('student_id', user.studentId)
      .order('saved_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ jobs: [] })
    }

    const jobs = (Array.isArray(data) ? data : [])
      .map((row: Record<string, unknown>) => {
        const job = row && typeof row === "object" && row.job && typeof (row.job) === "object" && !Array.isArray(row.job)
          ? row.job as { [key: string]: unknown }
          : null
        if (job && typeof job.id === "string") {
          const company =
            (job.registered_companies && typeof job.registered_companies === "object" && "company_name" in job.registered_companies)
              ? (job.registered_companies as { company_name?: string }).company_name
              : undefined
          const company_logo_image_path =
            (job.registered_companies && typeof job.registered_companies === "object" && "company_logo_image_path" in job.registered_companies)
              ? (job.registered_companies as { company_logo_image_path?: string }).company_logo_image_path
              : undefined
          return { ...job, id: job.id as string, company, company_logo_image_path }
        }
        return null
      })
      .filter(
        (job): job is { id: string; company: string | undefined; company_logo_image_path: string | undefined } =>
          Boolean(job && typeof job.id === "string")
      )

    return NextResponse.json({ jobs })
  } catch {
    return NextResponse.json({ jobs: [] })
  }
}

