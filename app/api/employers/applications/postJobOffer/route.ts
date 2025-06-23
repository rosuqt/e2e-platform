import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      salary,
      start_date,
      notes,
      application_id,
      student_id,
      employer_id,
      company_name,
      applicant_name,
      job_title,
      salary_type,
      work_setup,
      employment_type,
      work_location,
      work_schedule,
      bonuses,
      allowances, 
      benefits,
      offer_expiry,
      offer_date,
      custom_message,
      contract_file_url
    } = body;

    const { data, error } = await supabase.from('job_offers').insert([
      {
        salary,
        start_date,
        notes,
        application_id,
        student_id,
        employer_id,
        company_name,
        applicant_name,
        job_title,
        salary_type,
        work_setup,
        employment_type,
        work_location,
        work_schedule,
        bonuses,
        allowances, 
        benefits,
        offer_expiry,
        offer_date,
        custom_message,
        contract_file_url
      }
    ]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
