"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import ToggleSwitch from "./Toggle";

export default function HowItWorks() {
  const [toggleState, setToggleState] = useState(false);
  
  return(
    <div className="flex flex-col items-center space-y-6">

    <AnimatePresence mode="wait">
      {toggleState ? <AlternateView key="alternate" /> : <MainView key="main" />}
    </AnimatePresence>

    <ToggleSwitch
    knobWidth={150}
      isOn={toggleState}
      setIsOn={setToggleState}
      onLabel="For Employers"
      offLabel="For Students"
      className="!m-16"
    />
  </div>
  );
}

{/*Student View*/}
function MainView() {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  return (
    
    <motion.div
      ref={ref}
      key={inView ? "mainView" : "hidden"} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-[1fr_1.5fr] gap-20 max-w-7xl"
    >
      {/* Left Section */}
      <div>
      <h2 className="text-6xl font-bold mb-14">
        <span className="text-darkBlue">How It</span> <span className="text-customYellow">Works</span>
      </h2>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <Step key={index} number={index + 1} text={step} />
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-center space-y-9 mt-16">
        <div className="flex space-x-[100px]">
          {images.map((img, index) => (
            <div key={index} className="text-center">
              <motion.img
                src={img.src}
                alt={img.title}
                className="w-48 h-48 object-cover rounded-lg"
                whileHover={{ scale: 1.05 }}
              />
              <p className="mt-2 font-semibold">{img.title}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
      animate={inView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-4"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-darkBlue text-white text-lg font-bold">
        {number}
      </div>
      <p className="text-lg flex-1">{text}</p>
    </motion.div>
  );
}

{/*Employer View*/}
function AlternateView() {
    const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  return (
    
    <motion.div
      ref={ref}
      key={inView ? "mainView" : "hidden"} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-[1fr_1.5fr] gap-20 max-w-7xl"
    >
      {/* Left Section */}
      <div>
      <h2 className="text-6xl font-bold mb-14">
        <span className="text-darkBlue">How It</span> <span className="text-customYellow">Works</span>
      </h2>

        <div className="space-y-8">
          {steps2.map((step, index) => (
            <Step key={index} number={index + 1} text={step} />
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-center space-y-9 mt-16">
        <div className="flex space-x-[100px]">
          {images2.map((img, index) => (
            <div key={index} className="text-center">
              <motion.img
                src={img.src}
                alt={img.title}
                className="w-48 h-48 object-cover rounded-lg"
                whileHover={{ scale: 1.05 }}
              />
              <p className="mt-2 font-semibold">{img.title}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const steps = [
  "Create your profile and upload your resume to showcase your skills.",
  "AI recommends the best OJT opportunities. Chat directly with employers.",
  "Easily apply for OJT programs and monitor your application status."
];

const images = [
  { src: "images/how-it-works/student1.avif", title: "Set Up Your Profile" },
  { src: "images/how-it-works/student3.avif", title: "Match & Connect" },
  { src: "images/how-it-works/student2.avif", title: "Apply & Track Progress" }
];

const steps2 = [
  "Create your profile and verify your employer account to gain trust and full access.",
  "Find the right candidate with AI-powered candidate matching.",
  "Streamline your hiring process with easycreal-time application tracking."
];

const images2 = [
  { src: "images/how-it-works/employer1.avif", title: "Verify your Account" },
  { src: "images/how-it-works/employer3.avif", title: "AI Matching" },
  { src: "images/how-it-works/employer2.avif", title: "Seamless Hiring" }
];
