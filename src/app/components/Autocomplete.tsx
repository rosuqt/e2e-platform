import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AutocompleteProps {
  suggestions: string[];
  width?: string;
  placeholder?: string;
  value?: string; // <-- new prop added
  onChange?: (value: string) => void;
}

export default function Autocomplete({
  suggestions,
  width = "w-full",
  placeholder = "Type something...",
  value,
  onChange,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState<string>(value || "");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Sync internal state when external value changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (onChange) onChange(val);

    if (val.trim() === "") {
      setFilteredSuggestions([]);
    } else {
      setFilteredSuggestions(
        suggestions.filter((item) =>
          item.toLowerCase().includes(val.toLowerCase())
        )
      );
    }
  };

  const handleSelect = (suggestion: string) => {
    setInputValue(suggestion);
    if (onChange) onChange(suggestion);
    setFilteredSuggestions([]);
  };

  return (
    <div className={`relative ${width}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setFilteredSuggestions(suggestions)}
        onBlur={() => {
          setTimeout(() => {
            setFilteredSuggestions([]);
          }, 100);
        }}
        className="w-full pr-4 px-2 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />

      <AnimatePresence>
        {filteredSuggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-1 bg-white border shadow-md max-h-40 overflow-auto rounded-md z-10"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 text-left cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
