/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const locationParam = searchParams.get("location");
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const sortBy = (searchParams.get("sortBy") || "relevant").toLowerCase();
  const salaryParam = searchParams.get("salary")?.toLowerCase() || "";
  const matchScoreParamRaw = searchParams.get("match_score");
  const matchScoreFilter = matchScoreParamRaw ? Number(matchScoreParamRaw) : null;
  const matchScoreMinRaw = searchParams.get("match_score_min");
  const matchScoreMaxRaw = searchParams.get("match_score_max");
  const matchScoreMin = matchScoreMinRaw ? Number(matchScoreMinRaw) : null;
  const matchScoreMax = matchScoreMaxRaw ? Number(matchScoreMaxRaw) : null;

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
        company_name,
        verify_status
      ),
      registered_companies:company_id (
        id,
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
    console.error("API ERROR 500: Could not fetch job listings. Hint:", error.message)
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

  async function isJobInactive(job: any): Promise<boolean> {
    if (job.is_archived) return true;
    if (job.application_deadline) {
      const deadline = new Date(job.application_deadline);
      if (!isNaN(deadline.getTime()) && deadline < new Date()) return true;
    }
    if (job.max_applicants && Number(job.max_applicants) > 0) {
      const { data: appCountData } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("job_id", job.id);
      if ((appCountData as any)?.count >= Number(job.max_applicants)) return true;
    }
    return false;
  }

  let result = Array.isArray(data)
    ? await Promise.all(
        data.map(async job => {
          const mustHaves = normalizeArray(job.must_have_qualifications);
          const niceToHaves = normalizeArray(job.nice_to_have_qualifications);
          const perks = normalizeArray(job.perks_and_benefits);
          let verify_status = job.registered_employers?.verify_status;

          if (!verify_status && job.registered_companies?.verify_status) {
            verify_status = job.registered_companies.verify_status;
          }
          return {
            ...job,
            responsibilities: normalizeArray(job.responsibilities),
            must_haves: mustHaves,
            nice_to_haves: niceToHaves,
            perks: perks,
            verify_status: verify_status ?? null,
            company_id: job.registered_companies?.id ?? null
          }
        })
      )
    : [];

  result = await Promise.all(
    result.map(async job => (await isJobInactive(job) ? null : job))
  );
  result = result.filter(Boolean);

  let scoreMap: Record<string, number> = {};
  if (studentId) {
    try {
      const { data: matchesData } = await supabase
        .from("job_matches")
        .select("job_id, gpt_score")
        .eq("student_id", studentId);
      if (Array.isArray(matchesData)) {
        for (const m of matchesData) {
          if (m && m.job_id != null && typeof m.gpt_score === "number") {
            scoreMap[String(m.job_id)] = m.gpt_score;
          }
        }
      }
    } catch (e) {
      scoreMap = {};
    }
  }
  result = result.map(job => ({ ...job, match_score: scoreMap[String(job.id)] ?? 0 }));

  if ((typeof matchScoreMin === "number" && !isNaN(matchScoreMin)) || (typeof matchScoreMax === "number" && !isNaN(matchScoreMax))) {
    result = result.filter(job => {
      const s = Number(job.match_score ?? 0);
      const hasMin = typeof matchScoreMin === "number" && !isNaN(matchScoreMin);
      const hasMax = typeof matchScoreMax === "number" && !isNaN(matchScoreMax);

      if (hasMin && hasMax) {
        return s >= (matchScoreMin as number) && s <= (matchScoreMax as number);
      }
      if (hasMin) return s >= (matchScoreMin as number);
      if (hasMax) return s <= (matchScoreMax as number);
      return true;
    });
  }

  if (matchScoreFilter !== null && !isNaN(matchScoreFilter)) {
    result = result.filter(job => (job.match_score ?? 0) >= matchScoreFilter);
  }

  if (salaryParam) {
    const parseNumericFrom = (val: unknown): number | null => {
      if (val == null) return null;
      if (typeof val === "number") return val;
      if (typeof val === "string") {
        const digits = val.replace(/[^0-9]/g, "");
        return digits ? Number(digits) : null;
      }
      return null;
    };

    const isUnpaidValue = (raw: unknown): boolean => {
      if (raw == null) return true;
      if (typeof raw === "number") return raw === 0;
      if (typeof raw === "string") {
        const t = raw.trim();
        if (t === "" || t === "0") return true;
        if (/unpaid|no pay/i.test(t)) return true;
      }
      return false;
    };

    result = result.filter(job => {
      const hasPayAmountField = Object.prototype.hasOwnProperty.call(job, "pay_amount");
      const rawPay = hasPayAmountField ? (job as any).pay_amount : ((job as any).payAmount ?? (job as any).salary ?? null);
      const jobSalaryNum = parseNumericFrom(rawPay);

      if (salaryParam === "unpaid") {
        return isUnpaidValue(rawPay);
      }

      if (salaryParam.startsWith(">=")) {
        const val = Number(salaryParam.replace(">=", "").replace(/[^0-9]/g, ""));
        if (isNaN(val)) return false;
        if (jobSalaryNum === null) return false;
        return jobSalaryNum >= val;
      }

      const numeric = Number(salaryParam.replace(/[^0-9]/g, ""));
      if (!isNaN(numeric) && numeric > 0) {
        if (jobSalaryNum === null) return false;
        return jobSalaryNum >= numeric;
      }

      return true;
    });
  }

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
    }
  }

  if (searchQuery) {
    result = result.filter(job => {
      const title = (job.title || job.job_title || "").toLowerCase();
      const description = (job.description || "").toLowerCase();
      const company =
        (job.registered_employers?.company_name ||
         job.registered_companies?.company_name ||
         job.employers?.company_name ||
         [job.employers?.first_name, job.employers?.last_name].filter(Boolean).join(" ") ||
         "").toLowerCase();
      return (
        title.includes(searchQuery) ||
        description.includes(searchQuery) ||
        company.includes(searchQuery)
      );
    });
  }

  if (sortBy === "reco") {
    result = result.sort((a, b) => {
      const aScore = (a.match_score ?? 0);
      const bScore = (b.match_score ?? 0);
      if (bScore === aScore) {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime;
      }
      return bScore - aScore;
    });
  } else if (sortBy === "newest") {
     result = result.sort((a, b) => {
       const aTime = new Date(a.created_at || 0).getTime();
       const bTime = new Date(b.created_at || 0).getTime();
       return bTime - aTime;
     });
   }

   result = result.filter(
     job =>
       job.registered_employers?.verify_status === "full" ||
       job.registered_employers?.verify_status === "standard"
   );

   result = [
     ...result.filter(job => job.registered_employers?.verify_status === "full"),
     ...result.filter(job => job.registered_employers?.verify_status === "standard"),
   ];

   const standardJobs = result.filter(job => job.registered_employers?.verify_status === "standard");
   const companyJobCounts: Record<string, number> = {};
   for (const job of standardJobs) {
     const company =
       job.registered_employers?.company_name ||
       job.registered_companies?.company_name ||
       job.employers?.company_name ||
       [job.employers?.first_name, job.employers?.last_name].filter(Boolean).join(" ") ||
       "";
     if (!companyJobCounts[company]) companyJobCounts[company] = 0;
     companyJobCounts[company]++;
   }

   const jobsToHide: Set<string> = new Set();
   for (const company in companyJobCounts) {
     const jobsOfCompany = standardJobs.filter(job =>
       (job.registered_employers?.company_name ||
        job.registered_companies?.company_name ||
        job.employers?.company_name ||
        [job.employers?.first_name, job.employers?.last_name].filter(Boolean).join(" ") ||
        "") === company
     );
     let hideCount = Math.min(3, 1 + Math.floor(jobsOfCompany.length / 5));
     if (jobsOfCompany.length > 10) hideCount = Math.min(5, Math.floor(jobsOfCompany.length / 3));
     if (hideCount > jobsOfCompany.length) hideCount = jobsOfCompany.length;
     const shuffled = jobsOfCompany
       .map(j => j.id)
       .sort(() => Math.random() - 0.5)
       .slice(0, hideCount);
     shuffled.forEach(id => jobsToHide.add(String(id)));
   }

   result = result.filter(job =>
     !(job.registered_employers?.verify_status === "standard" && jobsToHide.has(String(job.id)))
   );

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

