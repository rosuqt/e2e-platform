"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
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
} from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Sign up and build your professional profile. Upload your resume, add your skills, and showcase your achievements.",
    icon: <Upload className="w-8 h-8 text-white" />,
    features: ["Upload resume", "Add skills & achievements", "Professional photo", "Portfolio showcase"],
  },
  {
    number: "02",
    title: "Get Matched",
    description:
      "Our AI analyzes your profile and matches you with relevant opportunities based on your skills and preferences.",
    icon: <Search className="w-8 h-8 text-white" />,
    features: ["AI-powered matching", "Personalized recommendations", "Real-time notifications", "Smart filtering"],
  },
  {
    number: "03",
    title: "Connect & Apply",
    description:
      "Connect with employers, practice interviews, and apply to positions that align with your career goals.",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    features: ["Direct messaging", "Interview practice", "Application tracking", "Feedback system"],
  },
  {
    number: "04",
    title: "Land Your Dream Job",
    description: "Get hired by top companies and start your career journey with confidence and the right connections.",
    icon: <Briefcase className="w-8 h-8 text-white" />,
    features: ["Job placement", "Career guidance", "Ongoing support", "Success tracking"],
  },
]

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
]

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
              Discover how our platform connects talented students with amazing opportunities in just four simple steps.
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
              Follow these simple steps to unlock your potential and connect with opportunities that matter.
            </p>
          </motion.div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="text-8xl font-bold text-gray-100 absolute -top-8 -left-4">{step.number}</div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center mb-6">
                        {step.icon}
                      </div>
                      <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                      <p className="text-gray-600 mb-6 text-lg">{step.description}</p>

                      <ul className="space-y-3">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
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
                      src="/placeholder.svg?height=400&width=600"
                      alt={step.title}
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />

                    {/* Overlay with step indicator */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-blue-700 font-bold">Step {step.number}</span>
                      </div>
                    </div>
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
              Our platform creates value for both students seeking opportunities and employers looking for talent.
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
              Ready to Start Your <span className="text-yellow-400">Journey</span>?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have already found their dream opportunities through our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
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
    </div>
  )
}
