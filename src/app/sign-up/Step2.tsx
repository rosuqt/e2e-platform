import { useEffect, useState } from "react";
import Autocomplete from "@/app/components/Autocomplete";
import Dropdown, { DropdownOption } from "@/app/components/Dropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formData } from "../../utils/type";
import CompanyForm from "./components/CreateCompany";
import Swal from "sweetalert2";
import { jobTitles, companyRoles } from "@/utils/jobData"; // adjust the path as needed


export default function Step2({
  setCurrentStep,
  formData,
  setformData,
}: {
  setCurrentStep: (step: number) => void;
  formData: formData;
  setformData: React.Dispatch<React.SetStateAction<formData>>;
}) {


  const [newBranch, setNewBranch] = useState("");
  const [branches, setBranches] = useState<DropdownOption[]>([]);

  const [newCompany, setNewCompany] = useState('');
  const [industryOpen, setIndustryOpen] = useState(false);
  const [industryValue, setIndustryValue] = useState('');
  const [sizeOpen, setSizeOpen] = useState(false);
  const [sizeValue, setSizeValue] = useState('');
  const [emailDomain, setEmailDomain] = useState("");
  const [companyWebsite, setWebsite] = useState("");


  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [companies, setCompanies] = useState<DropdownOption[]>([
    { id: "create-new", name: "+ Create New" },
  ]);

  const [isCompanyCreated, setIsCompanyCreated] = useState(false);

  const industries: DropdownOption[] = [
    { id: "agriculture", name: "Agriculture" },
    { id: "automotive", name: "Automotive" },
    { id: "banking-finance", name: "Banking & Finance" },
    { id: "biotechnology", name: "Biotechnology" },
    { id: "construction", name: "Construction" },
    { id: "education", name: "Education" },
    { id: "energy", name: "Energy" },
    { id: "entertainment", name: "Entertainment" },
    { id: "fashion-apparel", name: "Fashion & Apparel" },
    { id: "food-beverage", name: "Food & Beverage" },
    { id: "healthcare", name: "Healthcare" },
    { id: "hospitality", name: "Hospitality" },
    { id: "information-technology", name: "Information Technology" },
    { id: "logistics-transportation", name: "Logistics & Transportation" },
    { id: "manufacturing", name: "Manufacturing" },
    { id: "media-communications", name: "Media & Communications" },
    { id: "nonprofit", name: "Nonprofit" },
    { id: "professional-services", name: "Professional Services" },
    { id: "retail", name: "Retail" },
    { id: "technology", name: "Technology" },
    { id: "telecommunications", name: "Telecommunications" },
    { id: "tourism", name: "Tourism" },
    { id: "real-estate", name: "Real Estate" },
    { id: "wholesale", name: "Wholesale" },
    { id: "legal", name: "Legal" }
  ];
  
  const companySizes: DropdownOption[] = [
    { id: "small", name: "1-10" },
    { id: "medium", name: "11-50" },
    { id: "large", name: "51-200" },
    { id: "xlarge", name: "201-500" },
    { id: "xxlarge", name: "500+" },
  ];
  

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
    if (newCompany.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Company name required",
        text: "Please enter a valid company name before saving.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    if (
      newBranch.trim() === "" ||
      industryValue.trim() === "" ||
      sizeValue.trim() === "" ||
      emailDomain.trim() === "" ||
      companyWebsite.trim() === ""
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all required fields before submitting.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    
  
    console.log("Saving company with branch:", newBranch);
  
    try {
      console.log("New Branch:", newBranch);
      const companyBranch = formData.company_branch?.name || newBranch || "default-branch";
      console.log("Sending company branch:", companyBranch);
  
      console.log("Selected Industry Value (from state):", industryValue);
  
      const selectedIndustry =
        formData.company_industry ??
        industries.find((ind) => ind.name === industryValue) ??
        { id: "general", name: "General" };
  
      const selectedSize =
        formData.company_size ??
        companySizes.find((size) => size.name === sizeValue) ??
        { id: "unknown", name: "Unknown" };
  
      console.log("Final Industry being sent in request:", selectedIndustry);
  
      const requestBody = {
        company_name: newCompany,
        company_branch: companyBranch,
        company_industry: selectedIndustry.name,
        company_size: selectedSize.name,
        email_domain: emailDomain,
        company_website: companyWebsite,
      };
  
      console.log("Request Body being sent:", requestBody);
  
      const res = await fetch("/api/companies/new-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await res.json();

      
  
      if (res.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Company already exists",
          text: data.message || "This company already exists. Please use a different name.",
          confirmButtonText: "OK",
          confirmButtonColor: "#3B82F6",
        });
        return;
      }
  
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed to create company",
          text: data.message || "Something went wrong. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "#3B82F6",
        });
        return;
      }
      
  
      const newCompanyOption: DropdownOption = {
        id: data.company.id,
        name: data.company.company_name,
      };
  
      const updatedCompanies = [
        ...companies.filter((c) => c.id !== "create-new"),
        newCompanyOption,
        { id: "create-new", name: "+ Create New" },
      ];
  
      setIsCompanyCreated(true);
      setCompanies(updatedCompanies);
  
      setformData((prev) => ({
        ...prev,
        company_name: {
          id: newCompanyOption.id ?? "",
          name: newCompanyOption.name,
        },
        company_branch: { id: companyBranch, name: companyBranch },
        company_size: { id: selectedSize.id, name: selectedSize.name },
        email_domain: emailDomain,
        company_website: companyWebsite,
      }));
  
      setShowCompanyForm(false);
      setNewCompany("");
  
      const branchRes = await fetch(`/api/branches?company_id=${newCompanyOption.id}`);
      const branchData = await branchRes.json();
  
      if (branchRes.ok && Array.isArray(branchData)) {
        const fetchedBranches = branchData.map((branch: { branch_id: string; branch_name: string }) => ({
          id: branch.branch_id || "",
          name: branch.branch_name || "Unnamed Branch",
        }));
  
        const finalBranches = fetchedBranches.length
          ? [...fetchedBranches, { id: "create-new", name: "+ Create New" }]
          : [
              {
                id: companyBranch.toLowerCase().replace(/\s+/g, "-"),
                name: companyBranch,
              },
              { id: "create-new", name: "+ Create New" },
            ];
  
        setBranches(finalBranches);
  
        setformData((prev) => {
          const alreadySet = prev.company_branch?.name;
          if (alreadySet) return prev;
  
          return {
            ...prev,
            company_branch:
              finalBranches[0]?.id !== "create-new"
                ? { id: finalBranches[0].id ?? "", name: finalBranches[0].name }
                : { id: "", name: "" },
          };
        });
      } else {
        console.error("Failed to fetch branches for the new company.");
      }
    } catch (err) {
      console.error("Error creating company:", err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not connect to the server. Please check your connection.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6",
      });
    }
  };
  

  const handleChange = async (field: string, value: string | DropdownOption | null) => {
    if (field === "company_name" && value) {
      const selectedCompany = value as DropdownOption;
    
      if (selectedCompany.id === "create-new") {
        setShowCompanyForm(true);
        return;
      }
    
      setIsCompanyCreated(false);
    
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
          const data = await res.json();
        
          if (res.status === 409) {
            Swal.fire({
              icon: "error",
              title: "Company already exists",
              text: data.message || "A company with this name already exists.",
              confirmButtonText: "OK",
              confirmButtonColor: "#3B82F6",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Something went wrong",
              text: data.message || "We couldn’t fetch the branches. Please try again.",
              confirmButtonText: "OK",
              confirmButtonColor: "#3B82F6",
            });
          }
        
          console.error("Failed to fetch branches. Status:", res.status);
          return;
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
    } else if (field === "company_branch" && value) {
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

        setCompanies([{ id: "create-new", name: "+ Create New" }, ...fetchedCompanies]);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

    fetchCompanies();
  }, []);

  console.log("company_name:", formData.company_name?.name);
  console.log("company_branch:", formData.company_branch);
  console.log("company_role:", formData.company_role);
  console.log("job_title:", formData.job_title);
  console.log("company_email:", formData.company_email);
  console.log("email format valid:", /\S+@\S+\.\S+/.test(formData.company_email || ""));

  const isCompanyNameValid = (formData.company_name?.name?.trim() ?? "") !== "";
  console.log("Is company_name valid:", isCompanyNameValid);

  const isCompanyBranchValid = (formData.company_branch?.id && typeof formData.company_branch?.id === "string" && formData.company_branch?.id.trim() !== "" && formData.company_branch?.id !== "create-new") ?? false;
  console.log("Is company_branch valid:", isCompanyBranchValid);

  const isCompanyRoleValid = (formData.company_role?.trim() ?? "") !== "";
  console.log("Is company_role valid:", isCompanyRoleValid);

  const isJobTitleValid = (formData.job_title?.trim() ?? "") !== "";
  console.log("Is job_title valid:", isJobTitleValid);

  const isCompanyEmailValid = (formData.company_email?.trim() ?? "") !== "";
  console.log("Is company_email valid:", isCompanyEmailValid);

  const isEmailFormatValid = /\S+@\S+\.\S+/.test(formData.company_email || "");
  console.log("Is email format valid:", isEmailFormatValid);

  const isFormValid =
    isCompanyNameValid &&
    isCompanyBranchValid &&
    isCompanyRoleValid &&
    isJobTitleValid &&
    isCompanyEmailValid &&
    isEmailFormatValid;

  console.log("isFormValid:", isFormValid);

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
          onChange={(value) => {
            if (!isCompanyCreated) {
              handleChange("company_branch", value);
            }
          }}
          disabled={isCompanyCreated}
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
          <CompanyForm
            newCompany={newCompany}
            setNewCompany={setNewCompany}
            industryOpen={industryOpen}
            setIndustryOpen={setIndustryOpen}
            industryValue={industryValue}
            setIndustryValue={setIndustryValue}
            sizeOpen={sizeOpen}
            setSizeOpen={setSizeOpen}
            sizeValue={sizeValue}
            setSizeValue={setSizeValue}
            handleSaveCompany={handleSaveCompany}
            closeForm={() => setShowCompanyForm(false)}
            newBranch={newBranch}
            setNewBranch={setNewBranch}
            companyWebsite={companyWebsite}
            emailDomain={emailDomain}
            setEmailDomain={setEmailDomain}
            setWebsite={setWebsite}
          />

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
        <button
          onClick={() => setCurrentStep(1)}
          className="px-12 py-2 flex items-center justify-center rounded-full border border-button hover:bg-button/5 transition gap-2 text-button"
        >
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
