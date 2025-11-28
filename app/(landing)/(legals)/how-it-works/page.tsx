"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Upload,
  Search,
  MessageSquare,
  Briefcase,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";
import LandingFooter from "../../landing/components/landing-footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Sign up and build your professional profile. Upload your resume, add your skills, and showcase your achievements.",
    icon: <Upload className="w-8 h-8 text-white" />,
    features: [
      "Upload resume",
      "Add skills & achievements",
      "Professional photo",
      "Portfolio showcase",
    ],
  },
  {
    number: "02",
    title: "Get Matched",
    description:
      "Our AI analyzes your profile and matches you with relevant opportunities based on your skills and preferences.",
    icon: <Search className="w-8 h-8 text-white" />,
    features: [
      "AI-powered matching",
      "Personalized recommendations",
      "Real-time notifications",
      "Smart filtering",
    ],
  },
  {
    number: "03",
    title: "Connect & Apply",
    description:
      "Connect with employers, practice interviews, and apply to positions that align with your career goals.",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    features: [
      "Direct messaging",
      "Interview practice",
      "Application tracking",
      "Feedback system",
    ],
  },
  {
    number: "04",
    title: "Land Your Dream Job",
    description:
      "Get hired by top companies and start your career journey with confidence and the right connections.",
    icon: <Briefcase className="w-8 h-8 text-white" />,
    features: [
      "Job placement",
      "Career guidance",
      "Ongoing support",
      "Success tracking",
    ],
  },
];

const benefits = [
  {
    title: "For Students",
    items: [
      "Access to exclusive internship opportunities",
      "AI-powered job matching",
      "Interview practice and preparation",
      "Professional networking",
      "Career guidance and mentorship",
    ],
  },
  {
    title: "For Employers",
    items: [
      "Access to pre-screened talent",
      "AI-assisted candidate matching",
      "Streamlined hiring process",
      "Direct communication tools",
      "Reduced time-to-hire",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center text-white max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How It <span className="text-yellow-400">Works</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover how our platform connects talented students with amazing
              opportunities in just four simple steps.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <span>Simple</span>
              <ChevronRight className="w-4 h-4" />
              <span>Smart</span>
              <ChevronRight className="w-4 h-4" />
              <span>Successful</span>
            </div>
          </motion.div>
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

      {/* Steps Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">
              Your Journey to <span className="text-blue-700">Success</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to unlock your potential and connect
              with opportunities that matter.
            </p>
          </motion.div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="text-8xl font-bold text-gray-100 absolute -top-8 -left-4">
                      {step.number}
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center mb-6">
                        {step.icon}
                      </div>
                      <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        {step.description}
                      </p>

                      <ul className="space-y-3">
                        {step.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={
                        index === 0
                          ? "/images/how-it-works/bg-blue-gradient.png"
                          : index === 1
                          ? "/images/how-it-works/bg-blue-gradient.png"
                          : index === 2
                          ? "/images/how-it-works/bg-blue-gradient.png"
                          : index === 3
                          ? "/images/how-it-works/bg-blue-gradient.png"
                          : "/placeholder.svg?height=400&width=600"
                      }
                      alt={step.title}
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />

                    {/* Overlay with step indicator */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-blue-700 font-bold">
                          Step {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Portfolio Preview Floating Card - only for Step 1 */}
                    {index === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="pointer-events-auto bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40"
                          style={{
                            minWidth: 340,
                            maxWidth: 380,
                            width: "90%",
                            padding: "2rem 1.5rem 1.5rem 1.5rem",
                            boxShadow:
                              "0 4px 32px 0 rgba(80, 80, 255, 0.18), 0 0 0 2px rgba(80, 80, 255, 0.08)",
                            borderRadius: "1.25rem",
                            background:
                              "linear-gradient(135deg, rgba(60,110,255,0.18) 0%, rgba(120,60,255,0.16) 100%)",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <div className="text-lg font-semibold text-blue-700 mb-3 text-center">
                            Portfolio Preview
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {/* Portfolio thumbnails */}
                            {[1, 2, 3, 4].map((item) => (
                              <div
                                key={item}
                                className="aspect-[4/3] rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200 shadow-sm"
                              >
                                <svg width="32" height="32" fill="none">
                                  <rect
                                    width="32"
                                    height="32"
                                    rx="8"
                                    fill="#E0E7FF"
                                  />
                                  <path
                                    d="M8 20L14 14L20 20"
                                    stroke="#6366F1"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="2"
                                    fill="#6366F1"
                                  />
                                </svg>
                              </div>
                            ))}
                          </div>
                          <button
                            className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg border-none outline-none transition hover:from-blue-700 hover:to-indigo-700"
                            style={{
                              boxShadow: "0 0 12px 2px rgba(80,80,255,0.18)",
                              textShadow: "0 0 6px #6366F1",
                              filter: "drop-shadow(0 0 6px #6366F1)",
                            }}
                          >
                            + Add New Project
                          </button>
                        </div>
                      </div>
                    )}

                    {/* AI Job Matching Floating Panel - only for Step 2 */}
                    {index === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="pointer-events-auto rounded-2xl shadow-2xl border"
                          style={{
                            minWidth: 340,
                            maxWidth: 380,
                            width: "90%",
                            padding: "2rem 1.5rem 1.5rem 1.5rem",
                            borderRadius: "1.25rem",
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(120,60,255,0.18) 100%)",
                            border: "2px solid rgba(80,80,255,0.25)",
                            boxShadow:
                              "0 8px 40px 0 rgba(80,80,255,0.25), 0 0 0 4px rgba(120,60,255,0.10)",
                            backdropFilter: "blur(8px)",
                            zIndex: 10,
                          }}
                        >
                          <div className="text-lg font-semibold text-blue-700 mb-3 text-center drop-shadow">
                            AI Job Matching
                          </div>
                          <div className="space-y-4 mb-2">
                            {/* Job match rows */}
                            {(
                              [
                                { title: "Web Developer", match: 95 },
                                { title: "UI Designer", match: 88 },
                                { title: "Product Analyst", match: 81 },
                              ] as const
                            ).map((job, i) => (
                              <div key={i} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-base font-medium text-blue-800">
                                    {job.title}
                                  </span>
                                  <span className="text-sm font-semibold text-violet-600">
                                    {job.match}% match
                                  </span>
                                </div>
                                <div className="w-full h-3 bg-gradient-to-r from-blue-200 to-indigo-100 rounded-full relative overflow-hidden shadow-sm">
                                  <div
                                    className="absolute left-0 top-0 h-full rounded-full"
                                    style={{
                                      width: `${job.match}%`,
                                      background:
                                        "linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)",
                                      boxShadow:
                                        "0 0 12px 3px #6366F1, 0 0 4px 2px #3B82F6",
                                      filter: "drop-shadow(0 0 8px #6366F1)",
                                      transition:
                                        "width 0.6s cubic-bezier(.4,0,.2,1)",
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-center mt-2">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold shadow-sm border border-blue-200">
                              AI Powered Recommendations
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Connect & Apply Floating Panels - only for Step 3 */}
                    {index === 2 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="relative w-full flex flex-col items-center justify-center"
                          style={{ zIndex: 10 }}
                        >
                          {/* Chat Bubble Panel */}
                          <div
                            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 -top-8 rounded-xl shadow-2xl border"
                            style={{
                              minWidth: 120,
                              maxWidth: 160,
                              padding: "1rem",
                              borderRadius: "1rem",
                              background:
                                "linear-gradient(135deg, rgba(255,255,255,0.92) 80%, rgba(120,60,255,0.18) 100%)",
                              border: "2px solid rgba(80,80,255,0.25)",
                              boxShadow:
                                "0 8px 32px 0 rgba(80,80,255,0.25), 0 0 0 4px rgba(120,60,255,0.10)",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              {/* Chat bubble icon */}
                              <svg width="32" height="32" fill="none">
                                <rect
                                  width="32"
                                  height="32"
                                  rx="8"
                                  fill="#E0E7FF"
                                />
                                <path
                                  d="M10 14h8M10 18h4"
                                  stroke="#6366F1"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <rect
                                  x="8"
                                  y="10"
                                  width="16"
                                  height="12"
                                  rx="4"
                                  stroke="#6366F1"
                                  strokeWidth="2"
                                />
                              </svg>
                              <span className="text-xs text-blue-700 font-medium mt-1">
                                Direct Messaging
                              </span>
                            </div>
                          </div>
                          {/* Checklist/Calendar Panel */}
                          <div
                            className="pointer-events-auto absolute left-1/4 top-16 rounded-xl shadow-2xl border"
                            style={{
                              minWidth: 120,
                              maxWidth: 160,
                              padding: "1rem",
                              borderRadius: "1rem",
                              background:
                                "linear-gradient(135deg, rgba(255,255,255,0.92) 80%, rgba(120,60,255,0.18) 100%)",
                              border: "2px solid rgba(80,80,255,0.25)",
                              boxShadow:
                                "0 8px 32px 0 rgba(80,80,255,0.25), 0 0 0 4px rgba(120,60,255,0.10)",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              {/* Checklist/Calendar icon */}
                              <svg width="32" height="32" fill="none">
                                <rect
                                  width="32"
                                  height="32"
                                  rx="8"
                                  fill="#E0E7FF"
                                />
                                <rect
                                  x="10"
                                  y="12"
                                  width="12"
                                  height="8"
                                  rx="2"
                                  stroke="#6366F1"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M14 16h4"
                                  stroke="#6366F1"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <circle cx="12" cy="16" r="1" fill="#6366F1" />
                              </svg>
                              <span className="text-xs text-blue-700 font-medium mt-1">
                                Application Tracking
                              </span>
                            </div>
                          </div>
                          {/* Feedback Panel */}
                          <div
                            className="pointer-events-auto absolute right-1/4 top-24 rounded-xl shadow-2xl border"
                            style={{
                              minWidth: 120,
                              maxWidth: 160,
                              padding: "1rem",
                              borderRadius: "1rem",
                              background:
                                "linear-gradient(135deg, rgba(255,255,255,0.92) 80%, rgba(120,60,255,0.18) 100%)",
                              border: "2px solid rgba(80,80,255,0.25)",
                              boxShadow:
                                "0 8px 32px 0 rgba(80,80,255,0.25), 0 0 0 4px rgba(120,60,255,0.10)",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              {/* Speech bubble with stars icon */}
                              <svg width="32" height="32" fill="none">
                                <rect
                                  width="32"
                                  height="32"
                                  rx="8"
                                  fill="#E0E7FF"
                                />
                                <rect
                                  x="8"
                                  y="12"
                                  width="16"
                                  height="8"
                                  rx="4"
                                  stroke="#6366F1"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M12 16l1 2 2-4 2 4 1-2"
                                  stroke="#FBBF24"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="text-xs text-blue-700 font-medium mt-1">
                                Feedback System
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Job Offer Floating Stack - only for Step 4 */}
                    {index === 3 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="pointer-events-auto flex flex-col items-center justify-center w-full"
                          style={{
                            zIndex: 10,
                            padding: "2rem 0",
                          }}
                        >
                          {/* Job Offer Card Stack */}
                          <div className="relative w-[340px] h-[320px] flex items-center justify-center">
                            {(
                              [
                                {
                                  company: "XYZ Corp",
                                  position: "Frontend Developer",
                                },
                                {
                                  company: "Acme Inc",
                                  position: "UI Designer",
                                },
                                {
                                  company: "Accenture",
                                  position: "Software Engineer",
                                },
                              ] as const
                            ).map((card, i, arr) => (
                              <div
                                key={card.company}
                                className="absolute left-1/2 top-1/2 bg-white rounded-2xl shadow-xl px-6 py-5 w-[260px] flex flex-col items-center"
                                style={{
                                  transform: `translate(-50%, -50%) rotate(${
                                    (i - 1) * 10
                                  }deg) scale(${
                                    1 - (arr.length - i - 1) * 0.07
                                  })`,
                                  zIndex: 10 + i,
                                  boxShadow:
                                    "0 8px 32px 0 rgba(80,80,255,0.18)",
                                  opacity: 1 - (arr.length - i - 1) * 0.15,
                                }}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <svg width="24" height="24" fill="none">
                                    <rect
                                      x="4"
                                      y="8"
                                      width="16"
                                      height="8"
                                      rx="4"
                                      fill="#6366F1"
                                    />
                                    <rect
                                      x="8"
                                      y="12"
                                      width="8"
                                      height="4"
                                      rx="2"
                                      fill="#fff"
                                    />
                                  </svg>
                                  <span className="text-base font-bold text-blue-700">
                                    {card.company}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-700 mb-4">
                                  {card.position}
                                </span>
                                <div className="flex gap-6 mt-2">
                                  {/* Accept */}
                                  <button
                                    className="rounded-full bg-blue-100 p-2 shadow hover:bg-blue-200 transition"
                                    style={{ outline: "none", border: "none" }}
                                    tabIndex={-1}
                                    aria-label="Accept"
                                  >
                                    <svg width="20" height="20" fill="none">
                                      <circle
                                        cx="10"
                                        cy="10"
                                        r="9"
                                        fill="#3B82F6"
                                      />
                                      <path
                                        d="M6 10l3 3 5-5"
                                        stroke="#fff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </button>
                                  {/* Decline */}
                                  <button
                                    className="rounded-full bg-gray-100 p-2 shadow hover:bg-gray-200 transition"
                                    style={{ outline: "none", border: "none" }}
                                    tabIndex={-1}
                                    aria-label="Decline"
                                  >
                                    <svg width="20" height="20" fill="none">
                                      <circle
                                        cx="10"
                                        cy="10"
                                        r="9"
                                        fill="#6366F1"
                                      />
                                      <path
                                        d="M7 7l6 6M13 7l-6 6"
                                        stroke="#fff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Optional: Add a celebratory label below the stack */}
                          <div className="mt-8 text-lg font-semibold text-blue-700 bg-white/80 px-4 py-2 rounded-xl shadow">
                            Choose your offer & start your journey!
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">
              Benefits for <span className="text-yellow-500">Everyone</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform creates value for both students seeking opportunities
              and employers looking for talent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center">
                    {index === 0 ? (
                      <Users className="w-6 h-6 text-white" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold">{benefit.title}</h3>
                </div>

                <ul className="space-y-4">
                  {benefit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <Star className="text-yellow-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-700 to-indigo-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center text-white max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="text-yellow-400">Journey</span>?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have already found their dream
              opportunities through our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <motion.button
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium text-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Today <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/about-us">
                <motion.button
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn About Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <LandingFooter />
    </div>
  );
}