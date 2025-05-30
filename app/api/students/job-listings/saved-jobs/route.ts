import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

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
      return NextResponse.json({ jobIds: [] })
    }
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('student_id', user.studentId)
    if (error) {
      return NextResponse.json({ jobIds: [] })
    }
    return NextResponse.json({ jobIds: data?.map(d => d.job_id) ?? [] })
  } catch {
    return NextResponse.json({ jobIds: [] })
  }
}
