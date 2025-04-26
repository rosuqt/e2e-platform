"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { fill } from "three/src/extras/TextureUtils.js";

export default function HiringPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Seekr Logo"
              width={150}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              About STI
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Careers
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Applications
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Employer's Sign-in
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
            >
              Sign In
            </Link>
            <button className="block md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-blue-700 text-white">
          <div
            className="absolute bottom-0 right-0 w-full h-16 bg-white"
            style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }}
          ></div>
          <div className="container mx-auto px-4 py-16 md:py-24 md:px-6 lg:py-32">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="max-w-xl"
              >
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Grow your <br />
                  career with STI
                </h1>
                <h2 className="mt-2 text-2xl font-bold text-yellow-300 sm:text-3xl">
                  We&apos;re Hiring
                </h2>
                <p className="mt-4 text-lg text-blue-100">
                  Join a dynamic team where innovation meets education. If
                  you're talented, passionate, and excited about making a
                  difference in education, this is the place for you. We're
                  looking for exceptional individuals to join our team.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 rounded-md bg-yellow-400 px-6 py-3 text-base font-medium text-blue-900 hover:bg-yellow-300 transition-colors"
                >
                  View Open Positions
                </motion.button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative hidden md:block"
              >
                <div className="relative h-80 w-80 md:h-96 md:w-96 overflow-hidden rounded-full border-5 border-white shadow-xl ml-8">
                  <Image
                    src="/images/sti/teacher1.jpg"
                    alt="STI College students and faculty"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About STI College */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="mb-12 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Innovation and Excellence
              </h2>
              <p className="mt-2 text-xl text-gray-600">About STI College</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              <motion.div
                variants={fadeIn}
                className="group rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/sti/stibuilding.jpg"
                    alt="STI Campus"
                    width={300}
                    height={200}
                    className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Experience the Beauty of STI Campuses
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Modern facilities designed to provide students with a
                  conducive learning environment.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="group rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900">
                    STI's Legacy of Excellence in Education
                  </h3>
                  <p className="mt-2 mb-4 text-sm text-gray-600">
                    For decades, STI has been at the forefront of providing
                    quality education that prepares students for the real world.
                  </p>
                  <Image
                    src="/images/sti/graduatepic.jpg"
                    alt="STI Campus"
                    width={300}
                    height={200}
                    className="h-40 w-full object-cover transition-transform group-hover:scale-105 rounded-lg"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="group rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/sti/classroom.png"
                    alt="STI Classroom"
                    width={300}
                    height={200}
                    className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Industry-Driven Curriculum
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Our programs are designed in close collaboration with industry
                  leaders to ensure relevance.
                </p>
              </motion.div>
              <motion.div
                variants={fadeIn}
                className="group rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Nationwide Network
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  With campuses across the country, STI offers accessibility and
                  a strong alumni network for career growth.
                </p>
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/sti/student1.jpg"
                    alt="STI Classroom"
                    width={300}
                    height={200}
                    className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mission Statement */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="py-16 md:py-24"
        >
          <div className="container mx-auto px-4 md:px-6">
            <p className="mx-auto max-w-3xl text-center text-xl font-medium text-gray-700 md:text-2xl">
              Since 1983, STI College has been shaping future-ready
              professionals through innovative and industry-driven education
            </p>
          </div>
        </motion.section>

        {/* Ideal Candidates */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="mb-12 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Ideal Candidates for Our Team
              </h2>
              <p className="mt-2 text-gray-600">
                Below are the qualities and characteristics we look for in our
                ideal candidates
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-3"
            >
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dedication
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Committed to excellence in teaching and fostering student
                  growth.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Integrity
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Upholding high ethical standards, responsibility and
                  accountability in all actions.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Commitment to Excellence
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Striving for the highest standards in education and
                  professional development.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Career Opportunities */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="mb-12 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Explore{" "}
                <span className="text-blue-700">Career Opportunities</span>
              </h2>
              <p className="mt-2 text-gray-600">
                Discover exciting positions that align with your skills and
                passion. Join the STI team!
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2"
            >
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="group relative rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/sti/academic-content-developer.jpg"
                    alt="Academic Content Developer"
                    width={500}
                    height={300}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Academic Content Developer for Business Management
                </h3>
                <Link
                  href="#"
                  className="absolute bottom-4 right-4 text-blue-700 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="group relative rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/sti/software-dev.jpg"
                    alt="Software Developer"
                    width={500}
                    height={300}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Software Developer
                </h3>
                <Link
                  href="#"
                  className="absolute bottom-4 right-4 text-blue-700 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="group relative rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/sti/corporate-manager.jpg"
                    alt="Corporate Finance Manager"
                    width={500}
                    height={300}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Corporate Finance Manager
                </h3>
                <Link
                  href="#"
                  className="absolute bottom-4 right-4 text-blue-700 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="group relative rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/sti/welfare-counselor.jpg"
                    alt="Welfare Services Counselor"
                    width={500}
                    height={300}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Welfare Services Counselor
                </h3>
                <Link
                  href="#"
                  className="absolute bottom-4 right-4 text-blue-700 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="mb-12 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Benefits & Perks
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-3"
            >
              <motion.div
                variants={fadeIn}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <h3 className="mb-4 text-lg font-semibold text-blue-700">
                  Work-Life Balance
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-blue-500" />
                    <span>Flexible work schedules and remote work options</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-blue-500" />
                    <span>
                      Generous paid time off, holidays, and leave benefits
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-blue-500" />
                    <span>Supportive and healthy work environment</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="rounded-xl bg-blue-700 p-6 shadow-sm text-white"
              >
                <h3 className="mb-4 text-lg font-semibold">
                  Growth & Development
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-yellow-300" />
                    <span>
                      Access to training programs, workshops, and certifications
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-yellow-300" />
                    <span>
                      Career advancement opportunities within the organization
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-yellow-300" />
                    <span>Mentorship and guidance from industry experts</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <h3 className="mb-4 text-lg font-semibold text-blue-700">
                  Competitive Benefits
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-blue-500" />
                    <span>
                      Competitive salary with performance-based incentives
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-blue-500" />
                    <span>
                      Comprehensive health insurance, coverage, and wellness
                      programs
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 h-5 w-5 text-blue-500" />
                    <span>
                      Employee recognition programs and rewards for achievements
                    </span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-blue-700 py-16 md:py-24 text-white">
          <div
            className="absolute bottom-0 right-0 w-full h-16 bg-white"
            style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }}
          ></div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative hidden md:block"
              >
                <div className="relative h-80 w-full overflow-hidden rounded-xl border-4 border-white shadow-xl">
                  <Image
                    src="/images/sti/group.jpg"
                    alt="STI College Team"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Start Your <span className="text-yellow-300">Journey</span>{" "}
                  With Us
                </h2>
                <p className="mt-4 text-lg text-blue-100">
                  Join our team of dedicated professionals and make a difference
                  in the lives of students across the country.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 rounded-md bg-yellow-400 px-8 py-3 text-base font-bold text-blue-900 hover:bg-yellow-300 transition-colors"
                >
                  APPLY NOW
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Image
                src="/logo.png"
                alt="Seekr Logo"
                width={180}
                height={50}
                className="h-10 w-auto mb-4"
              />
              <address className="not-italic text-sm text-gray-600">
                <p>123 Main Street, Building A</p>
                <p>Makati City, Philippines 1234</p>
              </address>
              <p className="mt-2 text-sm text-gray-600">+63 123-4567</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-700">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-700">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">
                About Seekr
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-blue-700">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-700">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-700">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-700">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-xs text-gray-600">
            <p>© 2023 InternConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
