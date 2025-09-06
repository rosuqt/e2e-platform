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
    const isNonEmpty = (s: string) => s.trim().length > 0;
    if (val == null || val === "") return [];
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {

          return parsed.flatMap((s: unknown) =>
            typeof s === "string"
              ? s.split(/\r?\n|,/).map(str => str.trim()).filter(isNonEmpty)
              : []
          );
        }
      } catch {

        return String(val).split(/\r?\n|,/).map((s: string) => s.trim()).filter(isNonEmpty);
      }
    }
    if (Array.isArray(val)) {
      return val.flatMap((s: unknown) =>
        typeof s === "string"
          ? s.split(/\r?\n|,/).map(str => str.trim()).filter(isNonEmpty)
          : []
      );
    }
    return [];
  }

  const result = Array.isArray(data)
    ? data.map(job => {
        const mustHaves = normalizeArray(job.must_have_qualifications);
        const niceToHaves = normalizeArray(job.nice_to_have_qualifications);
        const perks = normalizeArray(job.perks_and_benefits);
        return {
          ...job,
          responsibilities: normalizeArray(job.responsibilities),
          must_haves: mustHaves,
          nice_to_haves: niceToHaves,
          perks: perks,
        }
      })
    : []

  // console.log("API result:", JSON.stringify(result, null, 2));

  return NextResponse.json(result)
}
