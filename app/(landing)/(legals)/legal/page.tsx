"use client"
import { motion, easeOut } from "framer-motion"
import Link from "next/link"
import { useEffect } from "react"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
}

const legalSections = [
  {
    title: "Privacy Policy",
    id: "privacy-policy",
    content: (
      <>
        <p className="mb-4">
          We value your privacy and are committed to protecting your personal information. We collect only the data necessary to provide our services, such as your name, email, and profile details. Your information is never sold to third parties. We use industry-standard security measures to safeguard your data. You may request to access, update, or delete your information at any time by contacting our support team.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Data collected: name, email, profile, usage data</li>
          <li>Purpose: service delivery, matching, communication</li>
          <li>Security: encryption, access controls</li>
          <li>Contact: seekr.assist@gmail.com</li>
        </ul>
      </>
    ),
  },
  {
    title: "Terms and Conditions",
    id: "terms-and-conditions",
    content: (
      <>
        <p className="mb-4">
          By using our platform, you agree to abide by our terms and conditions. You must provide accurate information, respect other users, and comply with all applicable laws. We reserve the right to suspend or terminate accounts that violate these terms. The platform is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from your use of the platform.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Provide accurate and updated information</li>
          <li>No unlawful, harmful, or abusive behavior</li>
          <li>Respect intellectual property rights</li>
          <li>Platform may update terms at any time</li>
        </ul>
      </>
    ),
  },
  {
    title: "User Agreement",
    id: "user-agreement",
    content: (
      <>
        <p className="mb-4">
          Users must be at least 16 years old to register. You are responsible for maintaining the confidentiality of your account. Do not share your login credentials. You agree to use the platform for its intended purpose and not to misuse any features. Any violation may result in account suspension or removal.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Minimum age: 16 years</li>
          <li>Keep your account secure</li>
          <li>Report suspicious activity immediately</li>
          <li>Follow all platform rules and guidelines</li>
        </ul>
      </>
    ),
  },
  {
    title: "Platform Guidelines",
    id: "platform-guidelines",
    content: (
      <>
        <p className="mb-4">
          We strive to maintain a positive and professional community. Treat all members with respect. Do not post inappropriate, offensive, or misleading content. Use the platform to connect, learn, and grow. We encourage constructive feedback and collaboration.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Be respectful and professional</li>
          <li>No spam, harassment, or discrimination</li>
          <li>Share accurate and relevant information</li>
          <li>Help us keep the community safe</li>
        </ul>
      </>
    ),
  },
]

export default function LegalPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.getElementById(window.location.hash.substring(1))
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center text-white max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Legal <span className="text-yellow-400">Information</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Please review our policies and guidelines to understand your rights and responsibilities on our platform.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="white"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

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
              Our <span className="text-blue-700">Policies</span> & Guidelines
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transparency and trust are at the core of our community. Read below to learn more.
            </p>
          </motion.div>

          <div className="space-y-16 max-w-3xl mx-auto">
            {legalSections.map((section, idx) => (
              <motion.div
                key={idx}
                id={section.id}
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-blue-700">{section.title}</h3>
                <div className="text-gray-700 text-lg">{section.content}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-blue-700 to-indigo-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center text-white max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Questions or Concerns?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact our support team at <a href="mailto:seekr.assist@gmail.com" className="underline">seekr.assist@gmail.com</a> for any legal inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
                </motion.button>
              </Link>
              <Link href="/faq">
                <motion.button
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View FAQ
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
