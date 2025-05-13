import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

interface FreeSoloProps {
  options: string[];
  label: string;
  onSelectionChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
}

export function FreeSolo({ options, label, onSelectionChange, error, errorMessage }: FreeSoloProps) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Autocomplete
        freeSolo
        options={options}
        onChange={(_, value) => onSelectionChange(value || "")}
        onInputChange={(_, value) => onSelectionChange(value || "")}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={error}
            helperText={error && errorMessage ? errorMessage : ""}
          />
        )}
      />
    </Stack>
  );
}
