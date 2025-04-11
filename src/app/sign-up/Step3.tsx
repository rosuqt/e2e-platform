import { useState, useRef } from "react";
import { ChevronLeft, Maximize, X } from "lucide-react";
import { Checkbox } from "@/app/sign-in/components/Checkbox";
import DigitalSignature from "./components/DigitalSignature";
import { motion } from "framer-motion";
import Link from "next/link";
import { formData } from "../../utils/type";

export default function Step3({
  setCurrentStep,
  formData, 
  setformData,
}: {
  setCurrentStep: (step: number) => void;
  formData: formData; 
  setformData: React.Dispatch<React.SetStateAction<formData>>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [agreeTnC, setAgreeTnC] = useState(false);
  const [signature, setSignature] = useState<string | null>(
    () => localStorage.getItem("signature") || formData.signature || null
  );

  const termsRef = useRef<HTMLDivElement>(null!);
  const guidelinesRef = useRef<HTMLDivElement>(null!);
  const agreementRef = useRef<HTMLDivElement>(null!);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSignatureChange = (newSignature: string | null) => {
    setSignature(newSignature);
    setformData((prev) => ({ ...prev, signature: newSignature }));  // Update formData
    if (newSignature) {
      localStorage.setItem("signature", newSignature);
    } else {
      localStorage.removeItem("signature");
    }
  };

  const sections = [
    {
      title: "Terms & Conditions",
      ref: termsRef,
      content: `1. Introduction`,
    },
    {
      title: "Platform Guidelines",
      ref: guidelinesRef,
      content: `To maintain a secure and professional environment, all employers must adhere to the following guidelines:`,
    },
    {
      title: "Employer Agreement",
      ref: agreementRef,
      content: `By registering on [Platform Name] as an employer, you confirm that:`,
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Verification Agreement</h2>
      <p className="text-gray-600 text-sm mb-4">
        To ensure a secure and trusted platform, we require all employers to
        agree to the following terms.
        <span
          onClick={() => setIsExpanded(true)}
          className="text-button font-medium cursor-pointer hover:underline"
        >
          {" "}
          Enter Full View
        </span>{" "}
        to sign and agree to our terms.
      </p>

      {!isExpanded ? (
        <div className="relative border p-4 rounded h-40 overflow-y-auto">
          <motion.button
            onClick={() => setIsExpanded(true)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 0.6,
              repeatDelay: 3,
            }}
          >
            <Maximize size={18} />
          </motion.button>

          <div className="text-sm">
            <p className="text-gray-400 italic text-base">Preview</p>
            {sections.map((section, index) => (
              <div key={index} ref={section.ref} className="mb-4 px-9">
                <h3 className="font-bold text-lg text-center mb-4 text-black">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-left whitespace-pre-line">
                  {section.content}
                </p>
                {index !== sections.length - 1 && (
                  <hr className="my-10 border-gray-300" />
                )}
              </div>
            ))}
            {signature ? (
              <div className="border border-gray-500 w-1/2 h-24 flex justify-center items-center mx-auto bg-white">
                <img
                  src={signature}
                  alt="Signature Preview"
                  className="max-h-full w-auto block"
                />
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No signature added yet.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-white p-6 flex flex-col justify-center items-center z-50">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <div className="max-w-6xl p-10 w-full border rounded-lg shadow-lg overflow-y-auto h-[100vh]">
            {sections.map((section, index) => (
              <div key={index} ref={section.ref} className="mb-6">
                <h3 className="font-bold text-2xl text-center text-black">
                  {section.title}
                </h3>
                <p className="text-gray-950 text-left whitespace-pre-line px-10 mt-8">
                  {section.content}
                </p>
                {index !== sections.length - 1 && (
                  <hr className="my-6 border-gray-300" />
                )}
              </div>
            ))}
            <hr className="my-6 border-gray-300" />
            <div className="flex items-center gap-2 mt-12">
              <Checkbox
                checked={agreeTnC}
                onChange={() => setAgreeTnC(!agreeTnC)}
              />
              <p className="font-medium">
                I agree to the{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => scrollToSection(termsRef)}
                >
                  Terms & Conditions
                </span>
                ,{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => scrollToSection(guidelinesRef)}
                >
                  Platform Guidelines
                </span>
                , and{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => scrollToSection(agreementRef)}
                >
                  Employer Agreement
                </span>
                .
              </p>
            </div>
            <p className="mt-10">
              Please sign below to confirm your agreement to the{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => scrollToSection(termsRef)}
              >
                Terms & Conditions
              </span>
              ,{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => scrollToSection(guidelinesRef)}
              >
                Platform Guidelines
              </span>
              , and{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => scrollToSection(agreementRef)}
              >
                Employer Agreement
              </span>
              .
            </p>

            <DigitalSignature
              onDone={() => setIsExpanded(false)}
              setSignature={handleSignatureChange}
              signature={signature}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-12 py-2 flex items-center justify-center rounded-full border border-button hover:bg-button/5 transition gap-2 text-button"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <Link href="/sign-in">
          <button
            className={`px-12 py-2 font-bold rounded-full transition ${
              signature && agreeTnC
                ? "bg-button text-white hover:bg-button/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!signature || !agreeTnC}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
