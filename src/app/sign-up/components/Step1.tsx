import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Select, { SingleValue } from "react-select";
import {
  getCountries,
  getCountryCallingCode,
  CountryCode,
} from "libphonenumber-js";
import axios from "axios";
import Swal from "sweetalert2";
import { formData } from "../components/type";

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

  useEffect(() => {
    const defaultCountry = countryOptions.find((option) => option.code === formData.country_code);
    setSelectedCountry(defaultCountry || countryOptions[0]);
  }, [formData.country_code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "first_name" || name === "last_name") {
      newValue = value.replace(/[^A-Za-z]/g, "");
    } else if (name === "phone") {
      newValue = value.replace(/[^0-9]/g, "").slice(0, 15);
    }

    setformData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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

  const validatePhone = (phone: string) => phone.length >= 10;

  const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name);

  const validateForm = () => {
    const newErrors: Errors = {
      first_name:
        formData.first_name && !validateName(formData.first_name)
          ? "First name can only contain letters"
          : "",
      last_name:
        formData.last_name && !validateName(formData.last_name)
          ? "Last name can only contain letters"
          : "",
      phone: validatePhone(formData.phone)
        ? ""
        : "Phone number must be at least 10 digits",
      email: validateEmail(formData.email) ? "" : "Enter a valid email",
      password: validatePassword(formData.password)
        ? ""
        : "Password must be at least 6 characters",
      confirmPassword:
        formData.password === formData.confirmPassword
          ? ""
          : "Passwords do not match",
    };

    setErrors(newErrors);
    setIsFormValid(Object.values(newErrors).every((err) => err === ""));
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        const response = await axios.post("/api/signup-step1", { ...formData, step: 1 });

        if (response.status === 201) {
          setCurrentStep(2);
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Submission error:", error.message);
        } else {
          console.error("Unknown submission error:", error);
        }

        Swal.fire({
          icon: "error",
          title: "This email already exists!",
          text: "Please use a different email address.",
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
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Personal Details</h2>
      <p className="text-sm text-gray-400 mb-5">
        Provide your personal details to complete your profile.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <input
            name="first_name"
            className="border p-2 rounded w-full"
            placeholder="First name"
            required
            value={formData.first_name}
            onChange={handleChange}
            onBlur={() => handleBlur("first_name")}
          />
          {touched.first_name && errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>

        <div>
          <input
            name="last_name"
            className="border p-2 rounded w-full"
            placeholder="Last name"
            required
            value={formData.last_name}
            onChange={handleChange}
            onBlur={() => handleBlur("last_name")}
          />
          {touched.last_name && errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>

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

          <input
            type="tel"
            name="phone"
            className="border p-2 rounded w-full"
            placeholder={`Phone Number (+${selectedCountry?.code.slice(1)})`}
            required
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
          />
          {touched.phone && errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="col-span-2">
          <input
            name="email"
            className="border p-2 rounded w-full"
            placeholder="Personal email"
            required
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            className="border p-2 rounded w-full"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
          />
          {touched.password && errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            className="border p-2 rounded w-full"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("confirmPassword")}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex justify-end mt-6 col-span-2">
          <button
            type="submit"
            className={`px-12 py-2 flex items-center justify-center gap-2 rounded-full border transition ${isFormValid ? "bg-button text-white hover:bg-buttonHover" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!isFormValid}
          >
            <p>Next</p>
            <ChevronRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
