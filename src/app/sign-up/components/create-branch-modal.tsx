"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { TextField, MenuItem, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleBlur = async () => {
    if (!formData.branchName.trim()) {
      setBranchNameError("Branch Name is required");
      setIsNextDisabled(true);
      branchNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

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
    setFormData({ ...formData, [id]: value });

    if (id === "branchName" && value.trim()) {
      setIsNextDisabled(false);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting formData:", { ...formData, companyId });
      const response = await fetch("/api/branches/new-branch", {
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
            label="Branch Name"
            variant="outlined"
            fullWidth
            value={formData.branchName}
            onChange={(e) => {
              setFormData({ ...formData, branchName: e.target.value });
              setBranchNameError("");
              if (isNextDisabled && e.target.value.trim()) {
                setIsNextDisabled(false);
              }
            }}
            onBlur={handleBlur}
            error={!!branchNameError}
            helperText={branchNameError || "e.g., Downtown Office"}
            InputProps={{
              style: branchNameError
                ? { borderColor: "red", animation: "shake 0.3s" }
                : {},
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Provide a unique name for the branch.</p>
        </motion.div>

        <TextField
          id="branchPhone"
          label="Phone Number"
          variant="outlined"
          fullWidth
          value={formData.branchPhone}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500 mt-1">Enter the branch&apos;s contact phone number.</p>

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
            id="branchEmailDomain"
            label="Email Domain (if applicable)"
            variant="outlined"
            fullWidth
            value={formData.branchEmailDomain.startsWith("@") ? formData.branchEmailDomain.slice(1) : formData.branchEmailDomain}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({
                ...formData,
                branchEmailDomain: value.startsWith("@") ? value : `@${value}`,
              });
            }}
            InputProps={{
              style: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Specify the email domain for the branch, e.g., &quot;branch.example.com&quot;.</p>

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
              <p className="text-xs text-gray-500 mt-1">Select the country where the branch is located.</p>
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
              <p className="text-xs text-gray-500 mt-1">Enter the city or region of the branch.</p>
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
            <p className="text-xs text-gray-500 mt-1">Provide the street address of the branch.</p>
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
            <p className="text-xs text-gray-500 mt-1">Enter the province or state of the branch.</p>
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
            <p className="text-xs text-gray-500 mt-1">Provide additional details for the branch&apos;s exact location.</p>
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