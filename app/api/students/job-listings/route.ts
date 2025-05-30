import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
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
    .eq('paused', false)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const normalizeArray = (val: unknown): string[] => {
    if (val == null || val === "") return [];
    if (typeof val === "string") {
      return String(val).split(/\r?\n|,/).map((s: string) => s.trim()).filter(Boolean)
    }
    if (Array.isArray(val)) return val as string[];
    return [];
  }

  const result = Array.isArray(data)
    ? data.map(job => ({
        ...job,
        responsibilities: normalizeArray(job.responsibilities),
        must_haves: normalizeArray(job.must_haves),
        nice_to_haves: normalizeArray(job.nice_to_haves),
        perks: normalizeArray(job.perks),
      }))
    : []

  return NextResponse.json(result)
}
