import { useEffect, useState } from "react";
import Autocomplete from "@/app/components/Autocomplete";
import Dropdown, { DropdownOption } from "@/app/components/Dropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formData } from "./components/type";

export default function Step2({
  setCurrentStep,
  formData,
  setformData,
}: {
  setCurrentStep: (step: number) => void;
  formData: formData;
  setformData: React.Dispatch<React.SetStateAction<formData>>;
}) {
  const jobTitles: string[] = ["Software Engineer"];
  const companyRoles: string[] = ["CEO"];

  const [newBranch, setNewBranch] = useState("");
  const [branches, setBranches] = useState<DropdownOption[]>([]);

  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [companies, setCompanies] = useState<DropdownOption[]>([
    { id: "create-new", name: "+ Create New" },
  ]);

  const handleSaveBranch = () => {
    if (newBranch.trim() === "") return;

    const newBranchOption: DropdownOption = {
      id: newBranch.toLowerCase().replace(/\s+/g, "-"),
      name: newBranch,
    };

    setBranches((prevBranches) => [...prevBranches, newBranchOption]);
    setShowBranchForm(false);
    setNewBranch("");
  };

  const handleSaveCompany = async () => {
    if (newCompany.trim() === "") return;
  
    try {
      const res = await fetch("/api/companies/new-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company_name: newCompany }),
      });
  
      if (res.ok) {
        const data = await res.json();
  
        const newCompanyOption: DropdownOption = {
          id: data.id,
          name: data.company_name,
        };
  
        const updatedCompanies = [
          ...companies.filter((c) => c.id !== "create-new"),
          newCompanyOption,
          { id: "create-new", name: "+ Create New" },
        ];
  
        setCompanies(updatedCompanies);

        setformData((prev) => {
          const updatedData = {
            ...prev,
            company_name: {
              id: newCompanyOption.id || "",
              name: newCompanyOption.name,
            },
            company_branch: { id: "", name: "" },
          };
          console.log(updatedData);
          return updatedData;
        });
        
        
  
        setShowCompanyForm(false);
        setNewCompany("");
      } else {
        console.error("Failed to create company.");
      }
    } catch (err) {
      console.error("Error creating company:", err);
    }
  };
  
  

  const handleChange = async (field: string, value: string | DropdownOption | null) => {
    if (field === "company_name" && value) {
      const selectedCompany = value as DropdownOption;
    
      if (selectedCompany.id === "create-new") {
        setShowCompanyForm(true);
        return;
      }
    
      setformData((prev) => ({
        ...prev,
        company_name: {
          id: selectedCompany.id || "",
          name: selectedCompany.name || "",
        },
        company_branch: { id: "", name: "" },
      }));
    
      try {
        const res = await fetch(`/api/branches?company_id=${selectedCompany.id}`);
        console.log("API Response:", res);
    
        if (!res.ok) {
          console.error("Error fetching branches:", res.statusText);
        }
    
        const data = await res.json();
    
        if (data && Array.isArray(data)) {
          const fetchedBranches = data.map((branch: { branch_id: string; branch_name: string }) => ({
            id: branch.branch_id || "",
            name: branch.branch_name || "Unnamed Branch",
          }));
    
          setBranches([
            ...fetchedBranches,
            { id: "create-new", name: "+ Create New" },
          ]);
        } else {
          console.error("Invalid branches data format", data);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    }
     else if (field === "company_branch" && value) {
      const selectedBranch = value as DropdownOption;
      console.log("Selected Branch Value:", value);
  
      setformData((prev) => ({
        ...prev,
        company_branch: {
          id: String(selectedBranch.id),
          name: selectedBranch.name || "",
        },
      }));
    } else {
      setformData((prev) => ({
        ...prev,
        [field]: typeof value === "string" ? value : (value as DropdownOption)?.name || "",
      }));
    }
  };
  

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();

        console.log("Fetched data:", data);  

        const fetchedCompanies = data.map((company: { id: string; company_name: string }) => ({
          id: company.id || "",
          name: company.company_name || "Unnamed Company",
        }));

        setCompanies([...fetchedCompanies, { id: "create-new", name: "+ Create New" }]);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  console.log("company_name:", formData.company_name?.name);


  const isFormValid =
  ((formData.company_name?.name?.trim() ?? "") !== "") &&
  ((formData.company_branch?.id && typeof formData.company_branch?.id === "string" && formData.company_branch?.id.trim() !== "" && formData.company_branch?.id !== "create-new") ?? false) &&
  ((formData.company_role?.trim() ?? "") !== "") &&
  ((formData.job_title?.trim() ?? "") !== "") &&
  ((formData.company_email?.trim() ?? "") !== "") &&
  (/\S+@\S+\.\S+/.test(formData.company_email || ""));





  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        console.log("Form data being submitted:", {
          company_name: formData.company_name?.name,
          company_branch: formData.company_branch?.name,
          company_role: formData.company_role,
          job_title: formData.job_title,
          company_email: formData.company_email,
          email: formData.email,
        });
  
        const response = await fetch("/api/signup-step1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: formData.company_name?.name,
            company_branch: formData.company_branch?.name,
            company_role: formData.company_role,
            job_title: formData.job_title,
            company_email: formData.company_email,
            email: formData.email,
            step: 2,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Success response:", data);
          setCurrentStep(3);
        } else {
          const data = await response.json();
          console.error("Error response:", data);
          alert(data.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Please fill out all required fields.");
    }
  };
  

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-4">
      <Dropdown
        options={companies}
        placeholder="Select a company"
        value={companies.find((company) => company.id === formData.company_name?.id) || null}
        onChange={(value) => handleChange("company_name", value)}
      />
        <Dropdown
          options={branches}
          placeholder="Company Branch"
          value={branches.find((b) => b.id === formData.company_branch?.id) || null}
          onChange={(value) => handleChange("company_branch", value)}
        />

        <Autocomplete
          suggestions={companyRoles}
          placeholder="Company Role"
          onChange={(value) => handleChange("company_role", value)}
        />
        <Autocomplete
          suggestions={jobTitles}
          placeholder="Job Title"
          onChange={(value) => handleChange("job_title", value)}
        />
        <input
          type="email"
          name="company_email"
          className="border p-2 w-full col-span-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Company Email"
          value={formData.company_email}
          onChange={(e) => handleChange("company_email", e.target.value)}
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
            <button onClick={handleSaveCompany} className="mt-2 px-4 py-2 bg-blue-500 text-white w-full rounded-lg">
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
            <button onClick={handleSaveBranch} className="mt-2 px-4 py-2 bg-blue-500 text-white w-full rounded-lg">
              Save
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-[82px]">
        <button onClick={() => setCurrentStep(1)} className="px-12 py-2 flex items-center justify-center rounded-full border border-button hover:bg-button/5 transition gap-2 text-button">
          <ChevronLeft size={20} />
          Back
        </button>

        <button
          onClick={handleSubmit}
          className={`px-12 py-2 flex items-center justify-center gap-2 rounded-full border ${
            isFormValid
              ? "bg-button text-white hover:bg-buttonHover"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
