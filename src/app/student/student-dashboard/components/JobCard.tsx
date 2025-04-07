import { Bookmark, Briefcase, CheckCircle, Clock, DollarSign } from "lucide-react";

interface JobCardProps {
  title: string;
  company: string;
  rating: string;
  reviews: number;
  closing: string;
  type: string;
  salary: string;
  matchPercent: string;
  timePosted: string;
}

export default function JobCard({
  title,
  company,
  rating,
  reviews,
  closing,
  type,
  salary,
  matchPercent,
  timePosted,
}: JobCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e6e6ed] p-4 relative">
      <button className="absolute top-4 right-4">
        <Bookmark className="text-gray-400" size={20} />
      </button>
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-[#dfebfb] flex items-center justify-center">
          {/* Icon */}
        </div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{company}</p>
          <div className="flex items-center mt-1">
            {/* Stars */}
            <span className="text-xs ml-1">{rating}/5 ({reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm">
          <Clock size={16} className="text-[#1551a9] mr-2" />
          <span>{closing}</span>
        </div>
        <div className="flex items-center text-sm">
          <Briefcase size={16} className="text-gray-500 mr-2" />
          <span>{type}</span>
        </div>
        <div className="flex items-center text-sm">
          <DollarSign size={16} className="text-gray-500 mr-2" />
          <span>{salary}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="bg-[#00d23f] text-white rounded-full py-2 px-4 flex items-center justify-center">
          <CheckCircle size={16} className="mr-2" />
          <span>You are {matchPercent} Matched to this job</span>
        </div>
      </div>

      <div className="mt-2 text-right text-xs text-gray-500">
        {timePosted}
      </div>
    </div>
  );
}
