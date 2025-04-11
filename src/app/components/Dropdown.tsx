import React, { useState, useEffect } from 'react';
import Select, { components, SingleValueProps, OptionProps, GroupBase } from 'react-select';
import { Frown } from 'lucide-react';

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
          <img src={data.logo} alt="" className="w-4 h-4 rounded-full" />
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
            <img src={data.logo} alt="" className="w-4 h-4 rounded-full" />
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
    <div className={width}>
      <Select<SelectOption, false, GroupBase<SelectOption>>
        value={selectedOption ? mappedOptions.find((opt) => opt.original.name === selectedOption.name) : null}
        onChange={handleChange}
        options={mappedOptions}
        placeholder={placeholder}
        isClearable
        isSearchable
        components={{
          Option: CustomOption,
          SingleValue,
          NoOptionsMessage,
        }}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: '#d1d5db',
            height: '45px',
            boxShadow: 'none',
            '&:hover': { borderColor: '#9ca3af' },
            cursor: disabled ? 'not-allowed' : 'pointer',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 10,
            marginTop:0,
            animation: 'bounceIn 0.2s ease-out',
          }),
        }}
        isDisabled={disabled}
      />
    </div>
  );
}
