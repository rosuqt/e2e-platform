export function calculateSkillsMatch(studentSkills: string[], jobSkills: string[]): number {
  if (!Array.isArray(studentSkills) || !Array.isArray(jobSkills) || jobSkills.length === 0) return 0;
  const normalizedStudentSkills = studentSkills.map(s => s.trim().toLowerCase());
  const normalizedJobSkills = jobSkills.map(s => s.trim().toLowerCase());
  const matched = normalizedJobSkills.filter(skill => normalizedStudentSkills.includes(skill));
  return Math.round((matched.length / normalizedJobSkills.length) * 100);
}
