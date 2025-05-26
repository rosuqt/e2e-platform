import React, { useState } from "react";
import { ArrowRight, CheckCircle, MapPin, Users, Mail, Bookmark, Briefcase, Clock, DollarSign, Calendar } from "lucide-react"; 
import { Divider as Separator } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { ApplicationModal } from "./application-modal";

const JobDetails = ({ onClose }: { onClose: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="flex items-center gap-2 text-sm bg-gray-200 px-4   py-1 rounded-full">
            <span className="text-blue-600 font-medium">5 Skills Matched</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-muted-foreground" />
            <span>23 applicants</span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            className="gap-2 rounded-full"
            onClick={() => setIsModalOpen(true)}
          >
            <Mail className="w-4 h-4" />
            <span className="text-white px-3">Apply</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 px-5"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save</span>
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

      {/* Match Percentage */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600"
              style={{ transform: "rotate(54deg)" }}
            />
            <span className="text-xl font-bold">15%</span>
          </div>
          <div className="flex-1">
            <h3 className="text-red-600 font-semibold">This Job Isn&apos;t a Strong Match</h3>
            <p className="text-xs text-muted-foreground mt-1">
              We&apos;ve checked your resume and selected skills, and unfortunately, this job isn&apos;t the best match for your
              profile. You can still apply, but the job may be seeking candidates with different qualifications.
            </p>
            <div className="mt-2 flex justify-between">
              <Button variant="link" className="p-0 h-auto text-primary">
                View Details
              </Button>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full">
                <FaWandMagicSparkles className="w-4 h-4" />
                <span>How can I make myself a stronger candidate?</span>
              </div>
            </div>
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

      {/* Job Posted By */}
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Profile picture"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Juan Ponce Dionisio</span>
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">HR Manager at FB Mark-It Place</span>
            </div>
          </div>
          <Button variant="outline" className="rounded-full text-blue-500 border-blue-500">
            Message
          </Button>
        </div>
      </div>

      <Separator />

      {/* About the Company */}
      <Card className="m-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">About the Company</h2>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="25" r="20" fill="#FF4D8D" />
                  <circle cx="25" cy="75" r="20" fill="#4D8DFF" />
                  <circle cx="75" cy="75" r="20" fill="#8DFF4D" />
                  <path d="M50,45 L35,65 L65,65 Z" fill="#8D4DFF" />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-bold">Job-All Tech Solutions</h3>
              <div className="text-sm font-medium">Software Development</div>
              <div className="text-xs text-muted-foreground mt-1">San Francisco, USA | Berlin, Germany</div>
              <div className="text-xs text-muted-foreground">Medium (200-500 employees)</div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Job-All Tech Solutions is a leading software development company specializing in AI-driven solutions and
            enterprise applications. With a global presence in San Francisco and Berlin, we are committed to innovation,
            efficiency, and excellence...
          </p>

          <div className="mt-2 text-right">
            <Button variant="link" className="p-0 h-auto text-primary">
              View company
            </Button>
          </div>
        </div>
      </Card>

      {/* Employees linked to this company */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Employees linked to this company</h2>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-2">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Employee"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">Antonio Bayagbag</div>
                    <div className="text-xs text-muted-foreground">HR Manager for Job-All</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="  text-blue-500 border-blue-500 w-full mt-3 rounded-full">
                  Follow
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
            <span className="sr-only">Next</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Render ApplicationModal */}
      {isModalOpen && (
        <ApplicationModal
          jobId={0} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default JobDetails;
