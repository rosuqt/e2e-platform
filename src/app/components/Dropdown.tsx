import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown, Frown } from "lucide-react";

export interface DropdownOption {
  id?: string;
  name: string;
  logo?: string | React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  width?: string;
  placeholder?: string;
  value?: DropdownOption | null;
  onChange?: (option: DropdownOption | null) => void;
}

export default function Dropdown({
  options,
  width = "w-full",
  placeholder = "Select option",
  value,
  onChange,
}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(value || null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setSelectedOption(value || null);
    setSearchQuery("");
  }, [value]);

  const handleSelect = (selected: DropdownOption) => {
    setSelectedOption(selected);
    setSearchQuery("");
    if (onChange) onChange(selected);
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Listbox value={selectedOption} onChange={handleSelect}>
      <div className={`relative ${width}`}>
        {/* Button */}
        <Listbox.Button className={`flex items-center justify-between border p-2 bg-white ${width}`}>
          <div className="flex items-center gap-2">
            {selectedOption?.logo && typeof selectedOption.logo === "string" ? (
              <img src={selectedOption.logo} alt="" className="w-4 h-4 rounded-full" />
            ) : (
              selectedOption?.logo
            )}
            <span className={selectedOption ? "" : "text-gray-400"}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Listbox.Button>

        {/* Dropdown Options */}
        <Listbox.Options className={`absolute mt-1 ${width} bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto`}>
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-1 border rounded focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <Listbox.Option
                key={index}
                value={option}
                className={`p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 ${
                  option.id === "create-new" ? "font-semibold text-blue-500" : ""
                }`}
              >
                {option.logo && typeof option.logo === "string" ? (
                  <img src={option.logo} alt="" className="w-4 h-4 rounded-full" />
                ) : (
                  option.logo
                )}
                <span>{option.name}</span>
                {selectedOption?.name === option.name && (
                  <Check className="w-4 h-4 text-blue-500 ml-auto" />
                )}
              </Listbox.Option>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm text-center flex items-center justify-center gap-2">
              <Frown className="w-4 h-4 text-gray-400" />
              No matches
            </div>
          )}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
