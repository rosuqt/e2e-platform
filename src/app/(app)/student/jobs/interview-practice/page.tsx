import Link from "next/link"
import { Clock, BarChart2, Award, Zap } from "lucide-react"
import { IoIosRocket } from "react-icons/io";
import StackCards from "./components/stack-cards"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      <div className="min-h-screen max-w-6xl mx-auto p-4 md:p-8">
      

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 bg-white">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                AI-Powered Interview Practice
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Master Your <span className="text-blue-600">Interview Skills</span> With Confidence
              </h2>
              <p className="text-lg text-gray-600">
                Practice with real interview questions, get instant feedback, and improve your chances of landing your
                dream job.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="interview-practice/select-practice"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Start Practicing <IoIosRocket className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-xl transition-all"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
            <div className="relative bg-white"> {/* Explicitly set background color */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl transform scale-95 opacity-70"></div>
              <div className="relative z-10 mt-50">
                <StackCards />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time Feedback</h3>
            <p className="text-gray-600">
              Get instant analysis on your interview performance with AI-powered insights.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <BarChart2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your improvement over time with detailed performance analytics.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Industry Questions</h3>
            <p className="text-gray-600">Practice with questions tailored to specific roles and industries.</p>
          </div>
        </div>

        {/* Practice History Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Practice History</h2>
                <p className="text-gray-600">Track your progress and see how you&apos;re improving over time.</p>
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  defaultValue="recent"
                >
                  <option value="recent">Sort by: Recent</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="score">Sort by: Score</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-6">Today</h3>
                <div className="space-y-8">
                  <HistoryItem
                    time="12 mins ago"
                    type="UI/UX Designer Mock Interview"
                    skills={["Strong Communication", "Needs More Confidence"]}
                    score="good"
                  />
                  <HistoryItem
                    time="8 hours ago"
                    type="Generic Mock Interview"
                    skills={["Strong Communication", "Confident"]}
                    score="good"
                  />
                  <HistoryItem
                    time="9:20 am"
                    type="Software Engineer Mock Interview"
                    skills={["Poor Communication", "Needs More Confidence"]}
                    score="bad"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-6">Dec 22, 2001</h3>
                <div className="space-y-8">
                  <HistoryItem
                    time="1:00 am"
                    type="UI/UX Designer Mock Interview"
                    skills={["Strong Communication", "Needs More Confidence"]}
                    score="good"
                  />
                  <HistoryItem
                    time="3:12 pm"
                    type="Generic Mock Interview"
                    skills={["Strong Communication", "Confident"]}
                    score="good"
                  />
                  <HistoryItem
                    time="9:30 am"
                    type="Software Engineer Mock Interview"
                    skills={["Poor Communication", "Needs More Confidence"]}
                    score="bad"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to ace your next interview?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start practicing now and get personalized feedback to improve your interview skills.
            </p>
            <Link
              href="/select-practice"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-lg"
            >
              Start Free Practice <IoIosRocket className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function HistoryItem({
  time,
  type,
  skills,
  score,
}: {
  time: string
  type: string
  skills: string[]
  score: "good" | "bad"
}) {
  return (
    <div className="relative pl-10 flex justify-between items-start group">
      <div className="absolute left-0 top-0 h-full flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            score === "good" ? "bg-green-500 group-hover:bg-green-600" : "bg-red-500 group-hover:bg-red-600"
          } text-white transition-colors`}
        >
          {score === "good" ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
      </div>

      <div className="flex-1">
        <div className="text-xs text-gray-500 mb-1">{time}</div>
        <div className="font-medium text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{type}</div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${
                skill.includes("Strong") || skill.includes("Confident")
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <Link
        href="#"
        className="text-blue-500 hover:text-blue-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
      >
        View
      </Link>
    </div>
  )
}
