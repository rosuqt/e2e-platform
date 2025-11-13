export function calculateSkillsMatch(studentSkills: string[], jobSkills: string[]): number {
  if (!Array.isArray(studentSkills) || !Array.isArray(jobSkills) || jobSkills.length === 0) return 10;
  const normalizedStudentSkills = studentSkills.map(s => s.trim().toLowerCase());
  const normalizedJobSkills = jobSkills.map(s => s.trim().toLowerCase());
  const matched = normalizedJobSkills.filter(skill => normalizedStudentSkills.includes(skill));
  const percent = Math.round((matched.length / normalizedJobSkills.length) * 100);
  return Math.min(100, percent + 10);
}
