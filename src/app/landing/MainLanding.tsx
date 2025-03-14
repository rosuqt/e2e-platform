import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
import UploadIcon from "./components/icons/UploadIcon";

export default function MainLanding() {
  return (
    <div className="relative min-h-screen bg-[#5d4ab1] text-white">
      <LandingNav />
      <HeroSection />

      {/* Set up your profile section */}

      <div className="bg-white px-10 py-16 text-black">
        <h1 className="text-4xl font-bold">
          Set up your <span className="text-[#2D4CC8]">Profile</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Set up your profile to showcase your skills. Connect with opportunities and grow your network.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <UploadIcon />
              <h3 className="text-xl font-bold">Upload your Resume</h3>
            </div>
            <p className="mt-2 text-sm">
              Upload your resume to highlight your experience and skills. Make it easier for employers to discover and connect with you.
            </p>
          </div>

          <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <img src="/icons/ai-job.svg" alt="AI Icon" className="w-8 h-8" />
              <h3 className="text-xl font-bold">AI Job Picker</h3>
            </div>
            <p className="mt-2 text-sm">
              Get personalized job recommendations based on your skills and interests. Let AI match you with the best opportunities effortlessly.
            </p>
          </div>

          <div className="bg-[#1C2B5E] text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <img src="/icons/skills.svg" alt="Skills Icon" className="w-8 h-8" />
              <h3 className="text-xl font-bold">Show off your skills</h3>
            </div>
            <p className="mt-2 text-sm">
              Showcase your skills and expertise to stand out. Let employers see what you bring to the table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
