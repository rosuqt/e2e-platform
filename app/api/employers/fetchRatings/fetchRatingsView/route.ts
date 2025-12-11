import { NextResponse } from "next/server";
import supabase, { getAdminSupabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get("company_id");
  const employerId = url.searchParams.get("employer_id");

  if (!companyId && !employerId) {
    return NextResponse.json({ success: false, error: "Missing company_id or employer_id" }, { status: 400 });
  }

  let query = supabase.from("student_ratings").select(`
    id,
    student_id,
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
    updated_at,
    job_postings(job_title),
    registered_students(first_name, last_name, email)
  `);

  if (companyId) {
    query = query.eq("company_id", companyId);
  }
  if (employerId) {
    query = query.eq("employer_id", employerId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const adminSupabase = getAdminSupabase();
  const ratingsWithImg = await Promise.all(
    (data ?? []).map(async (r) => {
      let profileImgUrl;
      let studentProfileImg: string | undefined;
      if (r.student_id) {
        const { data: profileData, error: profileError } = await supabase
          .from("student_profile")
          .select("profile_img")
          .eq("student_id", r.student_id)
          .maybeSingle();
        if (!profileError && profileData && typeof profileData.profile_img === "string") {
          studentProfileImg = profileData.profile_img;
        }
      }
      if (studentProfileImg && !/^https?:\/\//.test(studentProfileImg)) {
        try {
          const { data: signed, error: signedError } = await adminSupabase
            .storage
            .from("user.avatars")
            .createSignedUrl(studentProfileImg, 60 * 60);
          if (signed?.signedUrl && !signedError) {
            profileImgUrl = signed.signedUrl;
          } else {
            profileImgUrl = "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg";
          }
        } catch {
          profileImgUrl = "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg";
        }
      } else if (studentProfileImg && /^https?:\/\//.test(studentProfileImg)) {
        profileImgUrl = studentProfileImg;
      } else {
        profileImgUrl = "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg";
      }
      return {
        ...r,
        registered_students: {
          ...(!Array.isArray(r.registered_students) ? r.registered_students : {}),
          profile_img: profileImgUrl,
        },
      };
    })
  );

  return NextResponse.json(ratingsWithImg);
}

export async function POST(req: Request) {
  const body = await req.json();
  const companyId = body.company_id;
  const posterId = body.poster_id;

  if (!companyId && !posterId) {
    return NextResponse.json({ success: false, error: "Missing company_id or poster_id" }, { status: 400 });
  }

  // Company rating
  let companyRating = null;
  if (companyId) {
    const { data, error } = await supabase
      .from("student_ratings")
      .select("company_rating")
      .eq("company_id", companyId);
    console.log("Company rating data:", data); // <-- log company rating data
    if (!error && Array.isArray(data) && data.length > 0) {
      const ratings = data.map(r => r.company_rating).filter(r => typeof r === "number");
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
      companyRating = {
        rating: avg ?? 0,
        count: ratings.length,
      };
    } else {
      companyRating = { rating: 0, count: 0 };
    }
  }

  // Poster rating
  let posterRating = null;
  if (posterId) {
    const { data, error } = await supabase
      .from("student_ratings")
      .select("recruiter_rating")
      .eq("employer_id", posterId);
    console.log("Poster rating data:", data); // <-- log poster rating data
    if (!error && Array.isArray(data) && data.length > 0) {
      const ratings = data.map(r => r.recruiter_rating).filter(r => typeof r === "number");
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
      posterRating = {
        rating: avg ?? 0,
        count: ratings.length,
      };
    } else {
      posterRating = { rating: 0, count: 0 };
    }
  }

  console.log("Returning ratings:", { company: companyRating, poster: posterRating }); // <-- log final result

  return NextResponse.json({
    company: companyRating,
    poster: posterRating,
  });
}
