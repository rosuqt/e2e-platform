"use client";
import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
import UploadIcon from "./components/icons/UploadIcon";
import JobMatcher from "./components/icons/JobMatcher";
import Skills from "./components/icons/Skills";
import { motion } from "framer-motion";

const scrollFadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};


export default function MainLanding() {
  return (
    <div className="relative min-h-screen bg-[#ffffff] text-white">
      <LandingNav />
      <HeroSection />

      <div className="relative bg-white px-6 md:px-10 py-16 text-black">
        {/* Header Section */}
        <div className="space-y-5 text-center md:text-left md:ml-7 px-5">
          <h1 className="text-4xl md:text-5xl font-bold">
            Set up your <span className="text-[#2D4CC8]">Profile</span>
          </h1>
          <p className="mt-2 text-lg text-gray-500 max-w-xl mx-auto md:mx-0">
            Set up your profile to showcase your skills. Connect with opportunities and grow your network.
          </p>
        </div>

        {/* Cards Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center px-5">
          {/* Showcase your Resume Card */}
          <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg w-full max-w-[375px] flex flex-col items-start transform transition-transform duration-300 ease-in-out hover:scale-110">
            <UploadIcon />
            <h3 className="text-2xl font-bold mt-3">Showcase your Resume</h3>
            <p className="mt-2 text-gray-300 text-sm">
              Upload or build your resume to highlight your experience and skills. Make it easier for employers to discover and connect with you.
            </p>
          </div>

          {/* AI Job Matches Card */}
          <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg w-full max-w-[375px] flex flex-col items-start transform transition-transform duration-300 ease-in-out hover:scale-110">
            <JobMatcher />
            <h3 className="text-2xl font-bold mt-3 ml-6">AI Job Matches</h3>
            <p className="mt-2 text-gray-300 text-sm">
              Get personalized job recommendations based on your skills and resume. Let AI match you with the best opportunities effortlessly.
            </p>
          </div>

          {/* Show off your skills Card */}
          <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg w-full max-w-[375px] flex flex-col items-start transform transition-transform duration-300 ease-in-out hover:scale-110">
            <Skills />
            <h3 className="text-2xl font-bold mt-3">Show off your skills</h3>
            <p className="mt-2 text-gray-300 text-sm">
              Showcase your skills and expertise to stand out. Let employers see what you bring to the table.
            </p>
          </div>
        </div>

        {/* 1st group */}
        <motion.div
          variants={scrollFadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="mt-36 pt-9 pb-10 flex flex-col lg:flex-row justify-between items-center">
            <div className="mr-6 text-left flex flex-col items-start max-w-[900px] space-y-4">
              <h1 className="text-5xl font-bold md:ml-8 px-5">
                <span className="text-customYellow">AI-Assisted </span>
                <span className="text-darkBlue">Job Post</span>
              </h1>
              <h1 className="text-darkBlue text-5xl font-bold md:ml-8 px-5">Creator</h1>
              <p className="mt-4 text-gray-500 text-lg md:ml-8 pt-4 px-5 w-[600px]">
                Create clear, engaging job postings with AI assistance. Optimize your listings to attract the right candidates effortlessly.
              </p>
              <button className="bg-button text-white py-4 rounded-[10px] mt-auto ml-12 px-14 shadow-lg">
                Post a job
              </button>
            </div>  
            <div className="bg-gray-300 w-[400px] h-[520px] rounded-[30px] mr-44 relative">
              <img src="images/abstract-swirls.jpg" alt="Abstract Swirls" className="w-full h-full object-cover rounded-[30px]" />
              <img 
                src="https://support.eddy.com/hubfs/Screen%20Shot%202022-02-15%20at%203-10-13%20PM-png-1.png" 
                alt="Small Image" 
                className="absolute top-4 left-4 w-[280px] h-[280px] object-contain"
              />
              <img 
                src="https://www.naukri.com/campus/career-guidance/wp-content/uploads/2024/09/Job-posting-website-login.jpg" 
                alt="Another Small Image" 
                className="absolute bottom-4 left-24 w-[280px] h-[280px] object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* 2nd group */}
        <motion.div
          variants={scrollFadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="mt-36 pt-9 pb-10 flex flex-col lg:flex-row justify-between items-center">
            <div className="w-[420px] h-[520px] rounded-[30px] md:ml-8 px-5">
              <img src="images/abstract-swirls.jpg" alt="Abstract Swirls" className="w-full h-full object-cover rounded-[30px]" />
            </div>
            <div className="mr-6 text-left flex flex-col items-start max-w-[900px] space-y-4">
              <h1 className="text-5xl font-bold md:mr-44 px-5">
                <span className="text-customYellow">Connect with </span>
                <span className="text-darkBlue">people</span>
              </h1>
              <h1 className="text-darkBlue text-5xl font-bold md:mr-44 px-5">who can help</h1>
              <p className="mt-4 text-gray-500 text-lg md:mr-44 pt-4 px-5 w-[600px]">
                Build meaningful connections with people who can support your career journey. Use the in-app messaging system to network, ask questions, and explore new opportunities.
              </p>
              <button className="bg-button text-white py-4 rounded-[10px] ml-4 mt-auto ml-12 px-14 shadow-lg">
                Post a job
              </button>
            </div>
          </div>
        </motion.div>

        {/* 3rd group */}
        <motion.div
          variants={scrollFadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="mt-36 pt-9 pb-10 flex flex-col lg:flex-row justify-between items-center">
            <div className="mr-6 text-left flex flex-col items-start max-w-[900px] space-y-4">
              <h1 className="text-5xl font-bold md:ml-8 px-5">
                <span className="text-customYellow">AI-Assisted </span>
                <span className="text-darkBlue">Job Post</span>
              </h1>
              <h1 className="text-darkBlue text-5xl font-bold md:ml-8 px-5">Creator</h1>
              <p className="mt-4 text-gray-500 text-lg md:ml-8 pt-4 px-5 w-[600px]">
                Create clear, engaging job postings with AI assistance. Optimize your listings to attract the right candidates effortlessly.
              </p>
              <button className="bg-button text-white py-4 rounded-[10px] mt-auto ml-12 px-14 shadow-lg">
                Post a job
              </button>
            </div>
            <div className="bg-gray-300 w-[400px] h-[520px] rounded-[30px] mr-44">
              <img src="images/abstract-swirls.jpg" alt="Abstract Swirls" className="w-full h-full object-cover rounded-[30px]" />
            </div>
          </div>
        </motion.div>
              </div>
            </div>  



      
  );
}
