"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Book, Sun, Bell, Shield, Globe, FileText, Save, Moon } from "lucide-react"
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabList } from "./components/tab-list"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [jobAlerts, setJobAlerts] = useState(true)

  const tabs = [
    { id: "profile", icon: User, label: "Profile", description: "Manage your personal information" },
    { id: "academic", icon: Book, label: "Academic", description: "View and edit academic details" },
    { id: "appearance", icon: Sun, label: "Appearance", description: "Customize the application look" },
    { id: "notifications", icon: Bell, label: "Notifications", description: "Manage notification settings" },
    { id: "privacy", icon: Shield, label: "Privacy", description: "Control your privacy settings" },
    { id: "preferences", icon: Globe, label: "Preferences", description: "Set your job preferences" },
    { id: "resume", icon: FileText, label: "Resume", description: "Manage your resume and documents" },
  ]

  const handleTabChange = (id: string) => {
    setActiveTab(id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 pb-10">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-blue-600 flex items-center">
            <motion.div
              className="mr-4 bg-blue-500 text-white p-3 rounded-2xl shadow-lg"
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <User size={28} />
            </motion.div>
            <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">
              Account Settings
            </span>
          </h1>
          <p className="text-blue-600/70 mt-2 ml-16">Manage your profile, preferences, and account settings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TabList items={tabs} defaultTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Your basic profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-700">
                        Full Name
                      </Label>
                      <Input id="name" value="John Doe" disabled className="bg-blue-50/50 border-blue-200" />
                      <p className="text-sm text-blue-500/70">Your legal name as registered with the institution</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-700">
                        Email Address
                      </Label>
                      <Input id="email" value="john.doe@university.edu" disabled className="bg-blue-50/50 border-blue-200" />
                      <p className="text-sm text-blue-500/70">Your institutional email address</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-700">
                        Phone Number
                      </Label>
                      <Input id="phone" placeholder="Enter your phone number" className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-blue-700">
                        Bio
                      </Label>
                      <textarea
                        id="bio"
                        placeholder="Tell employers about yourself"
                        className="w-full min-h-[100px] rounded-md border border-blue-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                      <p className="text-sm text-blue-500/70">Brief description for your profile</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "academic" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      <Book className="h-5 w-5 mr-2" />
                      Academic Information
                    </CardTitle>
                    <CardDescription>Your course and academic details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormControl fullWidth className="mb-4">
                      <InputLabel id="course-label">Course/Program</InputLabel>
                      <Select labelId="course-label" id="course" defaultValue="">
                        <MenuItem value="cs">Bachelor of Science in Computer Science</MenuItem>
                        <MenuItem value="it">Bachelor of Science in Information Technology</MenuItem>
                        <MenuItem value="is">Bachelor of Science in Information Systems</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth className="mb-4">
                      <InputLabel id="year-label">Year Level</InputLabel>
                      <Select labelId="year-label" id="year" defaultValue="">
                        <MenuItem value="1">First Year</MenuItem>
                        <MenuItem value="2">Second Year</MenuItem>
                        <MenuItem value="3">Third Year</MenuItem>
                        <MenuItem value="4">Fourth Year</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth className="mb-4">
                      <InputLabel id="section-label">Section</InputLabel>
                      <Select labelId="section-label" id="section" defaultValue="">
                        <MenuItem value="A">Section A</MenuItem>
                        <MenuItem value="B">Section B</MenuItem>
                        <MenuItem value="C">Section C</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="graduation-label">Expected Graduation Date</InputLabel>
                      <Select labelId="graduation-label" id="graduation" defaultValue="">
                        <MenuItem value="2023">2023</MenuItem>
                        <MenuItem value="2024">2024</MenuItem>
                        <MenuItem value="2025">2025</MenuItem>
                        <MenuItem value="2026">2026</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      {darkMode ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
                      Appearance
                    </CardTitle>
                    <CardDescription>Customize how the application looks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-blue-700">Dark Mode</Label>
                        <p className="text-sm text-blue-500/70">Toggle between light and dark theme</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-blue-600" />
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Moon className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <Separator className="my-4 bg-blue-100" />
                    <div className="space-y-2">
                      <Label className="text-blue-700">Color Theme</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {["blue", "purple", "green", "orange", "red"].map((color) => (
                          <div
                            key={color}
                            className={`h-10 rounded-md cursor-pointer transition-all hover:scale-105 ${
                              color === "blue"
                                ? "ring-2 ring-blue-500 ring-offset-2 bg-gradient-to-r from-blue-500 to-sky-400"
                                : color === "purple"
                                ? "bg-gradient-to-r from-purple-500 to-pink-400"
                                : color === "green"
                                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                : color === "orange"
                                ? "bg-gradient-to-r from-orange-500 to-amber-400"
                                : "bg-gradient-to-r from-red-500 to-rose-400"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-blue-500/70">Select your preferred color theme</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-700">Font Size</Label>
                      <RadioGroup defaultValue="medium" className="flex space-x-2">
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="small" id="small" className="text-blue-600" />
                          <Label htmlFor="small" className="text-sm">
                            Small
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="medium" id="medium" className="text-blue-600" />
                          <Label htmlFor="medium" className="text-base">
                            Medium
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="large" id="large" className="text-blue-600" />
                          <Label htmlFor="large" className="text-lg">
                            Large
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notifications
                    </CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-blue-700">Email Notifications</Label>
                        <p className="text-sm text-blue-500/70">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-blue-700">Push Notifications</Label>
                        <p className="text-sm text-blue-500/70">Receive notifications on your device</p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-blue-700">Job Alerts</Label>
                        <p className="text-sm text-blue-500/70">Get notified about new job opportunities</p>
                      </div>
                      <Switch
                        checked={jobAlerts}
                        onCheckedChange={setJobAlerts}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Privacy
                    </CardTitle>
                    <CardDescription>Control your privacy settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-blue-700">Profile Visibility</Label>
                      <Input
                        id="visibility"
                        placeholder="Public/Private"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-700">Resume Privacy</Label>
                      <Input
                        id="resume-privacy"
                        placeholder="Public/Private"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Preferences
                    </CardTitle>
                    <CardDescription>Set your job preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-blue-700">Job Type</Label>
                      <Input
                        id="job-type"
                        placeholder="Full-time/Part-time"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-700">Preferred Industries</Label>
                      <Input
                        id="industries"
                        placeholder="e.g., Technology, Finance"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "resume" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Resume
                    </CardTitle>
                    <CardDescription>Manage your resume and documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-blue-700">
                        Upload Resume
                      </Label>
                      <Input id="resume" type="file" className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-700">Default Resume</Label>
                      <Input
                        id="default-resume"
                        placeholder="General Resume"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              className="flex justify-end mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-8 py-6 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <Save className="mr-2 h-5 w-5" />
                Save Changes
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
