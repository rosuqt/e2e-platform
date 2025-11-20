import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

interface Rating {
  id: number;
  job_id: number;
  employer_id: string;
  company_id: string;
  overall_rating: number;
  overall_comment: string;
  recruiter_rating: number;
  recruiter_comment: string;
  company_rating: number;
  company_comment: string;
  created_at: string;
  job_postings: { job_title: string }[];
  company?: { id: string; company_name: string; company_logo_url?: string | null } | null;
  employer?: { id: string; name: string } | null;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const studentId = (session?.user as { studentId?: string })?.studentId;

    if (!studentId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get jobId from query string
    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ success: false, error: "jobId is required" }, { status: 400 });
    }

    const { data: ratingsData, error } = await supabase
      .from("student_ratings")
      .select(`
        id,
        job_id,
        employer_id,
        company_id,
        overall_rating,
        overall_comment,
        recruiter_rating,
        recruiter_comment,
        company_rating,
        company_comment,
        created_at,
        job_postings(job_title)
      `)
      .eq("student_id", studentId)
      .eq("job_id", jobId) as { data: Rating[] | null; error: any };

    if (error) throw error;
    if (!ratingsData || ratingsData.length === 0) return NextResponse.json([]);

    const companyIds = [...new Set(ratingsData.map(r => r.company_id).filter(Boolean))];
    const employerIds = [...new Set(ratingsData.map(r => r.employer_id).filter(Boolean))];

    const { data: companies, error: companyError } = await supabase
      .from("company_profile")
      .select(`
        company_id,
        hq_img,
        registered_companies (
          company_name
        )
      `)
      .in("company_id", companyIds) as {
        data: {
          company_id: string;
          hq_img: string | null;
          registered_companies: { company_name: string } | null;
        }[] | null;
        error: any;
      };

    if (companyError) console.error("Company query error:", companyError);

    const { data: employers, error: employerError } = await supabase
      .from("employer_profile")
      .select("employer_id, first_name, last_name")
      .in("employer_id", employerIds);

    if (employerError) console.error("Employer query error:", employerError);

    const updatedRatings = await Promise.all(ratingsData.map(async r => {
      const companyProfile = companies?.find(c => c.company_id === r.company_id) || null;
      const employer = employers?.find(e => e.employer_id === r.employer_id) || null;

      let logoUrl: string | null = null;
      if (companyProfile?.hq_img) {
        const { data: signed } = await supabase.storage
          .from("company_logos")
          .createSignedUrl(companyProfile.hq_img, 60);
        logoUrl = signed?.signedUrl ?? null;
      }

      return {
        ...r,
        company: companyProfile
          ? {
              id: r.company_id,
              company_name: companyProfile.registered_companies?.company_name ?? "Unknown Company",
              company_logo_url: logoUrl,
            }
          : { id: r.company_id, company_name: "Unknown Company", company_logo_url: null },
        employer: employer
          ? { id: r.employer_id, name: `${employer.first_name} ${employer.last_name}`.trim() }
          : { id: r.employer_id, name: "Unknown Employer" },
      };
    }));

    return NextResponse.json(updatedRatings);

  } catch (err: any) {
    console.error("🔥 Database error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


// ----------------------
// POST handler to save rating
// ----------------------
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const studentId = (session?.user as { studentId?: string })?.studentId

    if (!studentId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { jobId, overall, recruiter, company } = body

    // Lookup the job to get employer_id and company_id
    const { data: jobData, error: jobError } = await supabase
      .from("job_postings")
      .select("id, employer_id, company_id")
      .eq("id", jobId)
      .single()

    if (jobError || !jobData) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    const { employer_id, company_id } = jobData

    const { data, error } = await supabase.from("student_ratings").insert([
      {
        student_id: studentId,
        job_id: jobId,
        overall_rating: overall.rating,
        overall_comment: overall.comment,
        recruiter_rating: recruiter.rating,
        recruiter_comment: recruiter.comment,
        company_rating: company.rating,
        company_comment: company.comment,
        employer_id,
        company_id,
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error("🔥 Failed to save rating:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

