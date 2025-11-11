/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { authOptions } from "../../../../../../lib/authOptions";
import { getServerSession } from "next-auth/next";

export async function POST(req: NextRequest) {
  const { skills, expertise = [], experience, certificates, bio, educations } = await req.json();

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
    ...expertise.filter((exp: any) =>
      !existingExpertise.some((e: any) => e.skill === exp.skill)
    )
  ];

  let existingExperiences: any[] = [];
  if (profile.experiences) {
    if (typeof profile.experiences === "string") {
      try {
        existingExperiences = JSON.parse(profile.experiences);
      } catch {
        existingExperiences = [];
      }
    } else if (Array.isArray(profile.experiences)) {
      existingExperiences = profile.experiences;
    }
  }
  const iconColors = [
    "#2563eb", "#10b981", "#f59e42", "#ef4444", "#a855f7", "#f43f5e", "#22d3ee", "#eab308", "#6366f1"
  ];
  function getRandomIconColor() {
    return iconColors[Math.floor(Math.random() * iconColors.length)];
  }
  const validExperienceObjects = (experience ?? []).filter(
    (exp: any) =>
      typeof exp === "object" &&
      exp !== null &&
      "jobTitle" in exp &&
      "company" in exp &&
      "years" in exp
  ).map((exp: any) => ({
    ...exp,
    iconColor: exp.iconColor ?? getRandomIconColor()
  }));
  const newExperiences = [
    ...existingExperiences,
    ...validExperienceObjects.filter((exp: any) =>
      !existingExperiences.some((e: any) =>
        e.jobTitle === exp.jobTitle &&
        e.company === exp.company &&
        e.years === exp.years
      )
    )
  ];

  let existingEducations: any[] = [];
  if (profile.educations) {
    if (typeof profile.educations === "string") {
      try {
        existingEducations = JSON.parse(profile.educations);
      } catch {
        existingEducations = [];
      }
    } else if (Array.isArray(profile.educations)) {
      existingEducations = profile.educations;
    }
  }
  const newEducations = [
    ...existingEducations,
    ...(educations ?? []).filter((edu: any) =>
      !existingEducations.some((e: any) =>
        e.school === edu.school &&
        e.degree === edu.degree &&
        e.level === edu.level
      )
    )
  ];

  const newCareerGoals = bio ?? profile.career_goals;

  const { error: updateError } = await supabase
    .from("student_profile")
    .update({
      skills: newSkills,
      certs: newCerts, 
      expertise: newExpertise,
      career_goals: newCareerGoals,
      experiences: newExperiences,
      educations: newEducations,
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
