"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageSquare, Users, MapPin, Calendar, Star, Award, Users2, Camera } from "lucide-react"
import AboutTab from "./components/about-tab"
import JobListingsTab from "./components/job-listings-tab"
import TeamTab from "./components/team-tab"
import RatingsTab from "./components/ratings-tab"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"

export default function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6 border border-blue-200">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          {/* Floating camera button for cover photo */}
          <button
            className="absolute top-4 right-4 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
            title="Change cover photo"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-16 left-6 w-32 h-32 bg-white rounded-md">
            <div className="relative w-full h-full">
              {/* White border around profile icon */}
              <div className="w-full h-full rounded-md bg-white border-4 border-white flex items-center justify-center">
                <div className="w-full h-full rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl select-none">
                  TC
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
                <h1 className="text-2xl font-bold">TechCorp Inc.</h1>
                <Badge className="bg-green-100 text-green-800 font-medium flex items-center gap-1 px-2">
                  <CheckCircle className="w-3 h-3" /> Verified
                </Badge>
              </div>
              <p className="text-gray-600">Software Development & IT Services</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              {/* Tabs moved below */}
            </div>

            <div className="flex gap-3">
              <Button className="rounded-full gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Company
              </Button>
              <Button variant="outline" className="rounded-full gap-2 border-blue-300 text-blue-600 hover:bg-blue-50">
                <Users className="w-4 h-4" />
                Follow
              </Button>
            </div>
          </div>
          {/* MUI Tabs at the bottom left of the header */}
          <div className="flex items-end mt-6">
            <Box sx={{ borderBottom: 1, borderColor: "divider", width: "fit-content", minWidth: 0 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="company profile tabs"
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
                  label="Team"
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

      {/* Company Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Founded</p>
            <p className="text-xl font-bold">2010</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Users2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Employees</p>
            <p className="text-xl font-bold">250+</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rating</p>
            <p className="text-xl font-bold">4.8/5</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Open Positions</p>
            <p className="text-xl font-bold">15</p>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 0 && <AboutTab />}
        {activeTab === 1 && <JobListingsTab />}
        {activeTab === 2 && <TeamTab />}
        {activeTab === 3 && <RatingsTab />}
      </div>
    </div>
  )
}
