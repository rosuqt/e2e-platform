import React, { useState } from "react";
import { ArrowRight, CheckCircle, MapPin, Users, Briefcase, Clock, DollarSign, Calendar } from "lucide-react"; 
import { Divider as Separator } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ApplicationModal } from "../../../students/jobs/job-listings/components/application-modal";
import { LuFileSearch,LuFilePen } from "react-icons/lu";
import QuickEditModal from "../../jobs/job-listings/components/quick-edit-modal";
import { useRouter } from "next/navigation";

const JobDetails = ({ onClose }: { onClose: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-blue-100 hover:bg-blue-200 rounded-full p-2"
        >
          <ArrowRight className="w-5 h-5 text-blue-600 rotate-180" />
        </button>
        <div className="mt-12 flex items-start gap-4">
          <div className="bg-black rounded-full w-14 h-14 flex items-center justify-center text-white">
            <span className="font-bold text-sm">Mark-It</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">UI/UX Designer</h1>
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="text-muted-foreground">Fb Mark-It Place</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>9/686 Jumper Road, Fernway Drive, San Jose Del Monte Malancat, Pampanga, NCR</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm bg-green-200 px-4   py-1 rounded-full">
            <span className="text-green-600 font-medium">Active</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-muted-foreground" />
            <span>23 applicants</span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            className="gap-2 rounded-full"
            onClick={() => router.push("/employers/jobs/job-listings")}
          >
            <LuFileSearch  className="w-4 h-4" />
            <span className="text-white px-3">View Job</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 px-5"
            onClick={() => setIsQuickEditOpen(true)}
          >
            <LuFilePen  className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences. You will design
          user-friendly interfaces that enhance functionality and aesthetics.
        </p>
      </div>

      <Separator />

      {/* Job Details Section */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Job Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">On-the-Job Training</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">Closes at March 28, 2025</span>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">800 / Day</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">Posted 7 days ago</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">5 vacancies</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">Recommended for BSIT Students</span>
          </div>
        </div>
      </div>

      <Separator />

   

      {/* About the Job */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">About the Job</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Passionate about creating beautiful, high-performance web applications? We&apos;re looking for a Frontend Developer
          with experience in React, Next.js, and TailwindCSS to join our fast-growing team. You&apos;ll work closely with
          designers and backend engineers to build sleek, scalable, and user-friendly interfaces. This is a remote first
          role with flexible hours, competitive pay, and opportunities for career growth!
        </p>

        <h3 className="font-semibold mt-6 mb-2">Responsibilities</h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>
            Develop and maintain responsive, high-performance web applications using React.js, Next.js, and TailwindCSS.
          </li>
          <li>Collaborate with UI/UX designers to implement beautiful and functional designs.</li>
          <li>Optimize web applications for speed, scalability, and accessibility.</li>
          <li>Work with backend engineers to integrate APIs and manage data flow efficiently.</li>
          <li>Write clean, reusable, and maintainable code while following best practices.</li>
          <li>Participate in code reviews and contribute to improving our development workflows.</li>
        </ul>

        <h3 className="font-semibold mt-6 mb-2">Qualifications</h3>
        <h4 className="text-sm font-medium mb-2">Must-Haves:</h4>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>2+ years of experience in Frontend Development (React.js, Next.js).</li>
          <li>Proficiency in HTML, CSS, JavaScript, and TailwindCSS.</li>
          <li>Strong understanding of component-based architecture and state management.</li>
          <li>Experience with RESTful APIs & handling asynchronous requests.</li>
          <li>Ability to write clean, efficient, and well-documented code.</li>
          <li>A good eye for design and attention to detail.</li>
        </ul>

        <h4 className="text-sm font-medium mt-4 mb-2">Nice-to-Haves:</h4>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>Experience with TypeScript.</li>
          <li>Knowledge of backend technologies (Node.js, Express, Firebase, or similar).</li>
          <li>Familiarity with CI/CD and version control (Git, GitHub).</li>
          <li>Knowledge of SEO & web performance optimization.</li>
        </ul>

        <h3 className="font-semibold mt-6 mb-2">Perks and Benefits</h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>Remote & Flexible Work: Work from anywhere with flexible hours.</li>
          <li>Competitive Salary & Bonuses: Performance-based incentives.</li>
          <li>Learning & Growth: Access to courses, workshops, and conferences.</li>
          <li>Paid Time Off: Generous vacation and sick leave.</li>
          <li>Tech Allowance: We provide the tools you need to succeed!</li>
        </ul>
      </div>

      <Separator />

      <Card className="border-blue-200 m-6">
        <div className="  100 border-b border-blue-100 rounded-t-lg px-6 py-4">
          <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <svg className="text-blue-600" width="20" height="20" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path d="M3 21V7a2 2 0 0 1 2-2h3V3h4v2h3a2 2 0 0 1 2 2v14" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            About the Company
          </h2>
        </div>
        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-60 h-60 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  <Image src={"/images/logo-test2.png"} alt="Job-All Tech Solutions" width={150} height={150} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Job-All Tech Solutions</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
                      <MapPin className="w-3 h-3" />
                      San Francisco, USA | Berlin, Germany
                    </span>
                    <span className="inline-flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700">
                      Software Development
                    </span>
                    <span className="inline-flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700">
                      Medium (200-500 employees)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Job-All Tech Solutions is a leading software development company specializing in AI-driven solutions and
                    enterprise applications. With a global presence in San Francisco and Berlin, we are committed to innovation,
                    efficiency, and excellence...
                  </p>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => router.push("/employers/profile/company")}>
                    View Company Profile
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Team Members
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mb-2 mx-auto">
                      <Image src="/placeholder.svg?height=64&width=64" alt="Employee" width={48} height={48} />
                    </div>
                    <div className="text-sm font-medium text-gray-800 truncate">Antonio Bayagbag</div>
                    <div className="text-xs text-gray-500 truncate">HR Manager for Job-All</div>
                  </div>
                ))}
              </div>
              <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-800 mt-3 w-full"
              onClick={() => router.push("/employers/profile/company")}>
                View All Team Members
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Render ApplicationModal */}
      {isModalOpen && (
        <ApplicationModal
          jobId={"0"}
          jobTitle="UI/UX Designer"
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <QuickEditModal
        open={isQuickEditOpen}
        onClose={() => setIsQuickEditOpen(false)}
        draftData={null}
        onSuccess={() => setIsQuickEditOpen(false)}
      />
    </div>
  );
};

export default JobDetails;
