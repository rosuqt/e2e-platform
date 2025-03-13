export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#5d4ab1] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5">
        <h1 className="text-xl font-bold">InternConnect</h1>
        <div className="space-x-10">
          <a href="#" className="text-white">People</a>
          <a href="#" className="text-white">Jobs</a>
          <a href="#" className="text-white">Companies</a>
          <a href="#" className="text-white">STI Hiring</a>
          <a href="#" className="font-bold">Employer’s Sign-up</a>
          <button className="bg-white text-[#5D4AB1] px-4 py-2 rounded-md font-semibold">Sign in</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center px-10 py-20">
        {/* Text Content */}
        <div className="lg:w-1/2">
          <h2 className="text-6xl font-semibold leading-tight">
            The ultimate platform for interns to <span className="text-yellow-400">connect, grow, and get hired</span>
          </h2>
          <p className="mt-4 text-lg font-light text-gray-200">
            Build your professional network, showcase your skills, and discover exciting internship opportunities—all in one place. Start your career journey today!
          </p>
          {/* Search Bar */}
          <div className="mt-6 flex space-x-4">
            <div className="flex flex-col w-[200px] bg-white p-4 rounded-md h-20 relative">
              <label className="text-sm absolute top-2 left-4 text-[#0F1476]">I&apos;m studying</label>
              <input
                type="text"
                placeholder="e.g. BSIT"
                className="w-full h-full text-left px-4 py-3 rounded-md text-black bg-transparent focus:outline-none focus:ring-0 placeholder-gray-500 mt-4"
              />
            </div>
            <div className="flex flex-col w-[280px] bg-white p-4 rounded-md h-20 relative">
              <label className="text-sm absolute top-2 left-4 text-[#0F1476]">I&apos;m looking for</label>
              <input
                type="text"
                placeholder="e.g. Web Development"
                className="w-full h-full text-left px-4 py-3 rounded-md text-black bg-transparent focus:outline-none focus:ring-0 placeholder-gray-500 mt-4"
              />
            </div>
            <button className="bg-button w-40 h-22 rounded-md text-lg font-semibold">Show jobs</button>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <div className="w-80 h-80 bg-gray-300 rounded-full overflow-hidden"></div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full">
      <svg viewBox="0 0 1440 320" className="w-full h-auto">
      <path 
          fill="white" 
          d="M0,240 C480,360 960,120 1440,240 L1440,320 L0,320 Z"
      ></path>
      </svg>




      </div>
    </div>
  );
}
