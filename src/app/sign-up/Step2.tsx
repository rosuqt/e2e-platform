import { useEffect, useState } from "react";
import Autocomplete from "@/app/components/Autocomplete";
import Dropdown, { DropdownOption } from "@/app/components/Dropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formData } from "../../utils/type";
import CompanyForm from "./components/new-company/CompanyInformation";
import Swal from "sweetalert2";
import { jobTitles, companyRoles } from "@/utils/jobData"; 

{/* bro im so done with ts */}

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
  const [companies, setCompanies] = useState<DropdownOption[]>([
    { id: "create-new", name: "+ Create New" },
  ]);


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
  
    try {
      const companyBranch = formData.company_branch?.name || newBranch || "default-branch";
  
      const selectedIndustry =
        formData.company_industry ?? industries.find((ind) => ind.name === industryValue) ?? { id: "general", name: "General" };
  
      const selectedSize =
        formData.company_size ?? companySizes.find((size) => size.name === sizeValue) ?? { id: "unknown", name: "Unknown" };
  
      const requestBody = {
        company_name: newCompany,
        company_branch: companyBranch,
        company_industry: selectedIndustry.name,
        company_size: selectedSize.name,
        email_domain: emailDomain,
        company_website: companyWebsite,
      };

      
  
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
  
      setCompanies(updatedCompanies);
  
      setformData((prev) => ({
        ...prev,
        company_name: {
          id: newCompanyOption.id ?? "",
          name: newCompanyOption.name,
        },
        company_branch: {
          id: companyBranch.toLowerCase().replace(/\s+/g, "-") || "",
          name: companyBranch,
        },
        company_size: { id: selectedSize.id, name: selectedSize.name },
        email_domain: emailDomain,
        company_website: companyWebsite,
      }));

      const updatedBranches = [
        {
          id: companyBranch.toLowerCase().replace(/\s+/g, "-"),
          name: companyBranch,
        },
        { id: "create-new", name: "+ Create New" },
      ];

      setBranches(updatedBranches);

      setformData((prev) => ({
        ...prev,
        company_branch: {
          id: updatedBranches[0].id,
          name: updatedBranches[0].name,
        },
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
          : updatedBranches;

        setBranches(finalBranches);

        setformData((prev) => ({
          ...prev,
          company_branch: {
            id: finalBranches[0].id,
            name: finalBranches[0].name,
          },
        }));
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
  }; //handleSaveCompany ending tag
  
  

  const handleChange = async (field: string, value: string | DropdownOption | null) => {
    if (field === "company_name" && value) {
      const selectedCompany = value as DropdownOption;
  
      if (selectedCompany.id === "create-new" && formData.company_name?.id) {
        Swal.fire({
          icon: "warning",
          title: "Company already created",
          text: "You have already created a company. Please select it from the list.",
          confirmButtonText: "OK",
          confirmButtonColor: "#3B82F6",
        });
        return;
      }
  
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
          const data = await res.json();
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
            text: data.message || "We couldn’t fetch the branches. Please try again.",
            confirmButtonText: "OK",
            confirmButtonColor: "#3B82F6",
          });
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
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    } else if (field === "company_branch" && value) {
      const selectedBranch = value as DropdownOption;
      
      if (selectedBranch && selectedBranch.id && selectedBranch.name) {
        console.log("Selected Branch Value:", selectedBranch);
        setformData((prev) => ({
          ...prev,
          company_branch: {
            id: String(selectedBranch.id),
            name: selectedBranch.name || "",
          },
        }));
      } else {
        console.warn("Invalid company branch selected:", selectedBranch);
      }
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

  useEffect(() => {
    const fetchBranchesForSelectedCompany = async () => {
      if (formData.company_name?.id && formData.company_name.id !== "create-new") {
        try {
          const res = await fetch(`/api/branches?company_id=${formData.company_name.id}`);
          const data = await res.json();
  
          if (res.ok && Array.isArray(data)) {
            const fetchedBranches = data.map((branch: { branch_id: string; branch_name: string }) => ({
              id: branch.branch_id || "",
              name: branch.branch_name || "Unnamed Branch",
            }));
  
            const hasCreatedBranch = fetchedBranches.length > 0;
  
            setBranches([
              ...(hasCreatedBranch ? [] : [{ id: "create-new", name: "+ Create New" }]),
              ...fetchedBranches,
            ]);
          } else {
            console.error("Failed to fetch branches for selected company");
            setBranches([{ id: "create-new", name: "+ Create New" }]);
          }
        } catch (err) {
          console.error("Error fetching branches for selected company:", err);
          setBranches([{ id: "create-new", name: "+ Create New" }]);
        }
      } else {
        setBranches([{ id: "create-new", name: "+ Create New" }]);
      }
    };
  
    fetchBranchesForSelectedCompany();
  }, [formData.company_name?.id]);
  
  

  console.log("company_name:", formData.company_name?.name);
  console.log("company_branch:", formData.company_branch);
  console.log("company_role:", formData.company_role);
  console.log("job_title:", formData.job_title);
  console.log("company_email:", formData.company_email);
  console.log("email format valid:", /\S+@\S+\.\S+/.test(formData.company_email || ""));

  const isCompanyNameValid = (formData.company_name?.name?.trim() ?? "") !== "";
  console.log("Is company_name valid:", isCompanyNameValid);

  console.log("company_branch object:", formData.company_branch); 
  console.log("company_branch id:", formData.company_branch?.id);

  const companyBranchId = String(formData.company_branch?.id || "");
  console.log("companyBranchId (as string):", companyBranchId);

  const isCompanyBranchIdExists = companyBranchId !== "";
  const isCompanyBranchIdString = typeof companyBranchId === "string";
  const isCompanyBranchIdNotEmpty = companyBranchId.trim() !== "";
  const isCompanyBranchIdNotCreateNew = companyBranchId !== "create-new";

  console.log("isCompanyBranchIdExists:", isCompanyBranchIdExists);
  console.log("isCompanyBranchIdString:", isCompanyBranchIdString);
  console.log("isCompanyBranchIdNotEmpty:", isCompanyBranchIdNotEmpty);
  console.log("isCompanyBranchIdNotCreateNew:", isCompanyBranchIdNotCreateNew);

  const isCompanyBranchValid = isCompanyBranchIdExists &&
    isCompanyBranchIdString &&
    isCompanyBranchIdNotEmpty &&
    isCompanyBranchIdNotCreateNew;

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
      <h2 className="text-xl font-semibold">Company Association</h2>
      <p className="text-sm text-gray-400 mb-5">
      Connect with your company to start posting jobs and managing applications. If your company is already on our platform, simply search for it. If not, you can add it now!
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Dropdown
          options={companies.filter((company) => company.id !== "create-new" || !formData.company_name?.id)}
          placeholder="Select a company"
          value={
            companies.find((company) => company.id === formData.company_name?.id) || null
          }
          onChange={(value) => handleChange("company_name", value)}
        />
        <Dropdown
          options={branches}
          placeholder="Company Branch"
          value={
            branches.find((b) => b.id === formData.company_branch?.id) || null
          } 
          onChange={(value) => {
            const selectedBranch = value as DropdownOption;
            if (selectedBranch) {
              setformData((prev) => ({
                ...prev,
                company_branch: {
                  id: selectedBranch.id || "",
                  name: selectedBranch.name || "",
                },
              }));
            }
          }}
        />

        <Autocomplete
        suggestions={companyRoles}
        placeholder="Company Role"
        value={formData.company_role || ""}
        onChange={(value) => handleChange("company_role", value)}
        />

      <Autocomplete
        suggestions={jobTitles}
        placeholder="Job Title"
        value={formData.job_title || ""}
        onChange={(value) => handleChange("job_title", value)}
      />

        <input
          type="email"
          name="company_email"
          className="border p-2 w-full col-span-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Company Email"
          value={formData.company_email}
          onChange={(e) => handleChange("company_email", e.target.value)}
          autoComplete="off"
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