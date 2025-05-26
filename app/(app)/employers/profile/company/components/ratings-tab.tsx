"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarIcon, Search, ChevronDown } from "lucide-react"
import Image from "next/image"

export default function RatingsTab() {
  const reviews = [
    {
      id: 1,
      reviewer: "Alex Johnson",
      position: "Former UI/UX Designer",
      rating: 4,
      date: "03-27-2023",
      review:
        "I worked at TechCorp for 3 years and overall had a positive experience. The culture is collaborative and supportive, with plenty of opportunities for professional growth. Management is accessible and responsive to employee concerns. Work-life balance was generally good, though it could get intense during product launches.",
      metrics: {
        culture: 4.5,
        worklife: 3.5,
        career: 4.0,
        benefits: 4.0,
        management: 3.5,
      },
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      reviewer: "Maria Rodriguez",
      position: "Current Frontend Developer",
      rating: 5,
      date: "02-15-2023",
      review:
        "TechCorp is an amazing place to work! The company truly values its employees and invests in their growth. I've been here for 2 years and have had multiple opportunities to learn new skills and take on challenging projects. The benefits are excellent, and the flexible work arrangements make it easy to maintain work-life balance.",
      metrics: {
        culture: 5.0,
        worklife: 4.5,
        career: 5.0,
        benefits: 4.5,
        management: 4.5,
      },
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      reviewer: "David Kim",
      position: "Former Product Manager",
      rating: 3,
      date: "01-30-2023",
      review:
        "TechCorp has a lot of potential but struggles with some organizational issues. While the technical teams are strong, decision-making can be slow and communication between departments isn't always clear. Benefits are competitive and colleagues are talented and friendly. Career advancement could be more structured and transparent.",
      metrics: {
        culture: 3.5,
        worklife: 3.0,
        career: 2.5,
        benefits: 4.0,
        management: 2.5,
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
            <div className="text-4xl font-bold">128</div>
            <p className="text-sm text-gray-500 mt-1">Reviews from current and former employees</p>
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
            <p className="text-sm text-gray-500 mt-1">Based on employee experiences and satisfaction</p>
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
                            ? "45%"
                            : rating === 4
                              ? "30%"
                              : rating === 3
                                ? "15%"
                                : rating === 2
                                  ? "7%"
                                  : "3%"
                        }`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm w-6 text-right">
                    {rating === 5 ? "58" : rating === 4 ? "38" : rating === 3 ? "19" : rating === 2 ? "9" : "4"}
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
                    alt={review.reviewer}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{review.reviewer}</h3>
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

                  <div className="text-sm text-gray-600 mt-1">{review.position}</div>

                  <p className="text-sm text-gray-600 mt-3">{review.review}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Company Culture: {review.metrics.culture}/5
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Work-Life Balance: {review.metrics.worklife}/5
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Career Growth: {review.metrics.career}/5
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Benefits: {review.metrics.benefits}/5
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Management: {review.metrics.management}/5
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button variant="outline" className="gap-2">
            Load More Reviews
          </Button>
        </div>
      </div>
    </div>
  )
}
