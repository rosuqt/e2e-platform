"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TextField, MenuItem, Button, Switch, Tabs, Tab, Tooltip, CircularProgress, Autocomplete, Popper, Box } from "@mui/material"
import { InfoOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { countries } from "../data/countries";
import Image from "next/image";


const shakeAnimation = {
  initial: { x: 0 },
  animate: { x: [0, -5, 5, -5, 5, 0] },
  transition: { duration: 0.3 },
}

const validateLength = (field: string, value: string, min: number, max: number) => {
  if (value.length < min) return `${field} must be at least ${min} characters.`;
  if (value.length > max) return `${field} must not exceed ${max} characters.`;
  return "";
};

type AddressData = {
  address: string;
  contactEmail: string;
  contactNumber: string;
  suiteUnitFloor: string;
  businessPark: string;
  buildingName: string;
  countryCode: string;
};

type AddressErrors = {
  contactEmail: string;
  contactNumber: string;
  countryCode: string;
  address: string; 
};

export default function CreateCompanyModal({ onClose }: { onClose: (newCompany?: { companyName: string; companyBranch: string; companyEmailDomain?: string }) => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const [isNextDisabled, setIsNextDisabled] = useState(false)
  const [noBranches] = useState(false)
  const [companyNameError, setCompanyNameError] = useState("");
  const [branchNameError, setBranchNameError] = useState("");
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({
    contactEmail: "",
    contactNumber: "",
    countryCode: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressErrors, setShowAddressErrors] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",
    companyBranch: "",
    companyIndustry: "",
    companySize: "",
    companyEmailDomain: "",
    companyWebsite: "",
    multipleBranch: true, 
    address: {
      address: "",
      contactEmail: "",
      contactNumber: "",
      suiteUnitFloor: "",
      businessPark: "",
      buildingName: "",
      countryCode: "",
    } as AddressData,
  })

  useEffect(() => {
    const savedData = sessionStorage.getItem("createCompanyFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("createCompanyFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let truncatedValue = value;

    if (id === "companyName") {
      truncatedValue = value.slice(0, 40);
      setCompanyNameError("");
      setIsNextDisabled(false);
    } else if (id === "companyBranch") {
      truncatedValue = value.slice(0, 40);
      setBranchNameError("");
      setIsNextDisabled(false);
    } else if (id === "companyEmailDomain") {
      truncatedValue = value.startsWith("@") ? value.slice(1, 40) : value.slice(0, 40);
    } else if (id === "companyWebsite") {
      truncatedValue = value.slice(0, 40);
    }

    if (formData[id as keyof typeof formData] !== truncatedValue) {
      setFormData({ ...formData, [id]: truncatedValue });
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    if (activeTab === 0) {
      const companyNameError = !formData.companyName
        ? "Company Name is required"
        : validateLength("Company Name", formData.companyName, 2, 40);
      const branchNameError = !formData.companyBranch
        ? "Company Branch Name is required"
        : validateLength("Company Branch Name", formData.companyBranch, 2, 40);
      const emailDomainError = formData.companyEmailDomain
        ? validateLength(
            "Email Domain",
            formData.companyEmailDomain.startsWith("@") ? formData.companyEmailDomain.slice(1) : formData.companyEmailDomain,
            3,
            40
          ) || (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.companyEmailDomain.slice(1))
              ? "Invalid domain format (e.g., company.com)"
              : "")
        : "";
      const websiteError = formData.companyWebsite
        ? validateLength("Company Website", formData.companyWebsite, 10, 40) ||
          (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.companyWebsite)
            ? "Invalid website format (e.g., example.com)"
            : "")
        : "";

      setCompanyNameError(companyNameError);
      setBranchNameError(branchNameError);

      if (companyNameError || branchNameError || emailDomainError || websiteError) {
        setIsNextDisabled(true);
        setIsLoading(false);
        return;
      }

      setIsNextDisabled(false);

      const isInvalid =
        !formData.companyName || !formData.companyBranch || !formData.companyIndustry;

      if (isInvalid) {
        setIsNextDisabled(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/sign-up/create-company/check-company-name?name=${encodeURIComponent(formData.companyName)}`);
        const result = await response.json();

        if (response.ok && result.exists) {
          setCompanyNameError(`"${formData.companyName}" already exists. Please select it from the dropdown list instead of creating a new one`);
          setIsNextDisabled(true);
          setIsLoading(false);
          return;
        } else if (!response.ok) {
          toast.error("An error occurred while validating the company name. Please try again.");
          setIsLoading(false);
          return;
        }
      } catch {
        toast.error("An error occurred while validating the company name. Please try again.");
        setIsLoading(false);
        return; 
      }

      setCompanyNameError("");
      setBranchNameError("");
    }

    if (activeTab === 1) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.address.contactEmail);
      const countryCode = formData.address.countryCode;
      const phone = formData.address.contactNumber;
      let numberValid = false;
      if (countryCode === "63" || countryCode === "+63") {
        numberValid = /^9\d{9}$/.test(phone);
      } else {
        numberValid = /^\d{7,15}$/.test(phone);
      }

      const requiredFields = [
        { key: "address", label: "Address" },
        { key: "contactEmail", label: "Contact Email" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "countryCode", label: "Country Code" },
      ] as const;
      let missing = false;
      const newAddressErrors: { contactEmail: string; contactNumber: string; countryCode: string; address: string; [key: string]: string } = {
        contactEmail: addressErrors.contactEmail ?? "",
        contactNumber: addressErrors.contactNumber ?? "",
        countryCode: addressErrors.countryCode ?? "",
        address: addressErrors.address ?? "",
      };
      requiredFields.forEach(field => {
        const value = (formData.address as Record<string, string>)[field.key] ?? "";
        if (!value) {
          newAddressErrors[field.key] = `${field.label} is required`;
          missing = true;
        } else {
          newAddressErrors[field.key] = "";
        }
      });
      newAddressErrors.contactEmail = emailValid ? "" : "Invalid email format";
      if (!countryCode) {
        newAddressErrors.countryCode = "Country code required";
        missing = true;
      }
      if (countryCode === "63" || countryCode === "+63") {
        newAddressErrors.contactNumber = /^9\d{9}$/.test(phone)
          ? ""
          : "PH mobile must start with 9 and be 10 digits (e.g. 9123456789)";
      } else {
        newAddressErrors.contactNumber = /^\d{7,15}$/.test(phone)
          ? ""
          : "Invalid phone number";
      }
      if (!emailValid || !numberValid) missing = true;

      setAddressErrors({
        contactEmail: newAddressErrors.contactEmail,
        contactNumber: newAddressErrors.contactNumber,
        countryCode: newAddressErrors.countryCode,
        address: newAddressErrors.address,
      });

      if (missing || !emailValid || !numberValid) {
        setShowAddressErrors(true);
        setIsLoading(false);
        return;
      }
      setShowAddressErrors(false);
    }

    setIsNextDisabled(false);
    if (activeTab < 2) {
      setActiveTab(activeTab + 1);
    } else {
      console.log("Company data submitted:", formData);
      onClose();
    }
    setIsLoading(false);
  }

  const handleBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (activeTab > 0) {
        setActiveTab(activeTab - 1)
      }
      setIsLoading(false);
    }, 300);
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/sign-up/create-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          companyBranch: formData.companyBranch || "Headquarters", 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Company and branch created successfully");

        if (!toast.isActive("companyCreated")) {
          toast.success(`Company "${result.data.company_name}" created successfully!`, { toastId: "companyCreated" });
        }

        onClose({ companyName: result.data.company_name, companyBranch: result.data.company_branch, companyEmailDomain: result.data.email_domain });
      } else {
        console.error("Failed to submit company data");
        toast.error("Failed to create company. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting company data:", error);
      toast.error("An error occurred while creating the company.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="p-6 max-w-3xl mx-auto bg-white rounded-lg overflow-y-auto"
        style={{ height: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Create New Company</h2>
          <Button
            variant="text"
            onClick={() => onClose()}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => {
            if (activeTab === 0) {
              const isInvalid = !formData.companyName || !formData.companyBranch || !formData.companyIndustry;
              if (isInvalid) {
                setIsNextDisabled(true);
                return;
              }
            }
            if (newValue === 2) {
              const addressValid =
                !!formData.address.address &&
                !!formData.address.contactEmail &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.address.contactEmail) &&
                !!formData.address.contactNumber &&
                /^[0-9+\-()\s]+$/.test(formData.address.contactNumber);
              if (!addressValid) {
                setShowAddressErrors(true);
                setIsNextDisabled(true);
                return;
              }
            }
            setActiveTab(newValue);
          }}
          className="mb-4"
        >
          <Tab label="Company Information" />
          <Tab label="Company Address" disabled={activeTab === 0 && isNextDisabled} />
          <Tab
            label="Preview"
            disabled={
              (activeTab === 0 && isNextDisabled) ||
              !formData.address.address ||
              !formData.address.contactEmail ||
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.address.contactEmail) ||
              !formData.address.contactNumber ||
              !/^[0-9+\-()\s]+$/.test(formData.address.contactNumber)
            }
          />
        </Tabs>

        {activeTab === 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4"> 
              <motion.div
                {...(companyNameError ? shakeAnimation : {})} 
              >
                <TextField
                  id="companyName"
                  label={<span>Company Name <span style={{ color: "red"  }}>*</span></span>}
                  placeholder="Enter the full name of the company"
                  variant="outlined"
                  fullWidth
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!companyNameError}
                  helperText={
                    companyNameError ||
                    (isNextDisabled && !formData.companyName ? "Company Name is required" : "Enter the full name of the company")
                  } 
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: companyNameError ? "red" : "darkgray", 
                      },
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: companyNameError ? "red" : "gray",
                      "&:hover": {
                        color: "#2563eb",
                      },
                    },
                  }}
                />
              </motion.div>
              <motion.div
                {...(branchNameError ? shakeAnimation : {})}
                className="relative"
              >
                <TextField
                  id="companyBranch"
                  label={<span>Company Branch Name <span style={{ color: "red" }}>*</span></span>}
                  placeholder="Enter the main branch name"
                  variant="outlined"
                  fullWidth
                  value={noBranches ? "Headquarters" : formData.companyBranch}
                  onChange={handleChange}
                  disabled={noBranches}
                  error={!!branchNameError}
                  helperText={
                    branchNameError ||
                    (isNextDisabled && !formData.companyBranch ? "Company Branch Name is required" : "")
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&:hover": {
                        color: "#2563eb",
                      },
                    },
                  }}
                />
                <div className="flex items-center mt-2">
                  <Tooltip title="This will be the main branch in the app, used as the primary reference point. It doesn't necessarily reflect the actual main office of the company." arrow>
                    <InfoOutlined className="text-gray-500 mr-1 cursor-pointer" fontSize="small" />
                  </Tooltip>
                  <label htmlFor="companyBranch" className="text-sm text-gray-600">
                    Specify the main branch of the company
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <Switch
                    id="noBranches"
                    checked={!formData.multipleBranch}
                    onChange={(e) => {
                      setFormData({ ...formData, multipleBranch: !e.target.checked });
                      if (e.target.checked) {
                        setFormData({ ...formData, companyBranch: "Headquarters", multipleBranch: false });
                        setBranchNameError("");
                        setIsNextDisabled(false);
                      } else {
                        setFormData({ ...formData, companyBranch: "", multipleBranch: true });
                      }
                    }}
                  />
                  <label htmlFor="noBranches" className="ml-2 text-blue-700">
                    This company doesn&apos;t have branches
                  </label>
                </div>
              </motion.div>
            </div>

            <motion.div
              {...(isNextDisabled && !formData.companyIndustry ? shakeAnimation : {})}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <TextField
                  id="companyIndustry"
                  select
                  label={<span>Industry <span style={{ color: "red" }}>*</span></span>}
                  placeholder="Select the industry"
                  variant="outlined"
                  fullWidth
                  value={formData.companyIndustry}
                  onChange={(e) => {
                    setFormData({ ...formData, companyIndustry: e.target.value });
                    if (isNextDisabled && e.target.value) {
                      setIsNextDisabled(false);
                    }
                  }}
                  error={isNextDisabled && !formData.companyIndustry}
                  helperText={isNextDisabled && !formData.companyIndustry ? "Industry is required" : ""}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&:hover": {
                        color: "#2563eb",
                      },
                    },
                  }}
                >
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="healthcare">Healthcare</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="retail">Retail</MenuItem>
                  <MenuItem value="manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
                <label htmlFor="companyIndustry" className="text-sm text-gray-600">Select the industry the company operates in</label>
              </div>
              <div>
                <TextField
                  id="companySize"
                  select
                  label="Company Size (Optional)"
                  placeholder="Select company size"
                  variant="outlined"
                  fullWidth
                  value={formData.companySize}
                  onChange={(e) =>
                    setFormData({ ...formData, companySize: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&:hover": {
                        color: "#2563eb",
                      },
                    },
                  }}
                >
                  <MenuItem value="1-10">1-10 employees</MenuItem>
                  <MenuItem value="11-50">11-50 employees</MenuItem>
                  <MenuItem value="51-200">51-200 employees</MenuItem>
                  <MenuItem value="201-500">201-500 employees</MenuItem>
                  <MenuItem value="501-1000">501-1000 employees</MenuItem>
                  <MenuItem value="1000+">1000+ employees</MenuItem>
                </TextField>
                <label htmlFor="companySize" className="text-sm text-gray-600">Specify the approximate size of the company</label>
              </div>
            </motion.div>

            <div className="flex items-center">
              <TextField
                value="@"
                variant="outlined"
                disabled
                className="w-16 text-center"
                InputProps={{
                  style: {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#2563eb",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&:hover": {
                      color: "#2563eb",
                    },
                  },
                }}
              />
              <TextField
                id="companyEmailDomain"
                label="Company Email Domain (if applicable)"
                placeholder="e.g. company.com"
                variant="outlined"
                fullWidth
                value={formData.companyEmailDomain.startsWith("@") ? formData.companyEmailDomain.slice(1) : formData.companyEmailDomain}
                onChange={handleChange}
                error={
                  !!formData.companyEmailDomain &&
                  !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.companyEmailDomain.slice(1))
                }
                helperText={
                  formData.companyEmailDomain &&
                  !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.companyEmailDomain.slice(1))
                    ? "Invalid domain format (e.g., company.com)"
                    : ""
                }
                InputProps={{
                  style: {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#2563eb",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&:hover": {
                      color: "#2563eb",
                    },
                  },
                }}
              />
            </div>
            <label htmlFor="companyEmailDomain" className="text-sm text-gray-600">Provide the email domain used by the company (e.g company.com)</label>
            <div className="flex justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={isNextDisabled || isLoading}
                startIcon={isLoading && <CircularProgress size={20} />}
              >
                {isLoading ? "Loading..." : "Next"}
              </Button>
            </div>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full">
              <AddressAutocomplete
                value={formData.address.address}
                onChange={(val: string) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, address: val },
                  })
                }
                error={!!(addressErrors as Record<string, string>).address || (showAddressErrors && !formData.address.address)}
                helperText={
                  (addressErrors as Record<string, string>).address ||
                  ((showAddressErrors && !formData.address.address) ? "Address is required" : "")
                }
              />
              <p className="text-xs text-gray-500 mt-1">Enter the full address of the company.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <TextField
                  id="suiteUnitFloor"
                  label="Suite / Unit / Floor (optional)"
                  placeholder="e.g. Suite 401, 3rd Floor"
                  variant="outlined"
                  fullWidth
                  value={formData.address.suiteUnitFloor || ""}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, suiteUnitFloor: e.target.value },
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&:hover": {
                        color: "#2563eb",
                      },
                    },
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Enter suite, unit, or floor</p>
              </div>
              <div>
                <TextField
                  id="businessPark"
                  label="Landmark"
                  placeholder="e.g. Technohub Business Park"
                  variant="outlined"
                  fullWidth
                  value={formData.address.businessPark || ""}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, businessPark: e.target.value },
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&:hover": {
                        color: "#2563eb",
                      },
                    },
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Enter business park or landmark</p>
              </div>
              <div>
                <TextField
                  id="buildingName"
                  label="Building Name"
                  placeholder="e.g. Cyber One Tower"
                  variant="outlined"
                  fullWidth
                  value={formData.address.buildingName || ""}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, buildingName: e.target.value },
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&:hover": {
                        color: "#2563eb",
                      },
                    },
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Enter building name</p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div>
                <div className="flex gap-2 w-full">
                  <Autocomplete
                    id="companyCountryCode"
                    options={countries}
                    autoHighlight
                    disablePortal
                    PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
                    getOptionLabel={(option) => `${option.code} (+${option.phone})`}
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <Box
                          key={key}
                          component="li"
                          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                          {...optionProps}
                        >
                          <Image
                            loading="lazy"
                            width={20}
                            height={15}
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            alt=""
                          />
                          {option.code} (+{option.phone})
                        </Box>
                      );
                    }}
                    value={countries.find((c) => c.phone === formData.address.countryCode) || null}
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        address: { ...formData.address, countryCode: newValue?.phone || "" },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country Code *"
                        placeholder="Select country code"
                        error={!!addressErrors.countryCode}
                        helperText={addressErrors.countryCode}
                        sx={{
                          minWidth: 120,
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#2563eb",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            "&:hover": {
                              color: "#2563eb",
                            },
                          },
                        }}
                      />
                    )}
                    sx={{ minWidth: 120, flex: "0 0 180px" }}
                  />
                  <TextField
                    id="companyContactNumber"
                    label={<span>Contact Number <span style={{ color: "red" }}>*</span></span>}
                    placeholder="Enter company phone number"
                    variant="outlined"
                    value={formData.address.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          contactNumber: e.target.value.replace(/\D/g, ""),
                        },
                      })
                    }
                    error={!!(addressErrors as Record<string, string>).contactNumber || (showAddressErrors && !formData.address.contactNumber)}
                    helperText={
                      (addressErrors as Record<string, string>).contactNumber ||
                      ((showAddressErrors && !formData.address.contactNumber) ? "Contact Number is required" : "")
                    }
                    inputProps={{ maxLength: 15, minLength: 7 }}
                    className="flex-1"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#2563eb",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        "&:hover": {
                          color: "#2563eb",
                        },
                      },
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Provide a phone number for contacting the company.</p>
              </div>
              <div>
                <TextField
                  id="companyContactEmail"
                  label={<span>Contact Email <span style={{ color: "red" }}>*</span></span>}
                  placeholder="Enter company contact email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.address.contactEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, contactEmail: e.target.value },
                    })
                  }
                  error={!!(addressErrors as Record<string, string>).contactEmail || (showAddressErrors && !formData.address.contactEmail)}
                  helperText={
                    (addressErrors as Record<string, string>).contactEmail ||
                    ((showAddressErrors && !formData.address.contactEmail) ? "Contact Email is required" : "")
                  }
                  sx={{
                    mt: 0,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&:hover": {
                        color: "#2563eb",
                      },
                    },
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Provide an email address for contacting the company.</p>
              </div>
            </div>
            <div>
              <TextField
                id="companyWebsite"
                label="Company Website (if applicable)"
                placeholder="e.g. example.com"
                variant="outlined"
                fullWidth
                value={formData.companyWebsite}
                onChange={handleChange}
                error={
                  !!formData.companyWebsite &&
                  !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.companyWebsite)
                }
                helperText={
                  formData.companyWebsite &&
                  !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.companyWebsite)
                    ? "Invalid website format (e.g., example.com)"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#2563eb",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&:hover": {
                      color: "#2563eb",
                    },
                  },
                }}
              />
              <label htmlFor="companyWebsite" className="text-sm text-gray-600">Enter the company&apos;s official website URL</label>
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                Back
              </Button>
              <div className="flex items-center gap-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white"
                  startIcon={isLoading && <CircularProgress size={20} />}
                >
                  {isLoading ? "Loading..." : "Next"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            className="space-y-6 p-6 w-[700px] mx-auto flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6 w-full">
              <div className="px-6">
                <h3 className="text-md font-semibold text-gray-700">Preview</h3>
                <p className="text-sm text-gray-500">Review the details of the company you are about to create.</p>
              </div>
          
              <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full">
                <h4 className="text-lg font-medium text-blue-600 mb-4">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div>
                    <p className="font-semibold">Company Name:</p>
                    <p>{formData.companyName || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Company Branch Name:</p>
                    <p>{formData.companyBranch || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Industry:</p>
                    <p>{formData.companyIndustry || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Company Size:</p>
                    <p>{formData.companySize || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email Domain:</p>
                    <p>{formData.companyEmailDomain || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Website:</p>
                    <p>{formData.companyWebsite || "Not Provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full">
                <h4 className="text-lg font-medium text-blue-600 mb-4">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div>
                    <p className="font-semibold">Address:</p>
                    <p>{formData.address.address || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Suite / Unit / Floor:</p>
                    <p>{formData.address.suiteUnitFloor || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Business Park / Landmark:</p>
                    <p>{formData.address.businessPark || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Building Name:</p>
                    <p>{formData.address.buildingName || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Contact Email:</p>
                    <p>{formData.address.contactEmail || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Contact Number:</p>
                    <p>
                      {formData.address.countryCode
                        ? `+${formData.address.countryCode} `
                        : ""}
                      {formData.address.contactNumber || "Not Provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center w-full">
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white"
                startIcon={isLoading && <CircularProgress size={20} />}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
