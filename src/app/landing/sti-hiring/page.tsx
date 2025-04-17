"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full z-50 bg-blue-700 text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Seekr</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex md:items-center md:space-x-6">
              <Link
                href="/"
                className="text-sm font-medium text-white hover:text-blue-200"
              >
                People
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-white hover:text-blue-200"
              >
                Jobs
              </Link>
              <Link
                href="/career"
                className="text-sm font-medium text-white hover:text-blue-200"
              >
                Companies
              </Link>
              <Link
                href="/applications"
                className="text-sm font-medium text-white hover:text-blue-200"
              >
                STI Hiring
              </Link>
              <Link
                href="/employer-sign-in"
                className="text-sm font-medium text-white hover:text-blue-200"
              >
                Employer's Sign-up
              </Link>
            </nav>
            <div className="hidden md:block">
              <Button className="bg-white text-blue-700 hover:bg-blue-100">
                Sign In
              </Button>
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-600"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="mt-8 flex flex-col gap-6">
                  <Link
                    href="/"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    People
                  </Link>
                  <Link
                    href="/about"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Jobs
                  </Link>
                  <Link
                    href="/career"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Companies
                  </Link>
                  <Link
                    href="/applications"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    STI Hiring
                  </Link>
                  <Link
                    href="/employer-sign-in"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Employer's Sign-up
                  </Link>
                  <Button
                    className="mt-4 w-full bg-blue-700 text-white hover:bg-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-0s">
        {/* Hero Section */}
        <section className="relative bg-blue-700 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                  Grow your
                  <br />
                  career with <span className="text-yellow-300">STI</span>
                </h1>
                <h2 className="text-2xl font-bold text-yellow-300 md:text-3xl">
                  We're Hiring
                </h2>
                <p className="max-w-md text-blue-100">
                  Join a forward-thinking institution that values innovation and
                  career growth. If you're talented, passionate, and excited
                  about making a difference, there's a place for you at STI
                  College.
                </p>
              </div>
              <div className="grid justify-end">
                <div className="relative h-auto w-80 overflow-hidden rounded-full md:h-96 md:w-96">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="STI College students and professionals"
                    width={400}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-0 h-16 w-full bg-white"
            style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }}
          ></div>
        </section>

        {/* About STI College */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold">
                Innovation and Excellence
              </h2>
              <h3 className="text-xl text-gray-600">About STI College</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 rounded-xl bg-gray-50 p-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-4 h-40 overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=160&width=320"
                    alt="STI Campus"
                    width={320}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="mb-2 text-lg font-bold text-blue-700">
                  Explore the Beauty of STI Campuses
                </h4>
                <p className="text-sm text-gray-600">
                  Our modern campuses provide state-of-the-art facilities
                  designed to enhance the learning experience.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg bg-blue-50 p-4 shadow-sm">
                <h4 className="mb-2 text-lg font-bold text-blue-700">
                  STI's Legacy of Excellence in Education
                </h4>
                <p className="text-sm text-gray-600">
                  With decades of experience in providing quality education, STI
                  has established itself as a leader in the industry.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-4 h-40 overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=160&width=320"
                    alt="STI Students"
                    width={320}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="mb-2 text-lg font-bold text-blue-700">
                  Industry-Driven Curriculum
                </h4>
                <p className="text-sm text-gray-600">
                  Our programs are designed in close collaboration with industry
                  leaders to ensure relevant skills development.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg bg-blue-50 p-4 shadow-sm">
                <h4 className="mb-2 text-lg font-bold text-blue-700">
                  Nationwide Network
                </h4>
                <p className="text-sm text-gray-600">
                  With campuses across the country, STI offers accessibility and
                  consistent quality education nationwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History Statement */}
        <section className="py-12 text-center">
          <div className="container mx-auto px-4">
            <p className="mx-auto max-w-3xl text-xl font-medium">
              Since 1983, STI College has been shaping
              <br />
              future-ready professionals through innovative
              <br />
              and industry-driven education
            </p>
          </div>
        </section>

        {/* Ideal Candidates */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                Ideal Candidates for Our Team
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                Below are the qualities and characteristics we look for in our
                ideal candidates
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg border border-gray-200 p-6 text-center shadow-sm">
                <div className="mb-4 rounded-full border border-gray-200 p-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Dedication</h3>
                <p className="text-sm text-gray-600">
                  Committed to delivering quality education and fostering
                  student growth
                </p>
              </div>

              <div className="flex flex-col items-center rounded-lg border border-gray-200 p-6 text-center shadow-sm">
                <div className="mb-4 rounded-full border border-gray-200 p-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Integrity</h3>
                <p className="text-sm text-gray-600">
                  Upholding high standards, responsibility and ethical conduct
                  in all interactions
                </p>
              </div>

              <div className="flex flex-col items-center rounded-lg border border-gray-200 p-6 text-center shadow-sm">
                <div className="mb-4 rounded-full border border-gray-200 p-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  Commitment to Excellence
                </h3>
                <p className="text-sm text-gray-600">
                  Striving for continuous improvement and maintaining high
                  standards in education
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Career Opportunities */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-center">
                Explore{" "}
                <span className="text-blue-700">Career Opportunities</span>
              </h2>
              <p className="text-center text-gray-600">
                Discover rewarding positions that align with your skills and
                passion
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex p-6">
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold">
                      Academic Content Developer for Business Management
                    </h3>
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Academic Content Developer"
                      width={400}
                      height={200}
                      className="mt-4 h-40 w-full rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-4 flex items-start">
                    <div className="rounded-full border border-gray-200 p-2 group-hover:border-blue-500 group-hover:bg-blue-50">
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex p-6">
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold">
                      Software Developer
                    </h3>
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Software Developer"
                      width={400}
                      height={200}
                      className="mt-4 h-40 w-full rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-4 flex items-start">
                    <div className="rounded-full border border-gray-200 p-2 group-hover:border-blue-500 group-hover:bg-blue-50">
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex p-6">
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold">
                      Corporate Finance Manager
                    </h3>
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Corporate Finance Manager"
                      width={400}
                      height={200}
                      className="mt-4 h-40 w-full rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-4 flex items-start">
                    <div className="rounded-full border border-gray-200 p-2 group-hover:border-blue-500 group-hover:bg-blue-50">
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex p-6">
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold">
                      Welfare Services Counselor
                    </h3>
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Welfare Services Counselor"
                      width={400}
                      height={200}
                      className="mt-4 h-40 w-full rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-4 flex items-start">
                    <div className="rounded-full border border-gray-200 p-2 group-hover:border-blue-500 group-hover:bg-blue-50">
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Benefits & Perks</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-6">
                <h3 className="mb-4 text-xl font-bold text-blue-700">
                  Work-Life Balance
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-700" />
                    <span className="text-sm">
                      Flexible work schedules and remote work options
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-700" />
                    <span className="text-sm">
                      Paid time off, holidays, and leave benefits
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-700" />
                    <span className="text-sm">
                      Supportive and healthy work environment
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-blue-700 p-6 text-white">
                <h3 className="mb-4 text-xl font-bold">Growth & Development</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-300" />
                    <span className="text-sm">
                      Access to training programs, workshops, and certifications
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-300" />
                    <span className="text-sm">
                      Career advancement opportunities within the organization
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-300" />
                    <span className="text-sm">
                      Mentorship and guidance from industry experts
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-200 p-6">
                <h3 className="mb-4 text-xl font-bold text-blue-700">
                  Competitive Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-700" />
                    <span className="text-sm">
                      Competitive salary with performance-based incentives
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-700" />
                    <span className="text-sm">
                      Comprehensive health coverage, and wellness programs
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-700" />
                    <span className="text-sm">
                      Employee recognition programs and rewards for achievements
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-700 py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold">
                  Start Your <span className="text-yellow-300">Journey</span>
                  <br />
                  With Us
                </h2>
                <div className="pt-4">
                  <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                    APPLY NOW
                  </Button>
                </div>
              </div>
              <div>
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="STI College team"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center">
                <span className="text-xl font-bold text-blue-700">Seekr</span>
              </div>
              <address className="not-italic text-sm text-gray-600">
                <p>123 Main Street, Anytown, Philippines 12345</p>
                <p>Established since 1983</p>
              </address>
              <div className="mt-4">
                <p className="text-sm text-gray-600">info@seekr.com</p>
                <p className="text-sm text-gray-600">+63 123-4567</p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase text-gray-500">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase text-gray-500">
                About Seekr
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    News
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-blue-800 py-4 text-center text-xs text-white">
        <div className="container mx-auto px-4">
          <p>© 2025 Seekr. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
