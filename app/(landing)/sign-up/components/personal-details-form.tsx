"use client"

import { motion } from "framer-motion"
import { TextField, InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import { FaUser } from "react-icons/fa"
import { PersonalDetails } from "../types";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { countries } from "../data/countries";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PersonalDetailsForm({
  data = { firstName: "", middleName: "", lastName: "", suffix: "", countryCode: "", phone: "", email: "", password: "", confirmPassword: "" },
  onChange,
  errors = {},
}: {
  data: PersonalDetails & { suffix?: string };
  onChange: (data: PersonalDetails & { suffix?: string }) => void;
  errors: { [key: string]: string };
}) {
  const errorAnimation = {
    initial: { x: 0 },
    animate: { x: [0, -10, 10, -10, 10, 0] },
    transition: { duration: 0.4 },
  }

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <motion.div
      className="space-y-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4  flex items-center space-x-2 pb-2 border-b border-gray-300">
        <div className="bg-blue-100 p-2 rounded-full">
          <FaUser className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Personal Details</h2>
      </div>

      <div className="overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_150px_1fr_100px] gap-3 px-6 mb-6 ">
        <motion.div {...(errors.firstName ? errorAnimation : {})}>
          <TextField
            id="firstName"
            label={<span>First Name <span className="text-red-600">*</span></span>}
            placeholder="Enter your first name"
            variant="outlined"
            fullWidth
            value={data.firstName}
            onChange={(e) => {
              const value = e.target.value;
              onChange({ ...data, firstName: value });
            }}
            error={!!errors.firstName}
            helperText={errors.firstName}
            inputProps={{ maxLength: 35, minLength: 1}}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "darkgray" },
                "&:hover fieldset": { borderColor: "#2563eb" },
              },
              "& .MuiInputLabel-root": { color: "gray" },
            }}
          />
        </motion.div>
        <motion.div
          className="md:col-span-1"
          style={{ minWidth: 0, maxWidth: 150 }}
          {...(errors.middleName ? errorAnimation : {})}
        >
          <TextField
            id="middleName"
            label="Middle Name"
            placeholder="Enter your middle name (optional)"
            variant="outlined"
            fullWidth
            value={data.middleName || ""}
            onChange={(e) => {
              const value = e.target.value;
              onChange({ ...data, middleName: value });
            }}
            error={!!errors.middleName}
            helperText={errors.middleName}
            inputProps={{ maxLength: 35 }}
            sx={{
              width: 150,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "darkgray" },
                "&:hover fieldset": { borderColor: "#2563eb" },
              },
              "& .MuiInputLabel-root": { color: "gray" },
            }}
          />
        </motion.div>
        <motion.div
          className="flex w-full"
          style={{ minWidth: 0 }}
          {...(errors.lastName ? errorAnimation : {})}
        >
          <TextField
            id="lastName"
            label={<span>Last Name <span className="text-red-600">*</span></span>}
            placeholder="Enter your last name"
            variant="outlined"
            fullWidth
            value={data.lastName}
            onChange={(e) => {
              const value = e.target.value;
              onChange({ ...data, lastName: value });
            }}
            error={!!errors.lastName}
            helperText={errors.lastName}
            inputProps={{ maxLength: 36, minLength: 1 }}
            sx={{
              width: "100%",
              flex: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "darkgray" },
                "&:hover fieldset": { borderColor: "#2563eb" },
              },
              "& .MuiInputLabel-root": { color: "gray" },
            }}
          />
        </motion.div>
        <FormControl sx={{ minWidth: 80, maxWidth: 100, flexShrink: 0 }}>
          <InputLabel id="suffix-label">Suffix</InputLabel>
          <Select
            labelId="suffix-label"
            id="suffix"
            value={data.suffix || ""}
            label="Suffix"
            onChange={(e) => onChange({ ...data, suffix: e.target.value })}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Jr.">Jr.</MenuItem>
            <MenuItem value="Sr.">Sr.</MenuItem>
            <MenuItem value="II">II</MenuItem>
            <MenuItem value="III">III</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-3 px-6 mb-6">
        <motion.div className="col-span-1" {...(errors.countryCode ? errorAnimation : {})}>
          <Autocomplete
            id="countryCode"
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
            value={countries.find((c) => c.phone === data.countryCode) || null}
            onChange={(event, newValue) => {
              onChange({ ...data, countryCode: newValue?.phone || "" });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<span>Code <span className="text-red-600">*</span></span>}
                placeholder="Select your country code"
                error={!!errors.countryCode}
                helperText={errors.countryCode}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "darkgray" },
                    "&:hover fieldset": { borderColor: "#2563eb" },
                  },
                  "& .MuiInputLabel-root": { color: "gray" },
                }}
              />
            )}
            sx={{ minWidth: 120 }}
          />
        </motion.div>
        <motion.div className="col-span-1" {...(errors.phone ? errorAnimation : {})}>
          <TextField
            id="phone"
            label={<span>Phone Number <span className="text-red-600">*</span></span>}
            placeholder="Enter your phone number"
            variant="outlined"
            fullWidth
            value={data.phone}
            onChange={(e) => {
              let value = e.target.value;
              const country = countries.find((c) => c.phone === data.countryCode);
              if (country?.code === "PH" && value.startsWith("0")) {
                value = value.replace(/^0+/, "");
              }
              onChange({ ...data, phone: value });
            }}
            error={!!errors.phone}
            helperText={errors.phone}
            inputProps={{ maxLength: 15, minLength: 7 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "darkgray" },
                "&:hover fieldset": { borderColor: "#2563eb" },
              },
              "& .MuiInputLabel-root": { color: "gray" },
            }}
          />
        </motion.div>
      </div>

      <motion.div className="px-6 mb-6" {...(errors.email ? errorAnimation : {})}>
        <TextField
          id="email"
          label={<span>Personal Email <span className="text-red-600">*</span></span>}
          placeholder="Enter your personal email"
          type="email"
          variant="outlined"
          fullWidth
          value={data.email}
          onChange={(e) => {
            const value = e.target.value;
            const emailRegex = /^[^\s@]+@([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/;
            const domainPart = value.split('@')[1];
            let emailError = "";
            if (!emailRegex.test(value)) {
              emailError = "Invalid email format";
            } else if (
              domainPart &&
              domainPart
                .split('.')
                .some(
                  label =>
                    label.startsWith('-') ||
                    label.endsWith('-')
                )
            ) {
              emailError = "Invalid email format";
            }
            onChange({ ...data, email: value });
            errors.email = emailError;
          }}
          error={!!errors.email}
          helperText={errors.email}
          inputProps={{ maxLength: 254, minLength: 6 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "darkgray" },
              "&:hover fieldset": { borderColor: "#2563eb" },
            },
            "& .MuiInputLabel-root": { color: "gray" },
          }}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-6 mb-6">
        <motion.div {...(errors.password ? errorAnimation : {})}>
          <TextField
            id="password"
            label={<span>Password <span className="text-red-600">*</span></span>}
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={data.password}
            onChange={(e) => {
              const value = e.target.value;
              let passwordError = "";
              if (value.length < 8) {
                passwordError = "Password must be at least 8 characters";
              } else if (!/[A-Z]/.test(value)) {
                passwordError = "Password must contain an uppercase letter";
              } else if (!/[a-z]/.test(value)) {
                passwordError = "Password must contain a lowercase letter";
              } else if (!/[0-9]/.test(value)) {
                passwordError = "Password must contain a digit";
              } else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\];'/`~+=]/.test(value)) {
                passwordError = "Password must contain a special character";
              }
              onChange({ ...data, password: value });
              errors.password = passwordError;
            }}
            error={!!errors.password}
            helperText={errors.password}
            inputProps={{ maxLength: 128, minLength: 8 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                  >
                    {showPassword ? (
                      <Eye className="text-gray-500 w-5 h-5" />
                    ) : (
                      <EyeOff className="text-gray-500 w-5 h-5" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "darkgray" },
                "&:hover fieldset": { borderColor: "#2563eb" },
              },
              "& .MuiInputLabel-root": { color: "gray" },
            }}
          />
        </motion.div>
        <motion.div {...(errors.confirmPassword ? errorAnimation : {})}>
          <TextField
            id="confirmPassword"
            label={<span>Confirm Password <span className="text-red-600">*</span></span>}
            placeholder="Re-enter your password"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={data.confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              const confirmPasswordError = value !== data.password ? "Passwords do not match" : "";
              onChange({ ...data, confirmPassword: value });
              errors.confirmPassword = confirmPasswordError;
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            inputProps={{ maxLength: 128, minLength: 8 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <Eye className="text-gray-500 w-5 h-5" />
                    ) : (
                      <EyeOff className="text-gray-500 w-5 h-5" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "darkgray" },
                "&:hover fieldset": { borderColor: "#2563eb" },
              },
              "& .MuiInputLabel-root": { color: "gray" },
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}



