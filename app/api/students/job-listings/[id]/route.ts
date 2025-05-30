import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request, { params }: { params?: { id?: string } } = {}) {
  const id = params?.id

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!id || !uuidRegex.test(id)) {
    return NextResponse.json({ error: 'Invalid job id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('job_postings')
    .select(`
      *,
      employers:employer_id (
        first_name,
        last_name,
        company_name
      ),
      registered_employers:employer_id (
        company_name
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const normalizeArray = (val: unknown): string[] => {
    if (val == null || val === "") return [];
    if (typeof val === 'string') {
      return String(val).split(/\r?\n|,/).map((s: string) => s.trim()).filter(Boolean)
    }
    if (Array.isArray(val)) return val as string[];
    return [];
  }

  const result = {
    ...data,
    responsibilities: normalizeArray(data?.responsibilities),
    must_haves: normalizeArray(data?.must_haves),
    nice_to_haves: normalizeArray(data?.nice_to_haves),
    perks: normalizeArray(data?.perks),
  }

  return NextResponse.json(result)
}
