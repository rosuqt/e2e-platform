"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TextField, MenuItem, Button, Switch, Tabs, Tab, Tooltip, CircularProgress } from "@mui/material"
import { InfoOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete from "@mui/material/Autocomplete";
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

export default function CreateCompanyModal({ onClose }: { onClose: (newCompany?: { companyName: string; companyBranch: string }) => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const [isNextDisabled, setIsNextDisabled] = useState(false)
  const [noBranches] = useState(false)
  const [companyNameError, setCompanyNameError] = useState("");
  const [addressErrors, setAddressErrors] = useState({
    contactEmail: "",
    contactNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",
    companyBranch: "",
    companyIndustry: "",
    companySize: "",
    companyEmailDomain: "",
    companyWebsite: "",
    multipleBranch: true, 
    address: {
      country: "",
      city: "",
      street: "",
      province: "",
      contactEmail: "",
      contactNumber: "",
      exactAddress: "",
    },
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
    } else if (id === "companyBranch") {
      truncatedValue = value.slice(0, 40);
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

      if (companyNameError || branchNameError || emailDomainError || websiteError) {
        setCompanyNameError(companyNameError);
        setIsNextDisabled(true);
        setIsLoading(false);
        return;
      }

      setCompanyNameError("");
      setIsNextDisabled(false);

      const isInvalid =
        !formData.companyName || !formData.companyBranch || !formData.companyIndustry;

      setIsNextDisabled(isInvalid); 
      if (isInvalid) {
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
          console.error("Error checking company name:", result.message);
          toast.error("An error occurred while validating the company name. Please try again.");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error checking company name:", error);
        toast.error("An error occurred while validating the company name. Please try again.");
        setIsLoading(false);
        return; 
      }

      setCompanyNameError("");
    }

    if (activeTab === 1) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.address.contactEmail);
      const numberValid = /^[0-9+\-()\s]+$/.test(formData.address.contactNumber);

      setAddressErrors({
        contactEmail: emailValid ? "" : "Invalid email format",
        contactNumber: numberValid ? "" : "Invalid phone number format",
      });

      if (!emailValid || !numberValid) {
        setIsLoading(false);
        return;
      }
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

  const handleSkipAddress = () => {
    setFormData({
      ...formData,
      address: {
        country: "",
        city: "",
        street: "",
        province: "",
        contactEmail: "",
        contactNumber: "",
        exactAddress: "",
      },
    });
    console.log("Address section skipped");
    setActiveTab(2);
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

        onClose({ companyName: result.data.company_name, companyBranch: result.data.company_branch });
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
            setActiveTab(newValue);
          }}
          className="mb-4"
        >
          <Tab label="Company Information" />
          <Tab label="Company Address" disabled={activeTab === 0 && isNextDisabled} />
          <Tab label="Preview" disabled={activeTab === 0 && isNextDisabled} />
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
                  label="Company Name *"
                  variant="outlined"
                  fullWidth
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!companyNameError || (isNextDisabled && !formData.companyName)}
                  helperText={
                    companyNameError || 
                    (isNextDisabled && !formData.companyName ? "Company Name is required" : "Enter the full name of the company")
                  } 
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: companyNameError || (isNextDisabled && !formData.companyName) ? "red" : "darkgray", 
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: companyNameError || (isNextDisabled && !formData.companyName) ? "red" : "gray",
                    },
                  }}
                />
              </motion.div>
              <motion.div
                {...(isNextDisabled && !formData.companyBranch ? shakeAnimation : {})}
                className="relative"
              >
                <TextField
                  id="companyBranch"
                  label="Company Branch Name *"
                  variant="outlined"
                  fullWidth
                  value={noBranches ? "Headquarters" : formData.companyBranch}
                  onChange={handleChange}
                  disabled={noBranches}
                  error={!!companyNameError || (isNextDisabled && !formData.companyBranch)}
                  helperText={
                    companyNameError || 
                    (isNextDisabled && !formData.companyBranch ? "Company Branch Name is required" : "")
                  }
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
                  label="Industry *"
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
                  variant="outlined"
                  fullWidth
                  value={formData.companySize}
                  onChange={(e) =>
                    setFormData({ ...formData, companySize: e.target.value })
                  }
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
              />
              <TextField
                id="companyEmailDomain"
                label="Company Email Domain (if applicable)"
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
              />
            </div>
            <label htmlFor="companyEmailDomain" className="text-sm text-gray-600">Provide the email domain used by the company (e.g company.com)</label>
            <TextField
              id="companyWebsite"
              label="Company Website (if applicable)"
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
            />
            <label htmlFor="companyWebsite" className="text-sm text-gray-600">Enter the company&apos;s official website URL</label>

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Autocomplete
                  id="companyCountry"
                  options={countries}
                  getOptionLabel={(option) => option.label}
                  value={countries.find((country) => country.label === formData.address.country) || null}
                  onChange={(event, newValue) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: newValue ? newValue.label : "" },
                    })
                  }
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <Image
                        loading="lazy"
                        width={20}
                        height={15}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <p className="text-xs text-gray-500 mt-1">Select the country where the company is located.</p>
              </div>
              <div>
                <TextField
                  id="companyCity"
                  label="City/Region"
                  variant="outlined"
                  fullWidth
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Enter the city or region of the company&apos;s address.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <TextField
                  id="companyStreet"
                  label="Street"
                  variant="outlined"
                  fullWidth
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Provide the street name or number of the company&apos;s address.</p>
              </div>
              <div>
                <TextField
                  id="companyProvince"
                  label="Province/State"
                  variant="outlined"
                  fullWidth
                  value={formData.address.province}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, province: e.target.value },
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Enter the province or state of the company&apos;s address.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <TextField
                  id="companyContactEmail"
                  label="Contact Email"
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
                  error={!!addressErrors.contactEmail}
                  helperText={addressErrors.contactEmail}
                />
                <p className="text-xs text-gray-500 mt-1">Provide an email address for contacting the company.</p>
              </div>
              <div>
                <TextField
                  id="companyContactNumber"
                  label="Contact Number"
                  variant="outlined"
                  fullWidth
                  value={formData.address.contactNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, contactNumber: e.target.value },
                    })
                  }
                  error={!!addressErrors.contactNumber}
                  helperText={addressErrors.contactNumber}
                />
                <p className="text-xs text-gray-500 mt-1">Provide a phone number for contacting the company.</p>
              </div>
            </div>

            <div>
              <TextField
                id="companyExactAddress"
                label="Exact Address"
                variant="outlined"
                fullWidth
                value={formData.address.exactAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, exactAddress: e.target.value },
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">Provide the full exact address of the company.</p>
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
                <button
                  onClick={handleSkipAddress}
                  className="text-blue-600 hover:underline"
                >
                  Skip
                </button>
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
                    <p className="font-semibold">Country:</p>
                    <p>{formData.address.country || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">City:</p>
                    <p>{formData.address.city || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Street:</p>
                    <p>{formData.address.street || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Province:</p>
                    <p>{formData.address.province || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Contact Email:</p>
                    <p>{formData.address.contactEmail || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Contact Number:</p>
                    <p>{formData.address.contactNumber || "Not Provided"}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <p className="font-semibold">Exact Address:</p>
                    <p>{formData.address.exactAddress || "Not Provided"}</p>
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
