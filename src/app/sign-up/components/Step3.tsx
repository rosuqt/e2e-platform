"use client";
import { useState, useRef } from "react";
import { ChevronLeft, Maximize, X } from "lucide-react";
import { Checkbox } from "@/app/sign-in/components/Checkbox";
import DigitalSignature from "./DigitalSignature";
import { motion } from "framer-motion";
import Link from "next/link";


export default function Step3({ setCurrentStep }: { setCurrentStep: (step: number) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [agreeTnC, setAgreeTnC] = useState(false);
  const [signature, setSignature] = useState<string | null>(
    () => localStorage.getItem("signature") || null
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
      content: `1. Introduction
Welcome to [Platform Name], a web-based platform connecting students with employment opportunities. By using our platform, you agree to comply with these Terms and Conditions. Failure to adhere may result in restricted access or account termination.

2. Employer Responsibilities
Provide accurate and up-to-date information during registration.
Use the platform solely for lawful job posting and recruitment purposes.
Ensure job listings comply with all labor laws and platform guidelines.
Maintain professionalism in communication with candidates.

3. Verification & Account Access
Upon registration, employers receive limited access until company email verification is completed.
Verification tiers affect job posting visibility and platform privileges.
False or misleading information may result in account suspension.

4. Job Posting & Recruitment Policies
Job descriptions must be clear, truthful, and non-discriminatory.
Unpaid internships must be clearly labeled and comply with labor laws.
No fraudulent, misleading, or spam job postings are allowed.

5. Account Termination & Suspension
We reserve the right to suspend or terminate accounts that violate our policies, provide false information, or engage in unethical hiring practices.

6. Modifications to Terms
We may update these Terms and Conditions periodically. Continued use of the platform after modifications constitutes acceptance of the revised terms.
`,
    },
    {
      title: "Platform Guidelines",
      ref: guidelinesRef,
      content: `To maintain a secure and professional environment, all employers must adhere to the following guidelines:

1. Professional Conduct
Maintain respectful communication with job seekers.
Do not request inappropriate personal information from applicants.

2. Job Posting Requirements
Clearly outline job responsibilities, requirements, and compensation (if applicable).
Avoid misleading job titles or descriptions.
Do not post duplicate, expired, or fraudulent job listings.

3. Verification & Compliance
Employers must verify their company email to unlock full platform privileges.
Employers with unverified company emails will have limited job visibility and posting capabilities.
Verified employers gain higher job listing visibility and full feature access.

4. Privacy & Security
Do not share or misuse candidate information.
Respect user privacy in accordance with data protection laws.
Failure to comply with these guidelines may result in restricted access or removal from the platform.
`,
    },
    {
      title: "Employer Agreement",
      ref: agreementRef,
      content: `By registering on [Platform Name] as an employer, you confirm that:

1. Verification & Data Submission
You acknowledge that verification is required to gain full access to the platform.
Upon sign-up, employers receive limited access and must verify their company email to unlock higher privileges.
Higher verification tiers require submitting official company documents for enhanced
     visibility and access.
You agree to provide accurate company details and understand that falsified information may result in immediate suspension.

2. Data Usage & Privacy
You consent to sharing your company name, company email, job postings, and submitted documents for verification purposes.
[Platform Name] ensures that all employer information is stored securely and will not be shared with third parties without consent.
Submitted documents will be used solely for verification and compliance with platform policies.

3. Responsibilities & Compliance
You are an authorized representative of the company you associate with.
You agree to comply with all platform policies, labor laws, and ethical hiring practices.
You will ensure that all job postings are accurate and non-deceptive.
You acknowledge that any violation of the platform’s policies may result in account restrictions or removal.
`,
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Verification Agreement</h2>
      <p className="text-gray-600 text-sm mb-4">
        To ensure a secure and trusted platform, we require all employers to agree to the following terms. 
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
            transition={{ repeat: Infinity, repeatType: "loop", duration: 0.6, repeatDelay: 3 }}
          >
            <Maximize size={18} />
          </motion.button>

          <div className="text-sm">
            <p className="text-gray-400 italic text-base">Preview</p>
            {sections.map((section, index) => (
              <div key={index} ref={section.ref} className="mb-4 px-9">
                <h3 className="font-bold text-lg text-center mb-4 text-black">{section.title}</h3>
                <p className="text-gray-600 text-left whitespace-pre-line">{section.content}</p>
                {index !== sections.length - 1 && <hr className="my-10 border-gray-300" />}
              </div>
            ))}
            {signature ? (
              <div className="border border-gray-500 w-1/2 h-24 flex justify-center items-center mx-auto bg-white">
              <img src={signature} alt="Signature Preview" className="max-h-full w-auto block" />
            </div>
            ) : (
              <p className="text-gray-500 text-sm text-center">No signature added yet.</p>
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
                <h3 className="font-bold text-2xl text-center text-black">{section.title}</h3>
                <p className="text-gray-950 text-left whitespace-pre-line px-10 mt-8">{section.content}</p>
                {index !== sections.length - 1 && <hr className="my-6 border-gray-300" />}
              </div>
            ))}
            <hr className="my-6 border-gray-300" />
            <div className="flex items-center gap-2 mt-12">
              <Checkbox checked={agreeTnC} onChange={() => setAgreeTnC(!agreeTnC)} />
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
