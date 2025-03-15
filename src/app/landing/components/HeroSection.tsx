"use client";

import { useState } from "react";
import Dropdown from "../components/Dropdown";
import { motion } from "framer-motion";

export default function HomePage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");

  const courseOptions: string[] = ["BSIT", "BSBA", "BSTM", "BSHM"];
  const jobOptions: { [key: string]: string[] } = {
    BSIT: ["Web Developer", "Software Engineer", "System Analyst", "UI/UX Designer"],
    BSBA: ["Marketing Manager", "Financial Analyst", "HR Specialist", "Business Consultant"],
    BSTM: ["Tour Guide", "Travel Agent", "Event Planner", "Airline Customer Service Manager"],
    BSHM: ["Hotel Manager", "Restaurant Manager", "Chef", "Food and Beverage Director"],
  };

  const images = [
    "/images/globe.png",
    "/images/email.png",
  ];

  return (
    <div className="relative min-h-screen bg-[#ffffff] text-white">
      <div className="relative bg-[#5D4AB1] min-h-[85vh] flex flex-wrap items-center justify-center px-6 py-16 lg:px-10 lg:flex-row">
        
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
            The ultimate platform for interns to{" "}
            <span className="text-yellow-400">connect, grow, and get hired</span>
          </h2>
          <p className="mt-4 text-lg font-light text-gray-200 max-w-xl mx-auto lg:mx-0">
            Build your professional network, showcase your skills, and discover exciting internship opportunities—all in one place. Start your career journey today!
          </p>

          {/* Dropdowns & Button */}
          <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4 z-[9999] relative">
            {/* Course Dropdown */}
            <Dropdown
              label="I'm studying"
              placeholder="Type here"
              options={courseOptions}
              selected={selectedCourse}
              setSelected={setSelectedCourse}
              dropdownHeight="max-h-[130px]"
              width="w-[180px]"
            />

            {/* Job Dropdown */}
            <Dropdown
              label="I'm looking for"
              placeholder={selectedCourse ? `e.g ${jobOptions[selectedCourse]?.[0]}` : "Leave blank for all jobs"}
              options={selectedCourse ? jobOptions[selectedCourse] || [] : []}
              selected={selectedJob}
              setSelected={setSelectedJob}
              dropdownHeight="max-h-32"
              width="w-[270px]"
            />

            <button className="bg-button w-40 h-14 md:h-16 rounded-md text-lg font-semibold z-[9999]">
              Show jobs
            </button>
          </div>
        </div>

        <FloatingImage images={images} />

        {/* Wave Divider */}
        <div className="absolute -bottom-10 left-0 w-full translate-y-[60px] z-[1]">
          <svg viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="white"
              d="M0,224C120,202,240,160,360,154.7C480,149,600,171,720,186.7C840,202,960,210,1080,197.3C1200,185,1320,139,1380,117.3L1440,96V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

interface FloatingImageProps {
  images: string[];
}

function FloatingImage({ images }: FloatingImageProps) {
  const [isDragging, setIsDragging] = useState(false);

  const positions = [
    { top: '-300px', left: '40px', rotate: '0deg', zIndex: 10, width: '300px', height: '300px' },  
    { top: '50px', left: '100px', rotate: '10deg', zIndex: 10, width: '200px', height: '200px' },  
  ];

  return (
    <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0 relative">
      {images.map((src, index) => (
        <motion.div
          key={index}
          className="overflow-hidden cursor-grab"
          drag
          dragElastic={0.8}
          whileTap={{ cursor: "grabbing" }}
          dragConstraints={{ left: 30, right: 30, top: 30, bottom: 30 }}
          animate={{
            scale: isDragging ? 1.05 : [1, 1.04, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          whileDrag={{ scale: 1.05 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          style={{
            position: 'absolute',
            top: positions[index]?.top,
            left: positions[index]?.left,
            transform: `rotate(${positions[index]?.rotate})`,
            zIndex: positions[index]?.zIndex,
            width: positions[index]?.width, 
            height: positions[index]?.height, 
          }}
        >
          <img
            src={src}
            alt="Hero"
            className="object-cover"
            draggable={false}
            style={{
              width: positions[index]?.width, 
              height: positions[index]?.height, 
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
