"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { StarIcon, Search, ChevronDown, Loader2 } from "lucide-react"
import axios from "axios"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { RatingsModal } from "../modals/ratings-modal"

interface Review {
  id: number
  company: { company_name: string; company_logo_url?: string | null } | null
  position: string
  rating: number
  date: string
  overall_comment: string
  recruiter_comment: string
  company_comment: string
  metrics: {
    professionalism: number
    communication: number
    environment: number
  }
  employer: { name: string; profile_img_url?: string | null } | null
}

export default function RatingsTab() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("Newest first")
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [recruiterImgUrl, setRecruiterImgUrl] = useState<string | null>(null)
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/api/students/ratings");
        const reviewsData: Review[] = (response.data || []).map((rating: any) => ({
          id: rating.id,
          company: {
            company_name: rating.company?.company_name || "Unknown Company",
            company_logo_url: rating.company?.company_logo_url || null,
          },
          employer: {
            name: rating.employer?.name || "Unknown Employer",
            profile_img_url: rating.employer?.profile_img || null,
          },
          position: rating.job_postings?.job_title || "Unknown Position",
          rating: rating.overall_rating || 0,
          date: rating.created_at ? new Date(rating.created_at).toLocaleDateString() : "",
          overall_comment: rating.overall_comment || "",
          recruiter_comment: rating.recruiter_comment || "",
          company_comment: rating.company_comment || "",
          metrics: {
            professionalism: rating.recruiter_rating || 0,
            communication: rating.overall_rating || 0,
            environment: rating.company_rating || 0,
          },
        }));
        setReviews(reviewsData);
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

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter(r =>
      r.company?.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.position?.toLowerCase().includes(search.toLowerCase()) ||
      r.employer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.overall_comment?.toLowerCase().includes(search.toLowerCase())
    )
    if (sortBy === "Newest first") {
      filtered = filtered.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
    } else if (sortBy === "Highest rated") {
      filtered = filtered.slice().sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "Lowest rated") {
      filtered = filtered.slice().sort((a, b) => a.rating - b.rating)
    }
    return filtered
  }, [reviews, sortBy, search])

  const handleViewMore = async (review: any) => {
    setSelectedReview(review)
    setModalOpen(true)
    let recruiterImgUrl = null
    if (review.employer?.profile_img_url) {
      try {
        const { data } = await axios.post("/api/employers/get-signed-url", {
          bucket: "user.avatars",
          path: review.employer.profile_img_url,
        })
        recruiterImgUrl = data?.signedUrl || null
      } catch {
        recruiterImgUrl = null
      }
    }
    setRecruiterImgUrl(recruiterImgUrl)
    setCompanyLogoUrl(review.company?.company_logo_url || null)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ratings</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {loading ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full">
              <div>
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-12 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mt-2"></div>
              </div>
              <div>
                <div className="h-10 w-28 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="flex items-center gap-2">
                  <div className="h-12 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mt-2"></div>
              </div>
              <div>
                <div className="space-y-2">
                  {[5,4,3,2,1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-300 animate-pulse" style={{ width: "60%" }}></div>
                      </div>
                      <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-4" />
              <span className="text-lg text-gray-600">Fetching your Ratings</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Total Reviews</h3>
                <div className="text-4xl font-bold">{totalReviews}</div>
                <p className="text-sm text-gray-500 mt-1">All feedback and ratings shared</p>
              </div>
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
              <div>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter((r) => r.rating === rating).length
                    const percent = totalReviews ? (count / totalReviews) * 100 : 0
                    return (
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
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm w-6 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 pb-4 flex justify-between items-center">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {sortBy}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setSortBy("Newest first")}>Newest first</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("Highest rated")}>Highest rated</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("Lowest rated")}>Lowest rated</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search reviews..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {filteredReviews.length === 0 ? (
                <p>No reviews submitted yet.</p>
              ) : (
                filteredReviews.map((review, index) => {
                  if (review.company?.company_logo_url) {
                    console.log("Company Logo URL:", review.company.company_logo_url);
                  }
                  return (
                    <div
                      key={review.id}
                      className={`transition-colors ${index !== reviews.length - 1 ? "border-b pb-6" : ""} hover:bg-yellow-50/40 rounded-lg`}
                    >
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          {review.company?.company_logo_url ? (
                            <img
                              src={review.company.company_logo_url}
                              alt={review.company?.company_name || "Company"}
                              width={48}
                              height={48}
                              style={{ objectFit: "cover", width: "48px", height: "48px", borderRadius: "9999px" }}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-600 text-sm font-medium rounded-full">
                              {review.company?.company_name?.[0] ?? "C"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{review.company?.company_name ?? "Unknown Company"}</h3>
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
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-sm text-gray-600">
                              You applied for <span className="font-medium">{review.position}</span>
                            </div>
                            <button
                              type="button"
                              className="border border-blue-500 text-blue-600 px-2 py-1 rounded font-medium text-xs hover:bg-blue-50 transition"
                              onClick={() => handleViewMore(review)}
                            >
                              View More
                            </button>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            You rated <span className="font-medium">{review.employer?.name}</span> hiring process
                          </div>
                          <p className="text-sm text-gray-600 mt-3">{review.overall_comment}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge
                              variant="outline"
                              className="text-xs h-8 flex items-center bg-slate-100/70 border-slate-300 text-slate-700"
                            >
                              Professionalism: {review.metrics.professionalism}/5
                            </Badge>

                            <Badge
                              variant="outline"
                              className="text-xs h-8 flex items-center bg-slate-100/70 border-slate-300 text-slate-700"
                            >
                              Work Environment: {review.metrics.environment}/5
                            </Badge>
                                                    <Badge
                              variant="outline"
                              className="text-xs h-8 flex items-center bg-slate-100/70 border-slate-300 text-slate-700"
                            >
                              Overall Experience: {review.metrics.communication}/5
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
      <RatingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        rating={
          selectedReview
            ? {
                overall_rating: selectedReview?.rating ?? 0,
                overall_comment: selectedReview?.overall_comment ?? "",
                recruiter_rating: selectedReview?.metrics?.professionalism ?? 0,
                recruiter_comment: selectedReview?.recruiter_comment ?? "",
                company_rating: selectedReview?.metrics?.environment ?? 0,
                company_comment: selectedReview?.company_comment ?? "",
                employer: selectedReview?.employer,
                company: selectedReview?.company
                  ? {
                      company_name: selectedReview.company.company_name,
                      company_logo_url: selectedReview.company.company_logo_url,
                    }
                  : undefined,
                job_postings: { job_title: selectedReview?.position },
                created_at: selectedReview?.date,
              }
            : {
                overall_rating: 0,
                overall_comment: "",
                recruiter_rating: 0,
                recruiter_comment: "",
                company_rating: 0,
                company_comment: "",
                employer: undefined,
                company: undefined,
                job_postings: undefined,
                created_at: "",
              }
        }
        recruiterImgUrl={recruiterImgUrl}
        companyLogoUrl={companyLogoUrl}
      />
    </div>
  )
}