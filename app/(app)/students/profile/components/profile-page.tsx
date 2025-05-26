"use client"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MdWorkOutline, MdStarOutline, MdContactMail, MdOutlineEmojiObjects } from "react-icons/md"
import { FaFacebook, FaLinkedin, FaRegBookmark, FaTwitter, FaBookmark, FaGithub, FaGlobe, FaInstagram, FaYoutube } from "react-icons/fa6";
import { LuTrophy } from "react-icons/lu";
import { Mail, Phone } from "lucide-react"
import AddEducationalModal from "./modals/add-education";
import AddExpertiseModal from "./modals/add-expertise";
import UploadFileModal from "./modals/upload-file";
import QuickViewModal from "./modals/quick-view";
import AddCertModal from "./modals/add-cert";
import ViewCertModal from "./modals/view-cert";
import AddEditContactModal from "./modals/add-edit-contact";
import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti"
import { skillSuggestions } from "./data/skill-suggestions"
import { SiIndeed } from "react-icons/si";
import { useSession } from "next-auth/react";

export default function AboutPage() {
  const [openAddEducation, setOpenAddEducation] = useState(false);
  const [openAddExpertise, setOpenAddExpertise] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState<null | "resume" | "cover">(null);
  const [openQuickView, setOpenQuickView] = useState(false);
  const [openAddCert, setOpenAddCert] = useState(false);
  const [openViewCert, setOpenViewCert] = useState(false);
  const [openEditContact, setOpenEditContact] = useState(false);
  const [contactInfo, setContactInfo] = useState<{
    email: string;
    countryCode: string;
    phone: string;
    socials: { key: string; url: string }[];
  }>({
    email: "john.doe@techcorp.com",
    countryCode: "1",
    phone: "5551234567",
    socials: []
  });
  type Cert = {
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    attachment?: File | null;
    category?: string;
  };
  const [certs, setCerts] = useState<Cert[]>([]);
  type QuickViewJob = {
    title: string;
    company: string;
    location: string;
    salary: string;
    posted: string;
    logoUrl?: string;
    type?: string;
    vacancies?: number;
    description?: string;
    closingDate?: string;
    remote?: boolean;
    matchScore?: number;
  };
  const [quickViewJob, setQuickViewJob] = useState<QuickViewJob | null>(null);
  type Education = {
    acronym: string;
    school: string;
    degree: string;
    years: string;
    color: string;
    textColor: string;
    level?: string;
  };
  const [educations, setEducations] = useState<Education[]>([
    {
      acronym: "STI",
      school: "STI College",
      level: "College",
      degree: "BS - Information Technology",
      years: "Present",
      color: "bg-yellow-100",
      textColor: "text-blue-800"
    },

  ]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState<number>(-1);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [uploadedResume, setUploadedResume] = useState<{ name: string; url: string; uploadedAt: string } | null>(null);
  const [uploadedCover, setUploadedCover] = useState<{ name: string; url: string; uploadedAt: string } | null>(null);
  const { data: session } = useSession();

  const fetchUploads = async () => {
    const student_id =
      (session?.user as { studentId?: string })?.studentId || "student_001";
    const res = await fetch(`/api/students/student-profile/modal?student_id=${student_id}`);
    if (!res.ok) {
      setUploadedResume(null);
      setUploadedCover(null);
      return;
    }
    const data = await res.json();
    if (data?.uploaded_resume_url) {
      const name = data.uploaded_resume_url.split("/").pop() || "resume";
      setUploadedResume({
        name,
        url: `/storage/${data.uploaded_resume_url}`,
        uploadedAt: data.updated_at || ""
      });
    } else {
      setUploadedResume(null);
    }
    if (data?.uploaded_cover_letter_url) {
      const name = data.uploaded_cover_letter_url.split("/").pop() || "cover_letter";
      setUploadedCover({
        name,
        url: `/storage/${data.uploaded_cover_letter_url}`,
        uploadedAt: data.updated_at || ""
      });
    } else {
      setUploadedCover(null);
    }
  };

  useEffect(() => {
    fetchUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const getFileIcon = (filepath: string) => {
    const ext = filepath.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "/images/icon/pdf.png";
    if (ext === "doc" || ext === "docx") return "/images/icon/doc.png";
    return "/images/icon/doc.png";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const SOCIALS = {
        indeed: { label: "Indeed", icon: <SiIndeed  size={28} />, color: "bg-black", text: "text-white" },
    linkedin: { label: "LinkedIn", icon: <FaLinkedin size={28} />, color: "bg-blue-100", text: "text-blue-600" },
    facebook: { label: "Facebook", icon: <FaFacebook size={28} />, color: "bg-blue-600", text: "text-white" },
    twitter: { label: "Twitter", icon: <FaTwitter size={28} />, color: "bg-blue-400", text: "text-white" },
    instagram: { label: "Instagram", icon: <FaInstagram size={28} />, color: "bg-pink-400", text: "text-white" },
    github: { label: "GitHub", icon: <FaGithub size={28} />, color: "bg-gray-800", text: "text-white" },
    youtube: { label: "YouTube", icon: <FaYoutube size={28} />, color: "bg-red-500", text: "text-white" },
    website: { label: "Website", icon: <FaGlobe size={28} />, color: "bg-green-200", text: "text-green-700" }
  };

  const colorMap: Record<string, { color: string; textColor: string }> = {
    "#2563eb": { color: "bg-blue-600", textColor: "text-white" },
    "#22c55e": { color: "bg-green-500", textColor: "text-white" },
    "#facc15": { color: "bg-yellow-400", textColor: "text-slate-800" },
    "#f59e42": { color: "bg-orange-400", textColor: "text-white" },
    "#ef4444": { color: "bg-red-500", textColor: "text-white" },
    "#a855f7": { color: "bg-purple-500", textColor: "text-white" },
    "#64748b": { color: "bg-slate-500", textColor: "text-white" }
  };

  const handleAddEducation = (data: {
    acronym?: string;
    school: string;
    degree: string;
    years: string;
    level: string;
    iconColor?: string;
  }) => {
    const colorInfo = colorMap[data.iconColor || "#2563eb"] || colorMap["#2563eb"];
    setEducations([
      ...educations,
      {
        acronym: data.acronym || "?",
        school: data.school,
        degree: data.degree && data.degree !== "None" ? data.degree : "",
        years: data.years,
        color: colorInfo.color,
        textColor: colorInfo.textColor,
        level: data.level
      }
    ]);
    setOpenAddEducation(false);
  };

  const [expertise, setExpertise] = useState<{ skill: string; mastery: number }[]>([]);
  const handleAddExpertise = (data: { skill: string; mastery: number }) => {
    setExpertise([...expertise, data]);
    setOpenAddExpertise(false);
  };

  const handleAddCert = (cert: {
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    attachment?: File | null;
    category?: string;
  }) => {
    setCerts(prev => [...prev, cert]);
    setOpenAddCert(false);
  };

  const handleSaveContact = (data: {
    email: string;
    countryCode: string;
    phone: string;
    socials: { key: string; url: string }[];
  }) => {
    setContactInfo(data);
    setOpenEditContact(false);
  };

  const addSkill = (value: string) => {
    const skill = value.trim();
    if (
      !skill ||
      skills.includes(skill) ||
      skill.length > 20 ||
      skills.length >= 8
    ) return;
    setSkills([...skills, skill]);
    setSkillInput("");
    setShowSkillInput(false);
    setFocusedSuggestion(-1);
  };

  const handleSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setFocusedSuggestion(-1);
  };

  const filteredSuggestions = (showSkillInput || skillInput)
    ? skillSuggestions
        .map(group => ({
          category: group.category,
          skills: group.skills.filter(
            skill =>
              skill.toLowerCase().includes(skillInput.toLowerCase()) &&
              !skills.includes(skill)
          )
        }))
        .filter(group => group.skills.length > 0)
    : [];

  const flatSuggestions = filteredSuggestions.flatMap(group =>
    group.skills.map(skill => ({
      skill,
      category: group.category
    }))
  );

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatSuggestions.length > 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setFocusedSuggestion(prev =>
        e.key === "ArrowDown"
          ? Math.min(prev + 1, flatSuggestions.length - 1)
          : Math.max(prev - 1, 0)
      );
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (focusedSuggestion >= 0 && flatSuggestions[focusedSuggestion]) {
        addSkill(flatSuggestions[focusedSuggestion].skill);
      } else {
        addSkill(skillInput);
      }
    } else if (e.key === "Escape") {
      setShowSkillInput(false);
      setSkillInput("");
      setFocusedSuggestion(-1);
    }
  };

  const removeSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const chipColors = [
    { color: "bg-blue-100", textColor: "text-blue-700" },
    { color: "bg-green-100", textColor: "text-green-700" },
    { color: "bg-purple-100", textColor: "text-purple-700" },
    { color: "bg-yellow-100", textColor: "text-yellow-700" },
    { color: "bg-pink-100", textColor: "text-pink-700" },
    { color: "bg-orange-100", textColor: "text-orange-700" },
    { color: "bg-slate-100", textColor: "text-slate-700" },
    { color: "bg-red-100", textColor: "text-red-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdOutlineEmojiObjects className="text-blue-600" size={20} />
            About Info
          </h2>
          <p className="text-sm text-gray-500">Update your background and career goals to reflect your journey.</p>
        </div>
        <div className="p-4 space-y-6">
          {/* Introduction */}
          <div>
            <h3 className="font-medium mb-2">Introduction</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Write a brief introduction about yourself and your passions.</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about your passions and interests..."
             
            />
          </div>
          <hr className="border-gray-200" />

          {/* Educational Background */}
          <div>
            <h3 className="font-medium mb-2">Educational Background</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Highlight your academic achievements and institutions attended.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educations.map((edu, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <div className={`${edu.color} p-2 rounded-md`}>
                    <span className={`text-sm font-bold ${edu.textColor}`}>{edu.acronym}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{edu.school}</h4>
                    <p className="text-sm text-gray-600">{(edu.level ? edu.level : "Level") + " | " + (edu.degree || "Degree")}</p>
                    <p className="text-xs text-gray-500">{edu.years}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={() => setOpenAddEducation(true)}
              >
                Add Educational Background
              </Button>
              <AddEducationalModal
                open={openAddEducation}
                onClose={() => setOpenAddEducation(false)}
                onSave={handleAddEducation}
              />
            </div>
          </div>
          <hr className="border-gray-200" />

          {/* Career Goals */}
          <div>
            <h3 className="font-medium mb-2">Career Goals</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Define your career aspirations and what you aim to achieve.</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about your career aspirations..."
              
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
              <MdOutlineEmojiObjects className="text-blue-600" size={20} />
              Skills & Expertise
            </h2>
            <p className="text-sm text-gray-500">Showcase your skills and technical expertise to stand out.</p>
          </div>
          <div className="p-4 space-y-6">
            {/* Skills */}
            <div>
              <h3 className="font-medium mb-2">Skills</h3>
              <p className="text-sm text-gray-500 mb-3 -mt-2">Highlight your top skills to attract employers.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, idx) => (
                  <span
                    key={skill}
                    className={`relative flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${chipColors[idx % chipColors.length].color} ${chipColors[idx % chipColors.length].textColor}`}
                    style={{ minHeight: 32 }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="ml-2 absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-red-500 hover:text-red-700  focus:outline-none"
                      style={{ fontSize: 16, lineHeight: 1 }}
                      tabIndex={-1}
                    >
                      <TiDelete size={16} />
                    </button>
                  </span>
                ))}
                {skills.length < 8 && showSkillInput && (
                  <div className="relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={handleSkillInput}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type then press Enter"
                      maxLength={20}
                      autoFocus
                      className="border border-blue-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onBlur={() => { setShowSkillInput(false); setSkillInput(""); setFocusedSuggestion(-1); }}
                      style={{ minHeight: 32 }}
                    />
                    {filteredSuggestions.length > 0 && (
                      <div className="absolute left-0 z-10 mt-1 w-full bg-white border border-blue-200 rounded-lg shadow-lg max-h-56 overflow-auto">
                        {filteredSuggestions.map((group, groupIdx) => (
                          <div key={group.category}>
                            <div className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 sticky top-0 z-10">{group.category}</div>
                            {group.skills.map((skill, idx) => {
                              const flatIdx =
                                filteredSuggestions
                                  .slice(0, groupIdx)
                                  .reduce((acc, g) => acc + g.skills.length, 0) + idx;
                              return (
                                <div
                                  key={skill}
                                  className={`px-3 py-2 cursor-pointer flex items-center ${
                                    flatIdx === focusedSuggestion ? "bg-blue-100" : ""
                                  }`}
                                  onMouseDown={() => addSkill(skill)}
                                  onMouseEnter={() => setFocusedSuggestion(flatIdx)}
                                >
                                  <span>{skill}</span>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {skills.length < 8 && !showSkillInput && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-4"
                    onClick={() => {
                      setShowSkillInput(true);
                      setTimeout(() => {
                        const input = document.querySelector<HTMLInputElement>('input[placeholder="Type then press Enter"]');
                        input?.focus();
                      }, 0);
                    }}
                  >
                    + Add Skill
                  </Button>
                )}
              </div>
            </div>
            <hr className="border-gray-200" />

            {/* Expertise */}
            <div>
              <h3 className="font-medium mb-2">Expertise</h3>
              <p className="text-sm text-gray-500 mb-3 -mt-2">Showcase your technical expertise and areas of proficiency.</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm flex items-center gap-1">
                      <span className="inline-block w-3 h-3 bg-yellow-400 rounded-sm"></span>
                      JavaScript
                    </span>
                  </div>
                  <Progress value={75} className="h-2 bg-gray-200 [&>div]:bg-yellow-400" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm flex items-center gap-1">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-sm"></span>
                      HTML5
                    </span>
                  </div>
                  <Progress value={65} className="h-2 bg-gray-200 [&>div]:bg-red-500" />
                </div>
              </div>
              <div className="text-left mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => setOpenAddExpertise(true)}
                >
                  + Add Expertise
                </Button>
                <AddExpertiseModal
                  open={openAddExpertise}
                  onClose={() => setOpenAddExpertise(false)}
                  onSave={handleAddExpertise}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
              <MdOutlineEmojiObjects className="text-blue-600" size={20} />
              Uploaded Documents
            </h2>
            <p className="text-sm text-gray-500 italic">This section is not visible to the public.</p>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="font-medium mb-2">Resume</h3>
              <p className="text-sm text-gray-500 mb-3 -mt-2">Upload your latest resume to share with potential employers.</p>
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => setOpenUploadModal("resume")}
                >
                  Upload Resume
                </Button>
                {uploadedResume ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded">
                      <img
                        src={getFileIcon(uploadedResume.url)}
                        alt="icon"
                        className="w-6 h-6"
                        onError={e => {
                          (e.target as HTMLImageElement).src = "/images/icon/doc.png";
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-800">{uploadedResume.name}</div>
                      <div className="text-xs text-gray-500">{formatDate(uploadedResume.uploadedAt)}</div>
                    </div>
                    <a
                      href={uploadedResume.url}
                      download
                      className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                    >
                      Download
                    </a>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No file uploaded</span>
                )}
              </div>
            </div>
            <hr className="border-gray-200" />
            <div>
              <h3 className="font-medium mb-2">Cover Letter</h3>
              <p className="text-sm text-gray-500 mb-3 -mt-2">Upload a cover letter to personalize your job applications.</p>
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => setOpenUploadModal("cover")}
                >
                  Upload Cover Letter
                </Button>
                {uploadedCover ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-gray-200">
                      <img
                        src={getFileIcon(uploadedCover.url)}
                        alt="icon"
                        className="w-6 h-6"
                        onError={e => {
                          (e.target as HTMLImageElement).src = "/images/icon/doc.png";
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-800">{uploadedCover.name}</div>
                      <div className="text-xs text-gray-500">{formatDate(uploadedCover.uploadedAt)}</div>
                    </div>
                    <a
                      href={uploadedCover.url}
                      download
                      className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                    >
                      Download
                    </a>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No file uploaded</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdWorkOutline className="text-blue-600" size={20} />
            Job Matches for you
          </h2>
          <p className="text-xs italic text-gray-500">Explore job opportunities tailored to your profile.</p>
        </div>
        <div className="p-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center pt-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    J
                  </div>
                </div>
                <div className="px-4 pt-4 pb-4 relative">
                  <div className="text-center mb-2">
                    <h3 className="font-medium text-gray-900">Junior Software Tester</h3>
                    <p className="text-sm text-gray-500">Av-average Inc. | Manila</p>
                    <p className="text-sm text-gray-400">₱25,000 - ₱35,000 / month</p>
                  </div>
                  <div className="text-xs font-medium text-orange-500 mb-4 text-center">{43 + i}% Match for this job</div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        setQuickViewJob({
                          title: "Junior Software Tester",
                          company: "Av-average Inc.",
                          location: "Manila",
                          salary: "₱25,000 - ₱35,000 / month",
                          posted: "7 days ago",
                          logoUrl: "",
                          type: "On-the-Job Training",
                          vacancies: 5,
                          description: "Assist in software testing and quality assurance for web applications.",
                          closingDate: "March 28, 2025",
                          remote: true,
                          matchScore: 43 + i
                        });
                        setOpenQuickView(true);
                      }}
                    >
                      <MdWorkOutline className="mr-1" size={16} /> Quick View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                      onClick={() => {
                        setSavedJobs((prev) =>
                          prev.includes(i)
                            ? prev.filter((jobId) => jobId !== i)
                            : [...prev, i]
                        );
                      }}
                    >
                      {savedJobs.includes(i) ? (
                        <>
                          <FaBookmark className="mr-1" size={16} /> Saved
                        </>
                      ) : (
                        <>
                          <FaRegBookmark className="mr-1" size={16} /> Save Job
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-4">
            <Button
              variant="link"
              className="text-blue-600 hover:underline"
            >
              View More
            </Button>
          </div>
          <QuickViewModal
            open={openQuickView}
            onClose={() => setOpenQuickView(false)}
            job={quickViewJob || {
              title: "",
              company: "",
              location: "",
              salary: "",
              posted: "",
              logoUrl: "",
              type: "",
              vacancies: 0,
              description: "",
              closingDate: "",
              remote: false,
              matchScore: 0
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <LuTrophy  className="text-blue-600" size={20} />
            Achievements
          </h2>
          <p className="text-sm text-gray-500">Add your achievements to showcase your accomplishments.</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certs.map((cert, idx) => (
              <div key={idx} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow min-h-[232px] flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    <MdStarOutline size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg text-gray-800">{cert.title}</h3>
                      {cert.category && (
                        <span className="ml-2 px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">{cert.category}</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span>{cert.issuer}</span>
                      {cert.issueDate && (
                        <>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className="text-xs text-gray-500">{cert.issueDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {cert.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {cert.description}
                  </p>
                )}
                <div className="mt-auto flex w-full justify-end gap-2">
                  {cert.attachment ? (
                    <Button
                      size="sm"
                      className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                      variant="default"
                      style={{ minHeight: 32 }}
                      onClick={() => {
                        setSelectedCert(cert);
                        setOpenViewCert(true);
                      }}
                    >
                      View Certificate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                      variant="outline"
                    >
                      No Certificate
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow min-h-[232px] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    <MdStarOutline size={24} />
                  </div>
                  <h3 className="font-medium text-lg text-gray-800">Student Club Hackathon Winner</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Led a team of 5 to develop a mobile app solution for campus sustainability, earning first place among
                  20 competitors.
                </p>
                <Button
                  size="sm"
                  className={`text-xs ${i === 1 ? "bg-blue-600 text-white hover:bg-blue-700" : "border-blue-300 text-blue-600 hover:bg-blue-50"}`}
                  variant={i === 1 ? undefined : "outline"}
                >
                  {i === 1 ? "View Certificate" : "No Certificate"}
                </Button>
              </div>
            ))}
            <div
              className="border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg p-6 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer min-h-[232px]"
              onClick={() => setOpenAddCert(true)}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12  bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-sm text-blue-600 mt-2">Add Achievement</p>
              </div>
            </div>
          </div>
          <AddCertModal
            open={openAddCert}
            onClose={() => setOpenAddCert(false)}
            onSave={handleAddCert}
          />
          <ViewCertModal
            open={openViewCert}
            onClose={() => setOpenViewCert(false)}
            cert={selectedCert || {
              title: "",
              issuer: "",
              issueDate: "",
              description: "",
              attachment: null,
              category: ""
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex justify-between items-center">
            <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
              <MdContactMail className="text-blue-600" size={20} />
              Contact Information
            </h2>
          </div>
          <p className="text-sm text-gray-500">Keep your contact details up-to-date for candidates and networking.</p>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-600">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Phone</p>
                  <p className="text-sm text-gray-600">
                    +{contactInfo.countryCode} {contactInfo.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-center justify-center">
              {contactInfo.socials.length > 0 && (
                <div className="w-full flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-800 mb-1 text-center">My Socials</p>
                  <div className="flex gap-4 flex-wrap justify-center">
                    {contactInfo.socials.map(s => {
                      const soc = SOCIALS[s.key as keyof typeof SOCIALS];
                      return (
                        <a
                          key={s.key}
                          href={s.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex flex-col items-center group`}
                        >
                          <div className={`${soc.color} ${soc.text} w-12 h-12 flex items-center justify-center rounded-full`}>
                            {soc.icon}
                          </div>
                          <span className="text-xs text-gray-600 mt-1 group-hover:underline">{soc.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex mt-4">
            <Button
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => setOpenEditContact(true)}
            >
              Edit Contact Info
            </Button>
          </div>
        </div>
      </div>
      <UploadFileModal
        open={openUploadModal !== null}
        onClose={() => setOpenUploadModal(null)}
        header={openUploadModal === "resume" ? "Upload Resume" : openUploadModal === "cover" ? "Upload Cover Letter" : ""}
        desc={
          openUploadModal === "resume"
            ? "Select your latest resume file to upload."
            : openUploadModal === "cover"
            ? "Select your cover letter file to upload."
            : ""
        }
        onUpload={fetchUploads}
      />
      <AddEditContactModal
        open={openEditContact}
        onClose={() => setOpenEditContact(false)}
        onSave={handleSaveContact}
        initial={contactInfo}
      />
    </div>
  )
}
