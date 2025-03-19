import Autocomplete from "@/app/components/Autocomplete";
import Dropdown, { DropdownOption } from "@/app/components/Dropdown";

export default function Step2() {
  const companies: DropdownOption[] = [

  ];
  const branches: DropdownOption[] = [

  ];

    const jobTitles: string[] = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer",
    "Product Manager", "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", "Cybersecurity Analyst",
    "IT Support Specialist", "Network Administrator", "Systems Engineer", "Database Administrator", "Cloud Engineer",
    "Business Analyst", "Marketing Specialist", "SEO Analyst", "Digital Marketing Manager", "Content Writer",
    "Graphic Designer", "Art Director", "Sales Executive", "Account Manager", "HR Manager", "Recruitment Specialist",
    "Operations Manager", "Finance Analyst", "Investment Banker", "Risk Manager", "Legal Advisor", "Medical Doctor",
    "Registered Nurse", "Pharmacist", "Veterinarian", "Civil Engineer", "Mechanical Engineer", "Electrical Engineer",
    "Architect", "Construction Manager", "Teacher", "Professor", "Research Scientist", "Social Worker", "Psychologist",
    "Event Planner", "Customer Support Specialist", "Public Relations Manager", "Entrepreneur", "Freelancer"
  ];
  
    const companyRoles: string[] = [
    "CEO", "CTO", "CFO", "COO", "CMO", "CHRO", "VP of Engineering", "VP of Sales", "VP of Marketing", "VP of Product",
    "Engineering Manager", "Product Owner", "Scrum Master", "Team Lead", "Tech Lead", "Principal Engineer",
    "Senior Developer", "Junior Developer", "Software Architect", "Security Analyst", "Cloud Architect",
    "Database Administrator", "Infrastructure Engineer", "IT Manager", "Operations Director", "Sales Director",
    "HR Director", "Finance Director", "Marketing Director", "Customer Success Manager", "Support Lead",
    "Account Executive", "Business Development Manager", "Client Relations Manager", "Project Manager",
    "Strategy Consultant", "Investment Analyst", "Legal Counsel", "Risk Compliance Officer", "Public Relations Officer",
    "Event Coordinator", "Media Relations Manager", "Creative Director", "UX Researcher", "QA Engineer",
    "Test Automation Engineer", "Community Manager", "Corporate Trainer", "Supply Chain Manager", "Procurement Manager"
  ];
  

  
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Company Association</h2>
        <p className="text-sm text-gray-400 mb-5">Connect with your company to start posting jobs and managing applications. If your company is already on our platform, simply search for it. If not, you can add it now!</p>
        <div className="grid grid-cols-2 gap-4">
          <Dropdown options={companies} placeholder="Company" />
         
          <Dropdown options={branches} placeholder="Company Branch"/>
          <Autocomplete suggestions={companyRoles} placeholder="Company Role"/>
          <Autocomplete suggestions={jobTitles} placeholder="Job Title"/>
          <input className="border p-2 rounded w-full col-span-2" placeholder="Company Email (if applicable)" />
        </div>
        <div className="flex justify-between mt-6">
        </div>
      </div>
    );
  };

  