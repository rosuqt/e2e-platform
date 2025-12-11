/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getAdminSupabase();

  const { data: companies, error } = await supabase
    .from('registered_companies')
    .select('*')
    .eq('verify_status', 'full');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bucket = 'company.logo';

  // Fetch all ratings for these companies
  const companyIds = (companies ?? []).map((c) => c.id);
  let ratingsData: any[] = [];
  if (companyIds.length > 0) {
    const { data: ratings, error: ratingsError } = await supabase
      .from('student_ratings')
      .select('company_id, company_rating')
      .in('company_id', companyIds);

    if (!ratingsError && Array.isArray(ratings)) {
      ratingsData = ratings;
    }
  }

  const ratingStats: Record<string, { sum: number; count: number }> = {};
  ratingsData.forEach((row) => {
    if (row.company_id && row.company_rating != null) {
      if (!ratingStats[row.company_id]) {
        ratingStats[row.company_id] = { sum: 0, count: 0 };
      }
      ratingStats[row.company_id].sum += row.company_rating;
      ratingStats[row.company_id].count += 1;
    }
  });

  const avgRatings: Record<string, number | null> = {};
  Object.keys(ratingStats).forEach((companyId) => {
    const { sum, count } = ratingStats[companyId];
    avgRatings[companyId] = count > 0 ? sum / count : null;
  });

  const companiesWithLogo = await Promise.all(
    (companies ?? []).map(async (company) => {
      let logo_url = null;
      if (company.company_logo_image_path) {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(company.company_logo_image_path);
        logo_url = data?.publicUrl || null;
      }
      const avg_company_rating = avgRatings[company.id] ?? null;
      return { ...company, logo_url, avg_company_rating };
    })
  );

  return NextResponse.json(companiesWithLogo);
}
