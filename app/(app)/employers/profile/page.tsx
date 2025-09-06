"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {  Building2, MapPin, Camera } from "lucide-react"
import { HiBadgeCheck } from "react-icons/hi";

import AboutTab from "./components/about-tab"
import JobListingsTab from "./components/job-listings-tab"
import RatingsTab from "./components/ratings-tab"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import router from "next/router"

export default function EmployerProfilePage() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const goToRatingsTab = () => setActiveTab(2)

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6 border border-blue-200">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
          {/* Floating camera button for cover photo */}
          <button
            className="absolute top-4 right-4 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
            title="Change cover photo"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-16 left-6 w-32 h-32 bg-white rounded-full">
            <div className="relative w-full h-full">
              {/* White border around profile icon */}
              <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl select-none">
                  KV
                </div>
              </div>
              {/* Floating camera button */}
              <button
                className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                title="Change profile picture"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="ml-36 pt-4 flex justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Kemlerina Vivi</h1>
                <Badge className="ml-3 bg-blue-600 text-white font-medium flex items-center justify-start   gap-1 px-6 shadow-sm">
                  <HiBadgeCheck className="w-5 h-5 mr-1" /> Verified
                </Badge>
              </div>
              <p className="text-gray-600">Senior HR Manager at TechCorp Inc.</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>Muntinlupa, Putatan</span>
              </div>

            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/employers/profile/company")}>
                <Building2 className="w-4 h-4" />
                View Company
              </Button>
            </div>
          </div>

          <div className="flex items-end mt-6">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="profile tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab
                  label="About"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 500,
                    fontSize: 14,
                    "&:hover": { color: "#2563eb" },
                  }}
                />
                <Tab
                  label="Job Listings"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 500,
                    fontSize: 14,
                    "&:hover": { color: "#2563eb" },
                  }}
                />
                <Tab
                  label="Ratings"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 500,
                    fontSize: 14,
                    "&:hover": { color: "#2563eb" },
                  }}
                />
              </Tabs>
            </Box>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 0 && <AboutTab goToRatingsTab={goToRatingsTab} />}
        {activeTab === 1 && <JobListingsTab />}
        {activeTab === 2 && <RatingsTab />}
      </div>

    </div>
  )
}
