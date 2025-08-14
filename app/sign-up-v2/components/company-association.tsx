"use client"
import { useState } from "react"
import { TextField, MenuItem, Autocomplete } from "@mui/material"
import { companyRoles } from "../../(landing)/sign-up/data/company-roles"
import { jobTitles } from "../../(landing)/sign-up/data/job-titles"

const companies = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Globex" },
  { id: "3", name: "Umbrella" },
  { id: "4", name: "Wayne Enterprises" },
  { id: "5", name: "Stark Industries" },
]

const branches = [
  { id: "1", name: "Main Branch" },
  { id: "2", name: "East Branch" },
  { id: "3", name: "West Branch" },
  { id: "4", name: "North Branch" },
  { id: "5", name: "South Branch" },
]

type CompanyAssociationData = {
  companyName?: string
  companyBranch?: string
  jobTitle?: string
  companyRole?: string
  companyEmail?: string
}

function CompanyAssociationFields({
  data = {},
  onChange = () => {},
}: {
  data?: CompanyAssociationData
  onChange?: (data: CompanyAssociationData) => void
}) {
  const [companyInput, setCompanyInput] = useState("")
  const [branchInput, setBranchInput] = useState("")
  return (
    <>
      <div className="text-center mb-6 mt-2 col-span-1 md:col-span-2">
        <div className="text-2xl font-semibold text-gray-800 mb-2">Company Association</div>
        <div className="text-gray-500 text-sm">
          Connect your account to your company so you can post jobs, manage applications, and find the right candidates for your team.
        </div>
      </div>
      <Autocomplete
        options={companies.map((c) => c.name)}
        value={data.companyName || ""}
        onChange={(_, newValue) => onChange({ ...data, companyName: newValue || "" })}
        inputValue={companyInput}
        onInputChange={(_, newInputValue) => setCompanyInput(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={<span>Company Name<span className="text-red-500">*</span></span>}
            variant="outlined"
            size="small"
            fullWidth
            InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
            InputProps={{
              ...params.InputProps,
              className: "bg-white bg-opacity-90 rounded-md"
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#2563eb" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" }
              }
            }}
          />
        )}
        className="col-span-1"
      />
      <Autocomplete
        options={branches.map((b) => b.name)}
        value={data.companyBranch || ""}
        onChange={(_, newValue) => onChange({ ...data, companyBranch: newValue || "" })}
        inputValue={branchInput}
        onInputChange={(_, newInputValue) => setBranchInput(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={<span>Company Branch<span className="text-red-500">*</span></span>}
            variant="outlined"
            size="small"
            fullWidth
            InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
            InputProps={{
              ...params.InputProps,
              className: "bg-white bg-opacity-90 rounded-md"
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#2563eb" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" }
              }
            }}
          />
        )}
        className="col-span-1"
      />
      <Autocomplete
        options={jobTitles.map((j) => (typeof j === "string" ? j : j.title))}
        value={data.jobTitle || ""}
        onChange={(_, newValue) => onChange({ ...data, jobTitle: newValue || "" })}
        renderInput={(params) => (
          <TextField
            {...params}
            label={<span>Job Title<span className="text-red-500">*</span></span>}
            variant="outlined"
            size="small"
            fullWidth
            InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
            InputProps={{
              ...params.InputProps,
              className: "bg-white bg-opacity-90 rounded-md"
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#2563eb" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" }
              }
            }}
          />
        )}
        className="col-span-1"
      />
      <TextField
        select
        label={<span>Position<span className="text-red-500">*</span></span>}
        variant="outlined"
        size="small"
        fullWidth
        value={data.companyRole || ""}
        onChange={(e) => onChange({ ...data, companyRole: e.target.value })}
        InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
        InputProps={{
          className: "bg-white bg-opacity-90 rounded-md"
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": { borderColor: "#2563eb" },
            "&.Mui-focused fieldset": { borderColor: "#2563eb" }
          }
        }}
        className="col-span-1"
      >
        {companyRoles.map((role) => (
          <MenuItem key={role.value} value={role.value}>
            {role.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label={<span>Company Email<span className="text-red-500">*</span></span>}
        variant="outlined"
        size="small"
        type="email"
        fullWidth
        value={data.companyEmail || ""}
        onChange={(e) => onChange({ ...data, companyEmail: e.target.value })}
        InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
        InputProps={{
          className: "bg-white bg-opacity-90 rounded-md"
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": { borderColor: "#2563eb" },
            "&.Mui-focused fieldset": { borderColor: "#2563eb" }
          }
        }}
        className="col-span-2"
      />
    </>
  )
}

export default CompanyAssociationFields

