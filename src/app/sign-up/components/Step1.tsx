import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function Step1({ setCurrentStep }: { setCurrentStep: (step: number) => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "firstName" || name === "lastName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: "Only letters are allowed" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      newValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    if (name === "phone") {
      if (!/^\+?[0-9\s-]*$/.test(value)) {
        setErrors((prev) => ({ ...prev, phone: "Phone number can only contain numbers, spaces, +, or -" }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
      newValue = value.replace(/[^0-9\s+-]/g, "");
    }

    if (name === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "password") {
      if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must have 1 uppercase, 1 number, and 1 special character",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleBlur = (name: string) => {
    if (name === "phone" && (formData.phone.length < 7 || formData.phone.length > 15)) {
      setErrors((prev) => ({ ...prev, phone: "Phone number must be between 7 and 15 digits." }));
    }
    if (name === "confirmPassword" && formData.confirmPassword !== formData.password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    }
  };

  const isFormValid =
    Object.values(formData).every((value) => value.trim() !== "") &&
    Object.values(errors).every((error) => error === "");

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Personal Details</h2>
      <p className="text-sm text-gray-400 mb-5">
        Provide your personal details to complete your profile. This information helps ensure a seamless and personalized experience.
      </p>

      <form className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <input
            name="firstName"
            className="border p-2 rounded w-full"
            placeholder="First name"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <input
            name="lastName"
            className="border p-2 rounded w-full"
            placeholder="Last name"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div className="col-span-2">
          <input
            type="tel"
            name="phone"
            className="border p-2 rounded w-full"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="col-span-2">
          <input
            name="email"
            className="border p-2 rounded w-full"
            placeholder="Personal email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </form>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => isFormValid && setCurrentStep(2)}
          className={`px-12 py-2 flex items-center justify-center gap-2 rounded-full border transition ${
            isFormValid ? "bg-button text-white hover:bg-buttonHover" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          <p>Next</p>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
