import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/api/db';

export async function POST(req: NextRequest) {
  try {
    const { company_name } = await req.json();

    const result = await pool.query(
      'INSERT INTO registered_company (company_name) VALUES ($1) RETURNING id, company_name',
      [company_name]
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
    const result = await pool.query('SELECT id, company_name FROM registered_company');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: 'Error fetching companies.' }, { status: 500 });
  }
}
