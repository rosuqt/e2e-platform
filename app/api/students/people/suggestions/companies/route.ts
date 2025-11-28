import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../lib/authOptions';

const courseIndustryMap: Record<string, string[]> = {
  'BS - Information Technology': [
    'Technology', 'Software', 'IT Services', 'Telecommunications', 'Cybersecurity',
    'Networking', 'E-commerce', 'Data', 'Cloud', 'Gaming'
  ],
  'BS - Hospitality Management': [
    'Hospitality', 'Hotel', 'Restaurant', 'Catering', 'Tourism', 'Travel',
    'Events', 'Foodservice', 'Cruise', 'Airline'
  ],
  'BS - Tourism': [
    'Tourism', 'Travel', 'Airline', 'Cruise', 'Hospitality', 'Resort',
    'Recreation', 'Transportation', 'Marketing', 'Events'
  ],
  'BS - Business Adminstration': [
    'Business', 'Finance', 'Marketing', 'Banking', 'Retail', 'Management',
    'Accounting', 'Sales', 'Real Estate', 'Logistics'
  ]
};

async function getCompanyCoverUrl(companyId: string): Promise<string | null> {
  const { data: profile, error } = await supabase
    .from('company_profile')
    .select('cover_img')
    .eq('company_id', companyId)
    .single();
  if (error || !profile?.cover_img) return null;
  const { data, error: urlError } = await supabase.storage
    .from('company.images')
    .createSignedUrl(profile.cover_img, 60 * 10);
  if (urlError || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function GET(req: NextRequest) {
  const url = req.url || ""
  const limitMatch = url.match(/limit=(\d+)/)
  let limit = 24
  if (limitMatch) {
    limit = parseInt(limitMatch[1], 10)
  }

  const session = await getServerSession(authOptions);
  const studentId = session?.user?.studentId;
  if (!studentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: student, error: studentError } = await supabase
    .from('registered_students')
    .select('course')
    .eq('id', studentId)
    .single();

  if (studentError || !student) {
    console.error('Student fetch error:', studentError);
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
  const course = student.course;
  const industries = courseIndustryMap[course];
  if (!industries) {
    return NextResponse.json({ error: 'Course not supported' }, { status: 400 });
  }

  const industriesLower = industries.map(i => i.toLowerCase());

  const { data: matchedCompanies, error: matchError } = await supabase
    .from('registered_companies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (matchError) {
    console.error('Company fetch error:', matchError);
    return NextResponse.json({ error: 'Error fetching companies' }, { status: 500 });
  }

  if (!Array.isArray(matchedCompanies)) {
    console.error('Supabase returned non-array data for companies');
    return NextResponse.json({ error: 'Unexpected data format from database' }, { status: 500 });
  }

  const matched = matchedCompanies.filter(c =>
    c.company_industry && industriesLower.includes(String(c.company_industry).toLowerCase())
  );
  const matchedIds = new Set(matched.map(c => c.id));
  const remaining = matchedCompanies.filter(c =>
    !matchedIds.has(c.id)
  );

  const getLogoUrl = (path: string | null) =>
    path
      ? `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/company.logo/${path}`
      : null;

  const allCompanies = [...matched, ...remaining];
  const companies = await Promise.all(
    allCompanies.map(async company => {
      const coverUrl = await getCompanyCoverUrl(company.id);
      return {
        ...company,
        logoUrl: getLogoUrl(company.company_logo_image_path),
        coverUrl,
      };
    })
  );

  return NextResponse.json({ companies });
}
