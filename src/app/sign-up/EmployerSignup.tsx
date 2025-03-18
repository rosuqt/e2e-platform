"use client";
import { useState } from "react";
import StepProgress from "./StepProgress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function App() {
  const [currentStep, setCurrentStep] = useState(1); // Initial step

  // Function to move to the next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1); // Move to the next step
    }
  };

  // Function to go back to the previous step
  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1); // Move to the previous step
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Step Progress Bar */}
      <StepProgress currentStep={currentStep} />

      {/* Form Content */}
      {currentStep === 1 && <Step1 onNext={() => setCurrentStep(2)} />}
      {currentStep === 2 && <Step2 onNext={() => setCurrentStep(3)} onBack={handleBackStep} />}
      {currentStep === 3 && <Step3 onBack={handleBackStep} />}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            onClick={handleBackStep} // Go back to previous step
            className="px-4 py-2 border rounded-md text-gray-700"
          >
            Back
          </button>
        )}
        {currentStep < 3 ? (
          <button
            onClick={handleNextStep} // Move to the next step
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Next
          </button>
        ) : (
          <button className="px-4 py-2 bg-green-600 text-white rounded-md">
            Sign Up
          </button>
        )}
      </div>
    </div>
  );
}
