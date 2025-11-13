//Tempo Smart Writer

const jobTitles = [
  "Frontend Developer",
  "Backend Engineer",
  "Product Manager",
  "UX Designer",
  "DevOps Specialist",
  "QA Analyst",
  "Data Scientist",
]

const jobDescriptions = [
  "Join our dynamic team to build scalable web applications and deliver high-quality user experiences.",
  "Work closely with cross-functional teams to design, develop, and deploy robust backend systems.",
  "Lead product initiatives, define requirements, and ensure timely delivery of innovative solutions.",
  "Design intuitive interfaces and conduct user research to enhance product usability.",
  "Automate infrastructure, monitor systems, and ensure high availability of our services.",
  "Develop and execute test plans to guarantee software quality and reliability.",
  "Analyze large datasets to extract insights and drive data-informed decisions.",
]

const jobSummaries = [
  "Exciting opportunity to make an impact in a fast-paced environment.",
  "Be part of a collaborative team focused on innovation and growth.",
  "Drive key projects and contribute to our mission of excellence.",
  "Shape the future of our products with your expertise.",
  "Help us deliver outstanding solutions to our clients.",
]

const mustHaveQualificationsList = [
  ["2+ years experience with React", "Strong JavaScript skills", "Familiarity with REST APIs"],
  ["3+ years backend development", "Experience with Node.js", "Database design knowledge"],
  ["Excellent communication", "Project management experience", "Analytical mindset"],
  ["Portfolio of design work", "Proficiency in Figma or Sketch", "User research experience"],
  ["Experience with AWS or Azure", "CI/CD pipeline knowledge", "Scripting skills (Bash, Python)"],
  ["Manual and automated testing", "Bug tracking tools experience", "Attention to detail"],
  ["Python or R proficiency", "Statistical analysis skills", "Experience with ML frameworks"],
]

const niceToHaveQualificationsList = [
  ["TypeScript experience", "Redux knowledge"],
  ["GraphQL familiarity", "Docker experience"],
  ["Agile certification", "Technical background"],
  ["Animation/motion design", "HTML/CSS skills"],
  ["Terraform knowledge", "Kubernetes experience"],
  ["Performance testing", "API automation"],
  ["Big Data tools", "Cloud data platforms"],
]

const responsibilitiesList = [
  ["Develop new features", "Collaborate with designers", "Review code and mentor peers"],
  ["Design APIs", "Optimize database queries", "Implement security best practices"],
  ["Define product roadmap", "Gather user feedback", "Coordinate with stakeholders"],
  ["Create wireframes", "Conduct usability tests", "Iterate on designs"],
  ["Automate deployments", "Monitor system health", "Respond to incidents"],
  ["Write test cases", "Report bugs", "Work with developers to resolve issues"],
  ["Build data pipelines", "Visualize data", "Present findings to teams"],
]

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getRandomJobDetails() {
  const idx = Math.floor(Math.random() * jobTitles.length)
  return {
    jobTitle: jobTitles[idx],
    jobDescription: jobDescriptions[idx],
    jobSummary: getRandom(jobSummaries),
    mustHaveQualifications: mustHaveQualificationsList[idx],
    niceToHaveQualifications: niceToHaveQualificationsList[idx],
    responsibilities: responsibilitiesList[idx],
  }
}
