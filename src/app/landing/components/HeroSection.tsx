"use client";

import { useState } from "react";
import Dropdown from "../components/Dropdown";

export default function HomePage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");

  const courseOptions: string[] = ["BSIT", "BSBA", "BSTM", "BSHM"];
  const jobOptions: { [key: string]: string[] } = {
    BSIT: [
      "Web Developer", "Software Engineer", "System Analyst", "UI/UX Designer",
      "Cybersecurity Analyst", "Data Scientist", "Cloud Engineer", "Database Administrator",
      "Mobile App Developer", "Game Developer", "IT Support Specialist", "DevOps Engineer",
      "AI/ML Engineer", "Full-Stack Developer", "Embedded Systems Engineer", "Network Administrator",
      "Blockchain Developer", "Business Intelligence Analyst", "IT Project Manager", "Penetration Tester",
      "E-commerce Developer", "VR/AR Developer", "Software QA Engineer", "Technical Writer",
      "IT Auditor", "IoT Developer", "ERP Specialist", "Robotics Programmer",
      "IT Business Analyst", "Front-End Developer"
    ],
    
    BSBA: [
      "Marketing Manager", "Financial Analyst", "HR Specialist", "Business Consultant",
      "Entrepreneur", "Sales Manager", "Operations Manager", "Investment Banker",
      "Public Relations Manager", "Logistics Manager", "Tax Consultant", "Digital Marketer",
      "Brand Strategist", "Customer Success Manager", "E-commerce Manager", "Product Manager",
      "Advertising Manager", "Real Estate Agent", "Corporate Trainer", "Retail Manager",
      "Social Media Manager", "Event Coordinator", "Procurement Manager", "Market Research Analyst",
      "Franchise Manager", "Export Manager", "Financial Planner", "Business Development Manager",
      "Risk Analyst", "Trade Specialist"
    ],
    
    BSTM: [
      "Tour Guide", "Travel Agent", "Event Planner", "Airline Customer Service Manager",
      "Resort Manager", "Cruise Ship Director", "Hospitality Consultant", "Hotel Sales Manager",
      "Travel Blogger", "Tour Operations Manager", "Destination Manager", "Cultural Tourism Coordinator",
      "Eco-Tourism Specialist", "Theme Park Manager", "Concierge Manager", "Airport Ground Staff",
      "Tourism Researcher", "Flight Attendant", "Casino Host", "Adventure Tourism Coordinator",
      "Corporate Travel Planner", "Wedding Destination Planner", "Luxury Travel Specialist",
      "Sustainable Tourism Advisor", "MICE (Meetings, Incentives, Conferences, Exhibitions) Manager",
      "Airline Sales Executive", "Travel Journalist", "Food Tourism Specialist",
      "Event Marketing Coordinator", "Travel Photographer"
    ],
    
    BSHM: [
      "Hotel Manager", "Restaurant Manager", "Chef", "Food and Beverage Director",
      "Catering Manager", "Pastry Chef", "Banquet Manager", "Hospitality Trainer",
      "Club Manager", "Resort Operations Manager", "Sommelier", "Kitchen Supervisor",
      "Guest Relations Manager", "Casino Manager", "Luxury Hospitality Consultant",
      "Bartender", "Resort Entertainment Coordinator", "Event Catering Manager",
      "Housekeeping Supervisor", "Hospitality Recruitment Specialist", "Hotel Front Desk Manager",
      "Airbnb Property Manager", "Cruise Ship Food & Beverage Manager", "Private Chef",
      "Culinary Instructor", "Sustainable Hospitality Consultant", "Wedding Catering Planner",
      "Hotel Revenue Manager", "Fine Dining Restaurant Owner", "Spa and Wellness Manager"
    ]
  };

  return (
    <div className="relative min-h-screen bg-[#ffffff] text-white">
      <div className="relative bg-[#5D4AB1] min-h-[85vh] flex flex-wrap items-center justify-center px-6 py-16 lg:px-10 lg:flex-row">
        
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
            The ultimate platform for interns to{" "}
            <span className="text-yellow-400">connect, grow, and get hired</span>
          </h2>
          <p className="mt-4 text-lg font-light text-gray-200 max-w-xl mx-auto lg:mx-0">
            Build your professional network, showcase your skills, and discover exciting internship opportunities—all in one place. Start your career journey today!
          </p>

          {/* Dropdowns & Button */}
          <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4 z-[9999] relative">
            {/* Course Dropdown */}
            <Dropdown
              label="I'm studying"
              placeholder="Type here"
              options={courseOptions}
              selected={selectedCourse}
              setSelected={setSelectedCourse}
              dropdownHeight="max-h-[130px]"
              width="w-[180px]"
            />

            {/* Job Dropdown */}
            <Dropdown
              label="I'm looking for"
              placeholder={selectedCourse ? `e.g ${jobOptions[selectedCourse]?.[0]}` : "Leave blank for all jobs"}
              options={selectedCourse ? jobOptions[selectedCourse] || [] : []}
              selected={selectedJob}
              setSelected={setSelectedJob}
              dropdownHeight="max-h-32"
              width="w-[270px]"
            />

            <button className="bg-button w-40 h-14 md:h-16 rounded-md text-lg font-semibold z-[9999]">
              Show jobs
            </button>
          </div>
        </div>

        {/* Right Content with Static Image */}
        <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <div className="w-[500px] h-[500px] bg-gray-300 rounded-full overflow-hidden mr-[-90px]">
            <img src="https://www.sti.edu/uploads/Scope_Landscape_2024.webp" alt="Hero" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute -bottom-10 left-0 w-full translate-y-[60px] z-[1]">
          <svg viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="white"
              d="M0,224C120,202,240,160,360,154.7C480,149,600,171,720,186.7C840,202,960,210,1080,197.3C1200,185,1320,139,1380,117.3L1440,96V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
