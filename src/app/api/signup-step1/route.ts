import { NextRequest, NextResponse } from "next/server";
import pool from "../db";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { step, first_name, last_name, phone, email, password, country_code, company_name, company_branch, company_role, job_title, company_email, signature, terms_accepted } = body;

    const branchName = typeof company_branch === "string" ? company_branch : "test";

    if (step === 1) {
      // Hash the password before inserting into pending_employers
      const hashedPassword = await bcrypt.hash(password, 10);

      const emailCheckQuery = `
        SELECT email FROM registered_employers WHERE email = $1
      `;
      const emailCheckResult = await pool.query(emailCheckQuery, [email]);

      if (emailCheckResult?.rowCount && emailCheckResult.rowCount > 0) {
        return NextResponse.json(
          { message: "User with this email is already registered!" },
          { status: 400 }
        );
      }

      const pendingEmailCheckQuery = `
        SELECT email FROM pending_employers WHERE email = $1
      `;
      const pendingEmailCheckResult = await pool.query(pendingEmailCheckQuery, [email]);

      if (pendingEmailCheckResult?.rowCount && pendingEmailCheckResult.rowCount > 0) {
        return NextResponse.json(
          { message: "User with this email is already pending approval!", type: "pending" },
          { status: 409 }
        );
      }

      const query = `
        INSERT INTO pending_employers
        (first_name, last_name, phone, email, password, country_code)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const values = [
        first_name,
        last_name,
        phone,
        email,
        hashedPassword,
        country_code,
      ];

      const result = await pool.query(query, values);
      return NextResponse.json(
        { message: "Step 1 complete", data: result.rows[0] },
        { status: 201 }
      );
    }

    if (step === 2) {
      const query = `
        UPDATE pending_employers
        SET company_name = $1, company_branch = $2, company_role = $3, job_title = $4, company_email = $5
        WHERE email = $6
        RETURNING *
      `;

      const values = [
        company_name,
        branchName,
        company_role,
        job_title,
        company_email,
        email
      ];

      const result = await pool.query(query, values);
      return NextResponse.json(
        { message: "Step 2 complete", data: result.rows[0] },
        { status: 200 }
      );
    }

    if (step === 3) {
      const query = `
        UPDATE pending_employers
        SET signature = $1, terms_accepted = $2
        WHERE email = $3
        RETURNING *
      `;

      const values = [signature, terms_accepted, email];

      const result = await pool.query(query, values);
      return NextResponse.json(
        { message: "Step 3 complete", data: result.rows[0] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid step" },
      { status: 400 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("duplicate key value")) {
        return NextResponse.json(
          { message: "User with this email already exists!" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Something went wrong", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error occurred", error },
      { status: 500 }
    );
  }
}