import { useEffect, useState } from "react";
import Autocomplete from "@/app/components/Autocomplete";
import Dropdown, { DropdownOption } from "@/app/components/Dropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Step2({
  setCurrentStep,
}: {
  setCurrentStep: (step: number) => void;
}) {
  const jobTitles: string[] = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "Product Manager",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Cybersecurity Analyst",
    "IT Support Specialist",
    "Network Administrator",
    "Systems Engineer",
    "Database Administrator",
    "Cloud Engineer",
    "Business Analyst",
    "Marketing Specialist",
    "SEO Analyst",
    "Digital Marketing Manager",
    "Content Writer",
    "Graphic Designer",
    "Art Director",
    "Sales Executive",
    "Account Manager",
    "HR Manager",
    "Recruitment Specialist",
    "Operations Manager",
    "Finance Analyst",
    "Investment Banker",
    "Risk Manager",
    "Legal Advisor",
    "Medical Doctor",
    "Registered Nurse",
    "Pharmacist",
    "Veterinarian",
    "Civil Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Architect",
    "Construction Manager",
    "Teacher",
    "Professor",
    "Research Scientist",
    "Social Worker",
    "Psychologist",
    "Event Planner",
    "Customer Support Specialist",
    "Public Relations Manager",
    "Entrepreneur",
    "Freelancer",
  ];

  const companyRoles: string[] = [
    "CEO",
    "CTO",
    "CFO",
    "COO",
    "CMO",
    "CHRO",
    "VP of Engineering",
    "VP of Sales",
    "VP of Marketing",
    "VP of Product",
    "Engineering Manager",
    "Product Owner",
    "Scrum Master",
    "Team Lead",
    "Tech Lead",
    "Principal Engineer",
    "Senior Developer",
    "Junior Developer",
    "Software Architect",
    "Security Analyst",
    "Cloud Architect",
    "Database Administrator",
    "Infrastructure Engineer",
    "IT Manager",
    "Operations Director",
    "Sales Director",
    "HR Director",
    "Finance Director",
    "Marketing Director",
    "Customer Success Manager",
    "Support Lead",
    "Account Executive",
    "Business Development Manager",
    "Client Relations Manager",
    "Project Manager",
    "Strategy Consultant",
    "Investment Analyst",
    "Legal Counsel",
    "Risk Compliance Officer",
    "Public Relations Officer",
    "Event Coordinator",
    "Media Relations Manager",
    "Creative Director",
    "UX Researcher",
    "QA Engineer",
    "Test Automation Engineer",
    "Community Manager",
    "Corporate Trainer",
    "Supply Chain Manager",
    "Procurement Manager",
  ];

  const [formData, setFormData] = useState<{
    company: DropdownOption | null;
    branch: string;
    companyRole: string;
    jobTitle: string;
    companyEmail: string;
  }>({
    company: null,
    branch: "",
    companyRole: "",
    jobTitle: "",
    companyEmail: "",
  });

  const [newBranch, setNewBranch] = useState("");

  const [branches, setBranches] = useState<DropdownOption[]>([
    { id: "TestBranch1", name: "Haws" },
    { id: "create-new", name: "+ Create New" },
  ]);

  const [lastAddedBranch, setLastAddedBranch] = useState<DropdownOption | null>(
    null,
  );

  const handleSaveBranch = () => {
    if (newBranch.trim() === "") return;

    const newBranchOption: DropdownOption = {
      id: newBranch.toLowerCase().replace(/\s+/g, "-"),
      name: newBranch,
    };

    setBranches((prevBranches) => [...prevBranches, newBranchOption]);
    setLastAddedBranch(newBranchOption);

    setShowBranchForm(false);
    setNewBranch("");
  };

  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [newCompany, setNewCompany] = useState("");

  const [companies, setCompanies] = useState<DropdownOption[]>([
    {
      id: "kemly-enterprises",
      name: "Kemly Enterprises",
      logo: "https://i.pinimg.com/736x/d5/df/38/d5df383773ca1bc126f30096231c285f.jpg",
    },
    { id: "create-new", name: "+ Create New" },
  ]);

  const [lastAddedCompany, setLastAddedCompany] =
    useState<DropdownOption | null>(null);

  const handleChange = (
    field: string,
    value: DropdownOption | string | null,
  ) => {
    console.log("Selected Value:", value);

    if (value && typeof value !== "string" && value.id === "create-new") {
      if (field === "company") {
        setShowCompanyForm(true);
      }
      if (field === "branch") {
        setShowBranchForm(true);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "company"
          ? (value as DropdownOption)
          : typeof value === "string"
            ? value
            : value?.name || "",
    }));
  };

  const handleSaveCompany = () => {
    if (newCompany.trim() === "") return;

    const newCompanyOption: DropdownOption = {
      id: newCompany.toLowerCase().replace(/\s+/g, "-"),
      name: newCompany,
    };

    setCompanies((prevCompanies) => [...prevCompanies, newCompanyOption]);
    setLastAddedCompany(newCompanyOption);

    setShowCompanyForm(false);
    setNewCompany("");
  };

  useEffect(() => {
    if (lastAddedCompany) {
      setFormData((prev) => ({ ...prev, company: lastAddedCompany }));
      setLastAddedCompany(null);
    }
  }, [lastAddedCompany]);

  useEffect(() => {
    if (lastAddedBranch) {
      setFormData((prev) => ({ ...prev, branch: lastAddedBranch.name }));
      setLastAddedBranch(null);
    }
  }, [lastAddedBranch]);

  const isFormValid =
    formData.company !== null &&
    formData.branch.trim() !== "" &&
    formData.companyRole.trim() !== "" &&
    formData.jobTitle.trim() !== "" &&
    formData.companyEmail.trim() !== "";

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Company Association</h2>
      <p className="text-sm text-gray-400 mb-5">
        Connect with your company to start posting jobs and managing
        applications. If your company is already on our platform, simply search
        for it. If not, you can add it now!
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Dropdown
          options={companies}
          placeholder="Select a company"
          value={formData.company}
          onChange={(value) => handleChange("company", value)}
        />

        <Dropdown
          options={branches}
          placeholder="Company Branch"
          value={branches.find((b) => b.name === formData.branch) || null}
          onChange={(value) => handleChange("branch", value)}
        />

        <Autocomplete
          suggestions={companyRoles}
          placeholder="Company Role"
          onChange={(value) => handleChange("companyRole", value)}
        />
        <Autocomplete
          suggestions={jobTitles}
          placeholder="Job Title"
          onChange={(value) => handleChange("jobTitle", value)}
        />
        <input
          type="email"
          name="companyEmail"
          className="border p-2 w-full col-span-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Company Email"
          value={formData.companyEmail}
          onChange={(e) => handleChange("companyEmail", e.target.value)}
        />
      </div>

      {showCompanyForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 w-full h-full">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Add New Company</h3>
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="w-full px-4 py-2 border mt-2"
              placeholder="Enter company name"
            />
            <button
              onClick={handleSaveCompany}
              className="mt-2 px-4 py-2 bg-blue-500 text-white w-full rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}
      {showBranchForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 w-full h-full">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Add New Branch</h3>
            <input
              type="text"
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
              className="w-full px-4 py-2 border mt-2"
              placeholder="Enter branch name"
            />
            <button
              onClick={handleSaveBranch}
              className="mt-2 px-4 py-2 bg-blue-500 text-white w-full rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-[82px]">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-12 py-2 flex items-center justify-center rounded-full border border-button hover:bg-button/5 transition gap-2 text-button"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <button
          onClick={() => isFormValid && setCurrentStep(3)}
          className={`px-12 py-2 flex items-center justify-center gap-2 rounded-full border transition ${
            isFormValid
              ? "bg-button text-white hover:bg-buttonHover"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          <p>Next</p>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
