"use client";
import { useState } from "react";
import StepProgress from "./StepProgress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white">
      <div className="font-bold text-3xl text-center mb-12">
        Sign up to hire talent
      </div>

      {/* Step Progress Bar */}
      <StepProgress currentStep={currentStep} />

      {/* Form Content */}
      {currentStep === 1 && <Step1 setCurrentStep={setCurrentStep} />}
      {currentStep === 2 && <Step2 setCurrentStep={setCurrentStep} />}
      {currentStep === 3 && <Step3 setCurrentStep={setCurrentStep} />}
    </div>
  );
}
