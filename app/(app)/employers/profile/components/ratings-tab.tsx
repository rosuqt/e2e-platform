"use client"

import { Badge } from "@/components/ui/badge"
import { StarIcon, Search, ChevronDown } from "lucide-react"
import Image from "next/image"

export default function RatingsTab() {
  const reviews = [
    {
      id: 1,
      candidate: "Ariza Rosu",
      position: "UI/UX Designer",
      rating: 4,
      date: "03-27-2023",
      review:
        "Great hiring process! John was professional and communicated clearly throughout the entire experience. The interview questions were relevant and challenging, giving me a good sense of the role requirements. Received timely feedback after each stage.",
      metrics: {
        professionalism: 4.5,
        communication: 4.5,
        environment: 4.0,
      },
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      candidate: "Reri Wu",
      position: "Frontend Developer",
      rating: 5,
      date: "02-15-2023",
      review:
        "Exceptional experience with John during the hiring process. The entire journey from initial contact to offer stage was seamless. I appreciated the transparent communication about company culture and expectations. One of the best recruitment experiences I've had.",
      metrics: {
        professionalism: 5.0,
        communication: 5.0,
        environment: 4.5,
      },
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      candidate: "Shiri Yosa",
      position: "Product Manager",
      rating: 3,
      date: "01-30-2023",
      review:
        "The interview process was well-structured, but there were some delays in communication between rounds. John was knowledgeable about the role but could improve on setting clear expectations about next steps. Overall a decent experience with room for improvement.",
      metrics: {
        professionalism: 3.5,
        communication: 2.5,
        environment: 4.0,
      },
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Total Reviews</h3>
            <div className="text-4xl font-bold">56</div>
            <p className="text-sm text-gray-500 mt-1">All candidate feedback from your hiring processes</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Average Rating</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">4.2</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-5 h-5 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : star <= 5 ? "text-gray-300" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Based on candidate feedback from interviews and hiring</p>
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
                                ? "bg-orange-400"
                                : "bg-red-500"
                      }`}
                      style={{
                        width: `${
                          rating === 5
                            ? "35%"
                            : rating === 4
                              ? "42%"
                              : rating === 3
                                ? "15%"
                                : rating === 2
                                  ? "6%"
                                  : "2%"
                        }`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm w-6 text-right">
                    {rating === 5 ? "19" : rating === 4 ? "24" : rating === 3 ? "8" : rating === 2 ? "3" : "2"}
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
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.candidate}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{review.candidate}</h3>
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
                    Applied for <span className="font-medium">{review.position}</span>
                  </div>

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
