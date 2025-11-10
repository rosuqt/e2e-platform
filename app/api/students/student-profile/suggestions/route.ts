import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  console.log("API /student-profile/suggestions called");
  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get("student_id");
  if (!student_id) {
    return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
  }

  const supabase = getAdminSupabase();

 const { data: resumes, error: resumeError } = await supabase
  .from("parsed_resumes")
  .select("parsed_skills, parsed_experience, parsed_certificates, summary")
  .eq("student_id", student_id)
  .order("parsed_at", { ascending: false })
  .limit(1);

const resume = resumes && resumes.length > 0 ? resumes[0] : null;
console.log("Resume:", resume);

  const { data: profile, error: profileError } = await supabase
    .from("student_profile")
    .select("skills, certs, expertise, introduction, short_bio")
    .eq("student_id", student_id)
    .single();
      console.log("Profile:", profile);

  if (resumeError || !resume || profileError || !profile) {
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }


  const profileSkills = Array.isArray(profile.skills) ? profile.skills.map(s => typeof s === "string" ? s.toLowerCase() : "") : [];
  const aiSkills = Array.isArray(resume.parsed_skills) ? resume.parsed_skills.map(s => s.name.toLowerCase()) : [];
  const skills = aiSkills.filter(s => !profileSkills.includes(s));

  const profileCerts = Array.isArray(profile.certs) ? profile.certs.map(c => typeof c.title === "string" ? c.title.toLowerCase() : "") : [];
  const aiCerts = Array.isArray(resume.parsed_certificates) ? resume.parsed_certificates.map(c => c.name.toLowerCase()) : [];
  const certificates = aiCerts.filter(c => !profileCerts.includes(c));

  const profileExp = Array.isArray(profile.expertise) ? profile.expertise.map(e => typeof e.skill === "string" ? e.skill.toLowerCase() : "") : [];
  const aiExp = Array.isArray(resume.parsed_experience) ? resume.parsed_experience.map(e => `${e.company} ${e.role}`.toLowerCase()) : [];
  const experience = aiExp.filter(e => !profileExp.includes(e));

  const bio = resume.summary ?? "";
  const intro = profile.introduction ?? "";
  const short_bio = profile.short_bio ?? "";
  const showBio = bio && bio !== intro && bio !== short_bio ? bio : "";

  console.log({
    skills,
    experience,
    certificates,
    bio: showBio
  });

  return NextResponse.json({
    suggestions: {
      skills,
      experience,
      certificates,
      bio: showBio
    }
  });

}