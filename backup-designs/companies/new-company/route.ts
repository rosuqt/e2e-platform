import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { company_name, company_branch, email_domain, company_website, company_size, company_industry } = await req.json();
    const normalizedCompanyName = company_name.trim().toLowerCase();
    const branch = company_branch || "default-branch";

    const { data: existingPending, error: pendingError } = await supabase
      .from('pending_newcompanies')
      .select('*')
      .eq('company_name', normalizedCompanyName);

    if (pendingError) {
      console.error("Error checking pending companies:", pendingError);
      return NextResponse.json({ message: "Error checking pending companies" }, { status: 500 });
    }

    if (existingPending && existingPending.length > 0) {
      return NextResponse.json(
        { message: 'A company with this name is already pending.' },
        { status: 409 }
      );
    }

    const { data: existingRegistered, error: registeredError } = await supabase
      .from('registered_companies')
      .select('*')
      .eq('company_name', normalizedCompanyName);

    if (registeredError) {
      console.error("Error checking registered companies:", registeredError);
      return NextResponse.json({ message: "Error checking registered companies" }, { status: 500 });
    }

    if (existingRegistered && existingRegistered.length > 0) {
      return NextResponse.json(
        { message: 'A company with this name already exists.' },
        { status: 409 }
      );
    }

    const { data: newCompany, error: insertError } = await supabase
      .from('pending_newcompanies')
      .insert({
        company_name: normalizedCompanyName,
        company_branch: branch,
        email_domain,
        company_website,
        company_size,
        company_industry,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    await supabase
      .from('pending_newbranches')
      .update({ is_main_branch: false })
      .eq('company_id', newCompany.id);

    const { data: newMainBranch, error: branchError } = await supabase
      .from('pending_newbranches')
      .insert({
        company_id: newCompany.id,
        name: branch,
        is_main_branch: true,
      })
      .select()
      .single();

    if (branchError) {
      throw branchError;
    }

    return NextResponse.json(
      { company: newCompany, mainBranch: newMainBranch },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { message: 'Error creating company.' },
      { status: 500 }
    );
  }
}