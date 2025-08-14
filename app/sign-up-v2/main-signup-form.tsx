"use client"
import { useState, useRef } from "react"
import PersonalInfoFields from "./components/personal-info"
import CompanyAssociationFields from "./components/company-association"
import { TextField } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { FaBuilding, FaUser } from "react-icons/fa"
import { FaBuildingUser } from "react-icons/fa6"
import { HiCheckBadge } from "react-icons/hi2"
import Preview from "./components/preview"

function MainSignUpForm() {
  const [step, setStep] = useState(1)
  const prevStep = useRef(1)
  const handleSetStep = (newStep: number) => {
    prevStep.current = step
    setStep(newStep)
  }
  const swipeDirection = step > prevStep.current ? 1 : -1

  const stepCount = 3
  const highlightWidth = 100 / stepCount

  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    code: "US",
    phone: "",
    email: "",
  })
  const [company, setCompany] = useState({
    companyName: "",
    companyBranch: "",
    jobTitle: "",
    companyRole: "",
    companyEmail: "",
  })
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 min-h-screen relative flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10 pt-8 flex flex-col items-center mb-2 mt-2">
        <div className="w-full flex mb-4">
          <div className="w-full flex rounded-full overflow-hidden bg-gray-100 h-12 relative mb-4">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 h-full bg-blue-500 z-0"
              style={{
                left: `${(step - 1) * highlightWidth}%`,
                width: `${highlightWidth}%`,
                borderRadius: 9999,
                zIndex: 1
              }}
            />
            <div className="flex-1 flex items-center justify-center relative z-10">
              <FaUser  className={`w-5 h-5  ${step === 1 ? " border-2 border-blue-500 text-white" : "  text-gray-400"} flex items-center justify-center font-bold`}/>
              <span className={`${step === 1 ? "text-white font-semibold" : "text-gray-400 font-medium"} text-sm ml-2`}>Personal Information</span>
            </div>
            <div className="flex-1 flex items-center justify-center relative z-10">
              <FaBuilding className={`w-5 h-5 ${step === 2 ? " text-white" : " text-gray-400"} flex items-center justify-center font-bold`}/>
              <span className={`${step === 2 ? "text-white font-semibold" : "text-gray-400 font-medium"} text-sm ml-2`}>Company Association</span>
            </div>
            <div className="flex-1 flex items-center justify-center relative z-10">
              <HiCheckBadge  className={`w-5 h-5  ${step === 3 ? " text-white" : " text-gray-400"} flex items-center justify-center font-bold`}/>
              <span className={`${step === 3 ? "text-white font-semibold" : "text-gray-400 font-medium"} text-sm ml-2`}>Preview</span>
            </div>
          </div>
        </div>
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="text-2xl font-semibold text-gray-800 mb-2">Personal Information</div>
              <div className="text-gray-500 text-sm">Just a few details to get you started! This info will be used for your login and so we can stay in touch.</div>
            </div>
            <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <PersonalInfoFields data={personal} onChange={setPersonal} />
              <TextField
                label={<span>Create Password<span className="text-red-500">*</span></span>}
                variant="outlined"
                size="small"
                type="password"
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
                InputProps={{
                  className: "bg-white bg-opacity-90 rounded-md"
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#2563eb"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2563eb"
                    }
                  }
                }}
              />
              <TextField
                label={<span>Confirm Password<span className="text-red-500">*</span></span>}
                variant="outlined"
                size="small"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                InputLabelProps={{ style: { fontSize: 14, color: "#6b7280" } }}
                InputProps={{
                  className: "bg-white bg-opacity-90 rounded-md"
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#2563eb"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2563eb"
                    }
                  }
                }}
              />
            </form>
            <div className="w-full flex justify-end items-center mt-2">
              <button className="bg-blue-500 text-white px-8 py-2 rounded-md shadow hover:bg-blue-600 transition" type="button" onClick={() => handleSetStep(2)}>Next Step</button>
            </div>
          </>
        )}
        {step === 2 && (
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <CompanyAssociationFields data={company} onChange={setCompany} />
            <div className="w-full flex justify-between items-center mt-2 col-span-2">
              <button className="bg-gray-200 text-gray-700 px-8 py-2 rounded-md shadow hover:bg-gray-300 transition" type="button" onClick={() => handleSetStep(1)}>Back</button>
              <button className="bg-blue-500 text-white px-8 py-2 rounded-md shadow hover:bg-blue-600 transition" type="button" onClick={() => handleSetStep(3)}>Next Step</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <div className="w-full flex flex-col items-center justify-center py-12">
            <div className="text-2xl text-gray-700 font-semibold mb-4">Preview</div>
            <div className="text-gray-500 mb-6">Just a quick check—make sure everything looks good!</div>
            <Preview personal={personal} company={company} />
            <div className="w-full flex justify-between items-center mt-6">
              <button className="bg-gray-200 text-gray-700 px-8 py-2 rounded-md shadow hover:bg-gray-300 transition" type="button" onClick={() => handleSetStep(2)}>Back</button>
              <button className="bg-blue-500 text-white px-8 py-2 rounded-md shadow hover:bg-blue-600 transition" type="button" disabled>Finish</button>
            </div>
          </div>
        )}
      </div>
      <div className="custom-shape-divider-bottom-1751788541">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39 116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
        </svg>
      </div>
    </div>
  )
}

export default MainSignUpForm