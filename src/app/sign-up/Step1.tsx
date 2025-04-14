import { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { getCountries, getCountryCallingCode, CountryCode } from "libphonenumber-js";
import axios from "axios";
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
        ? "Enter a valid email"
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "This email already exists!",
        text: "Please use a different email address.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6",
      });
    }
  };
  

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Personal Details</h2>
      <p className="text-sm text-gray-400 mb-5">
        Provide your personal details to complete your profile.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
      <motion.div
        variants={shakeVariant}
        animate={touched.first_name && errors.first_name ? "shake" : ""}
        className="w-full relative"
      >
        <input
          name="first_name"
          autoComplete="off"
          className={`border p-2 rounded w-full pr-10 ${
            touched.first_name && errors.first_name ? "border-red-500" : ""
          }`}
          placeholder="First name*"
          value={formData.first_name}
          onChange={handleChange}
          onBlur={() => handleBlur("first_name")}
        />
        {touched.first_name && errors.first_name && (
          <div className="absolute right-2 top-5 -translate-y-1/2 flex items-center pl-2">
            <MdError className="text-red-500 w-4 h-4  " />
          </div>
        )}
        {touched.first_name && errors.first_name && (
          <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
        )}
      </motion.div>



      <motion.div
        variants={shakeVariant}
        animate={touched.first_name && errors.first_name ? "shake" : ""}
        className="w-full relative"
      >
          <input
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
          {touched.last_name && errors.last_name && (
          <div className="absolute right-2 top-5 -translate-y-1/2 flex items-center pl-2">
            <MdError className="text-red-500 w-4 h-4  " />
          </div>
        )}
        {touched.last_name && errors.last_name && (
          <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
        )}
        </motion.div>

        <div className="col-span-2 flex gap-4">
        {selectedCountry && (
          <Select
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-1/3"
            onBlur={() => handleBlur("phone")}
          />
        )}

        <motion.div
          className="relative w-full"
          variants={shakeVariant}
          animate={touched.phone && errors.phone ? "shake" : ""}
        >
          <input
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
          />
          {touched.phone && errors.phone && (
            <div className="absolute right-2 top-5 -translate-y-1/2 flex items-center pl-2">
              <MdError className="text-red-500 w-4 h-4" />
            </div>
          )}
          {touched.phone && errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </motion.div>
      </div>

      <motion.div
        className="col-span-2 relative"
        variants={shakeVariant}
        animate={touched.email && errors.email ? "shake" : ""}
      >
        <input
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
        {touched.email && errors.email && (
          <div className="absolute right-2 top-5 -translate-y-1/2 flex items-center pl-2">
            <MdError className="text-red-500 w-4 h-4" />
          </div>
        )}
        {touched.email && errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </motion.div>

      <motion.div
        className="relative"
        variants={shakeVariant}
        animate={touched.password && errors.password ? "shake" : ""}
      >
        <input
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
        {touched.password && errors.password && (
          <div className="absolute right-2 top-5 -translate-y-1/2 flex items-center pl-2">
          </div>
        )}
        {touched.password && errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </motion.div>

      <motion.div
        className="relative"
        variants={shakeVariant}
        animate={touched.confirmPassword && errors.confirmPassword ? "shake" : ""}
      >
        <input
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
        {touched.confirmPassword && errors.confirmPassword && (
          <div className="absolute right-2 top-5 -translate-y-1/2 flex items-center pl-2">
          </div>
        )}
        {touched.confirmPassword && errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </motion.div>


        <div className="flex justify-end mt-6 col-span-2">
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
