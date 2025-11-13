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
  inputValue?: string;
}

export function FreeSolo({ options, label, onSelectionChange, error, errorMessage, inputValue }: FreeSoloProps) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={inputValue}
        onInputChange={(_, value, reason) => {
          if (reason === "input") {
            onSelectionChange(value || "");
          }
        }}
        onChange={(_, value, reason) => {
          if (reason === "selectOption" || reason === "createOption") {
            onSelectionChange(value || "");
          }
        }}
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
