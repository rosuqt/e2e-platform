import Link from "next/link";

export default function PeoplePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 shadow-md gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <Link href="/">
            <span className="text-blue-600 text-2xl font-bold">Seekr</span>
          </Link>
          {/* Search */}
          <div className="flex flex-wrap border border-gray-300 rounded-full overflow-hidden shadow-sm w-full sm:w-auto">
            <span className="bg-white-100 text-black-600 px-6 py-3 text-sm font-semibold">
              People
            </span>
            <input
              type="text"
              placeholder="First name"
              className="px-3 py-2 text-sm w-40 outline-none border-l border-gray-200"
            />
            <input
              type="text"
              placeholder="Last name"
              className="px-3 py-2 text-sm w-40 outline-none border-l border-gray-200"
            />
            <button className="px-3 bg-white hover:bg-gray-100 border-l flex items-center justify-center">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <a href="#" className="text-sm text-gray-700 hover:underline">
            Join now
          </a>
          <button className="px-6 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-400">
            Sign in
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mb-6">
          <img
            src="https://img.freepik.com/premium-vector/student-character-vector-people-with-books-backpacks_507816-667.jpg?semt=ais_hybrid"
            alt="Student nerds"
            className="w-full h-auto object-contain"
            loading="eager"
          />
        </div>
        <p className="text-base sm:text-lg text-gray-700">
          Try searching for your co-worker, classmate, professor, or friend
        </p>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t text-sm text-gray-500 text-center py-6 px-4">
        <p>
          {/*copyright sign*/}&copy; 2025{" "}
          <a href="#" className="font-semibold">
            InternConnect
          </a>
        </p>
        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          <a href="#" className="hover:underline">
            About Us
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
          <a href="#" className="hover:underline">
            Community Guidelines
          </a>
        </div>
      </footer>
    </div>
  );
}
