"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { TextField, MenuItem, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { countries } from "../data/countries";
import Image from "next/image";

const shakeAnimation = {
  initial: { x: 0 },
  animate: { x: [0, -5, 5, -5, 5, 0] },
  transition: { duration: 0.3 },
};

export default function CreateBranchModal({
  onClose,
  companyId,
}: {
  onClose: (branchDetails?: { branchName: string }) => void;
  companyId: string;
}) {
  const branchNameRef = useRef<HTMLDivElement>(null);
  const branchPhoneRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    branchName: "",
    branchPhone: "",
    branchEmailDomain: "",
    address: {
      country: "",
      city: "",
      street: "",
      province: "",
      exactAddress: "",
    },
  });

  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [branchNameError, setBranchNameError] = useState("");
  const [branchPhoneError, setBranchPhoneError] = useState("");
  const [branchCountryCodeError, setBranchCountryCodeError] = useState("");

  const handleBlur = async () => {
    try {
      const response = await fetch(`/api/sign-up/create-branch/check-branch-name?name=${encodeURIComponent(formData.branchName)}`);
      const result = await response.json();

      if (response.ok && result.exists) {
        setBranchNameError(`Branch name "${formData.branchName}" already exists. Please choose a different name.`);
        setIsNextDisabled(true);
      } else if (!response.ok) {
        setBranchNameError("An error occurred while validating the branch name. Please try again.");
      } else {
        setBranchNameError("");
        setIsNextDisabled(false);
      }
    } catch {
      setBranchNameError("An error occurred while validating the branch name. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "branchName") {
      setBranchNameError("");
    }

    if (id === "branchPhone") {
      setBranchPhoneError("");
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    let hasError = false;

    if (!formData.branchName.trim()) {
      setBranchNameError("Branch Name is required.");
      branchNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      hasError = true;
    } else if (formData.branchName.length < 2 || formData.branchName.length > 40) {
      setBranchNameError("Branch Name must be between 2 and 40 characters.");
      branchNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      hasError = true;
    } else {
      try {
        const response = await fetch(`/api/sign-up/create-branch/check-branch-name?name=${encodeURIComponent(formData.branchName)}`);
        const result = await response.json();

        if (result.exists) {
          setBranchNameError(`Branch name "${formData.branchName}" already exists. Please choose a different name.`);
          branchNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          hasError = true;
        }
      } catch (error) {
        console.error("Error checking branch name:", error);
        setBranchNameError("An error occurred while validating the branch name. Please try again.");
        hasError = true;
      }
    }

    if (!formData.branchPhone.trim()) {
      setBranchPhoneError("Phone Number is required.");
      branchPhoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      hasError = true;
    } else if (formData.branchPhone.split(" ").slice(1).join("").length < 8 || formData.branchPhone.split(" ").slice(1).join("").length > 15) {
      setBranchPhoneError("Phone Number must be between 8 and 15 digits.");
      branchPhoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      hasError = true;
    }

    if (!formData.branchPhone.split(" ")[0]) {
      setBranchCountryCodeError("Country Code is required.");
      branchPhoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      hasError = true;
    }

    if (hasError) return;

    try {
      console.log("Submitting formData:", { ...formData, companyId });
      const response = await fetch("/api/sign-up/create-branch/new-branch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, companyId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Branch data submitted successfully:", result);

        const branchName = result.data?.branch_name || result.branch?.branch_name || "unknown";

        if (!toast.isActive("branchCreated")) {
          toast.success(`Branch "${branchName}" created successfully!`, { toastId: "branchCreated" });
        }

        if (branchName !== "unknown") {
          onClose({ branchName });
        } else {
          console.warn("API response does not contain branch_name. Full response:", result);
          onClose();
        }
      } else {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        setBranchNameError("An error occurred while creating the branch. Please try again.");
        branchNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        toast.error("Failed to create branch. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting branch data:", error);
      setBranchNameError("An unexpected error occurred. Please try again.");
      branchNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("An error occurred while creating the branch.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Create New Branch for Company</h2>
        <Button
          variant="text"
          onClick={() => onClose()}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </Button>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          ref={branchNameRef}
          {...(branchNameError ? shakeAnimation : {})}
        >
          <TextField
            id="branchName"
            label="Branch Name *"
            variant="outlined"
            fullWidth
            value={formData.branchName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!branchNameError}
            helperText={branchNameError}
            inputProps={{ maxLength: 40 }}
          />
        </motion.div>

        <motion.div
          ref={branchPhoneRef}
          {...(branchPhoneError || branchCountryCodeError ? shakeAnimation : {})}
        >
          <div className="flex items-center gap-3">
            <Autocomplete
              id="branchCountryCode"
              options={countries}
              autoHighlight
              disablePortal
              PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
              getOptionLabel={(option: { code: string; phone: string }) => `${option.code} (+${option.phone})`}
              renderOption={(props, option: { code: string; phone: string }) => {
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
              value={countries.find((c) => c.phone === formData.branchPhone.split(" ")[0]) || null}
              onChange={(event, newValue) => {
                const phoneWithoutCode = formData.branchPhone.split(" ").slice(1).join(" ");
                setFormData({ ...formData, branchPhone: `${newValue?.phone || ""} ${phoneWithoutCode}` });
                setBranchCountryCodeError(""); // Clear error on valid selection
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country Code *"
                  error={!!branchCountryCodeError}
                  helperText={branchCountryCodeError}
                />
              )}
              sx={{ minWidth: 200 }}  
            />
            <TextField
              id="branchPhone"
              label="Phone Number *"
              variant="outlined"
              fullWidth
              value={formData.branchPhone.split(" ").slice(1).join(" ")}
              onChange={(e) => {
                const value = e.target.value;
                const countryCode = formData.branchPhone.split(" ")[0];
                setFormData({ ...formData, branchPhone: `${countryCode} ${value}` });
              }}
              error={!!branchPhoneError}
              helperText={branchPhoneError}
              inputProps={{ maxLength: 15, minLength: 8 }}
            />
          </div>
        </motion.div>

        <div className="flex items-center">
          <TextField
            value="@"
            variant="outlined"
            disabled
            className="w-16 text-center"
          />
          <TextField
            id="branchEmailDomain"
            label="Email Domain (if applicable)"
            variant="outlined"
            fullWidth
            value={formData.branchEmailDomain.startsWith("@") ? formData.branchEmailDomain.slice(1) : formData.branchEmailDomain}
            onChange={handleChange}
          />
        </div>

        <h3 className="text-lg font-semibold text-blue-700 mt-6">
          Branch Address <span className="text-sm text-gray-500">(leave blank to skip for now)</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TextField
                id="branchCountry"
                select
                label="Country"
                variant="outlined"
                fullWidth
                value={formData.address.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value },
                  })
                }
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                        overflowY: "auto",
                      },
                    },
                    disablePortal: true,
                  },
                }}
              >
                <MenuItem value="us">United States</MenuItem>
                <MenuItem value="ca">Canada</MenuItem>
                <MenuItem value="uk">United Kingdom</MenuItem>
                <MenuItem value="au">Australia</MenuItem>
                <MenuItem value="de">Germany</MenuItem>
                <MenuItem value="fr">France</MenuItem>
                <MenuItem value="jp">Japan</MenuItem>
              </TextField>
            </div>

            <div>
              <TextField
                id="branchCity"
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
            </div>
          </div>

          <div>
            <TextField
              id="branchStreet"
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
          </div>

          <div>
            <TextField
              id="branchProvince"
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
          </div>

          <div>
            <TextField
              id="branchExactAddress"
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
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isNextDisabled}
            className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white"
          >
            Create Branch
          </Button>
        </div>
      </motion.div>
    </div>
  );
}