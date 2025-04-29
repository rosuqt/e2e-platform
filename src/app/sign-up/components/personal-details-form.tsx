"use client"

import { motion } from "framer-motion"
import { TextField } from "@mui/material"
import { FaUser } from "react-icons/fa"
import { PersonalDetails } from "../types";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { countries } from "../data/countries";
import Image from "next/image";

export default function PersonalDetailsForm({
  data = { firstName: "", lastName: "", countryCode: "", phone: "", email: "", password: "", confirmPassword: "" },
  onChange,
  errors = {},
}: {
  data: PersonalDetails;
  onChange: (data: PersonalDetails) => void;
  errors: { [key: string]: string };
}) {
  const errorAnimation = {
    initial: { x: 0 },
    animate: { x: [0, -10, 10, -10, 10, 0] },
    transition: { duration: 0.4 },
  }

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 -mt-2 flex items-center space-x-2 pb-2 border-b border-gray-300">
        <div className="bg-blue-100 p-2 rounded-full">
          <FaUser className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Personal Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-6">
        <motion.div {...(errors.firstName ? errorAnimation : {})}>
          <TextField
            id="firstName"
            label="First Name *"
            variant="outlined"
            fullWidth
            value={data.firstName}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </motion.div>
        <motion.div {...(errors.lastName ? errorAnimation : {})}>
          <TextField
            id="lastName"
            label="Last Name *"
            variant="outlined"
            fullWidth
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-6">
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
                label="Country Code *"
                error={!!errors.countryCode}
                helperText={errors.countryCode}
              />
            )}
            sx={{ minWidth: 120 }}
          />
        </motion.div>
        <motion.div className="col-span-2" {...(errors.phone ? errorAnimation : {})}>
          <TextField
            id="phone"
            label="Phone Number *"
            variant="outlined"
            fullWidth
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </motion.div>
      </div>

      <motion.div className="px-6" {...(errors.email ? errorAnimation : {})}>
        <TextField
          id="email"
          label="Personal Email *"
          type="email"
          variant="outlined"
          fullWidth
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-6">
        <motion.div {...(errors.password ? errorAnimation : {})}>
          <TextField
            id="password"
            label="Password *"
            type="password"
            variant="outlined"
            fullWidth
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
          />
        </motion.div>
        <motion.div {...(errors.confirmPassword ? errorAnimation : {})}>
          <TextField
            id="confirmPassword"
            label="Confirm Password *"
            type="password"
            variant="outlined"
            fullWidth
            value={data.confirmPassword}
            onChange={(e) => onChange({ ...data, confirmPassword: e.target.value })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
