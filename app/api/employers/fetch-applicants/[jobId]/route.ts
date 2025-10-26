import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId
    const supabase = getAdminSupabase()

    const { data, error } = await supabase
      .from('applications')
      .select('status')
      .eq('job_id', jobId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    const statusCounts = data.reduce((acc: Record<string, number>, app) => {
      let status = app.status || 'New'

      if (status.toLowerCase() === 'interview scheduled') {
        status = 'Interview'
      }

      const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1
      return acc
    }, {})

    const formattedData = [
      { name: "New", value: statusCounts['New'] || 0, color: "#eab308" },
      { name: "Shortlisted", value: statusCounts['Shortlisted'] || 0, color: "#06b6d4" },
      { name: "Interview", value: statusCounts['Interview'] || 0, color: "#8b5cf6" },
      { name: "Waitlisted", value: statusCounts['Waitlisted'] || 0, color: "#3b82f6" },
      { name: "Hired", value: statusCounts['Hired'] || 0, color: "#059669" },
      { name: "Rejected", value: statusCounts['Rejected'] || 0, color: "#dc2626" },
    ].filter(item => item.value > 0)

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
