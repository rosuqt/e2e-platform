"use client";

import { ChevronRight } from "lucide-react";

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
}: CompanyFormProps) {

  const handleClose = () => {
    closeForm();
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBranch(e.target.value);
    console.log("New Branch Value on Change:", e.target.value); 
  };
  
  


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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    </span>
                </label>
                <input
                    id="company_branch"
                    placeholder="Type here"
                    className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                    value={newBranch} // Bind the newBranch state here
                    onChange={handleBranchChange} // Update newBranch on change
                />
              </div>

              {/* Industry Dropdown */}
              <div>
                <label htmlFor="company-industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Industry
                </label>
                <div className="relative">
                  <button
                    id="company-industry"
                    onClick={() => setIndustryOpen(!industryOpen)}
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
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        {["Technology", "Healthcare", "Finance", "Education", "Retail"].map((industry) => (
                          <button
                            key={industry}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={() => {
                              setIndustryValue(industry)
                              setIndustryOpen(false)
                            }}
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
                    id="company-size"
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
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        {["1-10", "11-50", "51-200", "201-500", "500+"].map((size) => (
                          <button
                            key={size}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={() => {
                              setSizeValue(size)
                              setSizeOpen(false)
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
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Company website <span className="text-gray-400 text-xs">(if applicable)</span>
                </label>
                <input
                  id="website"
                  placeholder="e.g www.company.com"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={handleSaveCompany}
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
  )
}
