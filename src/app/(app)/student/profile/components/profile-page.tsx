"use client"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MdWorkOutline, MdStarOutline, MdContactMail, MdOutlineEmojiObjects } from "react-icons/md"
import { FaRegBookmark } from "react-icons/fa6";
import { LuTrophy } from "react-icons/lu";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdOutlineEmojiObjects className="text-blue-600" size={20} />
            About Info
          </h2>
          <p className="text-sm text-gray-500">Update your background and career goals to reflect your journey.</p>
        </div>
        <div className="p-4 space-y-6">
          {/* Introduction */}
          <div>
            <h3 className="font-medium mb-2">Introduction</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Write a brief introduction about yourself and your passions.</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-600"
              placeholder="Write about your passions and interests..."
              defaultValue="Passionate about web development and always eager to learn new technologies. Currently exploring frontend design and backend logic to build efficient and user-friendly applications. Love solving problems through code!"
            />
          </div>
          <hr className="border-gray-200" />

          {/* Educational Background */}
          <div>
            <h3 className="font-medium mb-2">Educational Background</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Highlight your academic achievements and institutions attended.</p>
            <div className="flex gap-3 items-center">
              <div className="bg-yellow-100 p-2 rounded-md">
                <span className="text-sm font-bold text-blue-800">STI</span>
              </div>
              <div>
                <h4 className="font-medium">STI College</h4>
                <p className="text-sm text-gray-600">Bachelor of Science - Information Technology</p>
                <p className="text-xs text-gray-500">2019 - Present</p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                Add Educational Background
              </Button>
            </div>
          </div>
          <hr className="border-gray-200" />

          {/* Career Goals */}
          <div>
            <h3 className="font-medium mb-2">Career Goals</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Define your career aspirations and what you aim to achieve.</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-600"
              placeholder="Write about your career aspirations..."
              defaultValue="Aspiring front-end developer focused on creating engaging, accessible, and user-friendly web applications. Currently enhancing my JavaScript and React skills through hands-on projects, aiming to secure an internship or entry-level role to gain real-world experience and grow in a dynamic tech environment."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdOutlineEmojiObjects className="text-blue-600" size={20} />
            Uploaded Documents
          </h2>
          <p className="text-sm text-gray-500 italic">This section is not visible to the public.</p>
        </div>
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-medium mb-2">Resume</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Upload your latest resume to share with potential employers.</p>
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                Upload Resume
              </Button>
              <span className="text-sm text-gray-500">No file uploaded</span>
            </div>
          </div>
          <hr className="border-gray-200" />
          <div>
            <h3 className="font-medium mb-2">Cover Letter</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Upload a cover letter to personalize your job applications.</p>
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                Upload Cover Letter
              </Button>
              <span className="text-sm text-gray-500">No file uploaded</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdOutlineEmojiObjects className="text-blue-600" size={20} />
            Skills & Expertise
          </h2>
          <p className="text-sm text-gray-500">Showcase your skills and technical expertise to stand out.</p>
        </div>
        <div className="p-4 space-y-6">
          {/* Skills */}
          <div>
            <h3 className="font-medium mb-2">Skills</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Highlight your top skills to attract employers.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-green-500 hover:bg-green-600">Creativity</Badge>
              <Badge className="bg-purple-500 hover:bg-purple-600">Communication</Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700">Problem-Solving</Badge>
              <Badge className="bg-orange-500 hover:bg-orange-600">Teamwork</Badge>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-4"
              >
                + Add Skill
              </Button>
            </div>
          </div>
          <hr className="border-gray-200" />

          {/* Expertise */}
          <div>
            <h3 className="font-medium mb-2">Expertise</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Showcase your technical expertise and areas of proficiency.</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-sm"></span>
                    JavaScript
                  </span>
                </div>
                <Progress value={75} className="h-2 bg-gray-200 [&>div]:bg-yellow-400" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-sm"></span>
                    HTML5
                  </span>
                </div>
                <Progress value={65} className="h-2 bg-gray-200 [&>div]:bg-red-500" />
              </div>
             
            </div>
            <div className="text-left mt-2">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                + Add Expertise
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdWorkOutline className="text-blue-600" size={20} />
            Job Matches for you
          </h2>
          <p className="text-xs italic text-gray-500">Explore job opportunities tailored to your profile.</p>
        </div>
        <div className="p-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center pt-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    J
                  </div>
                </div>
                <div className="px-4 pt-4 pb-4 relative">
                  <div className="text-center mb-2">
                    <h3 className="font-medium text-gray-900">Junior Software Tester</h3>
                    <p className="text-sm text-gray-500">Av-average Inc. | Manila</p>
                    <p className="text-sm text-gray-400">₱25,000 - ₱35,000 / month</p>
                  </div>
                  <div className="text-xs font-medium text-orange-500 mb-4 text-center">{43 + i}% Match for this job</div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <MdWorkOutline className="mr-1" size={16} /> View Job
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <FaRegBookmark className="mr-1" size={16} /> Save Job
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-4">
            <Button
              variant="link"
              className="text-blue-600 hover:underline"
            >
              View More
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <LuTrophy  className="text-blue-600" size={20} />
            Achievements
          </h2>
          <p className="text-sm text-gray-500">Add your achievements to showcase your accomplishments.</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    <MdStarOutline size={24} />
                  </div>
                  <h3 className="font-medium text-lg text-gray-800">Student Club Hackathon Winner</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Led a team of 5 to develop a mobile app solution for campus sustainability, earning first place among
                  20 competitors.
                </p>
                <Button
                  size="sm"
                  className={`text-xs ${i === 1 ? "bg-blue-600 text-white hover:bg-blue-700" : "border-blue-300 text-blue-600 hover:bg-blue-50"}`}
                >
                  {i === 1 ? "View Certificate" : "No Certificate"}
                </Button>
              </div>
            ))}
            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 21h8m-4-4v4m-6-4h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1l-1-3H8l-1 3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg text-gray-800">Dean&apos;s List Award</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Recognized for academic excellence by maintaining a GPA of 3.9 or higher for three consecutive semesters.
              </p>
              <Button size="sm" className="text-xs bg-blue-600 text-white hover:bg-blue-700">
                View Certificate
              </Button>
            </div>
            <div className="border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg p-6 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12  bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-sm text-blue-600 mt-2">Add Achievement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <LuTrophy className="text-blue-600" size={20} />
            Portfolio
          </h2>
          <p className="text-sm text-gray-500">Showcase your projects and work samples to impress potential employers.</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    <MdStarOutline size={24} />
                  </div>
                  <h3 className="font-medium text-lg text-gray-800">Project Title {i}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Brief description of the project, highlighting its purpose, technologies used, and outcomes.
                </p>
                <Button
                  size="sm"
                  className="text-xs bg-blue-600 text-white hover:bg-blue-700"
                >
                  View Project
                </Button>
              </div>
            ))}
            <div className="border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg p-6 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-sm text-blue-600 mt-2">Add Project</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex justify-between items-center">
            <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
              <MdContactMail className="text-blue-600" size={20} />
              Contact Information
            </h2>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Edit
            </Button>
          </div>
          <p className="text-sm text-gray-500">Keep your contact details up-to-date for networking opportunities.</p>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path d="M22 7L12 13 2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Email</p>
              <p className="text-sm text-gray-600">kemlyrose15@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Phone</p>
              <p className="text-sm text-gray-600">+63 928-391-8443</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 text-gray-600 flex items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 0 0 20 15.3 15.3 0 0 0 0-20" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Website</p>
              <p className="text-sm text-gray-600">www.jobsNTech.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                <span className="font-bold text-lg">in</span>
              </div>
              <p className="text-sm text-gray-600">LinkedIn</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
                <span className="font-bold text-lg">f</span>
              </div>
              <p className="text-sm text-gray-600">Facebook</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-400 text-white flex items-center justify-center rounded-full">
                <span className="font-bold text-lg">t</span>
              </div>
              <p className="text-sm text-gray-600">Twitter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
