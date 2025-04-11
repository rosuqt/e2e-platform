import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/api/db';

export async function POST(req: NextRequest) {
    try {
      const { company_name, company_branch } = await req.json();
      console.log("Received data:", { company_name, company_branch });

      console.log('Received company branch:', company_branch);
  
      const branch = company_branch || "default-branch";
      console.log('Using company branch:', branch);
  
      const result = await pool.query(
        'INSERT INTO registered_company (company_name, company_branch) VALUES ($1, $2) RETURNING id, company_name, company_branch',
        [company_name, branch]
      );
  
      const newCompany = result.rows[0];
  
      return NextResponse.json(newCompany, { status: 200 });
    } catch (error) {
      console.error('Error creating company:', error);
      return NextResponse.json({ message: 'Error creating company.' }, { status: 500 });
    }
  }
  

export async function GET() {
  try {
    const result = await pool.query('SELECT id, company_name, company_branch FROM registered_company');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: 'Error fetching companies.' }, { status: 500 });
  }
}
