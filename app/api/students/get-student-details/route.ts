import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";

async function getStudentIdAndRoleFromSession(req: NextRequest): Promise<{ studentId: string | null, role: string | null }> {
  const session = await getServerSession({ req, ...authOptions });
  const studentId = session?.user && typeof session.user === "object"
    ? (session.user as Record<string, unknown>)["studentId"] as string ?? null
    : null;
  const role = session?.user && typeof session.user === "object"
    ? (session.user as Record<string, unknown>)["role"] as string ?? null
    : null;
  return { studentId, role };
}

async function getStudentDetails(student_id: string) {
  try {
    const { data: student, error: studentError } = await supabase
      .from("registered_students")
      .select("id, first_name, last_name, course, year, section, email")
      .eq("id", student_id)
      .single();

    if (studentError || !student) {
      console.log("No student found for id:", student_id)
      return null;
    }

    const { data: profile } = await supabase
      .from("student_profile")
      .select("profile_img, cover_image, short_bio, contact_info, uploaded_resume_url, uploaded_cover_letter_url")
      .eq("student_id", student_id)
      .single();

    if (!profile) {
      console.log("No profile found for student_id:", student_id)
    }

    let signedProfileImgUrl: string | null = null;
    let signedCoverImgUrl: string | null = null;

    if (profile?.profile_img) {
      const cleanProfileImg = profile.profile_img.replace(/^\/+/, "");
      const { data: signed, error: signedErr } = await supabase.storage
        .from("user.avatars")
        .createSignedUrl(cleanProfileImg, 60 * 60);
      if (!signedErr && signed?.signedUrl) {
        signedProfileImgUrl = signed.signedUrl;
      } else {
        signedProfileImgUrl = profile.profile_img;
      }
    }
    if (profile?.cover_image) {
      const cleanCoverImg = profile.cover_image.replace(/^\/+/, "");
      const { data: signed, error: signedErr } = await supabase.storage
        .from("user.covers")
        .createSignedUrl(cleanCoverImg, 60 * 60);
      if (!signedErr && signed?.signedUrl) {
        signedCoverImgUrl = signed.signedUrl;
      } else {
        signedCoverImgUrl = profile.cover_image;
      }
    }

    type ContactInfo = {
      email?: string | string[];
      phone?: string | string[];
      countryCode?: string;
      socials?: { key: string; url: string }[];
      [key: string]: unknown;
    };
    let contact_info: { email?: string[]; phone?: string[]; [key: string]: unknown } = {};
    if (profile?.contact_info) {
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

    return {
      ...student,
      profile_img: signedProfileImgUrl,
      cover_image: signedCoverImgUrl,
      short_bio: profile?.short_bio ?? "",
      contact_info,
      uploaded_resume_url: profile?.uploaded_resume_url ?? null,
      uploaded_cover_letter_url: profile?.uploaded_cover_letter_url ?? null,
    };
  } catch (err) {
    console.log("Error in getStudentDetails:", err)
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { studentId, role } = await getStudentIdAndRoleFromSession(req);
  if (!studentId || role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const details = await getStudentDetails(studentId);
  if (!details) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  return NextResponse.json(details);
}
