import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
import UploadIcon from "./components/icons/UploadIcon";
import JobMatcher from "./components/icons/JobMatcher";
import Skills from "./components/icons/Skills";

export default function MainLanding() {
  return (
    <div className="relative min-h-screen bg-[#5d4ab1] text-white">
      <LandingNav />
      <HeroSection />

      <div className="relative bg-white px-10 py-16 text-black">


  {/* Header Section */}
  <div className="space-y-5">
    <h1 className="text-5xl font-bold ml-20">
      Set up your <span className="text-[#2D4CC8]">Profile</span>
    </h1>
    <p className="mt-2 text-lg text-gray-500 max-w-xl ml-20">
      Set up your profile to showcase your skills. Connect with opportunities and grow your network.
    </p>
  </div>

  {/* Cards Section */}
  <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 justify-center ml-20 mr-20">
    {/* Showcase your Resume Card */}
    <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg w-[375px] h-[213px] flex flex-col items-start">
      <UploadIcon />
      <h3 className="text-2xl font-bold mt-3">Showcase your Resume</h3>
      <p className="mt-2 text-gray-300 text-sm">
        Upload or build your resume to highlight your experience and skills. Make it easier for employers to discover and connect with you.
      </p>
    </div>

    {/* AI Job Matches Card */}
    <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg w-[375px] h-[213px] flex flex-col items-start">
      <JobMatcher />
      <h3 className="text-2xl font-bold mt-3">AI Job Matches</h3>
      <p className="mt-2 text-gray-300 text-sm">
        Get personalized job recommendations based on your skills and resume. Let AI match you with the best opportunities effortlessly.
      </p>
    </div>

    {/* Show off your skills Card */}
    <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg w-[375px] h-[213px] flex flex-col items-start">
      <Skills />
      <h3 className="text-2xl font-bold mt-3">Show off your skills</h3>
      <p className="mt-2 text-gray-300 text-sm">
        Showcase your skills and expertise to stand out. Let employers see what you bring to the table.
      </p>
    </div>
  </div>
</div>
    </div>
  );
}
