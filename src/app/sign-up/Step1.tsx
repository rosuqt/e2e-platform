import { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { getCountries, getCountryCallingCode, CountryCode } from "libphonenumber-js";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { formData } from "../../utils/type";
import { ChevronRight } from "lucide-react";
import { MdError } from "react-icons/md";
import { motion } from "framer-motion";

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
  

  const handleCountryChange = (option: SingleValue<CountryOption>) => {
    if (option) {
      setSelectedCountry(option);
      setformData((prev) => ({
        ...prev,
        phone: "",
        country_code: option.code,
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
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
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

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-4 relative pb-24">
        <motion.div
          variants={shakeVariant}
          animate={touched.first_name && errors.first_name ? "shake" : ""}
          className="w-full flex items-center gap-2"
        >
          <div className="relative w-full">
            <label htmlFor="first_name" className="block text-sm font-normal text-gray-500">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              autoComplete="off"
              className={`border p-2 rounded w-full ${
                touched.first_name && errors.first_name ? "border-red-500" : ""
              }`}
              placeholder="First name*"
              value={formData.first_name}
              onChange={handleChange}
              onBlur={() => handleBlur("first_name")}
            />
            <div className="h-4">
              {touched.first_name && errors.first_name && (
                <p className="text-red-500 text-xs">{errors.first_name}</p>
              )}
            </div>
          </div>
          {touched.first_name && errors.first_name && <MdError className="text-red-500 w-4 h-4" />}
        </motion.div>

        <motion.div
          variants={shakeVariant}
          animate={touched.last_name && errors.last_name ? "shake" : ""}
          className="w-full flex items-center gap-2"
        >
          <div className="relative w-full">
            <label htmlFor="last_name" className="block text-sm font-normal text-gray-500">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              autoComplete="off"
              className={`border p-2 rounded w-full ${
                touched.last_name && errors.last_name ? "border-red-500" : ""
              }`}
              placeholder="Last name*"
              value={formData.last_name}
              onChange={handleChange}
              onBlur={() => handleBlur("last_name")}
            />
            <div className="h-4">
              {touched.last_name && errors.last_name && (
                <p className="text-red-500 text-xs">{errors.last_name}</p>
              )}
            </div>
          </div>
          {touched.last_name && errors.last_name && <MdError className="text-red-500 w-4 h-4" />}
        </motion.div>

        <div className="col-span-2 flex gap-4">
          {selectedCountry && (
            <div className="w-1/3">
              <label htmlFor="country" className="block text-sm font-normal text-gray-500">
                Country
              </label>
              <Select
                id="country"
                options={countryOptions}
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full"
                onBlur={() => handleBlur("phone")}
              />
            </div>
          )}

          <motion.div
            className="relative w-full flex items-center gap-2"
            variants={shakeVariant}
            animate={touched.phone && errors.phone ? "shake" : ""}
          >
            <div className="w-full">
              <label htmlFor="phone" className="block text-sm font-normal text-gray-500">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                autoComplete="off"
                className={`border p-2 rounded w-full ${
                  touched.phone && errors.phone ? "border-red-500" : ""
                }`}
                placeholder={`Phone Number (+${selectedCountry?.code.slice(1)})*`}
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur("phone")}
                onKeyDown={(e) => {
                  if (!/^[0-9]*$/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                    e.preventDefault();
                  }
                }}
              />
              <div className="h-4">
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone}</p>
                )}
              </div>
            </div>
            {touched.phone && errors.phone && <MdError className="text-red-500 w-4 h-4" />}
          </motion.div>
        </div>

        <motion.div
          className="col-span-2 flex items-center gap-2"
          variants={shakeVariant}
          animate={touched.email && errors.email ? "shake" : ""}
        >
          <div className="relative w-full">
            <label htmlFor="email" className="block text-sm font-normal text-gray-500">
              Email
            </label>
            <input
              id="email"
              name="email"
              autoComplete="off"
              className={`border p-2 rounded w-full ${
                touched.email && errors.email ? "border-red-500" : ""
              }`}
              placeholder="Personal email*"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
            />
            <div className="h-4">
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
          </div>
          {touched.email && errors.email && <MdError className="text-red-500 w-4 h-4" />}
        </motion.div>

        <motion.div
          className="relative flex items-center gap-2"
          variants={shakeVariant}
          animate={touched.password && errors.password ? "shake" : ""}
        >
          <div className="w-full">
            <label htmlFor="password" className="block text-sm font-normal text-gray-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="off"
              className={`border p-2 rounded w-full ${
                touched.password && errors.password ? "border-red-500" : ""
              }`}
              placeholder="Password*"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
            />
            <div className="h-4">
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
          </div>
          {touched.password && errors.password && <MdError className="text-red-500 w-4 h-4" />}
        </motion.div>

        <motion.div
          className="relative flex items-center gap-2"
          variants={shakeVariant}
          animate={touched.confirmPassword && errors.confirmPassword ? "shake" : ""}
        >
          <div className="w-full">
            <label htmlFor="confirmPassword" className="block text-sm font-normal text-gray-500">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              autoComplete="off"
              className={`border p-2 rounded w-full ${
                touched.confirmPassword && errors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder="Confirm Password*"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
            />
            <div className="h-4">
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          {touched.confirmPassword && errors.confirmPassword && <MdError className="text-red-500 w-4 h-4" />}
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
