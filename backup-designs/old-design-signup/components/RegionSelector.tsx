import React, { useState, useEffect } from "react";
import { DropdownOption as ImportedDropdownOption } from "@/app/components/Dropdown";

interface RegionSelectorProps {
  options: ImportedDropdownOption[];
  selectedBranch: string;
  onChange: (selectedRegion: string) => void;
  placeholder: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  options,
  selectedBranch,
  onChange,
  placeholder,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  useEffect(() => {
    setSelectedRegion(selectedBranch || "");
  }, [selectedBranch]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedRegion(selected);
    if (onChange) onChange(selected);
  };

  return (
    <div>
      <label htmlFor="region">{placeholder}</label>
      <select
        id="region"
        value={selectedRegion}
        onChange={handleRegionChange}
        className="border p-2 rounded"
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={option.id ?? `option-${index}`} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionSelector;
