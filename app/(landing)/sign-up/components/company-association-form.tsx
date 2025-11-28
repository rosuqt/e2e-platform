"use client";

import { motion } from "framer-motion";
import { TextField, Dialog, CircularProgress, Autocomplete, Skeleton } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { PiBuildingsFill } from "react-icons/pi";
import "react-toastify/dist/ReactToastify.css";
import CreateCompanyModal from "./create-company-modal";
import CreateBranchModal from "./create-branch-modal";
import { CompanyAssociation } from "../types";
import Image from "next/image";

interface Company {
  id: string;
  name: string;
  status: "registered" | "pending" | "unknown";
  logo?: string | null;
  emailDomain?: string | null;
}

type CompanyAssociationWithError = CompanyAssociation & { __emailError?: string | null };

export default function CompanyAssociationForm({
  data,
  onChange,
  errors = {},
}: {
  data: CompanyAssociation;
  onChange: (data: CompanyAssociation) => void;
  errors?: { [key: string]: string };
}) {
  const [isCompanyModalOpen, setCompanyModalOpen] = useState(false);
  const [isBranchModalOpen, setBranchModalOpen] = useState(false);
  const [fetchedCompanies, setFetchedCompanies] = useState<Company[]>([]);
  const [fetchedBranches, setFetchedBranches] = useState<{ branch_name: string; status: string; email_domain?: string | null }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [allowsMultipleBranches, setAllowsMultipleBranches] = useState<boolean | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [branchInput, setBranchInput] = useState("");

  const saveCompanyAssociation = useCallback((updated: CompanyAssociation) => {
    const prev = sessionStorage.getItem("signUpFormData");
    let merged: Record<string, unknown>;
    if (prev) {
      const prevObj = JSON.parse(prev) as Record<string, unknown>;
      merged = { ...prevObj, companyAssociation: { ...(prevObj.companyAssociation as object), ...updated } };
    } else {
      merged = { companyAssociation: updated };
    }
    sessionStorage.setItem("signUpFormData", JSON.stringify(merged));
  }, []);

  const fetchCompanies = useCallback(async (): Promise<Company[]> => {
    setLoadingCompanies(true);
    try {
      const response = await fetch("/api/sign-up/companies?includePending=true");
      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.statusText}`);
      }
      const data = await response.json();
      const companies = Array.isArray(data)
        ? data.map((company) => ({
            id: company.id,
            name: company.company_name || "Unnamed Company",
            status: company.status || "unknown",
            logo: company.company_logo_image_path || null,
            emailDomain: company.email_domain || null,
          }))
        : [];
      setFetchedCompanies(companies);
      return companies;
    } catch (error) {
      console.error("Error fetching companies:", error);
      setFetchedCompanies([]);
      return [];
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  const fetchBranches = useCallback(async (companyId: string) => {
    if (companyId.startsWith("pending-")) {
      setFetchedBranches([]);
      setAllowsMultipleBranches(null);
      return;
    }
    setLoadingBranches(true);
    try {
      const response = await fetch(`/api/sign-up/branches?company_id=${companyId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.statusText}`);
      }
      const { branches, multipleBranch } = await response.json();
      setFetchedBranches(branches);
      setAllowsMultipleBranches(multipleBranch);
    } catch (error) {
      if (!companyId.startsWith("pending-")) {
        console.error("Error fetching branches:", error);
      }
      setFetchedBranches([]);
      setAllowsMultipleBranches(null);
    } finally {
      setLoadingBranches(false);
    }
  }, []);

  const handleCompanyModalClose = useCallback(async (newCompany?: { companyName: string; companyBranch: string; companyEmailDomain?: string }) => {
    setCompanyModalOpen(false);

    if (newCompany) {
      const newCompanyData: Company = {
        id: `pending-${Date.now()}`,
        name: newCompany.companyName,
        status: "pending",
        logo: null,
        emailDomain: newCompany.companyEmailDomain || null,
      };

      setFetchedCompanies((prevCompanies) => [newCompanyData, ...prevCompanies]);

      const updatedData = {
        ...data,
        companyName: newCompany.companyName,
        companyBranch: newCompany.companyBranch,
        companyId: newCompanyData.id,
      };

      onChange(updatedData);
      saveCompanyAssociation(updatedData);

      setSelectedCompanyId(newCompanyData.id);
      fetchBranches(newCompanyData.id);

      setTimeout(() => {
        setSearchInput(newCompany.companyName);
        setBranchInput(newCompany.companyBranch);
      }, 0);
    }
  }, [data, fetchBranches, onChange, saveCompanyAssociation]);

  const handleBranchModalClose = useCallback((newBranch?: { branchName: string; branchEmailDomain?: string }) => {
    setBranchModalOpen(false);

    if (newBranch && newBranch.branchName) {
      setFetchedBranches((prevBranches) => [
        ...prevBranches,
        { branch_name: newBranch.branchName, status: "pending", email_domain: newBranch.branchEmailDomain || null },
      ]);

      const updatedData = { ...data, companyBranch: newBranch.branchName };
      onChange(updatedData);
      saveCompanyAssociation(updatedData);
    } else if (selectedCompanyId) {
      fetchBranches(selectedCompanyId);
    } else {
      const updatedData = { ...data, companyBranch: "" };
      onChange(updatedData);
      saveCompanyAssociation(updatedData);
    }
  }, [data, fetchBranches, onChange, selectedCompanyId, saveCompanyAssociation]);

  useEffect(() => {
    const savedData = sessionStorage.getItem("signUpFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData?.companyAssociation) {
        setSearchInput(parsedData.companyAssociation.companyName || "");
        setBranchInput(parsedData.companyAssociation.companyBranch || "");
        if (parsedData.companyAssociation.companyId) {
          setSelectedCompanyId(parsedData.companyAssociation.companyId);
        }
      }
    } else {
      setSearchInput(data.companyName || "");
      setBranchInput(data.companyBranch || "");
      if (data.companyId) {
        setSelectedCompanyId(data.companyId);
      }
    }
  }, [data.companyName, data.companyBranch, data.companyId]);

  useEffect(() => {
    if (fetchedCompanies.length === 0) {
      fetchCompanies();
    }
  }, [fetchCompanies, fetchedCompanies.length]);

  useEffect(() => {
    if (selectedCompanyId && fetchedBranches.length === 0) {
      fetchBranches(selectedCompanyId);
    }
  }, [selectedCompanyId, fetchBranches, fetchedBranches.length]);

  useEffect(() => {
    setSearchInput(data.companyName || "");
    setBranchInput(data.companyBranch || "");
  }, [data.companyName, data.companyBranch]);

  useEffect(() => {
    onChange({ ...data, __emailError: emailError } as CompanyAssociationWithError);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailError]);

  useEffect(() => {
    if (data.companyRole !== "Employee" || data.jobTitle !== "HR Representative") {
      const updatedData = { ...data, companyRole: "Employee", jobTitle: "HR Representative" };
      onChange(updatedData);
      saveCompanyAssociation(updatedData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompanyChange = async (value: string) => {
    if (value === "new") {
      setCompanyModalOpen(true);
      return;
    }

    const selectedCompany = fetchedCompanies.find((company) => company.name === value);
    if (selectedCompany) {
      if (selectedCompanyId !== selectedCompany.id) {
        setSelectedCompanyId(selectedCompany.id);
        setFetchedBranches([]);
        const updatedData = {
          ...data,
          companyName: value,
          companyId: selectedCompany.id,
          companyBranch: "",
          companyEmail: "",
          companyRole: "Employee",
          jobTitle: "HR Representative",
        };
        onChange(updatedData);
        saveCompanyAssociation(updatedData);
        setSearchInput(value);
        setBranchInput("");
      } else {
        const updatedData = {
          ...data,
          companyName: value,
          companyId: selectedCompany.id,
          companyRole: "Employee",
          jobTitle: "HR Representative",
        };
        onChange(updatedData);
        saveCompanyAssociation(updatedData);
        setSearchInput(value);
      }
    } else {
      setSelectedCompanyId(null);
      setFetchedBranches([]);
      const updatedData = { ...data, companyName: "", companyId: undefined, companyBranch: "", companyEmail: "", companyRole: "Employee", jobTitle: "HR Representative" };
      onChange(updatedData);
      saveCompanyAssociation(updatedData);
      setSearchInput("");
      setBranchInput("");
    }
  };

  const handleBranchChange = (newValue: string | null) => {
    if (newValue === "+ Add New Branch") {
      setBranchModalOpen(true);
      onChange({ ...data, companyBranch: "", companyRole: "Employee", jobTitle: "HR Representative" });
      saveCompanyAssociation({ ...data, companyBranch: "", companyRole: "Employee", jobTitle: "HR Representative" });
      setBranchInput("");
    } else {
      onChange({ ...data, companyBranch: newValue || "", companyRole: "Employee", jobTitle: "HR Representative" });
      saveCompanyAssociation({ ...data, companyBranch: newValue || "", companyRole: "Employee", jobTitle: "HR Representative" });
      setBranchInput(newValue || "");
    }
  };

  const emailDomainForDisplay =
    (() => {
      const company = fetchedCompanies.find(c => c.id === selectedCompanyId);
      const branch = fetchedBranches.find(b => b.branch_name === data.companyBranch);
      if (branch && branch.email_domain && branch.email_domain.trim() !== "") {
        return branch.email_domain;
      }
      if (company && company.emailDomain && company.emailDomain.trim() !== "") {
        return company.emailDomain;
      }
      return "";
    })();

  return (
    <>
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: "340px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
          paddingBottom: "16px",
        }}
      >
        <div className="mb-4 flex items-center space-x-2 pb-2 border-b border-gray-300">
          <div className="bg-blue-100 p-2 rounded-full">
            <PiBuildingsFill className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Company Association</h2>
        </div>

        <div className="px-4 flex flex-col items-center justify-center" style={{ minHeight: "180px" }}>
          <div className="w-full max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
              <motion.div
                animate={errors.companyName ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Autocomplete
                  id="companyName"
                  options={
                    loadingCompanies
                      ? Array.from({ length: 5 }, (_, i) => `loading-${i}`)
                      : ["+ Add New Company", ...fetchedCompanies
                        .filter((company) =>
                          company.name.toLowerCase().includes(searchInput.toLowerCase())
                        )
                        .map((company) => company.name),
                      ]
                  }
                  value={data.companyName || ""}
                  onChange={(event, newValue) => {
                    if (newValue === "+ Add New Company") {
                      setCompanyModalOpen(true);
                      setSearchInput("");
                      onChange({ ...data, companyName: "" });
                      saveCompanyAssociation({ ...data, companyName: "" });
                    } else if (newValue) {
                      handleCompanyChange(newValue);
                    }
                  }
                  }
                  inputValue={searchInput}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue !== "+ Add New Company") {
                      setSearchInput(newInputValue);
                    }
                  }}
                  loading={loadingCompanies}
                  freeSolo={false}
                  renderOption={(props, option) => {
                    const { key, ...rest } = props;
                    if (loadingCompanies && option.startsWith("loading-")) {
                      return (
                        <li key={key} {...rest} style={{ pointerEvents: "none" }}>
                          <Skeleton variant="text" width="80%" />
                        </li>
                      );
                    }

                    if (option === "+ Add New Company") {
                      return (
                        <li
                          key={key}
                          {...rest}
                          style={{
                            color: "blue",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                          }}
                        >
                          {option}
                        </li>
                      );
                    }

                    const company = fetchedCompanies.find((c) => c.name === option);
                    return (
                      <li
                        key={key}
                        {...rest}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px",
                        }}
                      >
                        {company?.logo ? (
                          <Image
                            src={company.logo}
                            alt={`${company.name} logo`}
                            width={24}
                            height={24}
                            style={{
                              marginRight: 8,
                              borderRadius: "50%",
                              objectFit: "cover",
                              objectPosition: "center",
                              width: "24px",
                              height: "24px",
                              backgroundColor: "#f0f0f0",
                            }}
                            onError={(e) => {
                              if (e.currentTarget.src !== "https://via.placeholder.com/24?text=?") {
                                e.currentTarget.src = "https://via.placeholder.com/24?text=?";
                              }
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              marginRight: 8,
                              borderRadius: "50%",
                              backgroundColor: "#d3d3d3",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PiBuildingsFill style={{ color: "white", width: 16, height: 16 }} />
                          </div>
                        )}
                        {option}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<span>Company Name <span className="text-red-600">*</span></span>}
                      placeholder="Select or type your company"
                      variant="outlined"
                      fullWidth
                      error={!!errors.companyName}
                      helperText={errors.companyName}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingCompanies ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiInputLabel-root": { color: "gray", "&:hover": { color: "#2563eb" } },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "darkgray" },
                          "&:hover fieldset": { borderColor: "#2563eb" },
                        },
                      }}
                    />
                  )}
                />
              </motion.div>
              <motion.div
                animate={errors.companyBranch ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Autocomplete
                  id="companyBranch"
                  options={
                    loadingBranches
                      ? Array.from({ length: 5 }, (_, i) => `loading-${i}`)
                      : allowsMultipleBranches === false
                      ? fetchedBranches.map((branch) => branch.branch_name)
                      : ["+ Add New Branch", ...fetchedBranches.map((branch) => branch.branch_name)]
                  }
                  value={data.companyBranch || ""}
                  onChange={(event, newValue) => {
                    handleBranchChange(newValue as string);
                  }}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue === "+ Add New Branch") {
                      setBranchModalOpen(true);
                      onChange({ ...data, companyBranch: "" });
                      saveCompanyAssociation({ ...data, companyBranch: "" });
                      setBranchInput("");
                    } else {
                      setBranchInput(newInputValue);
                    }
                  }}
                  inputValue={branchInput}
                  loading={loadingBranches}
                  freeSolo
                  disabled={!data.companyName}
                  renderOption={(props, option) => {
                    const { key, ...rest } = props;
                    if (loadingBranches && option.startsWith("loading-")) {
                      return (
                        <li key={key} {...rest} style={{ pointerEvents: "none" }}>
                          <Skeleton variant="text" width="80%" />
                        </li>
                      );
                    }
                    return (
                      <li key={key} {...rest} style={{ color: option === "+ Add New Branch" ? "blue" : "inherit" }}>
                        {option}
                      </li>
                    );
                  }}
                  ListboxProps={{
                    ...(!allowsMultipleBranches && {
                      children: (
                        <div style={{ padding: "8px", fontStyle: "italic", color: "gray" }}>
                          This company only allows one branch.
                        </div>
                      ),
                    }),
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<span>Company Branch <span className="text-red-600">*</span></span>}
                      placeholder="Select or type your branch"
                      variant="outlined"
                      fullWidth
                      error={!!errors.companyBranch}
                      helperText={errors.companyBranch}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingBranches ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: !data.companyName ? "lightgray" : "gray",
                          "&:hover": { color: "#2563eb" },
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: !data.companyName ? "lightgray" : "darkgray" },
                          backgroundColor: !data.companyName ? "#f5f5f5" : "white",
                          "&:hover fieldset": { borderColor: "#2563eb" },
                        },
                      }}
                    />
                  )}
                />
              </motion.div>
            </div>
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-full">
                <TextField
                  id="companyEmail"
                  label={
                    emailDomainForDisplay
                      ? (
                        <span>
                          Company Email <span className="text-red-600">*</span> (must match {emailDomainForDisplay.startsWith("@") ? emailDomainForDisplay : "@" + emailDomainForDisplay})
                        </span>
                      )
                      : "Company Email (if applicable)"
                  }
                  placeholder={
                    emailDomainForDisplay
                      ? `Enter your company email (must match ${emailDomainForDisplay.startsWith("@") ? emailDomainForDisplay : "@" + emailDomainForDisplay})`
                      : "Enter company email"
                  }
                  variant="outlined"
                  fullWidth
                  value={data.companyEmail || ""}
                  onChange={(e) => {
                    setEmailError(null);
                    const updatedData = { ...data, companyEmail: e.target.value };
                    onChange(updatedData);
                    saveCompanyAssociation(updatedData);
                  }}
                  onBlur={(e) => {
                    const email = e.target.value;
                    const domain = emailDomainForDisplay;
                    if (domain) {
                      if (!email) {
                        setEmailError("Company Email is required for this branch/company.");
                        return;
                      }
                      if (
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                        !email.endsWith(domain.startsWith("@") ? domain : "@" + domain)
                      ) {
                        setEmailError(
                          `Email must match the domain (${domain.startsWith("@") ? domain : "@" + domain})`
                        );
                        return;
                      }
                    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      setEmailError("Invalid email format");
                      return;
                    }
                    setEmailError(null);
                  }}
                  error={!!emailError}
                  helperText={emailError}
                  required={!!emailDomainForDisplay}
                  sx={{
                    "& .MuiInputLabel-root": { color: "gray" },
                    "& .MuiOutlinedInputRoot": {
                      "& fieldset": { borderColor: "darkgray" },
                    },
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col items-center mt-6">

            </div>
          </div>
        </div>
      </motion.div>

      <Dialog
        open={isCompanyModalOpen}
        onClose={() => handleCompanyModalClose()}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: { maxWidth: "900px", width: "90%", margin: "auto" },
        }}
      >
        <CreateCompanyModal onClose={handleCompanyModalClose} />
      </Dialog>

      <Dialog
        open={isBranchModalOpen}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleBranchModalClose();
          }
        }}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: { maxWidth: "900px", width: "90%", margin: "auto" },
        }}
      >
        {selectedCompanyId ? (
          <CreateBranchModal onClose={handleBranchModalClose} companyId={selectedCompanyId} />
        ) : (
          <div style={{ padding: "16px", color: "red" }}>
            Error: Cannot open CreateBranchModal because company ID is missing.
          </div>
        )}
      </Dialog>
    </>
  );
}
