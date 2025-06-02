"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Globe, Briefcase, GraduationCap, Users, Search, ChevronUp } from "lucide-react"
import supabase from "@/lib/supabase"

import CompanyCard from "./components/company-showcase"
import FeatureCard from "./components/feature-card"
import InterviewCard from "./components/interview-card"
import HowItWorksSection from "./components/how-it-works"
import CourseSelector from "./components/course-selector"
import LandingFooter from "./components/landing-footer"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}



const features = [
  {
    icon: <GraduationCap className="w-8 h-8 text-white" />,
    title: "Showcase your Resume",
    description:
      "Upload or build your resume to highlight your experience and skills. Make it easier for employers to discover you.",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-white" />,
    title: "Add Achievements",
    description:
      "Highlight your milestones and successes, showcasing your skills, growth, and dedication to potential employers.",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Show off your Skills",
    description: "Showcase your skills and expertise to stand out. Let employers see what you bring to the table.",
  },
]

export default function MainLanding() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null)
  const [stiHiringImageUrl, setStiHiringImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      if (e.detail > 1) {
        e.preventDefault()
      }
    }

    document.addEventListener("mousedown", handleDoubleClick)
    return () => {
      document.removeEventListener("mousedown", handleDoubleClick)
    }
  }, [])

  useEffect(() => {
    const fetchHeroImage = async () => {
      const response = await supabase.storage
        .from("app.images")
        .getPublicUrl("hero-section-img.png");

      setHeroImageUrl(response.data?.publicUrl || null);
    };

    fetchHeroImage();
  }, []);

  useEffect(() => {
    const fetchBgImage = async () => {
      const response = await supabase.storage
        .from("app.images")
        .getPublicUrl("bg-placeholder.jpg");

      setBgImageUrl(response.data?.publicUrl || null);
    };

    fetchBgImage();
  }, []);

  useEffect(() => {
    const fetchStiHiringImage = async () => {
      const response = await supabase.storage
        .from("app.images")
        .getPublicUrl("sti-hiring.png");

      setStiHiringImageUrl(response.data?.publicUrl || null);
    };

    fetchStiHiringImage();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll to Top Icon */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 border-2 border-white z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
      {/* Hero Section with Navbar */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800">

        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div className="lg:w-1/2 text-white" initial="hidden" animate="visible" variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                The ultimate platform for interns to{" "}
                <span className="text-yellow-400">connect, grow, and get hired</span>
              </h1>
              <p className="mt-6 text-lg text-blue-100 max-w-xl">
                Build your professional network, showcase your skills, and discover exciting internship
                opportunities—all in one place.
              </p>

              <CourseSelector />
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={heroImageUrl || "/placeholder.svg?height=500&width=600"}
                  alt="Students collaborating"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Floating elements */}
                <motion.div
                  className="absolute top-10 right-10 bg-white p-4 rounded-lg shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500 w-5 h-5" />
                    <span className="text-gray-800 font-medium">Resume uploaded</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-10 left-10 bg-white p-4 rounded-lg shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500 w-5 h-5" />
                    <span className="text-gray-800 font-medium">3 new job matches</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="white"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32 md:py-40">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Set up your <span className="text-blue-700">Profile</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Set up your profile to showcase your skills. Connect with opportunities and grow your network.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Job Matching Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-yellow-500">AI-Powered</span> Job & Candidate Matches
              </h2>
              <p className="text-gray-600 mb-8">
                Create clear, engaging job postings with AI assistance. Optimize your listings to attract the right
                candidates effortlessly.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Smart matching based on skills and experience",
                  "Personalized job recommendations",
                  "Real-time application tracking",
                  "Direct messaging with employers",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/sign-in">
                <motion.button
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Post a job <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={bgImageUrl || "/placeholder.svg?height=500&width=600"}
                  alt="AI Job Matching"
                  width={600}
                  height={500}
                  className="w-full h-auto"
                />

                {/* Floating UI elements */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Search className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI Job Matching</h3>
                        <p className="text-sm text-gray-600">Finding your perfect fit</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Web Developer</span>
                          <span className="text-sm text-blue-700">98% match</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-blue-700 h-1.5 rounded-full" style={{ width: "98%" }}></div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">UX Designer</span>
                          <span className="text-sm text-blue-700">87% match</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-blue-700 h-1.5 rounded-full" style={{ width: "87%" }}></div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Data Analyst</span>
                          <span className="text-sm text-blue-700">76% match</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-blue-700 h-1.5 rounded-full" style={{ width: "76%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connect with People Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={bgImageUrl || "/placeholder.svg?height=500&width=600"}
                  alt="Connect with people"
                  width={600}
                  height={500}
                  className="w-full h-auto"
                />

                {/* Network visualization overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Your Professional Network</h3>
                    <p className="text-blue-100">Connect with industry professionals and fellow students</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-yellow-500">Connect with people</span> who can help
              </h2>
              <p className="text-gray-600 mb-8">
                Build meaningful connections with people who can support your career journey. Use the in-app messaging
                system to network, ask questions, and explore new opportunities.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Expand Your Network</h3>
                    <p className="text-gray-600">
                      Connect with professionals in your field and build relationships that can lead to opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Join Communities</h3>
                    <p className="text-gray-600">
                      Participate in industry-specific groups to share knowledge and stay updated on trends.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/people">
                <motion.button
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Find People You May Know <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interview Practice Section */}
      <section className="py-32 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Smart</span> <span className="text-yellow-400">Practice Interviews</span>
              </h2>
              <p className="text-blue-100 mb-8">
                Prepare for real job interviews with AI-generated questions and feedback. Practice makes perfect, and
                our smart interview system helps you improve with each session.
              </p>

              <Link href="/sign-in">
                <motion.button
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Practice Interview <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <InterviewCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Verified Companies Section */}
      <CompanyCard />

      {/* STI Hiring Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-yellow-500">STI</span> <span className="text-blue-700">is now Hiring</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Join our team at STI College! We&apos;re looking for passionate individuals who are ready to make an impact
                in education and help shape future professionals.
              </p>

              <Link href="/sti-hiring">
                <motion.button
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              <div className="mt-8 p-6 bg-blue-700 text-white rounded-lg">
                <p className="font-medium">
                  <strong>Education for Real Life</strong>
                  <br />
                  Kick-start your career with STI College—where real-life education meets real opportunities.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl h-[500px]">
                <Image src={stiHiringImageUrl || "/placeholder.svg?height=500&width=600"} alt="STI Hiring" fill className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 background-animate"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white">Be </span>
              <motion.span
                className="text-yellow-400 inline-block"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                Future
              </motion.span>
              <span className="text-white"> Ready</span>
            </motion.h2>

            <motion.p
              className="text-2xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find Your Perfect OJT & Career Opportunities Today!
            </motion.p>

            <motion.p
              className="text-blue-100 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Connect with top employers, showcase your skills, and land the opportunity that takes your career to the
              next level. Whether you&apos;re searching for internships or full-time jobs, we&apos;ve got you covered.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/sign-in">
                <motion.button
                  className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-lg font-medium text-lg shadow-glow"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(255, 255, 255, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Today
                </motion.button>
              </Link>

              {/*
              <Link href="/how-it-works">
                <motion.button
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-lg font-medium text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn How It Works
                </motion.button>
              </Link>
              */}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { number: "500+", label: "Partner Companies" },
                { number: "10,000+", label: "Students Placed" },
                { number: "95%", label: "Placement Rate" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                  whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  <motion.div
                    className="text-4xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      
      <LandingFooter/>
    </div>
  )
}
