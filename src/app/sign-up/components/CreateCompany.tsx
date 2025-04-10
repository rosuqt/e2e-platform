"use client"

import { useState } from "react"

export default function CompanyForm() {
  const [countryOpen, setCountryOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [countryValue, setCountryValue] = useState("")
  const [cityValue, setCityValue] = useState("")

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="text-center relative pb-2 p-6 border-b border-gray-200">
          <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">✕</button>
          <div className="mx-auto bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            {/* Building icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" />
              <path d="M16 6h.01" />
              <path d="M12 6h.01" />
              <path d="M12 10h.01" />
              <path d="M12 14h.01" />
              <path d="M16 10h.01" />
              <path d="M16 14h.01" />
              <path d="M8 10h.01" />
              <path d="M8 14h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Create a new company</h2>
          <p className="text-sm text-gray-500 px-6">
            You are about to create a new company. Please ensure that all fields are answered truthfully and accurately.
            Company verification is required and can be completed within the app
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-medium text-base mb-3">Company Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <div className="relative">
                  <button
                    id="country"
                    onClick={() => setCountryOpen(!countryOpen)}
                    className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <span>{countryValue || "Select country"}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${countryOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {countryOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setCountryValue("United States")
                            setCountryOpen(false)
                          }}
                        >
                          United States
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setCountryValue("Canada")
                            setCountryOpen(false)
                          }}
                        >
                          Canada
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setCountryValue("United Kingdom")
                            setCountryOpen(false)
                          }}
                        >
                          United Kingdom
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="city" className="text-sm font-medium">
                  City/Region
                </label>
                <div className="relative">
                  <button
                    id="city"
                    onClick={() => setCityOpen(!cityOpen)}
                    className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <span>{cityValue || "Select City/Region"}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${cityOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {cityOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setCityValue("New York")
                            setCityOpen(false)
                          }}
                        >
                          New York
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setCityValue("Los Angeles")
                            setCityOpen(false)
                          }}
                        >
                          Los Angeles
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setCityValue("Chicago")
                            setCityOpen(false)
                          }}
                        >
                          Chicago
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Company Contact Email
              </label>
              <input
                id="email"
                placeholder="Write here"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium">
                Company Phone Number
              </label>
              <input
                id="phone"
                placeholder="Write here"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="address" className="text-sm font-medium">
              Exact Address
            </label>
            <input
              id="address"
              placeholder="Write here"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Does this company have multiple branches?</label>
            <div className="flex">
              <div className="w-1/2">
                <button className="w-full rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                  Yes
                </button>
              </div>
              <div className="w-1/2">
                <button className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100">
                  No
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </button>
            <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
