import { useState, useEffect } from "react";
import { getCountries, getCountryCallingCode, CountryCode } from "libphonenumber-js";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { formData } from "../../utils/type";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import { FormControl,  MenuItem, Select as MuiSelect, SelectChangeEvent } from "@mui/material";

{/*Needs fix: step1 pending_employers isnt getting checked*/}

const shakeVariant = {
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.4 },
  },
};

const countryOptions = getCountries().map((country) => ({
  value: country as CountryCode,
  label: `${country} (+${getCountryCallingCode(country as CountryCode)})`,
  code: `+${getCountryCallingCode(country as CountryCode)}`,
}));

interface CountryOption {
  value: CountryCode;
  label: string;
  code: string;
}

interface Errors {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Step1({
  setCurrentStep,
  formData,
  setformData,
}: {
  setCurrentStep: (step: number) => void;
  formData: formData;
  setformData: React.Dispatch<React.SetStateAction<formData>>;
}) {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  
  const [errors, setErrors] = useState<Errors>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    phone: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const defaultCountry = countryOptions.find((option) => option.code === formData.country_code);
    setSelectedCountry(defaultCountry || countryOptions[0]);
  }, [formData.country_code]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === "email") {
      setformData((prev) => ({
        ...prev,
        email: value,
        emailVerified: false,
      }));
    } else {
      setformData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    const selectedCode = event.target.value;
    const selectedOption = countryOptions.find((option) => option.code === selectedCode);
    if (selectedOption) {
      setSelectedCountry(selectedOption);
      setformData((prev) => ({
        ...prev,
        phone: "",
        country_code: selectedOption.code,
      }));
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;
  const validatePhone = (phone: string) => {
    if (!phone) return "Please fill out your phone number";
    if (/[^0-9]/.test(phone)) return "Phone number must not contain letters or symbols";
    if (phone.length < 10) return "Phone number must be at least 10 digits";
    return "";
  };
  const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name);

  const validateForm = () => {
    const newErrors: Errors = {
      first_name: !formData.first_name
        ? "Please fill out your first name"
        : !validateName(formData.first_name)
        ? "First name can only contain letters"
        : "",
  
      last_name: !formData.last_name
        ? "Please fill out your last name"
        : !validateName(formData.last_name)
        ? "Last name can only contain letters"
        : "",
  
      phone: validatePhone(formData.phone),
  
      email: !formData.email
        ? "Please fill out your email"
        : !validateEmail(formData.email)
        ? "Must be a valid email format. e.g email@mail.com"
        : "",
  
      password: !formData.password
        ? "Please fill out your password"
        : !validatePassword(formData.password)
        ? "Password must be at least 6 characters"
        : "",
  
      confirmPassword: !formData.confirmPassword
        ? "Please confirm your password"
        : formData.password !== formData.confirmPassword
        ? "Passwords do not match"
        : "",
    };
  
    setErrors(newErrors);
    setIsFormValid(Object.values(newErrors).every((err) => err === ""));
  };
  

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    setTouched({
      first_name: true,
      last_name: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
  
    validateForm();
    if (!isFormValid) return;
  
    if (formData.emailVerified) {
      setCurrentStep(2);
      return;
    }
  
    try {
      const response = await axios.post("/api/signup-step1", {
        ...formData,
        step: 1,
      });
  
      if (response.status === 201) {
        setformData((prev) => ({
          ...prev,
          emailVerified: true,
        }));
        setCurrentStep(2);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string; type?: string }>;
      const errorMessage = axiosError.response?.data?.message || "";
      const errorType = axiosError.response?.data?.type;

      if (axiosError.response?.status === 409 && errorType === "pending") {
        Swal.fire({
          icon: "warning",
          title: "This email is pending approval!",
          text: "Your registration is currently under review.",
          confirmButtonText: "OK",
          confirmButtonColor: "#3B82F6",
        });
      } else if (
        axiosError.response?.status === 400 &&
        errorMessage.toLowerCase().includes("already registered")
      ) {
        Swal.fire({
          icon: "error",
          title: "This email already exists!",
          text: "Please use a different email address.",
          confirmButtonText: "OK",
          confirmButtonColor: "#3B82F6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred. Please try again later.",
          confirmButtonText: "OK",
          confirmButtonColor: "#3B82F6",
        });
      }
    }
  };
  

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Personal Details</h2>
      <p className="text-sm text-gray-400 mb-5">
        Provide your personal details to complete your profile.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-1 mt-4 relative pb-24">
        <motion.div
          variants={shakeVariant}
          animate={touched.first_name && errors.first_name ? "shake" : ""}
          className="w-full flex items-center gap-1 mb-6"
        >
          <div className="relative w-full">
            <TextField
              id="first_name"
              name="first_name"
              label="First Name*"
              variant="outlined"
              fullWidth
              value={formData.first_name}
              onChange={handleChange}
              onBlur={() => handleBlur("first_name")}
              error={touched.first_name && !!errors.first_name}
              helperText={touched.first_name && errors.first_name}
              FormHelperTextProps={{ style: { minHeight: "1.5em" } }} // Reserve space for helper text
            />
          </div>
        </motion.div>

        <motion.div
          variants={shakeVariant}
          animate={touched.last_name && errors.last_name ? "shake" : ""}
          className="w-full flex items-center gap-1 mb-6"
        >
          <div className="relative w-full">
            <TextField
              id="last_name"
              name="last_name"
              label="Last Name*"
              variant="outlined"
              fullWidth
              value={formData.last_name}
              onChange={handleChange}
              onBlur={() => handleBlur("last_name")}
              error={touched.last_name && !!errors.last_name}
              helperText={touched.last_name && errors.last_name}
              FormHelperTextProps={{ style: { minHeight: "1.5em" } }} // Reserve space for helper text
            />
          </div>
        </motion.div>

        <div className="col-span-2 flex gap-6 items-end mb-6">
          <div className="w-1/3">
            <FormControl fullWidth>
              <MuiSelect
                labelId="country-select-label"
                id="country-select"
                value={selectedCountry?.code || ""}
                onChange={handleCountryChange}
                onBlur={() => handleBlur("phone")}
                displayEmpty
              >
                {countryOptions.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <motion.div
            className="flex-1 relative flex items-center gap-1"
            variants={shakeVariant}
            animate={touched.phone && errors.phone ? "shake" : ""}
          >
            <div className="w-full">
              <TextField
                id="phone"
                name="phone"
                label="Phone Number*"
                variant="outlined"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur("phone")}
                error={touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="col-span-2 flex items-center gap-1 mb-6"
          variants={shakeVariant}
          animate={touched.email && errors.email ? "shake" : ""}
        >
          <div className="relative w-full">
            <TextField
              id="email"
              name="email"
              label="Personal Email*"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
          </div>
        </motion.div>

        <motion.div
          className="relative flex items-center gap-1 mb-6"
          variants={shakeVariant}
          animate={touched.password && errors.password ? "shake" : ""}
        >
          <div className="w-full">
            <TextField
              id="password"
              name="password"
              label="Password*"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              FormHelperTextProps={{ style: { minHeight: "1.5em" } }} // Reserve space for helper text
            />
          </div>
        </motion.div>

        <motion.div
          className="relative flex items-center gap-1 mb-6"
          variants={shakeVariant}
          animate={touched.confirmPassword && errors.confirmPassword ? "shake" : ""}
        >
          <div className="w-full">
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password*"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
              error={touched.confirmPassword && !!errors.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
              FormHelperTextProps={{ style: { minHeight: "1.5em" } }} // Reserve space for helper text
            />
          </div>
        </motion.div>

        <div className="absolute bottom-6 right-4 left-4 flex justify-end">
          <button
            type="submit"
            className={`px-12 py-2 flex items-center justify-center gap-2 rounded-full border transition ${
              hasSubmitted && !isFormValid
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-button text-white hover:bg-buttonHover"
            }`}
            disabled={hasSubmitted && !isFormValid}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
