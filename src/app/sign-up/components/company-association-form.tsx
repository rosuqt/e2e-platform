"use client";

import { motion } from "framer-motion";
import { TextField, MenuItem, Dialog, CircularProgress, Autocomplete, Skeleton } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/system";
import { PiBuildingsFill } from "react-icons/pi";
import Popper from "@mui/material/Popper";
import "react-toastify/dist/ReactToastify.css";
import CreateCompanyModal from "./create-company-modal";
import CreateBranchModal from "./create-branch-modal";
import { CompanyAssociation } from "../types";
import { companyRoles } from "../data/company-roles";
import { jobTitles } from "../data/job-titles";
import Image from "next/image";

interface Company {
  id: string;
  name: string;
  status: "registered" | "pending" | "unknown";
  logo?: string | null;
  emailDomain?: string | null;
}

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme?.palette?.primary?.main || "#1976d2",
  backgroundColor: theme?.palette?.action?.hover || "#e3f2fd",
}));

const GroupItems = styled("ul")({
  padding: 0,
});

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
  const [fetchedBranches, setFetchedBranches] = useState<{ branch_name: string; status: string }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [loadingCompanies, setLoadingCompanies] = useState(false); 
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [allowsMultipleBranches, setAllowsMultipleBranches] = useState<boolean | null>(null); 
  const [searchInput, setSearchInput] = useState("");

  const fetchCompanies = useCallback(async (): Promise<Company[]> => {
    setLoadingCompanies(true);
    try {
      const response = await fetch("/api/sign-up/companies");
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
    setLoadingBranches(true);
    try {
      const response = await fetch(`/api/sign-up/branches?company_id=${companyId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.statusText}`);
      }

      const { branches, multipleBranch } = await response.json();

      console.log("Fetched branches:", branches);

      setFetchedBranches(branches);
      setAllowsMultipleBranches(multipleBranch);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setFetchedBranches([]);
      setAllowsMultipleBranches(null);
    } finally {
      setLoadingBranches(false);
    }
  }, []);

  const handleCompanyModalClose = useCallback(async (newCompany?: { companyName: string; companyBranch: string }) => {
    setCompanyModalOpen(false);

    if (newCompany) {
      console.log("New company created:", newCompany);

      const updatedCompanies = await fetchCompanies();

      const selectedCompany = updatedCompanies.find((company) => company.name === newCompany.companyName);

      if (selectedCompany) {
        setSelectedCompanyId(selectedCompany.id);
        const updatedData = {
          ...data,
          companyName: newCompany.companyName,
          companyBranch: newCompany.companyBranch,
          companyId: selectedCompany.id,
        };
        onChange(updatedData);
        sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));

        fetchBranches(selectedCompany.id);
      } else {
        console.warn("Newly created company not found in the fetched companies list.");
      }
    }
  }, [data, fetchCompanies, fetchBranches, onChange]);

  const handleBranchModalClose = useCallback((newBranch?: { branchName: string }) => {
    setBranchModalOpen(false);

    if (newBranch && newBranch.branchName) {
      console.log("New branch created:", newBranch);

      setFetchedBranches((prevBranches) => [
        ...prevBranches,
        { branch_name: newBranch.branchName, status: "pending" },
      ]);

      const updatedData = { ...data, companyBranch: newBranch.branchName };
      onChange(updatedData);
      sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
    } else if (selectedCompanyId) {
      fetchBranches(selectedCompanyId);
    } else {
      const updatedData = { ...data, companyBranch: "" };
      onChange(updatedData);
      sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
    }
  }, [data, fetchBranches, onChange, selectedCompanyId]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    const savedData = sessionStorage.getItem("signUpFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const mergedData = {
        ...data,
        ...parsedData.companyAssociation,
        companyName: "",
      };
      onChange(mergedData);
      setSelectedCompanyId(null);
      setFetchedBranches([]);
    }
  }, [data, onChange]);

  useEffect(() => {
    if (selectedCompanyId) {
      console.log("Triggering fetchBranches for selectedCompanyId:", selectedCompanyId);
      fetchBranches(selectedCompanyId);
    }
  }, [selectedCompanyId, fetchBranches]);

  useEffect(() => {
    if (data.companyName && !fetchedCompanies.some((company) => company.name === data.companyName)) {
      console.warn(`Selected company "${data.companyName}" is not in the fetched companies list.`);
      const updatedData = { ...data, companyName: "", companyId: undefined, companyBranch: "" };
      onChange(updatedData);
      sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
    }
  }, [data, fetchedCompanies, onChange]);

  const handleCompanyChange = async (value: string) => {
    if (value === "new") {
      setCompanyModalOpen(true);
      return;
    }

    const selectedCompany = fetchedCompanies.find((company) => company.name === value);
    if (selectedCompany) {
      console.log("Selected company:", selectedCompany);
      setSelectedCompanyId(selectedCompany.id)
      setFetchedBranches([]);
      const updatedData = {
        ...data,
        companyName: value,
        companyId: selectedCompany.id,
        companyBranch: "",
        companyEmail: selectedCompany.emailDomain ? `${selectedCompany.emailDomain.startsWith("@") ? "" : "@"}${selectedCompany.emailDomain}` : "",
      };
      onChange(updatedData);  
      sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
      console.log("Fetching branches for company ID:", selectedCompany.id);
      await fetchBranches(selectedCompany.id);
    } else {
      console.log("No company selected, clearing branches.");
      setFetchedBranches([]); 
      const updatedData = { ...data, companyName: "", companyId: undefined, companyBranch: "", companyEmail: "" };
      onChange(updatedData);
      sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
    }
  };

  return (
    <>
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-5 -mt-2 flex items-center space-x-2 pb-2 border-b border-gray-300">
          <div className="bg-blue-100 p-2 rounded-full">
            <PiBuildingsFill className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Company Association</h2>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4" style={{ rowGap: "1.5rem", marginBottom: "2rem" }}>
            <motion.div
              animate={errors.companyName ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Autocomplete
                id="companyName"
                options={
                  loadingCompanies
                    ? Array.from({ length: 5 }, (_, i) => `loading-${i}`) // Placeholder options
                    : ["+ Add New Company", ...fetchedCompanies
                      .filter((company) =>
                        company.name.toLowerCase().includes(searchInput.toLowerCase())
                      )
                      .map((company) => company.name),
                    ]
                }
                value={data.companyName || searchInput}
                onChange={(event, newValue) => {
                  if (newValue === "+ Add New Company") {
                    setCompanyModalOpen(true);
                    setSearchInput("");
                    onChange({ ...data, companyName: "" });
                  } else if (newValue) {
                    handleCompanyChange(newValue);
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue !== "+ Add New Company") {
                    setSearchInput(newInputValue);
                  }
                }}
                inputValue={searchInput} 
                loading={loadingCompanies}
                freeSolo 
                renderOption={(props, option) => {
                  if (loadingCompanies && option.startsWith("loading-")) {
                    return (
                      <li {...props} style={{ pointerEvents: "none" }}>
                        <Skeleton variant="text" width="80%" />
                      </li>
                    );
                  }

                  if (option === "+ Add New Company") {
                    return (
                      <li
                        {...props}
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
                      {...props}
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
                    label="Company Name *"
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
                      "& .MuiInputLabel-root": { color: "gray" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "darkgray" },
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
                    ? Array.from({ length: 5 }, (_, i) => `loading-${i}`) // Placeholder options
                    : allowsMultipleBranches === false
                    ? fetchedBranches.map((branch) => branch.branch_name)
                    : ["+ Add New Branch", ...fetchedBranches.map((branch) => branch.branch_name)]
                }
                value={data.companyBranch || ""}
                onChange={(event, newValue) => {
                  if (newValue === "+ Add New Branch") {
                    setBranchModalOpen(true);
                    onChange({ ...data, companyBranch: "" });
                  } else {
                    onChange({ ...data, companyBranch: newValue || "" });
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue === "+ Add New Branch") {
                    setBranchModalOpen(true);
                    onChange({ ...data, companyBranch: "" });
                  }
                }}
                inputValue={data.companyBranch || ""}
                loading={loadingBranches}
                freeSolo
                disabled={!data.companyName}
                renderOption={(props, option) => {
                  if (loadingBranches && option.startsWith("loading-")) {
                    return (
                      <li {...props} style={{ pointerEvents: "none" }}>
                        <Skeleton variant="text" width="80%" />
                      </li>
                    );
                  }
                  return (
                    <li {...props} style={{ color: option === "+ Add New Branch" ? "blue" : "inherit" }}>
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
                    label="Company Branch *"
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
                      "& .MuiInputLabel-root": { color: !data.companyName ? "lightgray" : "gray" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: !data.companyName ? "lightgray" : "darkgray" },
                        backgroundColor: !data.companyName ? "#f5f5f5" : "white",
                      },
                    }}
                  />
                )}
              />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4" style={{ rowGap: "1.5rem" }}>
            <motion.div
              animate={errors.companyRole ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <TextField
                id="companyRole"
                select
                label="Company Role *"
                variant="outlined"
                fullWidth
                value={data.companyRole || ""}
                onChange={(e) => {
                  const updatedData = { ...data, companyRole: e.target.value };
                  onChange(updatedData);
                  sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
                }}
                error={!!errors.companyRole}
                helperText={errors.companyRole}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        overflowY: "auto",
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiInputLabel-root": { color: "gray" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "darkgray" },
                  },
                }}
              >
                {companyRoles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
            </motion.div>
            <motion.div
              animate={errors.jobTitle ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Autocomplete
                id="jobTitle"
                options={jobTitles}
                groupBy={(option) => (typeof option === "string" ? "" : option.category)}
                getOptionLabel={(option) => (typeof option === "string" ? option : option.title)}
                value={data.jobTitle || ""}
                onChange={(event, newValue) => {
                  const updatedData = {
                    ...data,
                    jobTitle: typeof newValue === "string" ? newValue : newValue?.title || "",
                  };
                  onChange(updatedData);
                  sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
                }}
                onInputChange={(event, newInputValue) => {
                  const updatedData = {
                    ...data,
                    jobTitle: newInputValue,
                  };
                  onChange(updatedData);
                  sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
                }}
                freeSolo
                renderGroup={(params) => (
                  <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                  </li>
                )}
                PopperComponent={(props) => (
                  <Popper {...props} placement="bottom-start" disablePortal />
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Title *"
                    variant="outlined"
                    error={!!errors.jobTitle}
                    helperText={errors.jobTitle}
                    sx={{
                      "& .MuiInputLabel-root": { color: "gray" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "darkgray" },
                      },
                    }}
                  />
                )}
              />
            </motion.div>
          </div>
        </div>

        <div className="px-6" style={{ marginTop: "1.5rem" }}>
          <TextField
            id="companyEmail"
            label="Company Email (if applicable)"
            variant="outlined"
            fullWidth
            value={data.companyEmail || ""}
            onChange={(e) => {
              const updatedData = { ...data, companyEmail: e.target.value };
              onChange(updatedData);
              sessionStorage.setItem("signUpFormData", JSON.stringify({ companyAssociation: updatedData }));
            }}
            sx={{
              "& .MuiInputLabel-root": { color: "gray" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "darkgray" },
              },
            }}
          />
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
        {selectedCompanyId && (
          <CreateBranchModal onClose={handleBranchModalClose} companyId={selectedCompanyId} />
        )}
      </Dialog>
    </>
  );
}
