"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Plus, Minus, Search, MessageCircle, Users, Briefcase, Shield, HelpCircle } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const faqCategories = [
  {
    title: "Getting Started",
    icon: <Users className="w-6 h-6" />,
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "Creating an account is simple! Click the 'Sign Up' button, choose whether you're a student or employer, and fill out the registration form. You'll need to verify your email address to complete the process.",
      },
      {
        question: "Is the platform free to use?",
        answer:
          "Up to the client's decision.",
      },
      {
        question: "What information should I include in my profile?",
        answer:
          "Include your educational background, skills, work experience (if any), projects, achievements, and career interests. The more complete your profile, the better our AI can match you with relevant opportunities.",
      },
      {
        question: "How long does it take to set up my profile?",
        answer:
          "Most students complete their initial profile setup in 10-15 minutes. You can always come back later to add more details, upload additional documents, or update your information.",
      },
    ],
  },
  {
    title: "Job Matching & Applications",
    icon: <Briefcase className="w-6 h-6" />,
    faqs: [
      {
        question: "How does the AI matching system work?",
        answer:
          "Our AI analyzes your profile, skills, interests, and career goals to match you with relevant opportunities. It considers factors like your field of study, experience level, location preferences, and company culture fit.",
      },
      {
        question: "Can I apply to multiple positions at once?",
        answer:
          "Yes! You can apply to as many positions as you'd like. We recommend tailoring your application for each role to increase your chances of success.",
      },
      {
        question: "How do I track my applications?",
        answer:
          "Your dashboard includes an application tracker where you can see all your submitted applications, their current status, and any updates from employers.",
      },
      {
        question: "What happens after I apply to a position?",
        answer:
          "After applying, the employer will review your application. They may contact you directly through our messaging system, schedule an interview, or provide feedback. You'll be notified of any updates via email and in-app notifications.",
      },
    ],
  },
  {
    title: "For Employers",
    icon: <Shield className="w-6 h-6" />,
    faqs: [
      {
        question: "How do I post a job or internship?",
        answer:
          "After creating your employer account, click 'Post a Job' in your dashboard. Fill out the job details, requirements, and company information. Our AI will help optimize your posting to attract the right candidates.",
      },
      {
        question: "How are candidates matched to my postings?",
        answer:
          "Our AI matches candidates based on their skills, experience, education, and interests against your job requirements. You'll receive a ranked list of potential candidates with match scores.",
      },
      {
        question: "Can I search for candidates directly?",
        answer:
          "Yes! Premium employer accounts can search our candidate database using various filters like skills, education, location, and availability. You can also save searches and get alerts for new matching candidates.",
      },
      {
        question: "What verification do you do for companies?",
        answer:
          "We verify all company accounts through business registration checks, domain verification, and manual review. Verified companies receive a badge on their profile to build trust with candidates.",
      },
    ],
  },
  {
    title: "Platform Features",
    icon: <HelpCircle className="w-6 h-6" />,
    faqs: [
      {
        question: "What is the interview practice feature?",
        answer:
          "Our AI-powered interview practice tool generates relevant questions based on the positions you're interested in. You can practice answering questions, get feedback on your responses, and build confidence for real interviews.",
      },
      {
        question: "How does the messaging system work?",
        answer:
          "Our secure messaging system allows direct communication between students and employers. You can share documents, schedule interviews, and ask questions. All conversations are private and encrypted.",
      },
      {
        question: "Can I connect with other students?",
        answer:
          "Our networking feature allows you to connect with fellow students, join study groups, and participate in industry-specific communities. Building your professional network starts here.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "Yes, we take privacy seriously. Your personal information is encrypted and stored securely. You control what information is visible to employers, and we never share your data with third parties without your consent.",
      },
    ],
  },
]

const quickHelp = [
  {
    title: "Can't find what you're looking for?",
    description: "Contact our support team",
    action: "Get Help",
    icon: <MessageCircle className="w-8 h-8 text-white" />,
  },
  {
    title: "Want to see how it works?",
    description: "Take a guided tour",
    action: "Take Tour",
    icon: <Search className="w-8 h-8 text-white" />,
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const toggleItem = (categoryIndex: number, faqIndex: number) => {
    const key = `${categoryIndex}-${faqIndex}`
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

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
              Frequently Asked <span className="text-yellow-400">Questions</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Find answers to common questions about our platform, features, and how to make the most of your
              experience.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
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

      {/* FAQ Categories */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          {searchTerm && (
            <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeInUp}>
              <p className="text-gray-600">
                {filteredCategories.reduce((total, category) => total + category.faqs.length, 0)} results found for &quot;
                {searchTerm}&quot;
              </p>
            </motion.div>
          )}

          <div className="space-y-12">
            {(searchTerm ? filteredCategories : faqCategories).map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const key = `${categoryIndex}-${faqIndex}`
                      const isOpen = openItems[key]

                      return (
                        <div key={faqIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleItem(categoryIndex, faqIndex)}
                            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <Minus className="w-5 h-5 text-blue-700" />
                              ) : (
                                <Plus className="w-5 h-5 text-blue-700" />
                              )}
                            </div>
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 text-gray-700 leading-relaxed">{faq.answer}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {searchTerm && filteredCategories.length === 0 && (
            <motion.div className="text-center py-16" initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
              <p className="text-gray-600 mb-8">
                We couldn&apos;t find any FAQs matching your search. Try different keywords or contact our support team.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick Help Section */}
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
              Still Need <span className="text-yellow-500">Help</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our support team is here to help you succeed. Get personalized assistance or explore our platform with a
              guided tour.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quickHelp.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-blue-100 mb-6">{item.description}</p>
                <motion.button
                  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.action} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
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
              Ready to Get <span className="text-yellow-400">Started</span>?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students and employers who are already using our platform to build successful careers
              and find great talent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <motion.button
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium text-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up Now <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/how-it-works">
                <motion.button
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn How It Works
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
