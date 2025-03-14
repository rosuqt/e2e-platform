export default function HomePage() {
    return (
      <div className="relative min-h-screen bg-[#5d4ab1] text-white">
        <div className="relative bg-[#5d4ab1] min-h-[85vh] flex flex-col lg:flex-row items-center px-10 py-20">
          <div className="lg:w-1/2">
            <h2 className="text-6xl font-semibold leading-tight text-white">
              The ultimate platform for interns to{" "}
              <span className="text-yellow-400">connect, grow, and get hired</span>
            </h2>
            <p className="mt-4 text-lg font-light text-gray-200">
              Build your professional network, showcase your skills, and discover exciting internship opportunities—all in one place. Start your career journey today!
            </p>
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
          <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
            <div className="w-80 h-80 bg-gray-300 rounded-full overflow-hidden"></div>
          </div>
  
          <div className="absolute bottom-[-100px] left-0 w-full">
            <svg viewBox="0 0 1440 320" className="w-full h-auto">
              <path 
                fill="white" 
                d="M0,224C120,202,240,160,360,154.7C480,149,600,171,720,186.7C840,202,960,210,1080,197.3C1200,185,1320,139,1380,117.3L1440,96V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
              ></path>
            </svg>
          </div>
        </div>
  
        <div className="relative bg-white w-full h-[200px]"></div>
      </div>
    );
  }
  