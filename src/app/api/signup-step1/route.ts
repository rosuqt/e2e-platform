import { NextRequest, NextResponse } from "next/server";
import pool from "../db"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { first_name, last_name, phone, email, password, country_code } =
      body;

    const query = `
      INSERT INTO personal_details
      (first_name, last_name, phone, email, password, country_code)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      first_name,
      last_name,
      phone,
      email,
      password,
      country_code,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json(
      { message: "Signup successful", data: result.rows[0] },
      { status: 201 },
    );
  } catch (error: unknown) { // Explicitly set the type of error
    console.error("Error in POST /personal-details:", error);

    // Type assertion to handle the error as an instance of Error
    if (error instanceof Error) {
      // Handle specific error codes like unique constraint violations
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

    // If the error is not an instance of Error, send a generic error response
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
