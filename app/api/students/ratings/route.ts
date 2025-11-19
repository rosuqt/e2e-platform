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

    // NEW: read jobId from query string (used by the modal "already rated" check)
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    // Fetch ratings with job info, optionally filtered by jobId
    let query = supabase
      .from("student_ratings")
      .select(
        `
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
      `
      )
      .eq("student_id", studentId);

    if (jobId) {
      query = query.eq("job_id", jobId);
    }

    const { data: ratingsData, error } = (await query) as { data: Rating[] | null; error: any };

    if (error) throw error;
    if (!ratingsData) return NextResponse.json([]);

    // Collect unique company and employer IDs
    const companyIds = [...new Set(ratingsData.map(r => r.company_id).filter(Boolean))];
    const employerIds = [...new Set(ratingsData.map(r => r.employer_id).filter(Boolean))];

    // Fetch company profiles (with company_name)
    const { data: companies, error: companyError } = await supabase
      .from("company_profile")
      .select(
        `
    company_id,
    hq_img,
    registered_companies (
      company_name
    )
  `
      )
      .in("company_id", companyIds) as {
      data: {
        company_id: string;
        hq_img: string | null;
        registered_companies: { company_name: string } | null;
      }[] | null;
      error: any;
    };

    if (companyError) console.error("Company query error:", companyError);

    // FIX: only select existing employer_profile fields (assume a single full_name column)
    const { data: employers, error: employerError } = await supabase
      .from("employer_profile")
      .select("employer_id, full_name")
      .in("employer_id", employerIds);

    console.log("Employer IDs:", employerIds);
    console.log("Employers fetched:", employers);

    if (employerError) console.error("Employer query error:", employerError);

    // Merge info into ratings
    const updatedRatings = await Promise.all(
      ratingsData.map(async r => {
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
            ? { id: r.employer_id, name: employer.full_name ?? "Unknown Employer" }
            : { id: r.employer_id, name: "Unknown Employer" },
        };
      })
    );

    return NextResponse.json(updatedRatings);
  } catch (err: any) {
    console.error("🔥 Database error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
