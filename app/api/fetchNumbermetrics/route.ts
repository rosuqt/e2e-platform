/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getAdminSupabase();

  // Count companies by verify_status
  const { data: companies, error: companiesError } = await supabase
    .from('registered_companies')
    .select('verify_status', { count: 'exact', head: false });

  if (companiesError) {
    return NextResponse.json({ error: companiesError.message }, { status: 500 });
  }

  const verifyStatusCounts: Record<string, number> = {};
  companies?.forEach((c: any) => {
    const status = c.verify_status || 'unknown';
    verifyStatusCounts[status] = (verifyStatusCounts[status] || 0) + 1;
  });

  // Count registered students
  const { count: studentCount, error: studentsError } = await supabase
    .from('registered_students')
    .select('*', { count: 'exact', head: true });

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 });
  }

  // Count hired applications
  const { count: hiredCount, error: hiredError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'hired');

  if (hiredError) {
    return NextResponse.json({ error: hiredError.message }, { status: 500 });
  }

  return NextResponse.json({
    companyVerifyStatus: verifyStatusCounts,
    registeredStudents: studentCount || 0,
    hiredCount: hiredCount || 0,
  });
}
