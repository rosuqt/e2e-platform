"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, LinkedinIcon as LinkedIn, Mail, User, Users } from "lucide-react"
import Image from "next/image"

export default function TeamTab() {
  const departments = [
    { name: "All", count: 42 },
    { name: "Engineering", count: 18 },
    { name: "Design", count: 7 },
    { name: "Product", count: 5 },
    { name: "Marketing", count: 6 },
    { name: "Sales", count: 4 },
    { name: "HR", count: 2 },
  ]

  const employees = [
    {
      id: 1,
      name: "Alex Morgan",
      position: "Head of Design",
      department: "Design",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg?height=200&width=200",
      joined: "2019",
    },
    {
      id: 2,
      name: "Jessica Lee",
      position: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      avatar: "/placeholder.svg?height=200&width=200",
      joined: "2020",
    },
    {
      id: 3,
      name: "David Kim",
      position: "Product Manager",
      department: "Product",
      location: "New York, NY",
      avatar: "/placeholder.svg?height=200&width=200",
      joined: "2018",
    },
    {
      id: 4,
      name: "Rachel Chen",
      position: "Marketing Lead",
      department: "Marketing",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg?height=200&width=200",
      joined: "2021",
    },
    {
      id: 5,
      name: "Michael Johnson",
      position: "Backend Developer",
      department: "Engineering",
      location: "Chicago, IL",
      avatar: "/placeholder.svg?height=200&width=200",
      joined: "2019",
    },
    {
      id: 6,
      name: "Emily Wilson",
      position: "UX Designer",
      department: "Design",
      location: "Remote",
      avatar: "/placeholder.svg?height=200&width=200",
      joined: "2020",
    },
    {
      id: 7,
      name: "Robert Garcia",
      position: "DevOps Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg?height=200&width=200",
      joined: "2018",
    },
    {
      id: 8,
      name: "Sophia Martinez",
      position: "HR Specialist",
      department: "HR",
      location: "New York, NY",
      avatar: "/placeholder.svg?height=200&width=200",
      joined: "2021",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Company Team</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Users className="w-4 h-4 mr-1" />
              {employees.length} Employees
            </Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <div className="md:w-1/4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search team members..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Departments</h3>
              <div className="space-y-2">
                {departments.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                        defaultChecked={dept.name === "All"}
                      />
                      <span className="ml-2 text-sm">{dept.name}</span>
                    </label>
                    <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5">{dept.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Location</h3>
              <div className="space-y-2">
                {["All Locations", "San Francisco", "New York", "Chicago", "Remote"].map((location) => (
                  <div key={location} className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                        defaultChecked={location === "All Locations"}
                      />
                      <span className="ml-2 text-sm">{location}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Grid */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <Card
                  key={employee.id}
                  className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                          <Image
                            src={employee.avatar || "/placeholder.svg"}
                            alt={employee.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-12 p-4 text-center">
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <Badge className="bg-blue-100 text-blue-800 mt-2">{employee.department}</Badge>
                      <div className="mt-3 text-xs text-gray-500">
                        <div className="flex items-center justify-center mb-1">
                          <User className="w-3 h-3 mr-1" />
                          Joined {employee.joined}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1 gap-1">
                          <Mail className="w-3 h-3" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                          <LinkedIn className="w-3 h-3" />
                          Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
