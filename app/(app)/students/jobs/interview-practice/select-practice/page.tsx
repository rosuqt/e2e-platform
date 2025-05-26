import Link from "next/link"
import { ArrowLeft, Briefcase, Users } from "lucide-react"

export default function SelectPractice() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/students/jobs/interview-practice"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
              What Do You Want to Practice?
            </h1>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose the type of interview practice that best fits your needs. We&apos;ll tailor the experience to help you
              succeed.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Specific Job Option */}
              <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Job-Specific Practice</h3>
                <p className="text-gray-600 mb-8">
                  Choose a specific job title to get interview questions tailored to that role&apos;s requirements and
                  expectations.
                </p>
                <div className="relative w-full max-w-xs">
                  <select className="appearance-none w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md">
                    <option value="" className="text-black">Select a Job Title</option>
                    <option value="software-engineer" className="text-black">Software Engineer</option>
                    <option value="product-manager" className="text-black">Product Manager</option>
                    <option value="ux-designer" className="text-black">UX Designer</option>
                    <option value="data-scientist" className="text-black">Data Scientist</option>
                    <option value="marketing-manager" className="text-black">Marketing Manager</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-white"
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

              {/* Generic Interview Option */}
              <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Generic Interview</h3>
                <p className="text-gray-600 mb-8">
                  Practice with a variety of common interview questions that apply to any job and help build core
                  interview skills.
                </p>
                <Link
                  href="interview/generic"
                  className="inline-flex items-center gap-2 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-xl transition-all w-full max-w-xs justify-center shadow-sm hover:shadow-md"
                >
                  Start Generic Practice <span className="text-lg">✨</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
