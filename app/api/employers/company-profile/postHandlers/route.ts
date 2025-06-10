export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies as nextCookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = nextCookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const company_id = body.company_id as string | undefined;
  const company_size = body.company_size as string | undefined;
  const action = body.action as string | undefined;

  if (!company_id || !action) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (action === "update_company_size_registered_companies") {
    const { error } = await supabase
      .from("registered_companies")
      .update({ company_size })
      .eq("id", company_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  async function ensureCompanyProfileExists(company_id: string) {
    const { data } = await supabase
      .from("company_profile")
      .select("company_id")
      .eq("company_id", company_id)
      .single();
    if (!data) {
      const { error: insertError } = await supabase
        .from("company_profile")
        .insert({ company_id });
      if (insertError) {
        return insertError;
      }
    }
    return null;
  }

  if (action === "update_mission_vision") {
    const mission = body.mission as string | undefined;
    const vision = body.vision as string | undefined;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ mission, vision })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_core_values") {
    const core_values = body.core_values;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ core_values })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_founded") {
    const founded = body.founded as string | undefined;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ founded })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_about") {
    const about = body.about as string | undefined;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ about })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_goals") {
    const goals = body.goals;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ goals })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_hq_bio") {
    const hq_bio = body.hq_bio as string | undefined;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ hq_bio })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_achievements") {
    const achievements = body.achievements;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }

    if (Array.isArray(achievements)) {
      const seen = new Set();
      for (const a of achievements) {
        if (!a) continue;
        const key = [a.title?.toLowerCase().trim(), a.issuer?.toLowerCase().trim(), a.year?.toString().trim()].join("|");
        if (seen.has(key)) {
          return NextResponse.json({ error: "Achievement already exists." }, { status: 400 });
        }
        seen.add(key);
      }
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ achievements })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_founders") {
    const founders = body.founders;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ founders })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_business_hours") {
    const business_hours = body.business_hours;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ business_hours })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "update_slogan") {
    const slogan = body.slogan as string | undefined;
    const ensureError = await ensureCompanyProfileExists(company_id);
    if (ensureError) {
      return NextResponse.json({ error: ensureError.message }, { status: 500 });
    }
    const { error } = await supabase
      .from("company_profile")
      .update({ slogan })
      .eq("company_id", company_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
