import { NextResponse } from "next/server";
import client from "../db"; 
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const query = "SELECT id, email, password FROM registered_employers WHERE email = $1";
    const values = [email];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      console.log("User not found for email:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = result.rows[0];
    console.log("User found:", user);

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      console.log("Password mismatch for user:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    console.log("Sign-in successful for user:", email);
    return NextResponse.json({ message: "Sign-in successful", user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
