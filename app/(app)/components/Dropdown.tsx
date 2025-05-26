import React, { useState, useEffect } from 'react';
import Select, { components, SingleValueProps, OptionProps, GroupBase } from 'react-select';
import { Frown } from 'lucide-react';
import Image from "next/image";

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
  disabled?: boolean;
  className?: string;
}

type SelectOption = {
  value: string;
  label: string;
  logo?: string | React.ReactNode;
  original: DropdownOption;
};

export default function Dropdown({
  options,
  width = 'w-full',
  placeholder = 'Select option',
  value,
  onChange,
  disabled = false,
  className = '',
}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(value || null);

  useEffect(() => {
    setSelectedOption(value || null);
  }, [value]);

  const mappedOptions: SelectOption[] = options.map((opt) => ({
    value: opt.id || opt.name,
    label: opt.name,
    logo: opt.logo,
    original: opt,
  }));

  const handleChange = (selected: SelectOption | null) => {
    if (disabled) return;
    const original = selected?.original || null;
    setSelectedOption(original);
    if (onChange) onChange(original);
  };

  const CustomOption = (props: OptionProps<SelectOption, false>) => {
    const { data, innerRef, innerProps, isFocused } = props;
    const isCreateNew = data.value === 'create-new';

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`flex items-center gap-2 p-2 cursor-pointer ${isFocused ? 'bg-gray-100' : ''} ${isCreateNew ? 'font-semibold text-blue-500' : ''}`}
      >
        {data.logo && typeof data.logo === 'string' ? (
          <Image src={data.logo} alt="" width={16} height={16} className="rounded-full" />
        ) : (
          data.logo
        )}
        <span>{data.label}</span>
      </div>
    );
  };

  const SingleValue = (props: SingleValueProps<SelectOption, false>) => {
    const { data } = props;
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-2">
          {data.logo && typeof data.logo === 'string' ? (
            <Image src={data.logo} alt="" width={16} height={16} className="rounded-full" />
          ) : (
            data.logo
          )}
          <span>{data.label}</span>
        </div>
      </components.SingleValue>
    );
  };

  const NoOptionsMessage = () => (
    <div className="p-2 text-gray-500 text-sm text-center  flex items-center justify-center gap-2">
      <Frown className="w-4 h-4 text-gray-400" />
      No matches
    </div>
  );

  return (
    <div className={`${width} ${className}`}> {/* Applied className */}
      <Select<SelectOption, false, GroupBase<SelectOption>>
        value={selectedOption ? mappedOptions.find((opt) => opt.original.name === selectedOption.name) : null}
        onChange={handleChange}
        options={mappedOptions}
        placeholder={placeholder}
        isClearable
        isSearchable
        classNamePrefix="react-select"
        className={className}
        components={{
          Option: CustomOption,
          SingleValue,
          NoOptionsMessage,
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused
              ? '#3B82F6'
              : className?.includes("border-red-500")
              ? '#EF4444'
              : '#D1D5DB',
            height: '45px',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
            '&:hover': { borderColor: state.isFocused ? '#3B82F6' : '#9CA3AF' },
            cursor: disabled ? 'not-allowed' : 'pointer',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 10,
            marginTop: 0,
            animation: 'bounceIn 0.2s ease-out',
          }),
        }}
        isDisabled={disabled}
      />
    </div>
  );
}
