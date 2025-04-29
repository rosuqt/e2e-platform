import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState } from "react";

interface Option {
  value: string | number | ""; // Allow empty string as a valid value
  label: string;
}

interface MUIDropdownProps {
  label: string;
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
}

const MUIDropdown: React.FC<MUIDropdownProps> = ({ label, options, value, onChange }) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setTouched(true);
    onChange(event.target.value as string);
  };

  const isValid = value !== undefined && value !== "";

  return (
    <FormControl fullWidth className="w-full px-3 py-2">
      <InputLabel id="mui-dropdown-label">{label}</InputLabel>
      <Select
        labelId="mui-dropdown-label"
        id="mui-dropdown"
        value={String(value)}
        label={label}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        error={!isValid && touched}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={{
              backgroundColor: "white",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ebf8ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {!isValid && touched && (
        <p className="text-red-500 text-sm mt-1">This field must be filled</p>
      )}
    </FormControl>
  );
};

export default MUIDropdown;
