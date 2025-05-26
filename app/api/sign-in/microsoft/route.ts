import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  // NOTE: If you enabled the Supabase Azure provider, use Supabase's built-in OAuth flow.
  // This route is not needed for handling the OAuth callback.
  // Instead, use Supabase's signInWithOAuth({ provider: 'azure' }) on the frontend.
  // Post-login logic (like updating user roles or inserting into 'student') should be handled
  // via Supabase Auth hooks or Edge Functions for better security and reliability.

  // If you still want to use this route for post-login logic, ensure the user is already authenticated.
  // Example: get the user from Supabase session (via cookies or headers), not from access_token in query.

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/(landing)/sign-in?error=user`
    );
  }

  await supabase.auth.updateUser({
    data: { role: "student" }
  });

  const { data: student } = await supabase
    .from("student")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) {
    await supabase.from("student").insert({
      uuid: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
      user_id: user.id,
    });
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/students/dashboard`
  );
}

