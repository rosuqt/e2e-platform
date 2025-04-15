"use client";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface CompanyAddressProps {
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  companyEmail: string;
  setCompanyEmail: React.Dispatch<React.SetStateAction<string>>;
  companyNo: string;
  setCompanyNo: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  multBranch: boolean;
  setMultBranch: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveAddress: () => Promise<boolean>;
  nextStep: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function CompanyAddress({
  country,
  setCountry,
  city,
  setCity,
  companyEmail,
  setCompanyEmail,
  companyNo,
  setCompanyNo,
  address,
  setAddress,
  multBranch,
  setMultBranch,
  handleSaveAddress,
  nextStep,
  onBack,
  onClose,
}: CompanyAddressProps) {
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
    setCompanyEmail(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !/^\d+$/.test(value)) {
      setPhoneError("Please enter a valid phone number.");
    } else {
      setPhoneError("");
    }
    setCompanyNo(value);
  };

  return (
    <div className="flex items-center justify-center h-screen p-2">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="relative p-8">
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            {/* Close button SVG */}
          </button>

          <div className="text-center p-8 pb-0">
            <h2 className="text-xl font-semibold">Add Company Address</h2>
            <p className="text-sm text-gray-500 px-6 pb-4 border-b border-gray-300">
              Please provide accurate address details for your company.
            </p>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Address Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  placeholder="Enter country"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  placeholder="Enter city"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {/* Company Email */}
              <div>
                <label htmlFor="company-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Email
                </label>
                <input
                  id="company-email"
                  placeholder="Enter email"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                  value={companyEmail}
                  onChange={handleEmailChange}
                />
                {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
              </div>

              {/* Company Phone */}
              <div>
                <label htmlFor="company-no" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Phone
                </label>
                <input
                  id="company-no"
                  placeholder="Enter phone number"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                  value={companyNo}
                  onChange={handlePhoneChange}
                />
                {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  placeholder="Enter address"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Multiple Branches */}
              <div className="col-span-2 flex items-center">
                <input
                  id="mult-branch"
                  type="checkbox"
                  className="mr-2"
                  checked={multBranch}
                  onChange={(e) => setMultBranch(e.target.checked)}
                />
                <label htmlFor="mult-branch" className="text-sm font-medium text-gray-700">
                  This company has multiple branches
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={onBack}
                className="px-12 py-2 flex items-center justify-center gap-2 rounded-full border bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                <p>Back</p>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const success = await handleSaveAddress();
                  if (success) nextStep();
                }}
                className="px-12 py-2 flex items-center justify-center gap-2 rounded-full border bg-button text-white hover:bg-buttonHover"
              >
                <p>Next</p>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
