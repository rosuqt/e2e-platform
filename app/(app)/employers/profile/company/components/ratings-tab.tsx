/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarIcon, Search, ChevronDown } from "lucide-react"
import Image from "next/image"

export default function RatingsTab() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/employers/fetchRatings")
      .then(res => res.json())
      .then(data => {
        setReviews(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setReviews([])
        setLoading(false)
      })
  }, [])

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0
    return Math.round(
      (reviews.reduce((sum, r) => sum + (r.company_rating || 0), 0) / reviews.length) * 10
    ) / 10
  }, [reviews])

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as const
    reviews.forEach(r => {
      const val = Math.round(r.company_rating || 0)
      if (val >= 1 && val <= 5) (counts as Record<number, number>)[val]++
    })
    return counts
  }, [reviews])

  return (
    <div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Total Reviews</h3>
            <div className="text-4xl font-bold">{reviews.length}</div>
            <p className="text-sm text-gray-500 mt-1">Reviews from current and former employees</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Average Rating</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{avgRating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-5 h-5 ${avgRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
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
                        width: reviews.length
                          ? `${((ratingCounts as Record<number, number>)[rating] / reviews.length) * 100}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="text-sm w-6 text-right">
                    {(ratingCounts as Record<number, number>)[rating]}
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
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No ratings yet.</div>
          ) : (
            reviews.map((review, index) => (
              <div key={review.id || index} className={`${index !== reviews.length - 1 ? "border-b pb-6" : ""}`}>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={review.registered_students?.profile_img || "/placeholder.svg"}
                      alt={review.registered_students?.first_name || "Reviewer"}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {review.registered_students?.first_name
                          ? `${review.registered_students.first_name} ${review.registered_students.last_name || ""}`
                          : "Reviewer"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-4 h-4 ${review.company_rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      {review.job_postings?.job_title
                        ? <>Position: <span className="font-medium">{review.job_postings.job_title}</span></>
                        : null}
                    </div>

                    <p className="text-sm text-gray-600 mt-3">
                      {review.company_comment && review.company_comment.trim().length > 0
                        ? review.company_comment
                        : "No comment provided."}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        Company Rating: {review.company_rating || "—"}/5
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        Professionalism: {review.recruiter_rating || "—"}/5
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        Work Environment: {review.overall_rating || "—"}/5
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
