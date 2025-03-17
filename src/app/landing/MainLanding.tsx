"use client";
import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
import UploadIcon from "./components/icons/UploadIcon";
import JobMatcher from "./components/icons/JobMatcher";
import InterviewPrep from "./components/SwipableCard";
import Skills from "./components/icons/Skills";
import AutoScrollingCarousel from "./components/CarouselCards";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ScrollToTop from "./components/ScrolltoTop";
import HowItWorks from "./components/HowitWorks";
import AnimatedButton from "./components/Button2";
import { AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";



const scrollFadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const companies = [
  {
    name: "Vivi Enterfries",
    description: "Smart interview preparation tool that analyzes speech patterns and hesitation points.",
    rating: 5,
  },
  {
    name: "Vivision",
    description: "Coaching software that enhances communication skills and interview readiness.",
    rating: 5,
  },
  {
    name: "vvInsecure",
    description: "Adaptive interview training system that sharpens answers and reduces hesitation.",
    rating: 5,
  },
  {
    name: "Kemly n Friends",
    description: "Smart analytics-based coaching that improves your interview performance.",
    rating: 5,
  },
  {
    name: "Parker State",
    description: "Realistic AI-driven mock interviews with instant feedback to improve performance.",
    rating: 5,
  },
  {
    name: "Vivi Enterfries",
    description: "Personalized career coaching with AI-backed performance insights.",
    rating: 5,
  },
  {
    name: "Vox Tech",
    description: "VoxTech dominates the airwaves with state-of-the-art digital networks. ",
    rating: 5,
  }
];

const images = [
  'images/sti/teacher1.jpg', 
  'images/sti/teacher2.jpg',
  'images/sti/teacher3.jpg',
  'images/sti/teacher4.jpg',
  'images/sti/teacher5.jpg'

];



export default function MainLanding() {
    const [hovered, setHovered] = useState(false);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return; 
  
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 >= images.length ? 0 : prevIndex + 1;
        return nextIndex;
      });
    }, 3000); 
  
    return () => clearInterval(interval);
  }, [images]);
  
  
  return (
<div className="h-screen w-full">

  <div className="overflow-y-auto scroll-container">
    <div className="relative min-h-screen bg-[#ffffff] text-white ">
      <LandingNav />
      <HeroSection />
      <ScrollToTop />

      <div className="relative bg-white px-6 md:px-10 py-16 text-black">
        {/* Header Section */}
        <div className="space-y-5 text-center md:text-left md:ml-7 px-5">
          <h1 className="mt-14 text-4xl md:text-5xl font-bold">
            Set up your <span className="text-[#2D4CC8]">Profile</span>
          </h1>
          <p className="mt-2 text-lg text-gray-500 max-w-xl mx-auto md:mx-0">
            Set up your profile to showcase your skills. Connect with opportunities and grow your network.
          </p>
        </div>

        {/* 1st Section */}
        
        <motion.div
          variants={scrollFadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
          

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center px-5">
        
          {/* Showcase your Resume Card */}
          <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg w-full max-w-[375px] flex flex-col items-start transform transition-transform duration-300 ease-in-out hover:scale-110">
            <UploadIcon />
            <h3 className="text-2xl font-bold mt-3">Showcase your Resume</h3>
            <p className="mt-2 text-gray-300 text-sm">
              Upload or build your resume to highlight your experience and skills. Make it easier for employers to discover and connect with you.
            </p>
          </div>

          {/* Add Achievements */}
          <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg w-full max-w-[375px] flex flex-col items-start transform transition-transform duration-300 ease-in-out hover:scale-110">
            <JobMatcher />
            <h3 className="text-2xl font-bold mt-3">Add Achievements</h3>
            <p className="mt-2 text-gray-300 text-sm">
            Highlight your milestones and successes, showcasing your skills, growth, and dedication. From personal victories to professional accomplishments,
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
        </motion.div>




        {/* 2nd Section */}
        {/* AI-Powered Job & Candidate Matches */}
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
                <span className="text-customYellow">AI-Powered </span>
                <span className="text-darkBlue">Job & </span>
              </h1>
              <h1 className="text-darkBlue text-5xl font-bold md:ml-8 px-5">Candidate Matches</h1>
              <p className="mt-4 text-gray-500 text-lg md:ml-8 pt-4 px-5 w-[600px]">
                Create clear, engaging job postings with AI assistance. Optimize your listings to attract the right candidates effortlessly.
              </p>

              <motion.button
                className="bg-button text-white py-4 rounded-[10px] mt-auto ml-12 px-14 shadow-lg"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
              
                Post a job
              
              </motion.button>
              
              
            </div>  
            <div className="bg-gray-300 w-[400px] h-[520px] rounded-[30px] mr-[95px] relative">
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

        {/* Connect with people */}
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
              <h1 className="text-5xl font-bold md:ml-48 px-5">
                <span className="text-customYellow">Connect with </span>
                <span className="text-darkBlue">people</span>
              </h1>
              <h1 className="text-darkBlue text-5xl font-bold md:ml-48 px-5">who can help</h1>
              <p className="mt-4 text-gray-500 text-lg md:ml-48 pt-4 px-5 w-[600px]">
                Build meaningful connections with people who can support your career journey. Use the in-app messaging system to network, ask questions, and explore new opportunities.
              </p>
              <motion.button
                className="bg-button text-white py-4 rounded-[10px] mt-auto ml-52 px-14 shadow-lg"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
              
                Post a job
              
              </motion.button>
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
              <motion.button
                className="bg-button text-white py-4 rounded-[10px] mt-auto ml-12 px-14 shadow-lg"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
              
                Post a job
              
              </motion.button>
            </div>
            <div className="bg-gray-300 w-[400px] h-[520px] rounded-[30px] mr-[95px]">
              <img src="images/abstract-swirls.jpg" alt="Abstract Swirls" className="w-full h-full object-cover rounded-[30px]" />
            </div>
          </div>
        </motion.div>
              

        {/* 3rd Section */}
        <motion.div
          variants={scrollFadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
          
        >
        <div className="bg-darkBlue flex flex-col lg:flex-row items-center rounded-[80px] justify-center ml-16 mt-44 gap-64 w-[1300px] h-[100px] md:h-[500px] lg:h-[500px]">
        {/* Left Side */}
        <div className="max-w-md text-left">
          <h1 className="text-4xl md:text-6xl font-bold">
          <span className="text-[#ffffff]">Smart</span> 
          <span className="text-customYellow"> Practice Interviews</span>
          </h1>
          <p className="mt-2 text-xl text-gray-400">
            Prepare for real job interviews with AI-generated questions and feedback.
          </p>
        </div>

        {/* Right Side */}
        <div className="relative overflow-visible"> 
          <InterviewPrep />
        </div>
      </div>
      </motion.div>
 
      {/* 4th Section Note: Debating whether pwede to editable by admin or no na >__<*/}
      <motion.div
          variants={scrollFadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
      <div className=" py-56 mb-[-250px]">
      <div className="max-w-md text-left">
          <h1 className="text-4xl md:text-5xl font-bold whitespace-nowrap ml-24">
          <span className="text-customYellow">Verified </span> 
          <span className="text-darkBlue">Companies</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600 ml-24 w-[600px]">
          Explore opportunities with our partnered companies. Connect with top employers offering OJT programs and career growth opportunities
          </p>
        </div>
        </div>
      <AutoScrollingCarousel companies={companies} />
      </motion.div>
      </div>
      </div>  


      {/* 5th Section */}
      <section className="relative w-full px-2 py-28">
      <motion.div
          variants={scrollFadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="max-w-6xl ml-10 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-lg">
              <h2 className="text-8xl font-bold text-customYellow ">
                STI <span className="text-[#1C2B5E]">is now</span> Hiring
              </h2>
              <p className="mt-4 text-gray-700">
                Join our team at STI College! We’re looking for passionate individuals who are ready to make an impact in education and help shape future professionals.
              </p>
              <motion.button
                className="mt-6 px-14 py-5 bg-[#1C2B5E] text-white text-xl font-semibold rounded-lg shadow-md hover:bg-[#16224A]"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9, backgroundColor: "#E8AF30" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
              
                Apply Now
              
              </motion.button>
            </div>

            {/* Right: Slideshow */}
            <div className="relative w-[712px] max-w-[712px] h-[700px] mt-10 mr-[-320px]">

            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={images[index]}
                alt="STI Hiring"
                className="absolute inset-0 w-full h-full object-cover shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </AnimatePresence>
            </div>
          </div>

          <div className="w-[800px] bg-[#1C2B5E] text-gray-200 p-8 mt-[-124px] text-left">
            <p className="text-sm text-left max-w-lg ">
              <strong>Education for Real Life</strong>
              <br />
              Kick-start your career with STI College—where real-life education meets real opportunities.
            </p>
          </div>
          </motion.div>
        </section>

          {/* 6th Section */}     
          <div className="p-40 mb-16">
          <HowItWorks />
              </div>

           {/* 7th Section */}

          <motion.div
          variants={scrollFadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="relative w-[90%] max-w-[5000px] h-[500px] mx-auto flex items-center justify-center z-10">

          <div className="rounded-2xl absolute inset-0 bg-gradient-to-r from-darkBlue  to-[#5D4AB1] bg-animate z-0" />
          
          {/* Floating Objects */}
          <motion.div
            drag
            dragConstraints={{left: -100,right: 100,top: -100, bottom: 100, }}
            className="absolute w-40 h-40 rounded-full top-20 left-[calc(50%--8rem)] animate-float"
            style={{ cursor: 'grab' }} 
          >
            <img
              src="/images/globe.png"
              alt="Shape"
              className="w-full h-full object-cover rounded-full"
              draggable="false"
              style={{ transform: 'scale(1.2)' }} 
            />
          </motion.div>

          
          <motion.div drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            className="absolute w-20 h-50 rounded-full bottom-10 right-60 animate-float" 
            style={{ cursor: 'grab' }}  >
              <img
              src="/images/shapes/square.png"
              alt="Shape"
              className="w-full h-full object-cover rounded-full"
              draggable="false"
              style={{ transform: 'scale(4)' }} 
            />
          </motion.div>
          <motion.div drag dragConstraints={{ left: -150, right: -150, top: -150, bottom: 150 }}
            className="absolute w-20 h-50 rounded-full bottom-96 right-20 animate-float" 
            style={{ cursor: 'grab' }}  >
              <img
              src="/images/shapes/star.png"
              alt="Shape"
              className="w-full h-full object-cover rounded-full"
              draggable="false"
              style={{ transform: 'scale(4)' }} 
            />
          </motion.div>

          {/* CTA */}
          <div className="relative flex flex-col items-start w-full max-w-[1000px] ml-24 mx-auto z-10">
          <div className="text-left">
          <h2 className="text-7xl font-bold drop-shadow-lg">
            <span className="text-white">Be </span>
            <span className="text-yellow-400">Future </span>
            <span className="text-white">Ready</span>
          </h2>
          <h3 className="font-semibold text-lg mt-3 text-white"> Find Your Perfect OJT & Career Opportunities Today!</h3>

            <p className="text-base text-white/70 mt-2 w-[500px]">Connect with top employers, showcase your skills, and land the opportunity that takes your career to the next level. 
            Whether you're searching for internships or full-time jobs, we've got you covered.</p>
          </div>
          <div className="mt-5">
          
            <AnimatedButton />
          </div>
        </div>
        </div>
        </motion.div>

    <div className="mt-96">
    <Footer />
    </div>


  </div>
</div>
  );
}