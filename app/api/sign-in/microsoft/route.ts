import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {

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

