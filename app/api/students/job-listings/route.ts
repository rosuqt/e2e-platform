import { NextResponse } from 'next/server'
import supabase from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // --- Add filter extraction ---
  const typeParam = searchParams.get("work_type");
  const locationParam = searchParams.get("location");

  let query = supabase
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
      ),
      registered_companies:company_id (
        company_logo_image_path
      )
    `, { count: "exact" })
    .eq('paused', false);

  // --- Add filtering logic ---
  if (typeParam) {
    // Support multiple types (comma-separated)
    const types = typeParam.split(",").map(t => t.trim()).filter(Boolean);
    if (types.length === 1) {
      query = query.eq("work_type", types[0]);
    } else if (types.length > 1) {
      query = query.in("work_type", types);
    }
  }
  if (locationParam) {
    const locations = locationParam.split(",").map(l => l.trim()).filter(Boolean);
    if (locations.length === 1) {
      query = query.eq("remote_options", locations[0]);
    } else if (locations.length > 1) {
      query = query.in("remote_options", locations);
    }
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

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

  return NextResponse.json({
    jobs: result,
    total: count ?? 0,
    totalPages: count ? Math.ceil(count / limit) : 1,
    page,
    limit
  })
}

