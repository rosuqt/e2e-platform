"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "lucide-react"
import axios from "axios"

interface Review {
  id: number
  company: { company_name: string; company_logo_path?: string } | null
  position: string
  rating: number
  date: string
  review: string
  metrics: {
    professionalism: number
    communication: number
    environment: number
  }
  employer: { name: string } | null
  logoUrl?: string | null
}

export default function RatingsTab() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  function formatComments(rating: any) {
    const parts = [
      rating.recruiter_comment,
      rating.overall_comment,
      rating.company_comment,
    ].filter(Boolean)

    return parts
      .map((c: string) => {
        const trimmed = c.trim()
        return trimmed.endsWith(".") ? trimmed : trimmed + "."
      })
      .join(" ")
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/api/students/ratings");
  
        const reviewsData: Review[] = (response.data || []).map((rating: any) => ({
          id: rating.id,
          company: {
            company_name: rating.company?.company_name || "Unknown Company",
            company_logo_path: rating.company?.company_logo_url, // use backend URL
          },
          employer: {
            name: rating.employer
              ? `${rating.employer.first_name || ""} ${rating.employer.last_name || ""}`.trim()
              : "Unknown Employer",
          },
          
          position: rating.job_postings?.job_title || "Unknown Position",
          rating: rating.overall_rating || 0,
          date: rating.created_at ? new Date(rating.created_at).toLocaleDateString() : "",
          review: formatComments(rating),
          metrics: {
            professionalism: rating.recruiter_rating || 0,
            communication: rating.overall_rating || 0,
            environment: rating.company_rating || 0,
          },
          logoUrl: rating.company?.company_logo_url ?? null, // assign directly
        }));
  
        setReviews(reviewsData);
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, []);
  
  
  


  const totalReviews = reviews.length
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
  }, [reviews])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ratings</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm">

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Reviews */}
          <div>
            <h3 className="text-lg font-medium mb-2">Total Reviews</h3>
            <div className="text-4xl font-bold">{totalReviews}</div>
            <p className="text-sm text-gray-500 mt-1">All feedback and ratings shared</p>
          </div>

          {/* Average Rating */}
          <div>
            <h3 className="text-lg font-medium mb-2">Average Rating</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{averageRating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Number(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Shows how you usually rate employers and job listings
            </p>
          </div>

          {/* Rating Distribution */}
          <div>
            <h3 className="text-lg font-medium mb-2">Rating Distribution</h3>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => r.rating === rating).length
                const percent = totalReviews ? (count / totalReviews) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-3">{rating}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${percent}%` }}></div>
                    </div>
                    <span className="text-sm w-6 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews submitted yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex gap-4">
                  {/* Company Logo */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {review.logoUrl ? (
                      <Image
                        src={review.logoUrl}
                        alt={review.company?.company_name || "Company"}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-600 text-sm font-medium rounded-full">
                        {review.company?.company_name?.[0] ?? "C"}
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                    <h3 className="font-medium">{review.company?.company_name ?? "Unknown Company"}</h3>
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-500">{review.position}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      You rated <span className="font-medium">{review.employer?.name}</span> hiring process
                    </div>
                    <div className="text-sm text-gray-600">You applied for {review.position}</div>

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
            ))
          )}
        </div>
      </div>
    </div>
  )
}
