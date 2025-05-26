"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Loader } from "lucide-react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import PersonalDetailsForm from "./personal-details-form"
import CompanyAssociationForm from "./company-association-form"
import VerificationForm from "./verification-form"
import SuccessPage from "./success"
import { SignUpFormData } from "../types"

const AnimatedCheckIcon = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        key="check-icon"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Check className="w-4 h-4 text-white" />
      </motion.div>
    )}
  </AnimatePresence>
)

const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/check-email?email=${email}`);
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
};

export default function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<SignUpFormData>({
    personalDetails: {
      firstName: "",
      middleName: "",
      lastName: "",
      countryCode: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    companyAssociation: {
      companyId: "",
      companyName: "",
      companyBranch: "",
      companyRole: "",
      jobTitle: "",
      companyEmail: "",
    },
    verificationDetails: {
      termsAccepted: false,
      personalDetails: {
        firstName: "",
        middleName: "",
        lastName: "",
        countryCode: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      companyAssociation: {
        companyName: "",
        companyBranch: "",
        companyRole: "",
        jobTitle: "",
        companyEmail: "",
      },
    },
  })
  const [companyErrors, setCompanyErrors] = useState<{ [key: string]: string }>({
    companyName: "",
    companyBranch: "",
    companyRole: "",
    jobTitle: "",
  })
  const [personalDetailsErrors, setPersonalDetailsErrors] = useState<{ [key: string]: string }>({
    firstName: "",
    middleName: "",
    lastName: "",
    countryCode: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [fetchedCompanies, setFetchedCompanies] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const savedData = sessionStorage.getItem("signUpFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    const fetchInitialData = async () => {
      try {
        const companiesResponse = await fetch("/api/sign-up/companies");
        const companiesData: { company_name: string }[] = await companiesResponse.json();
        setFetchedCompanies(companiesData.map((company) => ({ name: company.company_name })));

        // Prefetch forms
        await Promise.all([
          fetch("/api/sign-up/personal-details-form"),
          fetch("/api/sign-up/company-association-form"),
          fetch("/api/sign-up/verification-form"),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const saveToSessionStorage = (data: Partial<SignUpFormData>) => {
    const updatedData = {
      ...formData,
      ...data,
      verificationDetails: {
        ...formData.verificationDetails,
        ...data.verificationDetails,
        personalDetails: { ...formData.personalDetails, ...data.personalDetails },
        companyAssociation: { ...formData.companyAssociation, ...data.companyAssociation },
      },
      companyAssociation: { ...formData.companyAssociation, ...data.companyAssociation },
    };

    if (JSON.stringify(updatedData) !== JSON.stringify(formData)) {
      setFormData(updatedData);
      sessionStorage.setItem("signUpFormData", JSON.stringify(updatedData));
    }
  };

  const validatePersonalDetails = async () => {
    const errors: { [key: string]: string } = {};
    const details = formData.personalDetails;

    if (!details.firstName.trim()) {
      errors.firstName = "First Name is required.";
    } else if (!/^[a-zA-Z]+(?:[-\s][a-zA-Z]+)*$/.test(details.firstName)) {
      errors.firstName = "Only letters, spaces, and single dashes allowed between names.";
    } else if (details.firstName.length < 1 || details.firstName.length > 36) {
      errors.firstName = "Must be between 1 and 36 characters.";
    }


    if (details.middleName && /[^a-zA-Z\s]/.test(details.middleName)) {
      errors.middleName = "Cant contain numbers or symbols.";
    } else if (details.middleName && details.middleName.length > 35) {
      errors.middleName = "Must not exceed 35 characters.";
    }

    if (!details.lastName.trim()) {
      errors.lastName = "Last Name is required.";
    } else if (/[^a-zA-Z\s]/.test(details.lastName)) {
      errors.lastName = "Cant contain numbers or symbols.";
    } else if (details.lastName.length < 1 || details.lastName.length > 35) {
      errors.lastName = "Last Name must be between 1 and 35 characters.";
    }

    if (!details.countryCode.trim()) {
      errors.countryCode = "Country Code is required.";
    }

    if (!details.phone.trim()) {
      errors.phone = "Phone Number is required.";
    } else if (/[^0-9]/.test(details.phone)) {
      errors.phone = "Cant contain letters or symbols.";
    } else if (details.phone.length < 7 || details.phone.length > 15) {
      errors.phone = "Must be between 7 and 15 digits.";
    }

    if (!details.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.email = "Invalid email format.";
    } else if (details.email.length < 6 || details.email.length > 254) {
      errors.email = "Email must be between 6 and 254 characters.";
    } else if (await checkEmailExists(details.email)) {
      errors.email = "This email is already registered.";
    }

    if (!details.password.trim()) {
      errors.password = "Password is required.";
    } else if (details.password.length < 8 || details.password.length > 40) {
      errors.password = "Password must be between 8 and 40 characters.";
    }

    if (!details.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required.";
    } else if (details.password !== details.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (JSON.stringify(errors) !== JSON.stringify(personalDetailsErrors)) {
      setPersonalDetailsErrors(errors);
    }

    return Object.keys(errors).length === 0;
  };

  const validateCompanyFields = () => {
    const errors: { [key: string]: string } = {}
    if (!formData.companyAssociation.companyName.trim()) {
      errors.companyName = "Company Name is required."
    }
    if (!formData.companyAssociation.companyBranch.trim()) {
      errors.companyBranch = "Company Branch is required."
    }
    if (!formData.companyAssociation.companyRole.trim()) {
      errors.companyRole = "Company Role is required."
    }
    if (!formData.companyAssociation.jobTitle.trim()) {
      errors.jobTitle = "Job Title is required."
    }
    setCompanyErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await validatePersonalDetails(); 
      if (!isValid) return; 
    }
    if (currentStep === 2) {
      const isValid = validateCompanyFields();
      if (!isValid) return;

      const companyName = formData.companyAssociation.companyName.trim();
      if (
        !fetchedCompanies.some((company) => company.name === companyName) &&
        !companyName 
      ) {
        setCompanyErrors((prev) => ({
          ...prev,
          companyName: "Please select a valid company from the list.",
        }));
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      setLoading(true);
      fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to submit form data");
          }
          return response.json();
        })
        .then(() => {
          setShowSuccess(true);
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: "An error occurred while submitting the form.",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card className="mt-18 pt-6 w-full max-w-3xl shadow-xl border-2 border-blue-200 bg-white relative overflow-hidden">
      <CardHeader className="relative z-10">
        <motion.h1
          className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Create Your Account
        </motion.h1>
        <div
          className="flex justify-between items-center relative z-10"
          style={{ marginTop: "1.5rem", paddingTop: "1rem" }}
        >
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex flex-col items-center relative w-full">
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-3 transition-all duration-500 ease-in-out ${
                  step < currentStep || (showSuccess && step === 3)
                    ? "bg-blue-500 border-blue-500"
                    : step === currentStep
                    ? "border-blue-500 bg-white"
                    : "border-gray-300 bg-white"
                }`}
                initial={{ scale: 1 }}
                animate={{
                  scale: step === currentStep || (showSuccess && step === 3) ? 1 : 0.9,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {(step < currentStep || (showSuccess && step === 3)) && (
                  <AnimatedCheckIcon isVisible={true} />
                )}
                {step === currentStep && (
                  <motion.div
                    className="w-3.5 h-3.5 rounded-full bg-blue-500"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                )}
              </motion.div>
              <div className="mt-1 text-sm font-medium text-blue-700">
                {step === 1 ? "Personal Details" : step === 2 ? "Company" : "Verification"}
              </div>
              {index < 2 && (
                <div className="absolute top-4 left-[calc(50%+20px)] w-[calc(100%-40px)] h-[2px]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-in-out ${
                      step < currentStep || (showSuccess && step === 2)
                        ? "bg-blue-500 w-full"
                        : step === currentStep
                        ? "bg-gray-300 border-dashed border-t-2 border-gray-300 bg-transparent w-full"
                        : "bg-gray-300 border-dashed border-t-2 border-gray-300 bg-transparent w-0"
                    }`}
                    style={{
                      transformOrigin: "left",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent
        className={`pt-4 relative z-10 ${showSuccess ? "h-auto" : ""}`}
        style={showSuccess ? undefined : { height: "380px", overflowY: "auto" }}
      >
        {showSuccess ? (
          <SuccessPage />
        ) : currentStep === 1 ? (
          <PersonalDetailsForm
            data={formData.personalDetails}
            onChange={(data) => {
              saveToSessionStorage({ personalDetails: data })
              setPersonalDetailsErrors({})
            }}
            errors={personalDetailsErrors}
          />
        ) : currentStep === 2 ? (
          <CompanyAssociationForm
            data={formData.companyAssociation}
            onChange={(data) => {
              saveToSessionStorage({ companyAssociation: data })
              setCompanyErrors({})
            }}
            errors={companyErrors}
          />
        ) : (
          <VerificationForm
            data={formData.verificationDetails}
            onChange={(data) =>
              saveToSessionStorage({ verificationDetails: data })
            }
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between pb-4 relative z-10">
        {!showSuccess && (
          <>
            {currentStep > 1 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={loading}
                  className="flex items-center gap-1 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-4 py-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              </motion.div>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={currentStep === 1 ? "ml-auto" : ""}
            >
              <Button
                onClick={handleNextStep}
                disabled={
                  loading ||
                  (currentStep === 3 && !formData.verificationDetails.termsAccepted)
                }
                className={`flex items-center gap-1 ${
                  loading
                    ? "bg-gray-300"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white shadow-md rounded-full px-4 py-2`}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {currentStep === 3 ? "Sign up" : "Next"}{" "}
                    {currentStep !== 3 && <ChevronRight className="w-4 h-4" />}
                  </>
                )}
              </Button>
            </motion.div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
