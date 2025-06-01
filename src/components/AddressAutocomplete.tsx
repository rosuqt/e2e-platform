'use client';

import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Popper from '@mui/material/Popper'

type Location = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function AddressAutocomplete({
  value,
  onChange,
  error,
  helperText,
  label = (
    <span>
      Address <span style={{ color: 'red' }}>*</span>
    </span>
  ),
  height,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  label?: React.ReactNode;
  height?: string | number;
}) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState<Location[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    if (focused && query.length > 2) {
      fetch(
        `https://api.locationiq.com/v1/autocomplete?key=pk.c385b06f82c7878e38c31e1b697d7b7f&q=${encodeURIComponent(
          query
        )}&limit=5&dedupe=1&`
      )
        .then((res) => res.json())
        .then((data) => setResults(Array.isArray(data) ? data : []))
        .catch(() => setResults([]));
    } else if (!focused) {
      setResults([]);
    }
  }, [query, focused]);

  useEffect(() => {
    if (inputRef.current) setAnchorEl(inputRef.current);
  }, []);

  return (
    <div
      className="w-full relative"
      tabIndex={-1}
      onBlur={() => setTimeout(() => setFocused(false), 100)}
    >
      <TextField
        inputRef={inputRef}
        fullWidth
        variant="outlined"
        label={label}
        value={query}
        error={error}
        helperText={helperText}
        onFocus={() => {
          setFocused(true);
          if (query.length > 2 && results.length === 0) {
            fetch(
              `https://api.locationiq.com/v1/autocomplete?key=pk.c385b06f82c7878e38c31e1b697d7b7f&q=${encodeURIComponent(
                query
              )}&limit=5&dedupe=1&`
            )
              .then((res) => res.json())
              .then((data) => setResults(Array.isArray(data) ? data : []))
              .catch(() => setResults([]));
          }
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        autoComplete="off"
        sx={height ? { height, '& .MuiInputBase-root': { height } } : undefined}
      />
      <Popper
        open={focused && results.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorEl?.offsetWidth || undefined }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
        ]}
      >
        <ul
          className="border border-gray-300 mt-1 rounded bg-white max-h-60 overflow-y-auto w-full"
        >
          {Array.isArray(results) && results.map((loc, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                setQuery(loc.display_name);
                onChange(loc.display_name);
                setResults([]);
              }}
            >
              {loc.display_name}
            </li>
          ))}
        </ul>
      </Popper>
    </div>
  );
}
