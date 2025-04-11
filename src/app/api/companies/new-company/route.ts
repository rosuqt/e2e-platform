import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/api/db';

export async function POST(req: NextRequest) {
  try {

    const { company_name, company_branch, email_domain, company_website, company_size, company_industry } = await req.json();
    console.log("Received data:", { company_name, company_branch, email_domain, company_website, company_size, company_industry });
    console.log("Received company_industry:", company_industry);

    const normalizedCompanyName = company_name.trim().toLowerCase();
    const branch = company_branch || "default-branch";
    console.log('Using company branch:', branch);

    const existingPending = await pool.query(
      'SELECT * FROM pending_newcompanies WHERE LOWER(company_name) = $1',
      [normalizedCompanyName]
    );

    if (existingPending.rows.length > 0) {
      return NextResponse.json(
        { message: 'A company with this name is already pending.' },
        { status: 409 }
      );
    }

    const existingRegistered = await pool.query(
      'SELECT * FROM registered_companies WHERE LOWER(company_name) = $1',
      [normalizedCompanyName]
    );

    if (existingRegistered.rows.length > 0) {
      return NextResponse.json(
        { message: 'A company with this name already exists.' },
        { status: 409 }
      );
    }

    const result = await pool.query(
      'INSERT INTO pending_newcompanies (company_name, company_branch, email_domain, company_website, company_size, company_industry) ' +
      'VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, company_name, company_branch, email_domain, company_website, company_size, company_industry',
      [normalizedCompanyName, branch, email_domain, company_website, company_size, company_industry]
    );

    const newCompany = result.rows[0];

    await pool.query(
      'UPDATE pending_newbranches SET is_main_branch = FALSE WHERE company_id = $1',
      [newCompany.id]
    );

    const mainBranchResult = await pool.query(
      'INSERT INTO pending_newbranches (company_id, name, is_main_branch) VALUES ($1, $2, TRUE) RETURNING id, company_id, name, is_main_branch',
      [newCompany.id, branch]
    );

    const newMainBranch = mainBranchResult.rows[0];

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
