import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

async function getSignedUrlIfNeeded(img: string | null | undefined, bucket: string): Promise<string | null> {
  if (!img) return null;
  if (/^https?:\/\//.test(img)) return img;
  const cleanPath = img.replace(/^\/+/, "");
  const { data: signed, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(cleanPath, 60 * 60);
  if (!error && signed?.signedUrl) {
    return signed.signedUrl;
  }
  return img;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  console.log("API public-profile: username param:", username);

  const { data: profile, error: profileError } = await supabase
    .from("student_profile")
    .select(
      "profile_img, cover_image, short_bio, contact_info, uploaded_resume_url, uploaded_cover_letter_url, username, student_id, introduction, career_goals, educations, skills, expertise, certs, portfolio"
    )
    .eq("username", username)
    .maybeSingle();

  console.log("API public-profile: student_profile result:", profile);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }
  if (!profile) {
    return NextResponse.json(null, { status: 404 });
  }

  let student = null;
  if (profile.student_id) {
    const { data } = await supabase
      .from("registered_students")
      .select("first_name, last_name, course, year, section, email")
      .eq("id", profile.student_id)
      .maybeSingle();
    student = data;
  }

  console.log("API public-profile: registered_students result:", student);

  const profile_img = await getSignedUrlIfNeeded(profile.profile_img, "user.avatars");
  const cover_image = await getSignedUrlIfNeeded(profile.cover_image, "user.covers");

  type ContactInfo = {
    email?: string | string[];
    phone?: string | string[];
    countryCode?: string;
    socials?: { key: string; url: string }[];
    [key: string]: unknown;
  };
  let contact_info: { email?: string[]; phone?: string[]; [key: string]: unknown } = {};
  if (profile.contact_info) {
    if (typeof profile.contact_info === "string") {
      try {
        const parsed: ContactInfo = JSON.parse(profile.contact_info);
        contact_info = {};
        if (parsed.email) {
          contact_info.email = Array.isArray(parsed.email)
            ? parsed.email
            : [parsed.email];
        }
        if (parsed.countryCode && parsed.phone) {
          contact_info.phone = [String(parsed.countryCode), String(parsed.phone)];
        } else if (parsed.phone) {
          contact_info.phone = [String(parsed.phone)];
        } else {
          contact_info.phone = [];
        }
        Object.keys(parsed).forEach((k) => {
          if (k !== "email" && k !== "phone" && k !== "countryCode") contact_info[k] = parsed[k];
        });
      } catch {
        contact_info = {};
      }
    } else {
      const parsed = profile.contact_info as ContactInfo;
      contact_info = {};
      if (parsed.email) {
        contact_info.email = Array.isArray(parsed.email)
          ? parsed.email
          : [parsed.email];
      }
      if (parsed.countryCode && parsed.phone) {
        contact_info.phone = [String(parsed.countryCode), String(parsed.phone)];
      } else if (parsed.phone) {
        contact_info.phone = [String(parsed.phone)];
      }
      Object.keys(parsed).forEach((k) => {
        if (k !== "email" && k !== "phone" && k !== "countryCode") contact_info[k] = parsed[k];
      });
    }
  }

  return NextResponse.json({
    first_name: student?.first_name ?? "",
    last_name: student?.last_name ?? "",
    course: student?.course ?? "",
    year: student?.year ?? "",
    section: student?.section ?? "",
    email: student?.email ?? "",
    profile_img,
    cover_image,
    short_bio: profile.short_bio ?? "",
    contact_info,
    uploaded_resume_url: profile.uploaded_resume_url ?? null,
    uploaded_cover_letter_url: profile.uploaded_cover_letter_url ?? null,
    username: profile.username,
    introduction: profile.introduction ?? "",
    career_goals: profile.career_goals ?? "",
    educations: profile.educations ?? [],
    skills: profile.skills ?? [],
    expertise: profile.expertise ?? [],
    certs: profile.certs ?? [],
    portfolio: profile.portfolio ?? [],
  });
}
