"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Lightbulb, Shield, Globe } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const teamMembers = [
  {
    name: "Allyza Rose Cayer",
    role: "Team Lead & Full-Stack Developer",
    bio: "I just want to make everything better. I have a passion for building intuitive user experiences and scalable systems.",
    image: "/placeholder.svg?height=300&width=300",
    expertise: "Strategy & Leadership",
  },
  {
    name: "Suzanne Alyanna Esplana",
    role: "Tester & Quality Assurance",
    bio: "Please write your bio here.",
    image: "/placeholder.svg?height=300&width=300",
    expertise: "Quality Assurance & Testing",
  },
  {
    name: "Adrian Sevilla",
    role: "Database Administrator & Full-Stack Developer",
    bio: "Please write your bio here.",
    image: "/placeholder.svg?height=300&width=300",
    expertise: "Support & Development",
  },
  {
    name: "Mark Toniel Seva",
    role: "Documentation",
    bio: "Please write your bio here.",
    image: "/placeholder.svg?height=300&width=300",
    expertise: "Documentation & Support",
  },
]

const advisor = {
  name: "Jerryfel Laraga",
  role: "Capstone Advisor",
  bio: "Bio here",
  image: "/placeholder.svg?height=300&width=300",
  expertise: "Education, Full-Stack Developer & Leadership",
}

const values = [
  {
    icon: <Heart className="w-8 h-8 text-white" />,
    title: "Student-First",
    description: "Every decision we make prioritizes student success and career growth.",
  },
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Trust & Transparency",
    description: "We build trust through honest communication and transparent processes.",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-white" />,
    title: "Innovation",
    description: "We continuously innovate to solve real problems in education and employment.",
  },
  {
    icon: <Globe className="w-8 h-8 text-white" />,
    title: "Accessibility",
    description: "We believe opportunities should be accessible to everyone, everywhere.",
  },
]

const stats = [
  { number: "2019", label: "Founded" },
  { number: "10,000+", label: "Students Helped" },
  { number: "500+", label: "Partner Companies" },
  { number: "95%", label: "Success Rate" },
]

export default function AboutUsPage() {
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
              About <span className="text-yellow-400">Our Mission</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              We&apos;re on a mission to bridge the gap between education and employment, creating meaningful connections
              that launch careers and build futures.
            </p>
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

      {/* Our Story Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl font-bold mb-6">
                Our <span className="text-blue-700">Story</span>
              </h2>
              <div className="space-y-6 text-gray-700">
                <p className="text-lg">
                  Founded in 2019, our platform was born from a simple observation: talented students were struggling to
                  find meaningful opportunities, while companies were having difficulty finding the right talent.
                </p>
                <p className="text-lg">
                  As former educators and industry professionals, we experienced this disconnect firsthand. We saw
                  brilliant students with incredible potential who just needed the right opportunity to shine, and we
                  met employers who were eager to find fresh talent but didn&apos;t know where to look.
                </p>
                <p className="text-lg">
                  That&apos;s when we decided to build something different—a platform that doesn&apos;t just match resumes to job
                  descriptions, but creates meaningful connections between people who can help each other grow.
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Our story"
                  width={600}
                  height={500}
                  className="w-full h-auto"
                />

                {/* Floating stats */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">10,000+</div>
                  <div className="text-sm text-gray-600">Students Helped</div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">500+</div>
                  <div className="text-sm text-gray-600">Partner Companies</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our <span className="text-yellow-500">Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we build our platform and serve our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our <span className="text-blue-700">Team</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re a diverse team of educators, technologists, and career experts united by our passion for student
              success.
            </p>
          </motion.div>

          {/* Core Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-blue-700 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-xs font-medium">
                  {member.expertise}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Advisor Section */}
          <motion.div
            className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Our Strategic Advisor</h3>
              <p className="text-blue-100">Guiding our vision with decades of educational leadership</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-40 h-40 flex-shrink-0">
                <Image
                  src={advisor.image || "/placeholder.svg"}
                  alt={advisor.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold mb-2">{advisor.name}</h4>
                <p className="text-yellow-400 font-medium mb-4">{advisor.role}</p>
                <p className="text-blue-100 mb-4">{advisor.bio}</p>
                <div className="bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium inline-block">
                  {advisor.expertise}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
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
              Our <span className="text-yellow-500">Impact</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our commitment to connecting talent with opportunity.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-700 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
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
              Join Our <span className="text-yellow-400">Mission</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Whether you&apos;re a student looking for opportunities or an employer seeking talent, we&apos;re here to help you
              succeed.
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

              <Link href="/contact">
                <motion.button
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
