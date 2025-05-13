"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { StarIcon, Search, ChevronDown } from "lucide-react"

export default function RatingsPage() {
  const reviews = [
    {
      id: 1,
      company: "Kumakashi Corporated",
      position: "UI/UX Designer",
      rating: 4,
      date: "03-27-2025",
      review:
        "Great experience overall! The employer was professional and communicated clearly throughout the process. I appreciated how supportive they were during my internship, always providing feedback when needed. Some delays in responses, but nothing too serious. The work environment was positive and I learned a lot.",
      metrics: {
        professionalism: 4.5,
        communication: 4.5,
        environment: 3.5,
      },
      logo: "/placeholder.svg?height=60&width=60",
      person: "Charlie Morning's",
    },
    {
      id: 2,
      company: "Kemlerina Rose",
      position: "UI/UX Designer",
      rating: 4,
      date: "03-27-2025",
      review:
        "Great experience overall! The employer was professional and communicated clearly throughout the process. I appreciated how supportive they were during my internship, always providing feedback when needed. Some delays in responses, but nothing too serious. The work environment was positive and I learned a lot.",
      metrics: {
        professionalism: 4.5,
        communication: 4.5,
        environment: 3.5,
      },
      logo: "/placeholder.svg?height=60&width=60",
      person: "Charlie Morning's",
    },
    {
      id: 3,
      company: "Kemlerina Rose",
      position: "UI/UX Designer",
      rating: 4,
      date: "03-27-2025",
      review:
        "Great experience overall! The employer was professional and communicated clearly throughout the process. I appreciated how supportive they were during my internship, always providing feedback when needed. Some delays in responses, but nothing too serious. The work environment was positive and I learned a lot.",
      metrics: {
        professionalism: 4.5,
        communication: 4.5,
        environment: 3.5,
      },
      logo: "/placeholder.svg?height=60&width=60",
      person: "Charlie Morning's",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ratings</h2>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Total Reviews</h3>
            <div className="text-4xl font-bold">200</div>
            <p className="text-sm text-gray-500 mt-1">All the feedback and ratings you&apos;ve shared</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Average Rating</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">3.6</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-5 h-5 ${star <= 3 ? "text-yellow-400 fill-yellow-400" : star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Shows how you usually rate employers and job listings</p>
          </div>

          <div>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        rating === 5
                          ? "bg-green-500"
                          : rating === 4
                            ? "bg-blue-500"
                            : rating === 3
                              ? "bg-yellow-500"
                              : rating === 2
                                ? "bg-blue-400"
                                : "bg-orange-500"
                      }`}
                      style={{
                        width: `${
                          rating === 5
                            ? "100%"
                            : rating === 4
                              ? "48%"
                              : rating === 3
                                ? "22%"
                                : rating === 2
                                  ? "28%"
                                  : "6%"
                        }`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm w-6 text-right">
                    {rating === 5 ? "50" : rating === 4 ? "24" : rating === 3 ? "11" : rating === 2 ? "14" : "3"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 pb-4 flex justify-between items-center">
          <div className="relative">
            <select className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Sort by</option>
              <option>Newest first</option>
              <option>Highest rated</option>
              <option>Lowest rated</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="search"
              className="pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search reviews..."
            />
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={review.id} className={`${index !== reviews.length - 1 ? "border-b pb-6" : ""}`}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={review.logo || "/placeholder.svg"}
                    alt={review.company}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{review.company}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    You rated <span className="font-medium">{review.person}</span> hiring process
                  </div>
                  <div className="text-sm text-gray-600">You Applied for {review.position}</div>

                  <p className="text-sm text-gray-600 mt-3">{review.review}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Professionalism: {review.metrics.professionalism}/5
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Communication: {review.metrics.communication}/5
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Work Environment: {review.metrics.environment}/5
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
