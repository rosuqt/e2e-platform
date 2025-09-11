import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { authOptions } from '../../../lib/authOptions'
import { getServerSession } from 'next-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface FeedbackData {
  ratings: Record<string, number>
  suggestions?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { role, studentId, employerId } = session.user as any
    let userId: string | null = null
    let userType: 'student' | 'employer' | null = null

    if (role === 'student' && studentId) {
      const { data: studentRow, error } = await supabase
        .from('registered_students')
        .select('id')
        .eq('id', studentId)
        .single()
      if (!studentRow || error) {
        console.error('Student lookup error:', error)
        return NextResponse.json({ error: 'Student profile not found', details: error?.message || null }, { status: 404 })
      }
      userId = studentRow.id
      userType = 'student'
    } else if (role === 'employer' && employerId) {
      const { data: employerRow, error } = await supabase
        .from('registered_employers')
        .select('id')
        .eq('id', employerId)
        .single()
      if (!employerRow || error) {
        console.error('Employer lookup error:', error)
        return NextResponse.json({ error: 'Employer profile not found', details: error?.message || null }, { status: 404 })
      }
      userId = employerRow.id
      userType = 'employer'
    }

    if (!userId || !userType) {
      return NextResponse.json({ error: 'User type not determined', details: { role, studentId, employerId } }, { status: 401 })
    }

    const body: FeedbackData = await request.json()
    if (!body.ratings || Object.keys(body.ratings).length === 0) {
      return NextResponse.json({ error: 'No ratings provided', details: body }, { status: 400 })
    }

    // Normalize rating keys to match database column names
    const normalizedRatings: Record<string, number> = {}
    for (const key in body.ratings) {
      const columnName = key.toLowerCase().replace(/\s+/g, '_')
      normalizedRatings[columnName] = body.ratings[key]
    }

    const insertData = {
      ...normalizedRatings,
      suggestions: body.suggestions || null,
      user_type: userType,
      ...(userType === 'student'
        ? { student_id: userId, employer_id: null }
        : { employer_id: userId, student_id: null }),
      created_at: new Date()
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert([insertData])
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Feedback insert error:', error)
      return NextResponse.json({ error: 'Failed to submit feedback', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Feedback submitted', data })
  } catch (err: any) {
    console.error('Unhandled server error:', err)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      },
      { status: 500 }
    )
  }
}
