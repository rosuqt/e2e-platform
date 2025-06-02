import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function GET(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params

  const { data, error } = await supabase
    .from('job_postings')
    .select(`
      *,
      employers:employer_id (
        first_name,
        last_name,
        job_title,
        company_name
      ),
      registered_employers:employer_id (
        company_name
      )
    `)
    .eq('id', jobId)
    .single()

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
              ? s.split(/\r?\n|,/).map((str: string) => str.trim()).filter(isNonEmpty)
              : []
          );
        }
      } catch {
        return String(val).split(/\r?\n|,/).map((s: string) => s.trim()).filter(isNonEmpty);
      }
    }
    if (Array.isArray(val)) {
      return (val as string[]).flatMap((s: string) =>
        typeof s === "string"
          ? s.split(/\r?\n|,/).map((str: string) => str.trim()).filter(isNonEmpty)
          : []
      );
    }
    return [];
  }

  const job = data
    ? {
        ...data,
        responsibilities: normalizeArray(data.responsibilities),
        must_haves: normalizeArray(data.must_have_qualifications),
        nice_to_haves: normalizeArray(data.nice_to_have_qualifications),
        perks: normalizeArray(data.perks_and_benefits),
      }
    : null

  return NextResponse.json(job)
}
