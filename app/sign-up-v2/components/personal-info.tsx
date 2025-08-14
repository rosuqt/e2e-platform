"use client"
import { TextField, MenuItem } from "@mui/material"
import { countries } from "../../(landing)/sign-up/data/countries"

export default function PersonalInfoFields({ data = {}, onChange = () => {} }) {
  return (
    <>
      <TextField
        label={<span>First Name<span className="text-red-500">*</span></span>}
        variant="outlined"
        size="small"
        fullWidth
        value={data.firstName || ""}
        onChange={e => onChange({ ...data, firstName: e.target.value })}
        InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
        InputProps={{
          className: "bg-white bg-opacity-90 rounded-md"
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#2563eb"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb"
            }
          }
        }}
      />
      <TextField
        label={<span>Last Name<span className="text-red-500">*</span></span>}
        variant="outlined"
        size="small"
        fullWidth
        value={data.lastName || ""}
        onChange={e => onChange({ ...data, lastName: e.target.value })}
        InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
        InputProps={{
          className: "bg-white bg-opacity-90 rounded-md"
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#2563eb"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb"
            }
          }
        }}
      />
      <TextField
        label="Middle Name"
        variant="outlined"
        size="small"
        fullWidth
        value={data.middleName || ""}
        onChange={e => onChange({ ...data, middleName: e.target.value })}
        InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
        InputProps={{
          className: "bg-white bg-opacity-90 rounded-md"
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#2563eb"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb"
            }
          }
        }}
      />
      <TextField
        select
        label="Suffix"
        variant="outlined"
        size="small"
        fullWidth
        value={data.suffix || ""}
        onChange={e => onChange({ ...data, suffix: e.target.value })}
        InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
        InputProps={{
          className: "bg-white bg-opacity-90 rounded-md"
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#2563eb"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb"
            }
          }
        }}
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="Jr.">Jr.</MenuItem>
        <MenuItem value="Sr.">Sr.</MenuItem>
        <MenuItem value="II">II</MenuItem>
        <MenuItem value="III">III</MenuItem>
        <MenuItem value="IV">IV</MenuItem>
      </TextField>
      <div className="col-span-1 md:col-span-2 flex flex-row gap-2">
        <TextField
          select
          label="Code"
          variant="outlined"
          size="small"
          className="w-32"
          value={data.code || "US"}
          onChange={e => onChange({ ...data, code: e.target.value })}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 250,
                  overflowY: "auto"
                }
              },
            },
            renderValue: (selected) => {
              const country = countries.find(c => c.code === selected);
              return (
                <span className="flex items-center gap-2">
                  <img
                    loading="lazy"
                    width={20}
                    height={15}
                    src={`https://flagcdn.com/w20/${country?.code.toLowerCase()}.png`}
                    alt=""
                    style={{ display: "inline-block", marginRight: 4 }}
                  />
                  +{country?.phone}
                </span>
              );
            }
          }}
          InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
          InputProps={{
            className: "bg-white bg-opacity-90 rounded-md"
          }}
          sx={{
            minWidth: 100,
            maxWidth: 120,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#2563eb"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2563eb"
              }
            }
          }}
        >
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <img
                  loading="lazy"
                  width={20}
                  height={15}
                  src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                  alt=""
                  style={{ display: "inline-block", marginRight: 4 }}
                />
                +{country.phone}
              </span>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={<span>Phone Number<span className="text-red-500">*</span></span>}
          variant="outlined"
          size="small"
          type="tel"
          value={data.phone || ""}
          onChange={e => onChange({ ...data, phone: e.target.value })}
          InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
          InputProps={{
            className: "bg-white bg-opacity-90 rounded-md"
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#2563eb"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2563eb"
              }
            }
          }}
        />
        <TextField
          label={<span>Email<span className="text-red-500">*</span></span>}
          variant="outlined"
          size="small"
          type="email"
          value={data.email || ""}
          onChange={e => onChange({ ...data, email: e.target.value })}
          InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
          InputProps={{
            className: "bg-white bg-opacity-90 rounded-md"
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#2563eb"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2563eb"
              }
            }
          }}
        />
      </div>
    </>
  )
}
