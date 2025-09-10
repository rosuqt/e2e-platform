import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { authOptions } from '../../../lib/authOptions'
import { getServerSession } from 'next-auth'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side operations
)

interface BugReportData {
  problem: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  browser?: string
  page?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log("SESSION OBJECT:", session)

    if (!session?.user) {
      console.error("❌ No session.user found – user not authenticated")
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { role, studentId, employerId } = session.user as any

    let userId: string | null = null
    let userType: 'student' | 'employer' | null = null

    // Use registered_students or registered_employers IDs directly
    if (role === 'student' && studentId) {
      const { data: studentRow, error: studentError } = await supabase
        .from('registered_students')
        .select('id')
        .eq('id', studentId)
        .single()

      if (!studentRow || studentError) {
        console.error("❌ No matching student found for id:", studentId, studentError)
        return NextResponse.json({ error: 'Student profile not found for this account' }, { status: 404 })
      }

      userId = studentRow.id
      userType = 'student'

    } else if (role === 'employer' && employerId) {
      const { data: employerRow, error: employerError } = await supabase
        .from('registered_employers')
        .select('id')
        .eq('id', employerId)
        .single()

      if (!employerRow || employerError) {
        console.error("❌ No matching employer found for id:", employerId, employerError)
        return NextResponse.json({ error: 'Employer profile not found for this account' }, { status: 404 })
      }

      userId = employerRow.id
      userType = 'employer'
    }

    if (!userId || !userType) {
      console.error("❌ Could not determine userId or userType", { role, studentId, employerId })
      return NextResponse.json(
        { error: 'User not authenticated or user type not determined' },
        { status: 401 }
      )
    }

    const body: BugReportData = await request.json()

    if (!body.problem || !body.description) {
      console.error("❌ Missing required fields. Problem or description not provided.")
      return NextResponse.json(
        { error: 'Problem and description are required' },
        { status: 400 }
      )
    }

    console.log("📋 User filled in bug report form:", {
      problem: body.problem,
      description: body.description,
      severity: body.severity,
      browser: body.browser,
      page: body.page,
      role: userType,
      userId
    })

    const insertData = {
      problem: body.problem.trim(),
      description: body.description.trim(),
      severity: body.severity || 'medium',
      browser: body.browser?.trim() || null,
      page: body.page?.trim() || null,
      user_type: userType,
      ...(userType === 'student'
        ? { student_id: userId, employer_id: null }
        : { employer_id: userId, student_id: null }
      )
    }

    console.log('📥 Inserting bug report into DB:', insertData)

    const { data, error } = await supabase
      .from('bug_reports')
      .insert([insertData])
      .select('id, created_at')
      .single()

    if (error) {
      console.error(`❌ Supabase insert error for ${userType}:`, JSON.stringify(error, null, 2))
      return NextResponse.json(
        {
          error: 'Failed to create bug report',
          details: error,
          hint: 'Check console/server logs for full details'
        },
        { status: 500 }
      )
    }

    console.log(`✅ Bug report created successfully for ${userType}:`, data)

    return NextResponse.json({
      success: true,
      message: 'Bug report submitted successfully',
      data: {
        id: data.id,
        created_at: data.created_at
      }
    })

  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.error("❌ No session.user found – user not authenticated")
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { role, studentId, employerId } = session.user as any

    let userId: string | null = null
    let userType: 'student' | 'employer' | null = null

    if (role === 'student' && studentId) {
      const { data: studentRow } = await supabase
        .from('registered_students')
        .select('id')
        .eq('id', studentId)
        .single()
      userId = studentRow?.id || null
      userType = 'student'
    } else if (role === 'employer' && employerId) {
      const { data: employerRow } = await supabase
        .from('registered_employers')
        .select('id')
        .eq('id', employerId)
        .single()
      userId = employerRow?.id || null
      userType = 'employer'
    }

    if (!userId || !userType) {
      console.error("❌ Could not determine user type in GET request", { role, studentId, employerId })
      return NextResponse.json(
        { error: 'User not authenticated or user type not determined' },
        { status: 401 }
      )
    }

    const query = userType === 'student'
      ? supabase.from('bug_reports').select('*').eq('student_id', userId)
      : supabase.from('bug_reports').select('*').eq('employer_id', userId)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error(`❌ Supabase fetch error for ${userType}:`, error)
      return NextResponse.json(
        { error: 'Failed to fetch bug reports' },
        { status: 500 }
      )
    }

    console.log(`📤 Retrieved ${data?.length || 0} bug reports for ${userType}`)

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('❌ API error in GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
