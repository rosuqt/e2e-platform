import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto py-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Verification Tiers</h1>
          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shadow">Seekr</span>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-blue-800">Choose Your Verification Tier</h2>
          <p className="text-lg text-blue-600">
            Unlock more features and credibility by upgrading your verification status.
          </p>
          <div className="grid gap-8 sm:grid-cols-3 mt-12">
            <Link href="/employers/verification/unverified" className="block">
              <div className="border-2 border-yellow-300 rounded-xl p-8 bg-white hover:shadow-lg transition-shadow flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <span className="text-yellow-500 text-3xl font-bold">B</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-700">Unverified</h3>
                <p className="text-blue-700 mb-2">Basic access with limited features</p>
                <span className="text-xs text-gray-400">Post up to 3 jobs</span>
              </div>
            </Link>
            <Link href="/employers/verification/partially-verified" className="block">
              <div className="border-2 border-blue-400 rounded-xl p-8 bg-white hover:shadow-lg transition-shadow flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-3xl font-bold">S</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-700">Partially Verified</h3>
                <p className="text-blue-700 mb-2">Enhanced access with more features</p>
                <span className="text-xs text-gray-400">Post up to 5 jobs</span>
              </div>
            </Link>
            <Link href="/employers/verification/fully-verified" className="block">
              <div className="border-2 border-blue-700 rounded-xl p-8 bg-white hover:shadow-lg transition-shadow flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center mb-4">
                  <span className="text-white text-3xl font-bold">F</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900">Fully Verified</h3>
                <p className="text-blue-700 mb-2">Complete access to all features</p>
                <span className="text-xs text-gray-400">Unlimited job postings</span>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t py-8 bg-white">
        <div className="container mx-auto text-center text-sm text-blue-600 font-medium">
          &copy; {new Date().getFullYear()} Seekr. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
