//this is only a placeholder. Replace this with the actual job list database

interface Job {
    title: string;
    company: string;
    location: string;
    description: string;
    detail: string;
    jobtype: string;
    salaryrange: string;
  }
  
  interface JobList {
    onSelectJob: (job: Job) => void;
  }
  export default function JobList({ onSelectJob }: JobList) { 
        const jobs = [
          {
            title: "Web Development Intern",
            company: "CloudConsole",
            location: "Makati",
            description: "Assist with optimizing website performance, including improving loading times and responsiveness.",
            detail: "You will work closely with our development team to enhance website functionality, ensuring smooth user experience across all devices.",
            jobtype: "Internship",
            salaryrange: "PHP 10,000 - PHP 15,000",
          },
          {
            title: "Software Engineer Intern",
            company: "TechCorp",
            location: "Quezon City",
            description: "Develop and test software solutions to improve system performance.",
            detail: "Interns will gain hands-on experience in software development, debugging, and collaborating with senior engineers on live projects.",
            jobtype: "Internship",
            salaryrange: "PHP 12,000 - PHP 18,000",
          },
          {
            title: "Marketing Assistant Intern",
            company: "Marketify",
            location: "Makati",
            description: "Assist in marketing campaigns and social media management.",
            detail: "You will be involved in content creation, digital marketing strategies, and analyzing campaign performance.",
            jobtype: "OJT",
            salaryrange: "PHP 8,000 - PHP 12,000",
          },
          {
            title: "Electrical Engineering Intern",
            company: "PowerGrid Inc.",
            location: "Pasig",
            description: "Work on electrical projects and assist in maintenance tasks.",
            detail: "You will assist in designing, testing, and maintaining electrical systems while ensuring compliance with safety standards.",
            jobtype: "OJT",
            salaryrange: "PHP 10,000 - PHP 15,000",
          },
          {
            title: "HR Assistant Intern",
            company: "PeopleFirst",
            location: "Taguig",
            description: "Support HR operations and manage employee records.",
            detail: "You will assist in recruitment, onboarding, and employee engagement activities, gaining exposure to HR best practices.",
            jobtype: "Internship",
            salaryrange: "PHP 8,000 - PHP 12,000",
          },
        ];
      
        return (
          <div>
            {jobs.map((job, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-white shadow-md rounded-lg cursor-pointer"
                onClick={() => onSelectJob(job)}
              >
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-gray-600">{job.company} • {job.location}</p>
              </div>
            ))}
          </div>
        );
      }
      