"use client";
import { ChevronRight } from "lucide-react";
import TooltipIcon from "@/app/components/Tooltip";
import { useState } from "react";

interface CompanyFormProps {
  newCompany: string;
  setNewCompany: React.Dispatch<React.SetStateAction<string>>;
  industryOpen: boolean;
  setIndustryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  industryValue: string;
  setIndustryValue: React.Dispatch<React.SetStateAction<string>>;
  sizeOpen: boolean;
  setSizeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sizeValue: string;
  setSizeValue: React.Dispatch<React.SetStateAction<string>>;
  handleSaveCompany: () => void;
  closeForm: () => void;
  newBranch: string;
  setNewBranch: React.Dispatch<React.SetStateAction<string>>;
  emailDomain: string;
  setEmailDomain: React.Dispatch<React.SetStateAction<string>>;
  companyWebsite: string;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
}

export default function CompanyForm({
  newCompany,
  setNewCompany,
  industryOpen,
  setIndustryOpen,
  industryValue,
  setIndustryValue,
  sizeOpen,
  setSizeOpen,
  sizeValue,
  setSizeValue,
  handleSaveCompany,
  closeForm,
  newBranch,
  setNewBranch,
  emailDomain,
  setEmailDomain,
  companyWebsite,
  setWebsite,
}: CompanyFormProps) {

  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = () => {
    closeForm();
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBranch(e.target.value);
    console.log("New Branch Value on Change:", e.target.value);
  };

  {/* Validations */}
  const [emailDomainError, setEmailDomainError] = useState('');

  const handleEmailDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length === 1 && value !== "@") {
      setEmailDomainError("Please start with an @");
      return; 
    }
  
    if (value.startsWith("@") && !/^[a-zA-Z0-9.-]*$/.test(value.substring(1))) {
      return;
    }
  
    setEmailDomain(value);
  
    const domainPart = value.substring(value.indexOf('@') + 1);
  
    if (value.includes('@') && domainPart && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainPart)) {
      setEmailDomainError("Please enter a valid email domain (e.g., @company.com)");
    } else {
      setEmailDomainError("");
    }
  };
  
  const [websiteError, setWebsiteError] = useState("");

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (value.length === 1 && !/[a-zA-Z]/.test(value)) {
      setWebsiteError("Please start with a valid character (e.g., letter or number)");
      return;
    }
  
    const validDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (value && !validDomainRegex.test(value)) {
      setWebsiteError("Please enter a valid website (e.g., website.com)");
    } else {
      setWebsiteError("");
    }
  
    setWebsite(value);
  };

  const handleSaveCompanyWithValidation = () => {
    if (emailDomainError) {
      return;
    }
    if(websiteError){
      return;
    }
  
    handleSaveCompany();
  };
  
  
  
  

  const industries = [
    "Agriculture", 
    "Automotive", 
    "Banking & Finance", 
    "Biotechnology", 
    "Construction", 
    "Education", 
    "Energy", 
    "Entertainment", 
    "Fashion & Apparel", 
    "Food & Beverage", 
    "Healthcare", 
    "Hospitality", 
    "Information Technology", 
    "Logistics & Transportation", 
    "Manufacturing", 
    "Media & Communications", 
    "Nonprofit", 
    "Professional Services", 
    "Retail", 
    "Technology", 
    "Telecommunications", 
    "Tourism", 
    "Real Estate", 
    "Wholesale", 
    "Legal"
  ];

  const filteredIndustries = industries.filter((industry) =>
    industry.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleIndustryChange = (selectedIndustry: string) => {
    setIndustryValue(selectedIndustry);
    setIndustryOpen(false);
    console.log("Selected Industry Value (inside handleIndustryChange):", selectedIndustry);
  };
  
  console.log("Final Industry Value being sent in request:", industryValue);
  
  

  return (
    <div className="flex items-center justify-center h-screen p-2">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="relative p-8">
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            onClick={handleClose}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="text-center p-8 pb-0">
            <div className="mx-auto bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 13V21M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Create a new company</h2>
            <p className="text-sm text-gray-500 px-6 pb-4 border-b border-gray-300">
              You are about to create a new company. Please ensure that all fields are answered truthfully and accurately.
              Company verification is required and can be completed within the app.
            </p>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Company Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Form fields */}
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  id="company_name"
                  placeholder="Write Here"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="company_branch" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Branch Name
                    <span className="ml-1 text-gray-400">
                    <TooltipIcon
                      text="The first registered branch will automatically be the main branch of your company for this app."
                      bgColor="bg-white"
                    />
                    </span>
                </label>
                <input
                    id="company_branch"
                    placeholder="Type here"
                    className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                    value={newBranch}
                    onChange={handleBranchChange}
                />
              </div>

              {/* Industry Dropdown */}
              <div>
                <label htmlFor="company-industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Industry
                </label>
                <div className="relative">
                  <button
                    id="company_industry"
                    onClick={() => setIndustryOpen(true)}
                    className="flex items-center justify-between w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-500"
                  >
                    <span>{industryValue || "Select an industry"}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform ${industryOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {industryOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-[205px] overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-sm border-b border-gray-200"
                          placeholder="Search Industry..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {filteredIndustries.map((industry) => (
                          <button
                            key={industry}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={() => handleIndustryChange(industry)}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Size Dropdown */}
              <div>
                <label htmlFor="company-size" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <div className="relative">
                  <button
                    id="company_size"
                    onClick={() => setSizeOpen(!sizeOpen)}
                    className="flex items-center justify-between w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-500"
                  >
                    <span>{sizeValue || "Select Size"}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform ${sizeOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {sizeOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-[205px] overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        {["1-10", "11-50", "51-200", "201-500", "500+"].map((size) => (
                          <button
                            key={size}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={() => {
                              setSizeValue(size);
                              setSizeOpen(false);
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>


              {/* Email & Website Fields */}
              <div>
                <label htmlFor="email-domain" className="block text-sm font-medium text-gray-700 mb-1">
                  Company email domain <span className="text-gray-400 text-xs">(if applicable)</span>
                </label>
                <input
                  id="email-domain"
                  placeholder="e.g @makati.company"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                  value={emailDomain}
                  onChange={handleEmailDomainChange}
                />
                {emailDomainError && (
                  <p className="text-sm text-red-500 mt-1">{emailDomainError}</p>
                )}
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Company website <span className="text-gray-400 text-xs">(if applicable)</span>
                </label>
                <input
                  id="website"
                  placeholder="e.g www.company.com"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                  value={companyWebsite}
                  onChange={handleWebsiteChange}
                />
                {websiteError && (
                  <p className="text-sm text-red-500 mt-1">{websiteError}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={handleSaveCompanyWithValidation}
                className="px-12 py-2 flex items-center justify-center gap-2 rounded-full border bg-button text-white hover:bg-buttonHover"
              >
                <p>Next</p>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
