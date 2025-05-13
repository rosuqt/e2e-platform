"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<"students" | "employers">("students")

  const tabs = {
    students: {
      title: "For Students",
      steps: [
        "Create your profile and upload your resume to showcase your skills.",
        "AI recommends the best OJT opportunities. Chat directly with employers.",
        "Easily apply for OJT programs and monitor your application status.",
      ],
      images: [
        { src: "/placeholder.svg?height=200&width=200", title: "Set Up Your Profile" },
        { src: "/placeholder.svg?height=200&width=200", title: "Match & Connect" },
        { src: "/placeholder.svg?height=200&width=200", title: "Apply & Track Progress" },
      ],
    },
    employers: {
      title: "For Employers",
      steps: [
        "Create your profile and verify your employer account to gain trust and full access.",
        "Find the right candidate with AI-powered candidate matching.",
        "Streamline your hiring process with easy real-time application tracking.",
      ],
      images: [
        { src: "/placeholder.svg?height=200&width=200", title: "Verify your Account" },
        { src: "/placeholder.svg?height=200&width=200", title: "AI Matching" },
        { src: "/placeholder.svg?height=200&width=200", title: "Seamless Hiring" },
      ],
    },
  }

  const currentTab = tabs[activeTab]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-blue-700">How It</span> <span className="text-yellow-500">Works</span>
          </h2>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === "students" ? "bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("students")}
            >
              For Students
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === "employers" ? "bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("employers")}
            >
              For Employers
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Steps */}
            <div>
              <div className="space-y-8">
                {currentTab.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-lg">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-3 gap-6">
              {currentTab.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                    <Image src={image.src || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
                  </div>
                  <p className="text-sm font-medium text-center">{image.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
