import { NextResponse } from 'next/server';
import pool from '../db.js';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        company_name, 
        main_branch, 
        company_logo, 
        company_type
      FROM registered_company
      ORDER BY company_name
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
