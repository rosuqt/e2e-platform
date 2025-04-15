import { NextRequest, NextResponse } from 'next/server';
import pool from '../db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, terms_accepted } = body;

    if (!email || typeof terms_accepted !== 'boolean') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const updateRes = await pool.query(
      'UPDATE pending_employers SET terms_accepted = $1 WHERE email = $2 RETURNING *',
      [terms_accepted, email]
    );

    if (updateRes.rowCount === 0) {
      return NextResponse.json({ error: 'Pending employer not found' }, { status: 404 });
    }

    const updatedEmployer = updateRes.rows[0];
    const hashedPassword = await bcrypt.hash(updatedEmployer.password, 10);
    updatedEmployer.password = hashedPassword;

    const columns = Object.keys(updatedEmployer);
    const values = Object.values(updatedEmployer);

    const insertQuery = `
      INSERT INTO registered_employers (${columns.join(',')})
      VALUES (${columns.map((_, i) => `$${i + 1}`).join(',')})
    `;
    await pool.query(insertQuery, values);

    await pool.query('DELETE FROM pending_employers WHERE email = $1', [email]);

    return NextResponse.json({ message: 'Employer registered successfully' }, { status: 200 });
  } catch (err: unknown) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
