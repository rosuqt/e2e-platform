/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Book, Sun, Bell, Shield,   Save, Moon } from "lucide-react"
import { FormControl, InputLabel, Chip } from "@mui/material"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import Checkbox from "@mui/material/Checkbox"
import Box from "@mui/material/Box"
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabList } from "./components/tab-list"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { countries } from "../../../(landing)/sign-up/data/countries"

type StudentProfile = {
  id: string
  student_id: string
  contact_info: {
    email?: string
    phone?: string
    socials?: { key: string; url: string }[]
    countryCode?: string
  }
  profile_img?: string
  username?: string
}

type SJobPref = {
  id: string
  job_type?: string | string[]
  remote_options?: string | string[]
  unrelated_jobs?: boolean
  student_id?: string
}

type Student = {
  id: string
  first_name?: string
  last_name?: string
  year?: string
  section?: string
  course?: string
  address?: string
  email?: string
  student_profile?: StudentProfile
  s_job_pref?: SJobPref[] 
  country?: string
  city?: string
}

const jobTypes = [
  { value: "part-time", label: "Part Time" },
  { value: "internship", label: "Internship/OJT" },
  { value: "ojt", label: "OJT" },
  { value: "full-time", label: "Full Time" },
]

const remoteOptions = [
  { value: "hybrid", label: "Hybrid" },
  { value: "wfh", label: "Work from Home" },
  { value: "onsite", label: "Onsite" },
]

const yearLevels = [
  { category: "College", options: [
    { value: "1st-year", label: "1st Year" },
    { value: "2nd-year", label: "2nd Year" },
    { value: "3rd-year", label: "3rd Year" },
    { value: "4th-year", label: "4th Year" },
  ]},
  { category: "Senior High", options: [
    { value: "shs-grade-11", label: "SHS Grade 11" },
    { value: "shs-grade-12", label: "SHS Grade 12" },
  ]}
];

const courses = [
  { value: "BS - Information Technology", label: "BS - Information Technology" },
  { value: "BS - Business Administration", label: "BS - Business Administration" },
  { value: "BS - Hospitality Management", label: "BS - Hospitality Management" },
  { value: "BS - Tourism Management", label: "BS - Tourism Management" },
  { value: "ABM", label: "ABM" },
  { value: "HUMSS", label: "HUMSS" },
  { value: "IT Mobile app and Web Development", label: "IT Mobile app and Web Development" },
];



export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [jobAlerts, setJobAlerts] = useState(true)
  const [student, setStudent] = useState<Student | null>(null)
  const [editJobType, setEditJobType] = useState<string[]>([])
  const [editRemoteOptions, setEditRemoteOptions] = useState<string | undefined>(undefined)
  const [editUnrelatedJobs, setEditUnrelatedJobs] = useState(false)
  const [editCourse, setEditCourse] = useState<string | undefined>(undefined);
  const [editYearLevel, setEditYearLevel] = useState<string | undefined>(undefined);
  const [editSection, setEditSection] = useState<string>("");
  const [editCountryCode, setEditCountryCode] = useState<string>("")
  const [editPhone, setEditPhone] = useState<string>("")
  const [editUsername, setEditUsername] = useState<string>("")
  const [editPersonalEmail, setEditPersonalEmail] = useState<string>("")
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string; email?: string; section?: string; country?: string; city?: string }>({})
  const [countriesList, setCountriesList] = useState<{ code: string; name: string }[]>([])
  const [editCountry, setEditCountry] = useState<string>("")
  const [citiesList, setCitiesList] = useState<{ id: string; name: string }[]>([])
  const [editCity, setEditCity] = useState<string>("")
  const [citiesLoading, setCitiesLoading] = useState(false)

  useEffect(() => {
    fetch("/api/students/settings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.student_profile)) {
          data.student_profile = data.student_profile.length > 0 ? data.student_profile[0] : undefined
        }
        data.student_profile = data.student_profile as StudentProfile | undefined
        setStudent(data)
      })
  }, [])

  useEffect(() => {
    if (student) {
      const jobTypeRaw = student.s_job_pref?.[0]?.job_type
      const remoteOptionsRaw = student.s_job_pref?.[0]?.remote_options

      const jobTypeArr = Array.isArray(jobTypeRaw) ? jobTypeRaw.map(String) : []
      let remoteOptionVal: string | undefined = undefined;
      if (Array.isArray(remoteOptionsRaw)) {
        remoteOptionVal = remoteOptionsRaw.length > 0 ? String(remoteOptionsRaw[0]) : undefined;
      } else if (typeof remoteOptionsRaw === "string") {
        remoteOptionVal = remoteOptionsRaw;
      }
      setEditJobType(jobTypeArr)
      setEditRemoteOptions(remoteOptionVal)
      setEditUnrelatedJobs(!!student.s_job_pref?.[0]?.unrelated_jobs)
      setEditCourse(student.course)
      setEditYearLevel(student.year)
      setEditSection(student.section ?? "")
      const cc = student?.student_profile?.contact_info?.countryCode
      setEditCountryCode(cc !== undefined && cc !== null ? String(cc) : "")
      setEditPhone(student?.student_profile?.contact_info?.phone ?? "")
      setEditUsername(student?.student_profile?.username ?? "")
      setEditPersonalEmail(student?.student_profile?.contact_info?.email ?? "")
      setEditCountry(student.country ?? "")
      setEditCity(student.city ?? "")
    }
  }, [student])

  useEffect(() => {
    fetch("/api/students/apply/countries-api")
      .then(res => res.json())
      .then(data => setCountriesList(data.data || []))
  }, [])

  useEffect(() => {
    if (editCountry) {
      setCitiesLoading(true)
      fetch(`/api/students/apply/cities-api?country=${encodeURIComponent(editCountry)}`)
        .then(res => res.json())
        .then(data => setCitiesList(data.data || []))
        .finally(() => setCitiesLoading(false))
    } else {
      setCitiesList([])
      setCitiesLoading(false)
    }
  }, [editCountry])

  const handleTabChange = (id: string) => {
    setActiveTab(id)
  }

  const handleJobTypeChange = (_: React.SyntheticEvent, values: { value: string; label: string }[]) => {
    setEditJobType(values.map(v => v.value))
  }
  const handleRemoteOptionsChange = (_: React.SyntheticEvent, value: { value: string; label: string } | null) => {
    setEditRemoteOptions(value ? value.value : undefined);
  }
  const handleCourseChange = (_: React.SyntheticEvent, value: { value: string; label: string } | null) => {
    setEditCourse(value ? value.value : undefined);
  };
  const handleYearLevelChange = (_: React.SyntheticEvent, value: { value: string; label: string } | null) => {
    setEditYearLevel(value ? value.value : undefined);
  };
  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d{0,3}$/.test(val)) {
      setEditSection(val);
      if (val.length !== 3) {
        setFieldErrors(prev => ({ ...prev, section: "Section must be exactly 3 digits." }));
      } else {
        setFieldErrors(prev => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { section: _removed, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(e.target.value)) setEditPhone(e.target.value)
  }
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUsername(e.target.value)
  }
  const handlePersonalEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPersonalEmail(e.target.value)
  }
  const handleCountryChange = (_: any, value: { code: string; name: string } | null) => {
    setEditCountry(value ? value.name : "")
    setEditCity("")
  }
  const handleCityChange = (_: any, value: { id: string; name: string } | null) => {
    setEditCity(value ? value.name : "")
  }

  const validateFields = () => {
    const errors: { phone?: string; email?: string; section?: string; country?: string; city?: string } = {}
    const country = countries.find((c) => c.phone === editCountryCode)
    const countryIso = country?.code as CountryCode | undefined
    let phoneInput = editPhone.trim()

    if (!editCountryCode.trim()) {
      errors.phone = "Country Code is required."
    }
    if (!phoneInput) {
      errors.phone = "Phone Number is required."
    } else {
      if (countryIso === "PH" && phoneInput.startsWith("0")) {
        phoneInput = phoneInput.substring(1)
      }
      if (
        (editCountryCode === "63" || editCountryCode === "+63") &&
        (!/^9\d{9}$/.test(phoneInput))
      ) {
        errors.phone = "PH mobile must start with 9 and be 10 digits (e.g. 9123456789)"
      } else if (!/^\d{7,15}$/.test(phoneInput)) {
        errors.phone = "Invalid phone number"
      } else {
        const phoneNumber = countryIso
          ? parsePhoneNumberFromString(phoneInput, countryIso)
          : undefined
        if (!countryIso) {
          errors.phone = "Invalid country code."
        } else if (!phoneNumber || !phoneNumber.isValid()) {
          errors.phone = "Invalid phone number for selected country."
        }
      }
    }

    if (!editPersonalEmail.trim()) {
      errors.email = "Email is required."
    } else {
      const email = editPersonalEmail
      const emailRegex = /^[^\s@]+@([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/
      const domainPart = email.split('@')[1]
      if (!emailRegex.test(email)) {
        errors.email = "Invalid email format."
      } else if (
        domainPart &&
        domainPart
          .split('.')
          .some(
            label =>
              label.startsWith('-') ||
              label.endsWith('-')
          )
      ) {
        errors.email = "Invalid email format."
      } else if (email.length < 6 || email.length > 254) {
        errors.email = "Email must be between 6 and 254 characters."
      }
    }
    if (!editCountry.trim()) {
      errors.country = "Country is required."
    }
    if (!editCity.trim()) {
      errors.city = "City is required."
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!student) return;
    if (!validateFields()) return;
    setSaving(true);
    await toast.promise(
      (async () => {
        const payload = {
          country: editCountry,
          city: editCity,
          course: editCourse,
          year: editYearLevel,
          section: editSection,
          s_job_pref: {
            job_type: editJobType,
            remote_options: editRemoteOptions ? [editRemoteOptions] : [],
            unrelated_jobs: editUnrelatedJobs,
          },
          contact_info: {
            countryCode: editCountryCode,
            phone: editPhone,
            email: editPersonalEmail,
          },
          username: editUsername,
        };
        await fetch("/api/students/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      })(),
      {
        loading: "Saving changes...",
        success: "Changes have been saved!",
        error: "Failed to save changes.",
        className: "bg-blue-600 border border-blue-200 text-white",
      }
    );
    setSaving(false);
  };

  const tabs = [
    { id: "profile", icon: User, label: "Profile", description: "Manage your personal information" },
    { id: "academic", icon: Book, label: "Academic", description: "View and edit academic details" },
    { id: "appearance", icon: Sun, label: "Appearance", description: "Customize the application look" },
    { id: "notifications", icon: Bell, label: "Notifications", description: "Manage notification settings" },
    { id: "account", icon: Shield, label: "Account", description: "Account preferences and password" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col">
            <TabList items={tabs} defaultTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 flex flex-col justify-start">
            {/* Removed header from here */}
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
                      <Input id="name" value={student ? `${student.first_name ?? ""} ${student.last_name ?? ""}` : ""} disabled className="bg-blue-50/50 border-blue-200" readOnly />
                      <p className="text-sm text-blue-500/70">Your legal name as registered with the institution</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-blue-700">
                        Username
                      </Label>
                      <FormControl fullWidth>
                        <InputLabel shrink htmlFor="username" sx={{ display: "none" }}>Username</InputLabel>
                        <Input
                          id="username"
                          value={editUsername}
                          onChange={handleUsernameChange}
                          className="bg-blue-50/50 border-blue-200 rounded-md text-base px-3 py-2"
                        />
                      </FormControl>
                      <p className="text-sm text-blue-500/70">Your unique username</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="personal-email" className="text-blue-700">
                          Personal Email
                        </Label>
                        <FormControl fullWidth>
                          <InputLabel shrink htmlFor="personal-email" sx={{ display: "none" }}>Personal Email</InputLabel>
                          <Input
                            id="personal-email"
                            value={editPersonalEmail}
                            onChange={handlePersonalEmailChange}
                            className="bg-blue-50/50 border-blue-200 rounded-md text-base px-3 py-2"
                          />
                        </FormControl>
                        {fieldErrors.email && (
                          <div className="text-red-500 text-xs mt-1">{fieldErrors.email}</div>
                        )}
                        <p className="text-sm text-blue-500/70">Your personal email address</p>
                      </div>
                    </div>
                   
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-700">
                        Phone Number
                      </Label>
                      <FormControl fullWidth>
                        <InputLabel shrink htmlFor="phone" sx={{ display: "none" }}>Phone Number</InputLabel>
                        <Box className="flex gap-2">
                          <Autocomplete
                            options={countries}
                            getOptionLabel={(option: { code: string; phone: string }) => `${option.code} (+${option.phone})`}
                            value={countries.find((c: { phone: string }) => c.phone === editCountryCode) || null}
                            onChange={(
                              _event: React.SyntheticEvent<Element, Event>,
                              value: { code: string; phone: string } | null
                            ) => setEditCountryCode(value ? value.phone : "")}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Country"
                                variant="outlined"
                                size="small"
                                sx={{
                                  minWidth: 180,
                                  backgroundColor: "#eff6ff",
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#eff6ff",
                                    "& fieldset": {
                                      borderColor: "#3b82f6",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#2563eb",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#2563eb",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    fontSize: "14px",
                                  },
                                }}
                              />
                            )}
                            slotProps={{
                              paper: {
                                sx: {
                                  fontSize: "15px"
                                }
                              }
                            }}
                            isOptionEqualToValue={(
                              option: { phone: string },
                              value: { phone: string }
                            ) => option.phone === value.phone}
                          />
                          <Input
                            id="phone"
                            value={editPhone}
                            onChange={handlePhoneChange}
                            className="bg-blue-50/50 border-blue-200 rounded-md text-base px-3 py-2 flex-1"
                            placeholder="Phone number"
                            type="tel"
                          />
                        </Box>
                        {fieldErrors.phone && (
                          <div className="text-red-500 text-xs mt-1">{fieldErrors.phone}</div>
                        )}
                      </FormControl>
                      <p className="text-sm text-blue-500/70">Your active mobile or contact number</p>
                    </div>
                    <Box className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="country" className="text-blue-700">
                          Country
                        </Label>
                        <FormControl fullWidth>
                          <Autocomplete
                            options={countriesList}
                            getOptionLabel={(option) => option.name}
                            value={countriesList.find(c => c.name === editCountry) || null}
                            onChange={handleCountryChange}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Country"
                                variant="outlined"
                                size="small"
                                sx={{
                                  minWidth: 180,
                                  backgroundColor: "#eff6ff",
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#eff6ff",
                                    "& fieldset": {
                                      borderColor: "#3b82f6",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#2563eb",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#2563eb",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    fontSize: "14px",
                                  },
                                }}
                              />
                            )}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                          />
                          {fieldErrors.country && (
                            <div className="text-red-500 text-xs mt-1">{fieldErrors.country}</div>
                          )}
                        </FormControl>
                        <p className="text-sm text-blue-500/70">Your country of residence</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="city" className="text-blue-700">
                          City
                        </Label>
                        <FormControl fullWidth>
                          <Autocomplete
                            options={citiesList}
                            getOptionLabel={(option) => option.name}
                            value={citiesList.find(c => c.name === editCity) || null}
                            onChange={handleCityChange}
                            loading={citiesLoading}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="City"
                                variant="outlined"
                                size="small"
                                sx={{
                                  minWidth: 180,
                                  backgroundColor: "#eff6ff",
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#eff6ff",
                                    "& fieldset": {
                                      borderColor: "#3b82f6",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#2563eb",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#2563eb",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    fontSize: "14px",
                                  },
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {citiesLoading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                                          <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                                          </svg>
                                        </Box>
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                          />
                          {fieldErrors.city && (
                            <div className="text-red-500 text-xs mt-1">{fieldErrors.city}</div>
                          )}
                        </FormControl>
                        <p className="text-sm text-blue-500/70">Your city of residence</p>
                      </div>
                    </Box>
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
                    {/* School Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-700">
                        School Email
                      </Label>
                      <Input id="email" value={student?.email ?? ""} disabled className="bg-blue-50/50 border-blue-200 rounded-md text-base px-3 py-2" readOnly />
                      <p className="text-sm text-blue-500/70">Your institutional email address. This cannot be changed</p>
                    </div>
                    {/* Year, Course, Section fields in a grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year" className="text-blue-700">
                          Year
                        </Label>
                        <Box>
                          <Autocomplete
                            options={yearLevels.flatMap(group => group.options)}
                            getOptionLabel={(option) => option.label}
                            groupBy={(option) => {
                              const group = yearLevels.find(g => g.options.some(o => o.value === option.value));
                              return group ? group.category : "";
                            }}
                            value={
                              yearLevels.flatMap(g => g.options).find(l => l.value === editYearLevel) || null
                            }
                            onChange={handleYearLevelChange}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Year Level"
                                variant="outlined"
                                size="small"
                                InputLabelProps={{ shrink: false }}
                                sx={{
                                  backgroundColor: "#eff6ff",
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#eff6ff", 
                                    "& fieldset": {
                                      borderColor: "#3b82f6",
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                        </Box>
                        <p className="text-sm text-blue-500/70">Your current year level</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course" className="text-blue-700">
                          Course
                        </Label>
                        <Box>
                          <Autocomplete
                            options={
                              (() => {
                                const collegeYearValues = yearLevels.find(g => g.category === "College")?.options.map(o => o.value) ?? []
                                if (collegeYearValues.includes(editYearLevel ?? "")) {
                                  return courses.filter(c => c.value.startsWith("BS"))
                                } else {
                                  return courses.filter(c => !c.value.startsWith("BS"))
                                }
                              })()
                            }
                            getOptionLabel={(option) => option.label}
                            value={courses.find(c => c.value === editCourse) || null}
                            onChange={handleCourseChange}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Course"
                                variant="outlined"
                                size="small"
                                InputLabelProps={{ shrink: false }}
                                sx={{
                                  backgroundColor: "#eff6ff",
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#eff6ff",
                                    "& fieldset": {
                                      borderColor: "#3b82f6",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#2563eb",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#2563eb",
                                    },
                                  },
                                }}
                              />
                            )}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                          />
                        </Box>
                        <p className="text-sm text-blue-500/70">Your enrolled program or course</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="section" className="text-blue-700">
                          Section
                        </Label>
                        <Box>
                          <TextField
                            placeholder="Section (e.g., 611)"
                            variant="outlined"
                            size="small"
                            value={editSection}
                            onChange={handleSectionChange}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            type="number"
                            inputProps={{ minLength: 3, maxLength: 3 }}
                            sx={{
                              backgroundColor: "#eff6ff",
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#eff6ff",
                                "& fieldset": {
                                  borderColor: "#3b82f6",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#2563eb",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#2563eb",
                                },
                              },
                            }}
                          />
                          {fieldErrors.section && (
                            <div className="text-red-500 text-xs mt-1">{fieldErrors.section}</div>
                          )}
                        </Box>
                        <p className="text-sm text-blue-500/70">Your current section</p>
                      </div>
                    </div>
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

            {activeTab === "account" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Account
                    </CardTitle>
                    <CardDescription>Manage your job preferences and change your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Job Preferences</h3>
                      <Separator className="mb-6" />
                      <Box className="mb-6">
                        <Autocomplete
                          multiple
                          disableCloseOnSelect
                          options={jobTypes}
                          getOptionLabel={(option) => option.label}
                          value={jobTypes.filter(j => editJobType.includes(j.value))}
                          onChange={handleJobTypeChange}
                          renderOption={(props, option, { selected }) => {
                            const { key, ...rest } = props
                            return (
                              <li key={key} {...rest}>
                                <Checkbox
                                  checked={selected}
                                  style={{ marginRight: 8 }}
                                />
                                {option.label}
                              </li>
                            )
                          }}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                label={option.label}
                                {...getTagProps({ index })}
                                key={option.value}
                                sx={{
                                  backgroundColor: "#3b82f6",
                                  color: "#fff",
                                  fontWeight: 500,
                                  borderRadius: "9999px",
                                  fontSize: "0.95rem",
                                  border: "none",
                                  px: 2,
                                  py: 0.5,
                                  "& .MuiChip-deleteIcon": {
                                    color: "#fff",
                                    fontSize: "1rem", 
                                    marginLeft: "2px"
                                  }
                                }}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Preferred job type"
                              variant="outlined"
                              size="small"
                              InputLabelProps={{ shrink: false }}
                              sx={{
                                backgroundColor: "#eff6ff",
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#eff6ff",
                                  "& fieldset": {
                                    borderColor: "#3b82f6",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#2563eb",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#2563eb",
                                  },
                                },
                              }}
                            />
                          )}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                        />
                      </Box>
                      <Box className="mb-6">
                        <Autocomplete
                          options={remoteOptions}
                          getOptionLabel={(option) => option.label}
                          value={remoteOptions.find(r => r.value === editRemoteOptions) || null}
                          onChange={handleRemoteOptionsChange}
                          renderOption={(props, option) => {
                            const { key, ...rest } = props
                            return (
                              <li key={key} {...rest}>
                                {option.label}
                              </li>
                            )
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Preferred remote option"
                              variant="outlined"
                              size="small"
                              InputLabelProps={{ shrink: false }}
                              sx={{
                                backgroundColor: "#eff6ff",
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#eff6ff",
                                  "& fieldset": {
                                    borderColor: "#3b82f6",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#2563eb",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#2563eb",
                                  },
                                },
                              }}
                            />
                          )}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                        />
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} className="mb-2">
                        <Switch
                          checked={editUnrelatedJobs}
                          onCheckedChange={setEditUnrelatedJobs}
                          color="primary"
                        />
                        <span className="text-sm text-blue-600">
                          Would you like job recommendations unrelated to your course?
                        </span>
                      </Box>
                    </div>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Change Password</h3>
                      <Separator className="mb-6" />
                      <div className="space-y-4">
                        <Input
                          type="password"
                          placeholder="Current Password"
                          className="border-blue-200 focus:border-blue-400 bg-blue-50/50 h-10"
                        />
                        <Input
                          type="password"
                          placeholder="New Password"
                          className="border-blue-200 focus:border-blue-400 bg-blue-50/50 h-10"
                        />
                        <Input
                          type="password"
                          placeholder="Confirm New Password"
                          className="border-blue-200 focus:border-blue-400 bg-blue-50/50 h-10"
                        />
                        <button
                          type="button"
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                        >
                          Update Password
                        </button>
                      </div>
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-150 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.04, boxShadow: "0 4px 16px 0 rgba(59,130,246,0.15)" }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}



