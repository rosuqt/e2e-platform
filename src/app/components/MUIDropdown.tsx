import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Option {
  value: string | number | "";
  label: string;
}

interface MUIDropdownProps {
  label: string;
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string; 
}

const MUIDropdown: React.FC<MUIDropdownProps> = ({ label, options, value, onChange, error, errorMessage }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as string);
  };

  return (
    <FormControl
      fullWidth
      className={`w-full px-3 py-2 ${error ? "border-red-500 animate-shake" : ""}`}
    >
      <InputLabel
        id="mui-dropdown-label"
        style={{ color: error ? "red" : undefined }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="mui-dropdown-label"
        id="mui-dropdown"
        value={String(value)}
        label={label}
        onChange={handleChange}
        error={error}
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
      {error && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </FormControl>
  );
};

export default MUIDropdown;
