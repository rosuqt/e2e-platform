"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  options: string[];
  selected: string;
  setSelected: (value: string) => void;
  dropdownHeight?: string;
  width?: string;
  height?: string;
  placeholder?: string;
}

export default function Dropdown({
    label,
    options,
    selected,
    setSelected,
    dropdownHeight = "max-h-40",
    width = "w-[200px]",
    height = "h-auto", // <-- Added height
    placeholder = "Type here...",
}: DropdownProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(selected.toLowerCase())
    );

    const handleSelect = (option: string) => {
        setSelected(option);
        setShowDropdown(false);
    };

    return (
        <div ref={dropdownRef} className={`relative ${width} ${height}`}>
            {/* Clickable*/}
            <div 
                className="relative w-full px-4 pt-8 pb-5 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 border border-gray-300 cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                <label className="text-sm absolute top-2 left-4 text-[#0F1476]">
                    {label}
                </label>

                {/* Input Field */}
                <input
                    type="text"
                    placeholder={placeholder}
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="w-full bg-transparent text-black border-none outline-none"
                />

                {/* Dropdown Arrow */}
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-cursor">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Dropdown List */}
            {showDropdown && (
                <ul
                    className={`absolute top-full left-0 w-full text-black text-lg bg-white border border-gray-300 rounded-md mt-1 shadow-lg overflow-y-auto z-50 ${dropdownHeight}`}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option}
                                onMouseDown={() => handleSelect(option)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-400">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
}
