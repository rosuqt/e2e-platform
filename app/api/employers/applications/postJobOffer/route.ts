/* eslint-disable @typescript-eslint/no-explicit-any */
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
      contract_file_url,
      id
    } = body;

    const offer: Record<string, any> = {
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
    };
    if (id) {
      offer.id = id;
    }

    const { error } = await supabase.from('job_offers').upsert([offer], { onConflict: 'id' }).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
