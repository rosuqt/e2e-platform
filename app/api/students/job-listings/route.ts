import { NextResponse } from 'next/server'
import supabase from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from '../../../../lib/authOptions';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const typeParam = searchParams.get("work_type");
  // eslint-disable-next-line prefer-const
  let locationParam = searchParams.get("location");

  const session = await getServerSession(authOptions)
  const studentId = session?.user?.studentId

  let preferredTypes: string[] = []
  let preferredLocations: string[] = []
  let allowUnrelatedJobs = true

  const jobTypeMap: Record<string, string> = {
    internship: "OJT/Internship",
    "ojt": "OJT/Internship",
    "full-time": "Full-time",
    "part-time": "Part-time"
  }
  const remoteMap: Record<string, string> = {
    wfh: "Work from home",
    onsite: "On-site",
    hybrid: "Hybrid"
  }

  if (!typeParam && !locationParam && studentId) {
    const { data: pref, error: prefErr } = await supabase
      .from("s_job_pref")
      .select("job_type, remote_options, unrelated_jobs")
      .eq("student_id", studentId)
      .single()
    console.log("s_job_pref data:", pref)
    console.log("s_job_pref error:", prefErr)
    if (!prefErr && pref) {
      if (pref.job_type) {
        try {
          const arr = typeof pref.job_type === "string" ? JSON.parse(pref.job_type) : pref.job_type
          preferredTypes = Array.isArray(arr)
            ? arr.map((t: string) => (jobTypeMap[t.trim().toLowerCase()] || t.trim().toLowerCase()))
            : []
        } catch {
          preferredTypes = String(pref.job_type)
            .split(",")
            .map((t: string) => jobTypeMap[t.trim().toLowerCase()] || t.trim().toLowerCase())
            .filter(Boolean)
        }
      }
      if (pref.remote_options) {
        try {
          const arr = typeof pref.remote_options === "string" ? JSON.parse(pref.remote_options) : pref.remote_options
          preferredLocations = Array.isArray(arr)
            ? arr.map((l: string) => remoteMap[l.trim().toLowerCase()] || l.trim().toLowerCase())
            : []
        } catch {
          preferredLocations = String(pref.remote_options)
            .split(",")
            .map((l: string) => remoteMap[l.trim().toLowerCase()] || l.trim().toLowerCase())
            .filter(Boolean)
        }
      }
      if (typeof pref.unrelated_jobs === "boolean") {
        allowUnrelatedJobs = pref.unrelated_jobs
      }
    }
    console.log("preferredTypes:", preferredTypes)
    console.log("preferredLocations:", preferredLocations)
    console.log("allowUnrelatedJobs:", allowUnrelatedJobs)
  }

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

  if (typeParam) {
    const types = typeParam.split(",").map(t => t.trim());
    query = types.length === 1
      ? query.eq("work_type", types[0])
      : query.in("work_type", types);
  } else if (locationParam) {
    const locations = locationParam.split(",").map(l => l.trim());
    query = locations.length === 1
      ? query.eq("remote_options", locations[0])
      : query.in("remote_options", locations);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

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

  let result = Array.isArray(data)
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
    : [];
  console.log("Initial jobs count:", Array.isArray(data) ? data.length : 0)
  console.log("Result jobs count before filtering:", result.length)
  if (preferredTypes.length > 0 || preferredLocations.length > 0) {
    if (!allowUnrelatedJobs) {
      result = result.filter(job => {
        const jobTypeNorm = jobTypeMap[(job.work_type || "").trim().toLowerCase()] || (job.work_type || "").trim().toLowerCase()
        const remoteNorm = remoteMap[(job.remote_options || "").trim().toLowerCase()] || (job.remote_options || "").trim().toLowerCase()
        return (
          (preferredTypes.length > 0 && preferredTypes.includes(jobTypeNorm)) ||
          (preferredLocations.length > 0 && preferredLocations.includes(remoteNorm))
        )
      });
      console.log("Filtered jobs count (only related):", result.length)
    } else {
      result = result.sort((a, b) => {
        const aTypeNorm = jobTypeMap[(a.work_type || "").trim().toLowerCase()] || (a.work_type || "").trim().toLowerCase()
        const aRemoteNorm = remoteMap[(a.remote_options || "").trim().toLowerCase()] || (a.remote_options || "").trim().toLowerCase()
        const bTypeNorm = jobTypeMap[(b.work_type || "").trim().toLowerCase()] || (b.work_type || "").trim().toLowerCase()
        const bRemoteNorm = remoteMap[(b.remote_options || "").trim().toLowerCase()] || (b.remote_options || "").trim().toLowerCase()
        const aMatches =
          (preferredTypes.length > 0 && preferredTypes.includes(aTypeNorm)) ||
          (preferredLocations.length > 0 && preferredLocations.includes(aRemoteNorm));
        const bMatches =
          (preferredTypes.length > 0 && preferredTypes.includes(bTypeNorm)) ||
          (preferredLocations.length > 0 && preferredLocations.includes(bRemoteNorm));
        return (bMatches ? 1 : 0) - (aMatches ? 1 : 0);
      });
      console.log("Sorted jobs count (related first):", result.length)
    }
  }
  console.log("Final jobs count after filtering/sorting:", result.length)
  console.log("Paged jobs count:", result.slice(from, to + 1).length)

  const pagedResult = result.slice(from, to + 1);

  function parsePrefArray(arr: unknown): string[] {
    if (!Array.isArray(arr)) return [];
    if (arr.length === 1 && typeof arr[0] === "string" && arr[0].startsWith("[")) {
      const cleaned = arr[0].replace(/^\[|\]$/g, "");
      return cleaned
        .split(",")
        .map(s => s.replace(/"/g, "").trim().toLowerCase())
        .filter(Boolean);
    }
    return arr
      .map((s: unknown) => typeof s === "string" ? s.replace(/"/g, "").trim().toLowerCase() : "")
      .filter(Boolean);
  }

  return NextResponse.json({
    jobs: pagedResult,
    total: result.length,
    totalPages: Math.ceil(result.length / limit),
    page,
    limit,
    preferredTypes: parsePrefArray(preferredTypes),
    preferredLocations: parsePrefArray(preferredLocations),
    allowUnrelatedJobs
  })
}

