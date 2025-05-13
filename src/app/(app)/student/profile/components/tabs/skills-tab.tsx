"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function SkillsPage() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Skills & Expertise</h2>

        <div className="space-y-8">
          {/* Skills */}
          <div>
            <h3 className="text-lg font-medium mb-4">Skills</h3>
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
          <hr className="border-gray-300 my-6" />

          {/* Expertise */}
          <div>
            <h3 className="text-lg font-medium mb-4">Expertise</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Showcase your technical expertise and areas of proficiency.</p>
            <div className="space-y-4">
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
          <hr className="border-gray-300 my-6" />

          {/* Tools & Technologies */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tools & Technologies</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["VS Code", "Git", "GitHub", "Figma", "Adobe XD", "Postman"].map((tool) => (
                <div key={tool} className="flex items-center gap-2 p-2 border rounded-md">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm">{tool}</span>
                </div>
              ))}
            </div>
            <div className="text-left mt-4">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                + Add Tool/Technology
              </Button>
            </div>
          </div>
          <hr className="border-gray-300 my-6" />

          {/* Languages */}
          <div>
            <h3 className="text-lg font-medium mb-4">Languages</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">English</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`w-4 h-4 rounded-full ${i <= 4 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Filipino</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`w-4 h-4 rounded-full ${i <= 5 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-left mt-4">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                + Add Language
              </Button>
            </div>
          </div>
          <hr className="border-gray-300 my-6" />

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-medium mb-4">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                      <span className="font-bold text-lg">C</span>
                    </div>
                    <h3 className="font-medium text-lg text-gray-800">Certification Title {i}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Brief description of the certification, including the issuing organization and year.
                  </p>
                  <Button
                    size="sm"
                    className="text-xs bg-blue-600 text-white hover:bg-blue-700"
                  >
                    View Certificate
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
                  <p className="text-sm text-blue-600 mt-2">Add Certification</p>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-gray-300 my-6" />

          {/* Portfolio */}
          <div>
            <h3 className="text-lg font-medium mb-4">Portfolio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                      <span className="font-bold text-lg">P</span>
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
      </CardContent>
    </Card>
  )
}
