/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("parsed_resumes")
    .select("*")
    .order("parsed_at", { ascending: false })
    .limit(1);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const row = data?.[0];
  if (!row) {
    return new Response(JSON.stringify(null), { status: 200 });
  }

  const skillsArr = typeof row.parsed_skills === "string"
    ? JSON.parse(row.parsed_skills)
    : row.parsed_skills;
  const experienceArr = typeof row.parsed_experience === "string"
    ? JSON.parse(row.parsed_experience)
    : row.parsed_experience;
  const certificatesArr = typeof row.parsed_certificates === "string"
    ? JSON.parse(row.parsed_certificates)
    : row.parsed_certificates;
  const educationsArr = typeof row.parsed_education === "string"
    ? JSON.parse(row.parsed_education)
    : row.parsed_education;
  const expertiseArr = row.parsed_expertise;

  const skills = Array.isArray(skillsArr)
    ? skillsArr.map((s: any) => typeof s === "string" ? s : s.name || "")
    : [];
  const experience = Array.isArray(experienceArr)
    ? experienceArr.map((e: any) => {
        if (typeof e === "string") return e;
        if (e.jobTitle && e.company) return `${e.jobTitle} — ${e.company}`;
        if (e.jobTitle) return e.jobTitle;
        if (e.company) return e.company;
        return JSON.stringify(e);
      })
    : [];
  const certificates = Array.isArray(certificatesArr)
    ? certificatesArr.map((c: any) => ({
        title: c.title || "",
        issuer: c.issuer || "",
        description: c.description || ""
      }))
    : [];
  const bio = row.summary || "";

  const educations = Array.isArray(educationsArr)
    ? educationsArr.map((e: any) => ({
        level: e.level || "",
        years: e.years || "",
        degree: e.degree || "",
        school: e.school || "",
        acronym: e.acronym || ""
      }))
    : [];
  const expertise = Array.isArray(expertiseArr)
    ? expertiseArr
        .map((e: any) => typeof e === "string" ? e : e.name)
        .filter((name: any) => typeof name === "string" && name.length > 0)
    : [];

  return new Response(
    JSON.stringify({ skills, experience, certificates, bio, educations, expertise }),
    { status: 200 }
  );
}
