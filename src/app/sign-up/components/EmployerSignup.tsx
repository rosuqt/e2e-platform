  "use client";
  import { useState } from "react";
  import StepProgress from "./StepProgress";
  import Step1 from "../Step1";
  import Step2 from "../Step2";
  import Step3 from "../Step3";
  import { formData } from "@/utils/type";


  export default function App() {
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setformData] = useState<formData>({
      id: "",
      first_name: "",
      last_name: "",
      country_code: "+63",
      phone: "",
      email: "",
      emailVerified: false,
      password: "",
      confirmPassword: "",
      company_name: { id: "", name: "" },
      company_branch: { id: "", name: "" },
      company_role: "",
      job_title: "",
      company_email: "",
      signature: "",
      terms_accepted: false,
      email_domain: "",
      company_website: "",
      company_size: { id: "", name: "" },
      company_industry: { id: "", name: "" },
    });
    
    
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white">
        <div className="font-bold text-3xl text-center mb-12">
          Sign up to hire talent
        </div>

        <StepProgress currentStep={currentStep} />

        {currentStep === 1 && (
          <Step1
          setCurrentStep={setCurrentStep}
          formData={formData}
          setformData={setformData}
        />
        
        )}
        {currentStep === 2 && (
          <Step2
          setCurrentStep={setCurrentStep}
          formData={formData}
          setformData={setformData}
        />
        )}
        {currentStep === 3 && <Step3
          setCurrentStep={setCurrentStep}
          formData={formData}
          setformData={setformData}
        />
  }
      </div>
    );
  }
