"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { IoIosRocket } from "react-icons/io"
import dynamic from "next/dynamic"
import welcomeSchool from "@/../public/animations/welcome/welcome-school.json"
import welcomeJobs from "@/../public/animations/welcome/welcome-jobs.json"
import welcomeSuccess from "@/../public/animations/welcome/welcome-success.json"
import { Loader2 } from "lucide-react"
import { FaGraduationCap } from "react-icons/fa"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import Switch from "@mui/material/Switch"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Checkbox from "@mui/material/Checkbox"
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog"
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
const ConfettiFireworks = dynamic(() => import("@/components/magicui/fireworks").then(mod => mod.ConfettiFireworks), { ssr: false })

interface FormData {
  course: string
  yearLevel: string
  section: string
  jobType: string[]
  remoteOption: string[]
  unrelatedJobRecommendations: boolean
}

const courses = [
  { value: "bsit", label: "BS - Information Technology" },
  { value: "bsba", label: "BS - Business Administration" },
  { value: "bshm", label: "BS - Hospitality Management" },
  { value: "bscs", label: "BS - Computer Science" },
]

const jobTypes = [
  { value: "part-time", label: "Part Time" },
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
]

const STORAGE_KEY = "ftueFormData"
const STEP_KEY = "ftueCurrentStep"

export default function WelcomeFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    course: "",
    yearLevel: "",
    section: "",
    jobType: [],
    remoteOption: [],
    unrelatedJobRecommendations: false,
  })
  const [isPosting, setIsPosting] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const lottieRef = useRef<import("lottie-react").LottieRefCurrentProps | null>(null)

  const totalSteps = 3

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    const savedStep = sessionStorage.getItem(STEP_KEY)
    if (saved) setFormData(JSON.parse(saved))
    if (savedStep) setCurrentStep(Number(savedStep))
  }, [])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    sessionStorage.setItem(STEP_KEY, String(currentStep))
  }, [currentStep])

  const handleNext = async () => {
    if (currentStep === 2) {
      setIsPosting(true)
      let success = false
      try {
        const res = await fetch("/api/students/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include" 
        })

        console.log("POST /api/students/welcome status:", res.status)
        if (res.ok) {
          success = true
        } else {
          const data = await res.json()
          setErrorMsg(data?.error || "Something went wrong. Please try again.")
          setShowError(true)
        }
      } catch {
        setErrorMsg("Network error. Please try again.")
        setShowError(true)
      }
      setIsPosting(false)
      if (success) setCurrentStep(currentStep + 1)
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handleFinish = () => {
    setIsPosting(true)
    setTimeout(() => {
      sessionStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STEP_KEY)
      window.location.href = "/students/dashboard"
    }, 1200)
  }

  const updateFormData = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isStep1Valid =
    !!formData.course.trim() &&
    !!formData.yearLevel.trim() &&
    !!formData.section.trim()

  

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 flex">
        <div className="relative w-1/2 h-full">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 600 1080"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <defs>
              <linearGradient id="ftueLeftGradient" x1="600" y1="0" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#a21caf" />
              </linearGradient>
              <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.08"/>
                </feComponentTransfer>
              </filter>
            </defs>
            <path
              d="
                M0,0
                L520,0
                Q590,270 520,540
                Q450,810 600,1080
                L0,1080
                Z
              "
              fill="url(#ftueLeftGradient)"
            />
            <rect
              x="0"
              y="0"
              width="600"
              height="1080"
              filter="url(#noiseFilter)"
              style={{ mixBlendMode: "overlay" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center ml-24 mt-16">
            {["1", "2", "3"].map((step) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                animate={currentStep === Number(step) ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 60, damping: 20 }}
                style={{ position: currentStep === Number(step) ? "relative" : "absolute", width: "100%" }}
              >
                {currentStep === 1 && step === "1" && (
                  <div className="bg-white rounded-full shadow-lg flex items-center justify-center" style={{ width: 400, height: 400 }}>
                    <Lottie
                      lottieRef={lottieRef}
                      animationData={welcomeSchool}
                      loop={true}
                      style={{ width: 300, height: 300 }}
                    />
                  </div>
                )}
                {currentStep === 2 && step === "2" && (
                  <div className="bg-white rounded-full shadow-lg flex items-center justify-center" style={{ width: 400, height: 400 }}>
                    <Lottie
                      animationData={welcomeJobs}
                      loop={true}
                      style={{ width: 300, height: 300 }}
                    />
                  </div>
                )}
                {currentStep === 3 && step === "3" && (
                  <div className="bg-white rounded-full shadow-lg flex items-center justify-center" style={{ width: 400, height: 400 }}>
                    <Lottie
                      animationData={welcomeSuccess}
                      loop={false}
                      autoplay={true}
                      lottieRef={lottieRef}
                      onComplete={() => {
                        const duration = lottieRef.current?.getDuration(true)
                        if (typeof duration === "number") {
                          lottieRef.current?.goToAndStop(duration, true)
                        }
                      }}
                      style={{ width: 300, height: 300 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="absolute top-12 left-20 max-w-md z-10">
            {currentStep !== 3 && (
              <>
                <h2
                  className="text-4xl font-extrabold mb-3 text-white bg-clip-text text-transparent drop-shadow"
                >
                  Welcome to Seekr
                </h2>
                <p className="text-sm text-white/60 font-regular drop-shadow">
                  Since it’s your first time, we’d love to get to know you a bit better so we can give you the best experience possible. This will only take a moment!
                </p>
              </>
            )}
          </div>
        </div>
        <div className="w-1/2 h-full bg-white" />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-end"></div>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 60, damping: 20 }}
            className="space-y-8 w-full"
          >
            <Card className="p-8 border-0 shadow-lg">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                      Complete Your School Profile
                    </h1>
                    <p className="text-gray-400">Please provide your course, year level, and section.</p>
                  </div>
                  <div className="space-y-4">
                    <Box>
                      <Autocomplete
                        options={courses}
                        getOptionLabel={(option) => option.label}
                        value={courses.find(c => c.value === formData.course) || null}
                        onChange={(_, value) => updateFormData("course", value ? value.value : "")}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Course"
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: false }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                      />
                    </Box>
                    <div className="grid grid-cols-2 gap-4">
                      <Box>
                        <Autocomplete
                          options={yearLevels.flatMap(group => group.options)}
                          getOptionLabel={(option) => option.label}
                          groupBy={(option) => {
                            const group = yearLevels.find(g => g.options.some(o => o.value === option.value))
                            return group ? group.category : ""
                          }}
                          value={
                            yearLevels.flatMap(g => g.options).find(l => l.value === formData.yearLevel) || null
                          }
                          onChange={(_, value) => updateFormData("yearLevel", value ? value.value : "")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Year Level"
                              variant="outlined"
                              size="small"
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                        />
                      </Box>
                      <Box>
                        <TextField
                          placeholder="Section (e.g., 611)"
                          variant="outlined"
                          size="small"
                          value={formData.section}
                          onChange={(e) => updateFormData("section", e.target.value)}
                          InputLabelProps={{ shrink: false }}
                          fullWidth
                        />
                      </Box>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                      Personalize Your Experience
                    </h1>
                    <p className="text-gray-400">Help us tailor job recommendations for you.</p>
                  </div>
                  <div className="space-y-6">
                    <Box>
                      <Autocomplete
                        multiple
                        disableCloseOnSelect
                        options={jobTypes}
                        getOptionLabel={(option) => option.label}
                        value={jobTypes.filter(j => formData.jobType.includes(j.value))}
                        onChange={(_, values) => updateFormData("jobType", values.map(v => v.value))}
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
                              variant="outlined"
                              label={option.label}
                              {...getTagProps({ index })}
                              key={option.value}
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
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                      />
                    </Box>
                    <Box>
                      <Autocomplete
                        multiple
                        disableCloseOnSelect
                        options={remoteOptions}
                        getOptionLabel={(option) => option.label}
                        value={remoteOptions.filter(r => formData.remoteOption.includes(r.value))}
                        onChange={(_, values) => updateFormData("remoteOption", values.map(v => v.value))}
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
                              variant="outlined"
                              label={option.label}
                              {...getTagProps({ index })}
                              key={option.value}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Preferred remote option"
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: false }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                      />
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={formData.unrelatedJobRecommendations}
                        onChange={(_, checked) => updateFormData("unrelatedJobRecommendations", checked)}
                        color="primary"
                        inputProps={{ "aria-label": "unrelated jobs" }}
                      />
                      <span className="text-sm text-blue-600">
                        Would you like job recommendations unrelated to your course?
                      </span>
                    </Box>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6 text-center relative">
                  <ConfettiFireworks />
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <FaGraduationCap  className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                      You&apos;re All Set!
                    </h1>
                    <p className="text-gray-400">
                      Your profile has been completed successfully. You can now explore job opportunities tailored for you.
                    </p>
                  </div>
                  <motion.button
                    onClick={handleFinish}
                    className="flex items-center justify-center mx-auto rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-400 text-white font-bold text-lg px-8 py-3 shadow-lg transition-colors focus:outline-none"
                    style={{ backgroundImage: "linear-gradient(to right, #d946ef, #38bdf8)" }}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    disabled={isPosting}
                  >
                    {isPosting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin w-8 h-8 mr-2" />
                        Opening...
                      </span>
                    ) : (
                      "Start Exploring"
                    )}
                  </motion.button>
                </div>
              )}
            </Card>
            {currentStep < 3 && (
              <div className="flex flex-col items-center mt-8 w-full">
                <div className="flex space-x-2 mb-6">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i + 1 === currentStep ? "bg-blue-600" : i + 1 < currentStep ? "bg-blue-400" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between w-full">
                  {currentStep > 1 ? (
                    <>
                      <motion.button
                        onClick={handleBack}
                        type="button"
                        className="flex items-center rounded-full px-5 py-2 text-base border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 transition-colors focus:outline-none"
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.93 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back
                      </motion.button>
                      <div className="flex items-center">
                        {currentStep === 2 && (
                          <Button
                            variant="ghost"
                            onClick={handleSkip}
                            className="text-blue-500 hover:text-blue-700 px-4 py-2 mr-2"
                            type="button"
                          >
                            Skip
                          </Button>
                        )}
                        <motion.button
                          onClick={handleNext}
                          disabled={currentStep === 1 && !isStep1Valid}
                          type="button"
                          className={`flex items-center justify-center px-6 py-2 font-semibold text-white bg-blue-500 rounded-full shadow transition-colors focus:outline-none text-base
                            ${currentStep === 1 && !isStep1Valid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                          whileHover={{ scale: currentStep === 1 && !isStep1Valid ? 1 : 1.07 }}
                          whileTap={{ scale: currentStep === 1 && !isStep1Valid ? 1 : 0.93 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          Finish
                          <IoIosRocket  className="w-5 h-5 ml-1" />
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <div className="flex w-full justify-end">
                      <motion.button
                        onClick={handleNext}
                        disabled={!isStep1Valid}
                        type="button"
                        className={`flex items-center justify-center px-6 py-2 font-semibold text-white bg-blue-500 rounded-full shadow transition-colors focus:outline-none text-base
                          ${!isStep1Valid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                        whileHover={{ scale: !isStep1Valid ? 1 : 1.07 }}
                        whileTap={{ scale: !isStep1Valid ? 1 : 0.93 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        Next
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>
            {errorMsg}
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => setShowError(false)}>
            OK
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
