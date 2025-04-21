import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const companyId = url.searchParams.get('company_id');

  if (!companyId) {
    return NextResponse.json({ message: 'company_id is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('pending_newbranches')
      .select(`
        id AS branch_id,
        name AS branch_name,
        company_id,
        companies:company_id (company_name)
      `)
      .eq('company_id', companyId)
      .order('name');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching company branches:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
