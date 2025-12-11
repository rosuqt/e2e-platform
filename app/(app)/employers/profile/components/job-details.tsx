import React, { useState } from "react";
import { ArrowRight, CheckCircle, Users, Briefcase, Clock, DollarSign, Calendar } from "lucide-react"; 
import { Divider as Separator } from "@mui/material";
import { Button } from "@/components/ui/button";
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
          {/* Removed logo */}
          {/* <div className="bg-black rounded-full w-14 h-14 flex items-center justify-center text-white">
            <span className="font-bold text-sm">Mark-It</span>
          </div> */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">UI/UX Designer</h1>
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            {/* Removed Fb Mark-It Place */}
            {/* <div className="text-muted-foreground">Fb Mark-It Place</div> */}
            {/* Removed address */}
            {/* <div className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>9/686 Jumper Road, Fernway Drive, San Jose Del Monte Malancat, Pampanga, NCR</span>
            </div> */}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          {/* Removed Active badge and applicants count */}
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

      {/* Render ApplicationModal */}
      {isModalOpen && (
        <ApplicationModal
          jobId={"0"}
          jobTitle="UI/UX Designer"
          onClose={() => setIsModalOpen(false)} gpt_score={0}        />
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
