"use client";
import { StarIcon } from "lucide-react";

type Review = {
  id: number;
  company: string;
  position: string;
  rating: number;
  date: string;
  review: string;
  metrics: {
    professionalism: number;
    communication: number;
    environment: number;
  };
  logo: string;
  person: string;
};

export default function PublicRatingsTab({ reviews }: { reviews?: Review[] }) {
  const sampleReviews = reviews ?? [
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
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ratings</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="space-y-6">
          {sampleReviews.map((review, index) => (
            <div key={review.id} className={`${index !== sampleReviews.length - 1 ? "border-b pb-6" : ""}`}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
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
                    <span className="text-xs bg-gray-50 px-2 py-1 rounded border text-gray-700">
                      Professionalism: {review.metrics.professionalism}/5
                    </span>
                    <span className="text-xs bg-gray-50 px-2 py-1 rounded border text-gray-700">
                      Communication: {review.metrics.communication}/5
                    </span>
                    <span className="text-xs bg-gray-50 px-2 py-1 rounded border text-gray-700">
                      Work Environment: {review.metrics.environment}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sampleReviews.length === 0 && (
            <div className="text-gray-400 italic text-center py-8">No ratings yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
