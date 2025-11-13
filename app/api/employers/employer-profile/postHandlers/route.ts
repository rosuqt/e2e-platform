import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  employerId?: string
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser | undefined
  if (!user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { employerID, about, hiring_philosophy, contact_info, availability, short_bio } = await req.json()
  const employerId = employerID
  if (!employerId) {
    return NextResponse.json({ error: "Missing employerID" }, { status: 400 })
  }
  const supabase = getAdminSupabase()
  const data: { employer_id: string; about?: string; hiring_philosophy?: string; contact_info?: Record<string, unknown>; availability?: Record<string, unknown>; short_bio?: string } = { employer_id: employerId }
  if (about !== undefined) data.about = about
  if (hiring_philosophy !== undefined) data.hiring_philosophy = hiring_philosophy
  if (availability !== undefined) data.availability = availability
  if (short_bio !== undefined) data.short_bio = short_bio

  let contactInfoToSave = contact_info;
  if (contact_info && typeof contact_info === "object" && "website" in contact_info) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { website, ...rest } = contact_info;
    contactInfoToSave = rest;
  }
  if (contact_info !== undefined) data.contact_info = contactInfoToSave

  if (contact_info?.website) {
    let companyId = contact_info.company_id;
    if (!companyId) {
      const { data: employerProfile } = await supabase
        .from("registered_employers")
        .select("company_id")
        .eq("id", employerId)
        .single();
      companyId = employerProfile?.company_id;
    }
    if (!companyId) {
      return NextResponse.json({ error: "Missing company_id for website update" }, { status: 400 })
    }
    const { error: companyError } = await supabase
      .from("registered_companies")
      .update({ company_website: contact_info.website })
      .eq("id", companyId)
    if (companyError) {
      return NextResponse.json({ error: companyError.message }, { status: 500 })
    }
  }

  if (
    contact_info &&
    (
      contact_info.phone !== undefined ||
      contact_info.countryCode !== undefined
    )
  ) {
    const updateFields: {phone?: string; country_code?: string } = {};
    if (contact_info.phone !== undefined) updateFields.phone = contact_info.phone;
    if (contact_info.countryCode !== undefined) updateFields.country_code = contact_info.countryCode;
    if (Object.keys(updateFields).length > 0) {
      const { error: empError } = await supabase
        .from("registered_employers")
        .update(updateFields)
        .eq("id", employerId);
      if (empError) {
        return NextResponse.json({ error: empError.message }, { status: 500 })
      }
    }
  }

  const { error } = await supabase
    .from("employer_profile")
    .upsert([data], { onConflict: "employer_id" })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
