import { NextResponse } from 'next/server';
import pool from '../db.js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const companyId = url.searchParams.get('company_id');
  
  if (!companyId) {
    return NextResponse.json({ message: 'company_id is required' }, { status: 400 });
  }

  try {
    const result = await pool.query(`
      SELECT 
        cb.id AS branch_id,
        cb.name AS branch_name,
        c.id AS company_id,
        c.company_name AS company_name
      FROM pending_newbranches cb
      JOIN pending_newcompanies c ON cb.company_id = c.id
      WHERE cb.company_id = $1
      ORDER BY c.company_name, cb.name;
    `, [companyId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching company branches:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
