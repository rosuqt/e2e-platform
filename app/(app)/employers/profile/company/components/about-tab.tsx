"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Globe, Mail, Phone, Calendar, Target, Award, Heart, Users } from "lucide-react"
import Image from "next/image"

export default function AboutTab() {
  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Target className="text-blue-600" size={20} />
            Overview
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Mission & Vision */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Mission</h3>
            <p className="text-gray-600">
              Our mission is to empower businesses and individuals through innovative technology solutions that solve
              real-world problems. We strive to create software that is intuitive, efficient, and accessible to all,
              while maintaining the highest standards of quality and security.
            </p>

            <h3 className="font-semibold text-lg mt-6">Vision</h3>
            <p className="text-gray-600">
              To be the leading technology partner for businesses undergoing digital transformation, recognized globally
              for our commitment to excellence, innovation, and positive technological impact on society.
            </p>
          </div>

          {/* Core Values */}
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4">Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-blue-100">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3 mt-3">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium mb-2">Customer-Focused</h4>
                  <p className="text-sm text-gray-600">
                    We put our customers&apos; needs at the center of everything we do, ensuring our solutions add real
                    value.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-purple-100">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3 mt-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-medium mb-2">Innovation</h4>
                  <p className="text-sm text-gray-600">
                    We continuously explore new technologies and methods to stay ahead in a rapidly changing industry.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-green-100">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3 mt-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-medium mb-2">Collaboration</h4>
                  <p className="text-sm text-gray-600">
                    We believe great things happen when diverse minds work together toward common goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* About Company */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            About Company
          </h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="rounded-xl overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Company headquarters"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">TechCorp Headquarters</h3>
                <p className="text-sm text-gray-600">Modern workspace designed for collaboration and innovation</p>
              </div>
            </div>

            <div className="md:w-2/3 space-y-4">
              <p className="text-gray-600">
                Founded in 2010, TechCorp Inc. has grown from a small startup with 5 employees to a thriving technology
                company with over 250 professionals across three global offices. We specialize in developing enterprise
                software solutions, mobile applications, and providing IT consulting services to businesses of all
                sizes.
              </p>

              <p className="text-gray-600">
                Our team of experienced developers, designers, and project managers work collaboratively to deliver
                customized solutions that address our clients&apos; unique challenges. We pride ourselves on building
                long-term relationships with our clients, many of whom have been with us since our early days.
              </p>

              <h3 className="font-semibold text-lg mt-6">Goals</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Expand our service offerings to include AI and machine learning solutions by 2024</li>
                <li>Increase our global presence with new offices in Europe and Asia by 2025</li>
                <li>Reduce our carbon footprint by implementing sustainable practices across all operations</li>
                <li>Develop and launch our own SaaS product line targeting small to medium businesses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements & Awards */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Award className="text-blue-600" size={20} />
            Company Achievements
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Best Workplace Award 2022</h3>
                  <p className="text-sm text-gray-500">TechLife Magazine</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Recognized for our exceptional workplace culture, employee benefits, and commitment to work-life
                balance.
              </p>
            </div>

            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Innovation Excellence 2021</h3>
                  <p className="text-sm text-gray-500">Global Tech Summit</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Awarded for our groundbreaking retail analytics solution that increased client revenue by an average of
                32%.
              </p>
            </div>

            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Fastest Growing Tech Company</h3>
                  <p className="text-sm text-gray-500">Business Today, 2020</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Named one of the top 50 fastest-growing technology companies with 175% year-over-year growth.
              </p>
            </div>

            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Community Impact Award</h3>
                  <p className="text-sm text-gray-500">Tech For Good Foundation, 2019</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Recognized for our pro-bono work developing digital solutions for non-profit organizations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Founders */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Users className="text-blue-600" size={20} />
            Founders
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=96&width=96"
                  alt="Michael Chen"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Michael Chen</h3>
                <p className="text-sm text-gray-600 mb-2">CEO & Co-Founder</p>
                <p className="text-sm text-gray-600">
                  With over 20 years of experience in software development and business leadership, Michael co-founded
                  TechCorp with a vision to create technology that makes a positive impact. Prior to TechCorp, he held
                  leadership positions at Google and Microsoft.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=96&width=96"
                  alt="Sarah Johnson"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                <p className="text-sm text-gray-600 mb-2">CTO & Co-Founder</p>
                <p className="text-sm text-gray-600">
                  A brilliant technologist with a Ph.D. in Computer Science from MIT, Sarah oversees all technical
                  aspects of TechCorp&apos;s products and services. Her innovative approach to problem-solving has been
                  instrumental in the company&apos;s success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Members Preview */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Users className="text-blue-600" size={20} />
            Company Members
          </h2>
          <Button variant="link" className="text-blue-600">
            View All
          </Button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-3">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt="Team member"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">
                        {i === 1 ? "Alex Morgan" : i === 2 ? "Jessica Lee" : i === 3 ? "David Kim" : "Rachel Chen"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {i === 1
                          ? "Head of Design"
                          : i === 2
                            ? "Senior Developer"
                            : i === 3
                              ? "Product Manager"
                              : "Marketing Lead"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Mail className="text-blue-600" size={20} />
            Contact Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Headquarters</p>
                  <p className="text-sm text-gray-600">123 Tech Avenue, San Francisco, CA 94107</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-600">info@techcorp.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Phone</p>
                  <p className="text-sm text-gray-600">+1 (555) 987-6543</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-full">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Website</p>
                  <p className="text-sm text-gray-600">www.techcorp.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center rounded-full">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Business Hours</p>
                  <p className="text-sm text-gray-600">Monday - Friday: 9am - 6pm PST</p>
                </div>
              </div>

              <div className="pt-2">
                <Button className="gap-2 w-full">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

