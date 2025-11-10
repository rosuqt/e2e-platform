/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { authOptions } from "../../../../../../lib/authOptions";
import { getServerSession } from "next-auth/next";

export async function POST(req: NextRequest) {
  const { skills, experience, certificates, bio } = await req.json();

  const session = await getServerSession(authOptions);
  const student_id = session?.user?.studentId;

  if (!student_id) {
    return NextResponse.json({ success: false, error: "Unauthorized: No student_id" }, { status: 401 });
  }

  const supabase = getAdminSupabase();

  const { data: profile, error: fetchError } = await supabase
    .from("student_profile")
    .select("*")
    .eq("student_id", student_id)
    .single();

  if (fetchError || !profile) {
    return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
  }

  let existingSkills: string[] = [];
  if (profile.skills) {
    if (typeof profile.skills === "string") {
      try {
        existingSkills = JSON.parse(profile.skills);
      } catch {
        existingSkills = [];
      }
    } else if (Array.isArray(profile.skills)) {
      existingSkills = profile.skills;
    }
  }
  const newSkills = Array.from(new Set([...existingSkills, ...skills]));

  let existingCerts: any[] = [];
  if (profile.certs) {
    if (typeof profile.certs === "string") {
      try {
        existingCerts = JSON.parse(profile.certs);
      } catch {
        existingCerts = [];
      }
    } else if (Array.isArray(profile.certs)) {
      existingCerts = profile.certs;
    }
  }

  const mappedCerts = (certificates ?? []).map((cert: any) => ({
    title: cert.title ?? "",
    issuer: cert.issuer ?? "",
    category: cert.category ?? "Award",
    issueDate: cert.issueDate ?? "",
    description: cert.description ?? "",
    attachmentUrl: cert.attachmentUrl ?? "",
  }));

  const newCerts = [
    ...existingCerts,
    ...mappedCerts.filter((cert: any) => !existingCerts.some((e: any) => e.title === cert.title))
  ];

  let existingExpertise: any[] = [];
  if (profile.expertise) {
    if (typeof profile.expertise === "string") {
      try {
        existingExpertise = JSON.parse(profile.expertise);
      } catch {
        existingExpertise = [];
      }
    } else if (Array.isArray(profile.expertise)) {
      existingExpertise = profile.expertise;
    }
  }
  const newExpertise = [
    ...existingExpertise,
    ...experience
      .filter((exp: string) => !existingExpertise.some((e: any) => e.skill === exp))
      .map((exp: string) => ({ skill: exp, mastery: 100 }))
  ];

  const newCareerGoals = bio ?? profile.career_goals;

  const { error: updateError } = await supabase
    .from("student_profile")
    .update({
      skills: newSkills,
      certs: newCerts, 
      expertise: newExpertise,
      career_goals: newCareerGoals,
      updated_at: new Date().toISOString(),
    })
    .eq("student_id", student_id);

  if (updateError) {
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
