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

    let urlObj;
    try {
      urlObj = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost");
    } catch {
      urlObj = new URL("http://localhost" + req.url);
    }
    const jobId = urlObj.searchParams.get("jobId");

    let query = supabase
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
      .eq("student_id", studentId);

    if (jobId) {
      query = query.eq("job_id", jobId);
    }

    const { data: ratingsData, error } = await query as { data: Rating[] | null; error: any };

    if (error) throw error;
    if (!ratingsData || ratingsData.length === 0) return NextResponse.json([]);

    const companyIds = [...new Set(ratingsData.map(r => r.company_id).filter(Boolean))];
    const employerIds = [...new Set(ratingsData.map(r => r.employer_id).filter(Boolean))];

    const { data: companies } = await supabase
      .from("company_profile")
      .select(`
        company_id,
        registered_companies (
          company_name,
          company_logo_image_path
        )
      `)
      .in("company_id", companyIds) as {
        data: {
          company_id: string;
          registered_companies: { company_name: string; company_logo_image_path?: string | null } | null;
        }[] | null;
        error: any;
      };

    const { data: employers } = await supabase
      .from("employer_profile")
      .select(`
        employer_id,
        profile_img,
        registered_employers!employer_profile_employer_id_fkey (
          first_name,
          last_name
        )
      `)
      .in("employer_id", employerIds) as {
        data: {
          employer_id: string;
          profile_img?: string | null;
          registered_employers: { first_name: string | null; last_name: string | null } | null;
        }[] | null;
        error: any;
      };

    const updatedRatings = await Promise.all(ratingsData.map(async r => {
      const companyProfile = companies?.find(c => c.company_id === r.company_id) || null;
      const employer = employers?.find(e => e.employer_id === r.employer_id) || null;

      let logoUrl: string | null = null;
      const logoPath = companyProfile?.registered_companies?.company_logo_image_path;
      if (logoPath) {
        logoUrl = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/company.logo/${logoPath}`;
      }

      let employerName = "Unknown Employer";
      let employerProfileImgUrl: string | null = null;
      if (employer?.registered_employers) {
        const regFirst = employer.registered_employers.first_name?.trim() || "";
        const regLast = employer.registered_employers.last_name?.trim() || "";
        if (regFirst || regLast) {
          employerName = `${regFirst} ${regLast}`.trim();
        }
      }
      if (employer?.profile_img) {
        employerProfileImgUrl = employer.profile_img.trim();
      }

      return {
        ...r,
        company: companyProfile
          ? {
              id: r.company_id,
              company_name: companyProfile.registered_companies?.company_name ?? "Unknown Company",
              company_logo_url: logoUrl || null,
            }
          : { id: r.company_id, company_name: "Unknown Company", company_logo_url: null },
        employer: { id: r.employer_id, name: employerName, profile_img: employerProfileImgUrl },
      };
    }));

    return NextResponse.json(updatedRatings);

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const studentId = (session?.user as { studentId?: string })?.studentId

    if (!studentId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { jobId, overall, recruiter, company } = body

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
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
