//Tempo to simulate matching skills

export const courseExpertise: Record<string, string[]> = {
  "BSIT - Bachelor of Science in Information Technology": [
    "Programming",
    "Web Development",
    "Database Management",
    "Networking",
    "Cybersecurity",
    "System Analysis",
    "Cloud Computing",
    "UI/UX Design",
    "Project Management",
    "Technical Support",
  ],
  "BSBA - Bachelor of Science in Business Administration": [
    "Accounting",
    "Marketing",
    "Finance",
    "Business Analysis",
    "Entrepreneurship",
    "Human Resources",
    "Management",
    "Sales",
    "Strategic Planning",
    "Communication",
  ],
  "BSHM - Bachelor of Science in Hospitality Management": [
    "Customer Service",
    "Event Planning",
    "Food and Beverage Management",
    "Front Office Operations",
    "Housekeeping",
    "Tourism",
    "Hotel Management",
    "Culinary Skills",
    "Sales and Marketing",
    "Leadership",
  ],
  "BSTM - Bachelor of Science in Tourism Management": [
    "Tour Planning",
    "Travel Consultancy",
    "Event Management",
    "Tour Guiding",
    "Marketing",
    "Customer Relations",
    "Destination Management",
    "Cultural Awareness",
    "Communication",
    "Sales",
  ],
};

export const courseSkills: Record<string, string[]> = {
  "BSIT - Bachelor of Science in Information Technology": [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Adaptability",
    "Critical Thinking",
    "Time Management",
    "Creativity",
    "Attention to Detail",
    "Collaboration",
    "Work Ethic",
  ],
  "BSBA - Bachelor of Science in Business Administration": [
    "Leadership",
    "Communication",
    "Teamwork",
    "Negotiation",
    "Adaptability",
    "Problem Solving",
    "Time Management",
    "Decision Making",
    "Emotional Intelligence",
    "Work Ethic",
  ],
  "BSHM - Bachelor of Science in Hospitality Management": [
    "Customer Service",
    "Communication",
    "Teamwork",
    "Adaptability",
    "Problem Solving",
    "Attention to Detail",
    "Multitasking",
    "Empathy",
    "Work Ethic",
    "Conflict Resolution",
  ],
  "BSTM - Bachelor of Science in Tourism Management": [
    "Communication",
    "Customer Service",
    "Teamwork",
    "Adaptability",
    "Problem Solving",
    "Cultural Sensitivity",
    "Organization",
    "Flexibility",
    "Work Ethic",
    "Interpersonal Skills",
  ],
};

/**
 * @param courseKey 
 * @param count 
 */
export function getRandomSkillsForCourse(courseKey: string, count = 5): string[] {
  const allSkills = [
    ...(courseExpertise[courseKey] || []),
    ...(courseSkills[courseKey] || [])
  ];
  const uniqueSkills = Array.from(new Set(allSkills));
  for (let i = uniqueSkills.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueSkills[i], uniqueSkills[j]] = [uniqueSkills[j], uniqueSkills[i]];
  }
  return uniqueSkills.slice(0, count);
}


