import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const parts = url.pathname.split('/')
    const jobId = parts[parts.length - 1]

    const supabase = getAdminSupabase()

    const { data, error } = await supabase
      .from('applications')
      .select('status,student_id')
      .eq('job_id', jobId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    const studentIds = data.map(app => app.student_id).filter(Boolean)
    const matchScores: Record<string, number> = {}
    if (studentIds.length) {
      const { data: matches } = await supabase
        .from('job_matches')
        .select('student_id, gpt_score')
        .eq('job_id', jobId)
        .in('student_id', studentIds)
      if (Array.isArray(matches)) {
        matches.forEach(m => {
          if (m.student_id) matchScores[m.student_id] = Number(m.gpt_score) || 0
        })
      }
    }

    const statusCounts = data.reduce((acc: Record<string, number>, app: { status?: string, student_id?: string }) => {
      let status = app.status || 'New'
      if (status.toLowerCase() === 'interview scheduled') status = 'Interview'
      const normalized =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      acc[normalized] = (acc[normalized] || 0) + 1
      return acc
    }, {})

    const formattedData = [
      { name: 'New', value: statusCounts['New'] || 0, color: '#eab308' },
      { name: 'Shortlisted', value: statusCounts['Shortlisted'] || 0, color: '#06b6d4' },
      { name: 'Interview', value: statusCounts['Interview'] || 0, color: '#8b5cf6' },
      { name: 'Waitlisted', value: statusCounts['Waitlisted'] || 0, color: '#3b82f6' },
      { name: 'Hired', value: statusCounts['Hired'] || 0, color: '#059669' },
      { name: 'Rejected', value: statusCounts['Rejected'] || 0, color: '#dc2626' },
    ].filter(item => item.value > 0)

    return NextResponse.json(formattedData)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
