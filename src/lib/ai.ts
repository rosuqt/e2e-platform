import { togetherTextGeneration } from './together';

function onlyText(v: unknown): string {
  if (!v) return '';
  if (Array.isArray(v)) return v.filter(Boolean).join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export function buildJobText(job: {
  job_title?: string;
  job_summary?: string | null;
  job_description?: string | null;
  must_have_qualifications?: string[] | null;
  nice_to_have_qualifications?: string[] | null;
  responsibilities?: string | null;
}) {
  return [
    onlyText(job.job_title),
    onlyText(job.job_summary),
    onlyText(job.job_description),
    `Must-have: ${onlyText(job.must_have_qualifications)}`,
    `Nice-to-have: ${onlyText(job.nice_to_have_qualifications)}`,
    `Responsibilities: ${onlyText(job.responsibilities)}`
  ].filter(Boolean).join('\n');
}

export function buildStudentText(sp: {
  introduction?: unknown; career_goals?: unknown; short_bio?: unknown;
  educations?: unknown; skills?: unknown; expertise?: unknown; certs?: unknown; portfolio?: unknown;
}) {
  return [
    `Intro: ${onlyText(sp.introduction)}`,
    `Goals: ${onlyText(sp.career_goals)}`,
    `Bio: ${onlyText(sp.short_bio)}`,
    `Educations: ${onlyText(sp.educations)}`,
    `Skills: ${onlyText(sp.skills)}`,
    `Expertise: ${onlyText(sp.expertise)}`,
    `Certs: ${onlyText(sp.certs)}`,
    `Portfolio: ${onlyText(sp.portfolio)}`
  ].join('\n');
}

export async function extractSkillsFromJob(jobText: string): Promise<string[]> {
  const prompt = `
You are extracting skills and expertise from job descriptions.

Task:
From the text below, extract a concise list containing both:
1. Hard skills — specific technical abilities, tools, programming languages, or methods.
2. Soft skills — interpersonal skills, work habits, and personal attributes.

Rules:
- Use the following lists of skills and expertise as your main reference:
Soft skills: Communication, Active Listening, Public Speaking, Negotiation, Giving Feedback, Receiving Feedback, Persuasion, Interpersonal Skills, Teamwork, Collaboration, Mentoring, Delegation, Networking, Cultural Awareness, Leadership, Decision Making, Initiative, Accountability, Responsibility, Goal Setting, Time Management, Organization, Self-Motivation, Self-Discipline, Dependability, Work Ethic, Learning Agility, Problem-Solving, Critical Thinking, Resourcefulness, Creativity, Adaptability, Flexibility, Open-Mindedness, Positive Attitude, Emotional Intelligence, Empathy, Patience, Stress Management, Conflict Resolution
Expertise: JavaScript, Python, Java, SQL, React, Node.js, PHP, Git & GitHub, Cybersecurity Basics, Mobile App Development, Networking Fundamentals, Linux CLI, Software Testing, UI/UX Design, Cloud Computing (e.g., AWS, Azure), Database Management, Agile Methodologies, Tour Guiding Techniques, Travel Booking Systems (e.g., Amadeus, Galileo), Itinerary Planning, Cultural Tourism, Tourism Law & Ethics, Event Planning, Ecotourism Practices, Foreign Language Skills, Airline Operations, Customer Service in Tourism, Front Office Operations, Bartending & Mixology, Culinary Arts, Food & Beverage Services, Housekeeping Operations, Hospitality Software (e.g., Opera PMS), Guest Relations, Event Coordination, Hospitality Law, Health & Safety Compliance, Financial Accounting, Business Analytics (Excel, Power BI), Marketing Strategy, Project Management, E-commerce Operations, Sales Techniques, Human Resource Management, Entrepreneurship, Strategic Management, Customer Relationship Management (CRM Tools)
- Prioritize matching as many skills/expertise as possible from these lists.
- You may add a few unique skills/expertise not present in the lists if relevant.
- Return ONLY a flat JSON array of 1–2 word strings.
- Total generated skills must be minimum of 15 skills in total. IMPORTANT!
- Soft skills must be at least 50% of the list.
- Do NOT include responsibilities, requirements, or sentences.
- Do NOT output explanations, code, variable names, or labels.

Job text:
"""${jobText}"""
`;

  const out = await togetherTextGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    prompt,
    max_tokens: 200,
    temperature: 0.2,
  });

  const raw = out.choices?.[0]?.text ?? '';
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as unknown[];
      const arr: string[] = parsed.map(s => String(s).trim()).filter(Boolean);
      return [...new Set(arr)];
    } catch {}
  }
  return [...new Set(String(raw).split(',').map(s => s.trim()))].filter(Boolean);
}

export async function extractSkillsRaw(prompt: string) {
  const out = await togetherTextGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    prompt,
    max_tokens: 200,
    temperature: 0.2,
  });

  return out.choices?.[0]?.text ?? '';
}

export async function getSkillDetails(skill: string): Promise<{
  description: string;
  course: string;
  resource_titles: string[];
  resource_urls: string[];
  resource_levels: string[];
}> {
  const prompt = `
For the skill "${skill}", provide:
1. A short description (max 30 words).
2. The most relevant course: BSIT, BSBA, BSHM, BSTM, or ALL.
3. 3 resource titles (books, articles, videos, or websites) for learning this skill, with their URLs.

Format your response as a JSON object:
{
  "description": "...",
  "course": "...",
  "resource_titles": ["...", "...", "..."],
  "resource_urls": ["...", "...", "..."]
}
`;

  const out = await togetherTextGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    prompt,
    max_tokens: 300,
    temperature: 0.2,
  });

  const raw = out.choices?.[0]?.text ?? '';
  try {
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
      return {
        description: parsed.description ?? '',
        course: parsed.course ?? 'ALL',
        resource_titles: parsed.resource_titles ?? [],
        resource_urls: parsed.resource_urls ?? [],
        resource_levels: ["Easy", "Medium", "Hard"]
      };
    }
  } catch {}
  return {
    description: '',
    course: 'ALL',
    resource_titles: [],
    resource_urls: [],
    resource_levels: ["Easy", "Medium", "Hard"]
  };
}




