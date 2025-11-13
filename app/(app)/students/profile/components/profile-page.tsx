/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MdWorkOutline, MdStarOutline, MdContactMail, MdOutlineEmojiObjects } from "react-icons/md"
import { FaFacebook, FaLinkedin, FaRegBookmark, FaTwitter, FaBookmark, FaGithub, FaGlobe, FaInstagram, FaYoutube } from "react-icons/fa6";
import { LuTrophy } from "react-icons/lu";
import { Mail, Pencil, Phone, Trash2 } from "lucide-react"
import AddEducationalModal from "./modals/add-education";
import AddExpertiseModal from "./modals/add-expertise";
import UploadFileModal from "./modals/upload-file";
import QuickViewModal from "./modals/quick-view";
import AddCertModal from "./modals/add-cert";
import ViewCertModal from "./modals/view-cert";
import AddEditContactModal from "./modals/add-edit-contact";
import AddPortfolioModal from "./modals/add-portfolio";
import ViewPortfolioModal from "./modals/view-portfolio";
import ExperienceSection from "./modals/experience-section";
import AddExpModal from "./modals/add-exp";
import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti"
import { skillSuggestions } from "./data/skill-suggestions"
import { SiIndeed } from "react-icons/si";
import { useSession } from "next-auth/react";
import { ExpertiseIcon } from "./data/expertise-icons"
import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa";
import { Tooltip as MuiTooltip, Tooltip } from "@mui/material"
import toast from "react-hot-toast"
import { PiFiles } from "react-icons/pi";
import { TbFileSmile } from "react-icons/tb";
import { AiSuggestionsModal } from "./modals/ai-suggestions-modal";
import JobMatchesSection from "./job-matches-section"

const colorMap: Record<string, { color: string; textColor: string }> = {
  "#2563eb": { color: "bg-blue-600", textColor: "text-white" },
  "#22c55e": { color: "bg-green-500", textColor: "text-white" },
  "#facc15": { color: "bg-yellow-400", textColor: "text-white" },
  "#f59e42": { color: "bg-orange-400", textColor: "text-white" },
  "#ef4444": { color: "bg-red-500", textColor: "text-white" },
  "#a855f7": { color: "bg-purple-500", textColor: "text-white" },
  "#64748b": { color: "bg-slate-500", textColor: "text-white" }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AboutPage() {
  const [openAddEducation, setOpenAddEducation] = useState(false);
  const [openAddExpertise, setOpenAddExpertise] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState<null | "resume" | "cover">(null);
  const [openQuickView, setOpenQuickView] = useState(false);
  const [openAddCert, setOpenAddCert] = useState(false);
  const [openViewCert, setOpenViewCert] = useState(false);
  const [openEditContact, setOpenEditContact] = useState(false);
  const [openAddPortfolio, setOpenAddPortfolio] = useState(false);
  const [openViewPortfolio, setOpenViewPortfolio] = useState(false);
  const [openAddExp, setOpenAddExp] = useState(false);
  const [contactInfo, setContactInfo] = useState<{
    email: string;
    countryCode: string;
    phone: string;
    socials: { key: string; url: string }[];
  }>({
    email: "",
    countryCode: "",
    phone: "",
    socials: []
  });
  type Cert = {
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    attachmentUrl?: string;
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
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState<number>(-1);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [uploadedResume, setUploadedResume] = useState<{ name: string; url: string; uploadedAt: string }[]>([]);
  const [uploadedCover, setUploadedCover] = useState<{ name: string; url: string; uploadedAt: string }[]>([]);
  const [introduction, setIntroduction] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingIntro, setLoadingIntro] = useState(false);
  const [loadingCareer, setLoadingCareer] = useState(false);
  const [deletingCertIdx, setDeletingCertIdx] = useState<number | null>(null);
  const [deletingSkillIdx, setDeletingSkillIdx] = useState<number | null>(null);
  const [downloadingResumeIdx, setDownloadingResumeIdx] = useState<number | null>(null);
  const [downloadingCoverIdx, setDownloadingCoverIdx] = useState<number | null>(null);
  const [renamingResumeIdx, setRenamingResumeIdx] = useState<number | null>(null);
  const [renamingCoverIdx, setRenamingCoverIdx] = useState<number | null>(null);
  const [renameResumeValue, setRenameResumeValue] = useState("");
  const [renameCoverValue, setRenameCoverValue] = useState("");
  const [savingRenameResume, setSavingRenameResume] = useState(false);
  const [savingRenameCover, setSavingRenameCover] = useState(false);
  const [editingEducationIdx, setEditingEducationIdx] = useState<number | null>(null);
  const [deletingEducationIdx, setDeletingEducationIdx] = useState<number | null>(null);
  const [expertise, setExpertise] = useState<{ skill: string; mastery: number }[]>([]);
  const [expertiseError, setExpertiseError] = useState<string | null>(null);
  const [editingExpertiseIdx, setEditingExpertiseIdx] = useState<number | null>(null);
  const [editingExpertise, setEditingExpertise] = useState<{ skill: string; mastery: number } | null>(null);
  const [editingCertIdx, setEditingCertIdx] = useState<number | null>(null);
  const [experiences, setExperiences] = useState<{
    jobTitle: string;
    company: string;
    jobType: string;
    years: string;
    iconColor: string;
  }[]>([]);
  const [deletingExpIdx, setDeletingExpIdx] = useState<number | null>(null);
  const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{
    expertise: (string | { name: string; confidence?: number })[] | undefined;
    skills: string[];
    experience: string[];
    certificates: (string | { title: string; issuer?: string; description?: string })[];
    bio: string;
    educations?: {
      level: string;
      years: string;
      degree: string;
      school: string;
      acronym: string;
    }[];
  } | null>(null);
const [showAiSuggestionsModal, setShowAiSuggestionsModal] = useState(false);

const triggerStudentEmbedding = async () => {
  const currentStudentId = (session?.user as { studentId?: string })?.studentId || "student_001";
  await fetch("/api/ai-matches/embeddings/student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: currentStudentId }),
  });
};

  type Portfolio = {
    title: string;
    description?: string;
    link?: string;
    attachment?: File | null;
    category?: string;
    attachmentUrl?: string;
  };
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [editingPortfolioIdx, setEditingPortfolioIdx] = useState<number | null>(null);
  const [deletingPortfolioIdx, setDeletingPortfolioIdx] = useState<number | null>(null);
  const [showDeleteResumeModal, setShowDeleteResumeModal] = useState(false)
  const [dontShowDeleteResumeModal, setDontShowDeleteResumeModal] = useState(false)
  const [pendingDeleteResumeIdx, setPendingDeleteResumeIdx] = useState<number | null>(null)

  const MAX_RESUMES = 3;
  const MAX_COVERS = 3;

  const handleDownload = async (type: "resume" | "cover", idx: number) => {
    let filePath = "";
    if (type === "resume" && uploadedResume.length > idx) {
      filePath = uploadedResume[idx].url.replace(/^\/storage\//, "");
      setDownloadingResumeIdx(idx);
      try {
        const res = await fetch("/api/students/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bucket: "student.documents", path: filePath }),
        });
        const data = await res.json();
        if (res.ok && data.signedUrl) {
          window.open(data.signedUrl, "_blank");
        } else {
          alert(data.error || "Resume file not found or not accessible.");
        }
      } finally {
        setDownloadingResumeIdx(null);
      }
    }
    if (type === "cover" && uploadedCover.length > idx) {
      filePath = uploadedCover[idx].url.replace(/^\/storage\//, "");
      setDownloadingCoverIdx(idx);
      try {
        const res = await fetch("/api/students/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bucket: "student.documents", path: filePath }),
        });
        const data = await res.json();
        if (res.ok && data.signedUrl) {
          window.open(data.signedUrl, "_blank");
        } else {
          alert(data.error || "Cover letter file not found or not accessible.");
        }
      } finally {
        setDownloadingCoverIdx(null);
      }
    }
  };

  const handleDeleteCert = async (idx: number) => {
    const cert = certs[idx];
    setDeletingCertIdx(idx);
    try {
      const res = await fetch("/api/students/student-profile/userActions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cert.title,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
        }),
      });
      if (res.ok) {
        setCerts(prev => prev.filter((_, i) => i !== idx));
      }
    } finally {
      setDeletingCertIdx(null);
    }
  };

  const handleDeleteResume = async (idx: number) => {
    setPendingDeleteResumeIdx(idx)
    const student_id = (session?.user as { studentId?: string })?.studentId || "student_001"
    const fileToDelete = uploadedResume[idx]
    if (!fileToDelete) return
    await fetch("/api/students/student-profile/userActions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id,
        fileType: "resume",
        fileName: fileToDelete.name,
        fileUrl: fileToDelete.url,
      }),
    })
    setPendingDeleteResumeIdx(null)
    fetchUploads()
    toast.success("Resume deleted")
  }
  const handleDeleteCover = async (idx: number) => {
    const student_id = (session?.user as { studentId?: string })?.studentId || "student_001";
    const fileToDelete = uploadedCover[idx];
    if (!fileToDelete) return;
    await fetch("/api/students/student-profile/userActions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id,
        fileType: "cover_letter",
        fileName: fileToDelete.name,
        fileUrl: fileToDelete.url,
      }),
    });

    fetchUploads();
  };

  const fetchUploads = async () => {
    const student_id =
      (session?.user as { studentId?: string })?.studentId || "student_001";
    const res = await fetch(`/api/students/student-profile/postHandlers?student_id=${student_id}`);
    if (!res.ok) {
      setUploadedResume([]);
      setUploadedCover([]);
      return;
    }
    const data = await res.json();

    let resumePaths: string[] = [];
    if (Array.isArray(data.uploaded_resume_url)) {
      resumePaths = data.uploaded_resume_url;
    } else if (typeof data.uploaded_resume_url === "string" && data.uploaded_resume_url) {
      resumePaths = [data.uploaded_resume_url];
    }
    let coverPaths: string[] = [];
    if (Array.isArray(data.uploaded_cover_letter_url)) {
      coverPaths = data.uploaded_cover_letter_url;
    } else if (typeof data.uploaded_cover_letter_url === "string" && data.uploaded_cover_letter_url) {
      coverPaths = [data.uploaded_cover_letter_url];
    }

    setUploadedResume(
      resumePaths.length
        ? resumePaths.map((path: string) => ({
            name: path.split("/").pop() || "resume",
            url: `/storage/${path}`,
            uploadedAt: data.updated_at || ""
          }))
        : []
    );
    setUploadedCover(
      coverPaths.length
        ? coverPaths.map((path: string) => ({
            name: path.split("/").pop() || "cover_letter",
            url: `/storage/${path}`,
            uploadedAt: data.updated_at || ""
          }))
        : []
    );


  };

  const fetchProfile = async () => {
  const res = await fetch("/api/students/student-profile/getHandlers");
  if (!res.ok) return;
  const data = await res.json();
  if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);
  if (data.expertise && Array.isArray(data.expertise)) setExpertise(data.expertise);
  if (data.educations && Array.isArray(data.educations)) {
    setEducations(
      data.educations.map((edu: Record<string, unknown>) => {
        const colorInfo = colorMap[String(edu.iconColor)] || colorMap["#2563eb"];
        return {
          ...edu,
          color: colorInfo.color,
          textColor: "text-white"
        };
      })
    );
  }
  if (data.certs && Array.isArray(data.certs)) setCerts(data.certs);
  if (typeof data.introduction === "string") setIntroduction(data.introduction);
  if (typeof data.career_goals === "string") setCareerGoals(data.career_goals);
  if (data.contact_info && typeof data.contact_info === "object") {
    setContactInfo({
      email: data.contact_info.email || "",
      countryCode: data.contact_info.countryCode || "",
      phone: data.contact_info.phone || "",
      socials: Array.isArray(data.contact_info.socials) ? data.contact_info.socials : []
    });
  }
  if (data.portfolio && Array.isArray(data.portfolio)) setPortfolio(data.portfolio);
  if (data.experiences && Array.isArray(data.experiences)) {
    setExperiences(data.experiences);
  }
};

useEffect(() => {
  fetchProfile();
  fetchUploads();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [session]);
 

  const saveProfileField = async (field: string, value: unknown) => {
    if (field === "introduction") setLoadingIntro(true);
    if (field === "career_goals") setLoadingCareer(true);
    await fetch("/api/students/student-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    await triggerStudentEmbedding();
    if (field === "introduction") setLoadingIntro(false);
    if (field === "career_goals") setLoadingCareer(false);
  };

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
        indeed: { label: "Indeed", icon: <SiIndeed  size={28} />, color: "bg-blue-900", text: "text-white" },
    linkedin: { label: "LinkedIn", icon: <FaLinkedin size={28} />, color: "bg-blue-100", text: "text-blue-600" },
    facebook: { label: "Facebook", icon: <FaFacebook size={28} />, color: "bg-blue-600", text: "text-white" },
    twitter: { label: "Twitter", icon: <FaTwitter size={28} />, color: "bg-blue-400", text: "text-white" },
    instagram: { label: "Instagram", icon: <FaInstagram size={28} />, color: "bg-pink-400", text: "text-white" },
    github: { label: "GitHub", icon: <FaGithub size={28} />, color: "bg-gray-800", text: "text-white" },
    youtube: { label: "YouTube", icon: <FaYoutube size={28} />, color: "bg-red-500", text: "text-white" },
    website: { label: "Website", icon: <FaGlobe size={28} />, color: "bg-green-200", text: "text-green-700" }
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
    if (editingEducationIdx !== null) {
      const newEducations = educations.map((edu, idx) =>
        idx === editingEducationIdx
          ? {
              acronym: data.acronym || "",
              school: data.school,
              degree: data.degree && data.degree !== "None" ? data.degree : "",
              years: data.years,
              color: colorInfo.color,
              textColor: colorInfo.textColor,
              level: data.level
            }
          : edu
      );
      setEducations(newEducations);
      setEditingEducationIdx(null);
      saveProfileField("educations", newEducations);
    } else {
      setEducations([
        ...educations,
        {
          acronym: data.acronym || "",
          school: data.school,
          degree: data.degree && data.degree !== "None" ? data.degree : "",
          years: data.years,
          color: colorInfo.color,
          textColor: colorInfo.textColor,
          level: data.level
        }
      ]);
      saveProfileField("educations", [
        ...educations,
        {
          acronym: data.acronym || "",
          school: data.school,
          degree: data.degree && data.degree !== "None" ? data.degree : "",
          years: data.years,
          color: colorInfo.color,
          textColor: colorInfo.textColor,
          level: data.level
        }
      ]);
    }
    setOpenAddEducation(false);
  };

  const handleEditEducation = (idx: number) => {
    setEditingEducationIdx(idx);
    setOpenAddEducation(true);
  };

const handleDeleteEducation = async (idx: number) => {
  setDeletingEducationIdx(idx);
  const student_id = (session?.user as { studentId?: string })?.studentId || "student_001";
  try {
    const res = await fetch("/api/students/student-profile/userActions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "education_delete",
        educationIdx: idx,
        student_id
      }),
    });
    if (res.ok) {
      setEducations(prev => prev.filter((_, i) => i !== idx));
    }
  } finally {
    setDeletingEducationIdx(null);
  }
};

const handleDeleteExp = async (idx: number) => {
  setDeletingExpIdx(idx);
  const student_id = (session?.user as { studentId?: string })?.studentId || "student_001";
  try {
    const res = await fetch("/api/students/student-profile/userActions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "experience_delete",
        experienceIdx: idx,
        student_id
      }),
    });
    if (res.ok) {
      setExperiences(prev => prev.filter((_, i) => i !== idx));
    }
  } finally {
    setDeletingExpIdx(null);
  }
};

  const handleAddExpertise = async (data: { skill: string; mastery: number }) => {
    if (
      expertise.some(
        (e, idx) =>
          e.skill.trim().toLowerCase() === data.skill.trim().toLowerCase() &&
          (editingExpertiseIdx === null || idx !== editingExpertiseIdx)
      )
    ) {
      setExpertiseError("Expertise already exists.");
      return;
    }
    if (editingExpertiseIdx !== null) {
      const newExpertise = expertise.map((e, idx) =>
        idx === editingExpertiseIdx ? { skill: data.skill, mastery: data.mastery } : e
      );
      setExpertise(newExpertise);
      setEditingExpertiseIdx(null);
      setEditingExpertise(null);
      const student_id = (session?.user as { studentId?: string })?.studentId;
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id,
          type: "expertise_update",
          data: newExpertise
        }),
      });
      await triggerStudentEmbedding();
    } else {
      setExpertise([data, ...expertise]);
      const student_id = (session?.user as { studentId?: string })?.studentId;
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "expertise",
          student_id,
          data
        }),
      });
      await triggerStudentEmbedding();
    }
    setExpertiseError(null);
    setOpenAddExpertise(false);
  };

  const handleEditExpertise = (idx: number) => {
    setEditingExpertiseIdx(idx);
    setEditingExpertise(expertise[idx]);
    setOpenAddExpertise(true);
  };

  const handleDeleteExpertise = async (idx: number) => {
    const exp = expertise[idx];
    setExpertise(prev => prev.filter((_, i) => i !== idx));
    const student_id = (session?.user as { studentId?: string })?.studentId;
    await fetch("/api/students/student-profile/userActions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expertiseSkill: exp.skill,
        expertiseMastery: exp.mastery,
        student_id
      }),
    });
  };

  const handleAddCert = (cert: {
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    attachment?: File | null;
    category?: string;
    attachmentUrl?: string;
  }) => {
    if (editingCertIdx !== null) {
      setCerts(prev =>
        prev.map((c, idx) => (idx === editingCertIdx ? cert : c))
      );
      setEditingCertIdx(null);
    } else {
      setCerts(prev => [...prev, cert]);
    }
    setOpenAddCert(false);
  };

  const handleAddPortfolio = (item: {
    title: string;
    description?: string;
    link?: string;
    attachment?: File | null;
    category?: string;
    attachmentUrl?: string;
  }) => {
    if (editingPortfolioIdx !== null) {
      setPortfolio(prev =>
        prev.map((c, idx) => (idx === editingPortfolioIdx ? item : c))
      );
      setEditingPortfolioIdx(null);
    } else {
      setPortfolio(prev => [...prev, item]);
    }
    setOpenAddPortfolio(false);
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

  const addSkill = async (value: string) => {
    const skill = value.trim();
    if (
      !skill ||
      skills.some(s => s.toLowerCase() === skill.toLowerCase()) ||
      skill.length > 20
    ) return;
    const newSkills = [skill, ...skills];
    setSkills(newSkills);
    setSkillInput("");
    setShowSkillInput(false);
    setFocusedSuggestion(-1);
    await saveProfileField("skills", newSkills);
    await triggerStudentEmbedding();
  };

  const removeSkill = async (idx: number) => {
    setDeletingSkillIdx(idx);
    const newSkills = skills.filter((_, i) => i !== idx);
    setSkills(newSkills);
    try {
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: newSkills }),
      });
      await triggerStudentEmbedding();
    } finally {
      setDeletingSkillIdx(null);
    }
  };

  const handleIntroductionBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIntroduction(e.target.value);
    await saveProfileField("introduction", e.target.value);
  };

  const handleCareerGoalsBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setCareerGoals(e.target.value);
    await saveProfileField("career_goals", e.target.value);
  };

  const handleIntroductionKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setLoadingIntro(true);
      await saveProfileField("introduction", introduction);
      setLoadingIntro(false);
    }
  };

  const handleCareerGoalsKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setLoadingCareer(true);
      await saveProfileField("career_goals", careerGoals);
      setLoadingCareer(false);
    }
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

  const handleRenameResume = async (idx: number) => {
    if (!uploadedResume[idx]) return;
    setSavingRenameResume(true);
    try {
      const student_id = (session?.user as { studentId?: string })?.studentId || "student_001";
      const oldName = uploadedResume[idx].name;
      const newName = renameResumeValue.trim();
      if (!newName || newName === oldName) {
        setRenamingResumeIdx(null);
        setSavingRenameResume(false);
        return;
      }
      const fileUrl = uploadedResume[idx].url;
      const payload = {
        action: "rename",
        fileType: "resume",
        student_id,
        oldName,
        newName,
        fileUrl,
      };
      console.log("[RENAME] Sending payload to API:", payload);
      const res = await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[RENAME] API response status:", res.status);
      if (res.ok) {
        await fetchUploads();
        setRenamingResumeIdx(null);
      } else {
        const err = await res.json();
        console.error("[RENAME] API error:", err);
      }
    } finally {
      setSavingRenameResume(false);
    }
  };

  const handleRenameCover = async (idx: number) => {
    if (!uploadedCover[idx]) return;
    setSavingRenameCover(true);
    try {
      const student_id = (session?.user as { studentId?: string })?.studentId || "student_001";
      const oldName = uploadedCover[idx].name;
      const newName = renameCoverValue.trim();
      if (!newName || newName === oldName) {
        setRenamingCoverIdx(null);
        setSavingRenameCover(false);
        return;
      }
      const fileUrl = uploadedCover[idx].url;
      const payload = {
        action: "rename",
        fileType: "cover_letter",
        student_id,
        oldName,
        newName,
        fileUrl,
      };
      console.log("[RENAME] Sending payload to API:", payload);
      const res = await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[RENAME] API response status:", res.status);
      if (res.ok) {
        await fetchUploads();
        setRenamingCoverIdx(null);
      } else {
        const err = await res.json();
        console.error("[RENAME] API error:", err);
      }
    } finally {
      setSavingRenameCover(false);
    }
  };

  const handleDeletePortfolio = async (idx: number) => {
    setDeletingPortfolioIdx(idx);
    const newPortfolio = portfolio.filter((_, i) => i !== idx);
    setPortfolio(newPortfolio);
    await fetch("/api/students/student-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "portfolio_update", data: newPortfolio }),
    });
    setDeletingPortfolioIdx(null);
  };

  const handleResumeUpload = async (fileOrFiles: File | File[]) => {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    for (const file of files) {
      const ocrForm = new FormData();
      ocrForm.append("file", file, file.name);
      let parsedText = "";
      try {
        const ocrRes = await fetch("/api/ai-matches/pdf-ocr", {
          method: "POST",
          body: ocrForm
        });
        const ocrData = await ocrRes.json();
        if (ocrRes.ok && ocrData.text) {
          parsedText = ocrData.text;
          console.log("[PDF OCR] Parsed resume text:", ocrData.text);
        } else {
          console.warn("[PDF OCR] Error parsing resume:", ocrData.error || ocrData);
        }
      } catch (err) {
        console.error("[PDF OCR] Exception during OCR:", err);
      }

      const uploadForm = new FormData();
      uploadForm.append("file", file, file.name);
      const student_id = (session?.user as { studentId?: string })?.studentId || "student_001";
      uploadForm.append("student_id", student_id);

      let uploadedFileUrl = "";
      try {
        const uploadRes = await fetch("/api/students/student-profile/userActions", {
          method: "POST",
          body: uploadForm
        });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (uploadRes.ok) {
          if (uploadData.uploaded_resume_url) {
            const p = Array.isArray(uploadData.uploaded_resume_url) ? uploadData.uploaded_resume_url[0] : uploadData.uploaded_resume_url;
            uploadedFileUrl = p.startsWith("/storage/") ? p : `/storage/${p}`;
          } else if (uploadData.file_url) {
            uploadedFileUrl = uploadData.file_url.startsWith("/storage/") ? uploadData.file_url : `/storage/${uploadData.file_url}`;
          } else if (uploadData.path) {
            uploadedFileUrl = `/storage/${uploadData.path}`;
          } else if (uploadData.url) {
            uploadedFileUrl = uploadData.url;
          } else {
            uploadedFileUrl = `/storage/${student_id}/resume/${file.name}`;
            console.warn("[UPLOAD] upload response did not include path; using constructed url:", uploadedFileUrl);
          }
        } else {
          console.error("[UPLOAD] Upload failed", uploadRes.status, uploadData);
        }
      } catch (err) {
        console.error("[UPLOAD] Exception during upload:", err);
      }

      try {
        const aiPayload = {
          student_id,
          file_url: uploadedFileUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || "application/pdf",
          parsed_text: parsedText
        };
        const aiRes = await fetch("/api/ai-matches/ai-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aiPayload)
        });
        if (!aiRes.ok) {
          const errBody = await aiRes.text().catch(() => "");
          console.error("[AI-RESUME] Server error:", aiRes.status, errBody);
        } else {
          console.log("[AI-RESUME] Sent parsed resume to ai-resume");
        }
      } catch (err) {
        console.error("[AI-RESUME] Exception sending parsed text:", err);
      }
    }

await fetchUploads();

await new Promise(resolve => setTimeout(resolve, 500)); 

try {
  const student_id = (session?.user as { studentId?: string })?.studentId || "student_001";
  const res = await fetch(`/api/students/student-profile/suggestions?student_id=${student_id}`);
  if (res.ok) {
    const data = await res.json();
    const suggestions = data.suggestions;
    if (
      suggestions &&
      (
        (Array.isArray(suggestions.skills) && suggestions.skills.length > 0) ||
        (Array.isArray(suggestions.experience) && suggestions.experience.length > 0) ||
        (Array.isArray(suggestions.certificates) && suggestions.certificates.length > 0) ||
        (typeof suggestions.bio === "string" && suggestions.bio.length > 0)
      )
    ) {
      setAiSuggestions(suggestions);
      setShowAiSuggestionsModal(true);
    }
  }
} catch (err) {
  console.error("[AI SUGGESTIONS] Error fetching suggestions:", err);
}
  };

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
              placeholder="Write then Press enter to save"
              value={introduction}
              onChange={e => setIntroduction(e.target.value)}
              onBlur={handleIntroductionBlur}
              onKeyDown={handleIntroductionKeyDown}
              disabled={loadingIntro}
            />
            <div className="flex items-center gap-2 mt-1">
              {loadingIntro && (
                <span className="flex items-center text-blue-600 text-xs">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Saving...
                </span>
              )}
            </div>
          </div>
          <hr className="border-gray-200" />

          {/* Educational Background */}
          <div>
            <h3 className="font-medium mb-2">Educational Background</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Highlight your academic achievements and institutions attended.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educations.map((edu, idx) => (
                <div key={idx} className="flex gap-3 items-center relative">
                  <div className={`${edu.color} p-2 rounded-md flex items-center justify-center`} style={{ minWidth: 40, minHeight: 40 }}>
                    {edu.acronym && edu.acronym.trim() !== "" ? (
                      <span className="text-sm font-bold text-white">{edu.acronym}</span>
                    ) : (
                      <FaGraduationCap size={20} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{edu.school}</h4>
                    <p className="text-sm text-gray-600">{(edu.level ? edu.level : "Level") + " | " + (edu.degree || "Degree")}</p>
                    <p className="text-xs text-gray-500">{edu.years}</p>
                  </div>
                  {!(idx === 0 && edu.school === "STI College Alabang") && (
                    <div className="flex items-center gap-1 absolute right-2 top-2">
                      <button
                        className="flex items-center justify-center text-blue-500 hover:text-blue-700"
                        title="Edit Education"
                        onClick={() => handleEditEducation(idx)}
                        style={{ marginLeft: 0 }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="flex items-center justify-center text-red-500 hover:text-red-700"
                        title="Delete Education"
                        disabled={deletingEducationIdx === idx}
                        onClick={() => handleDeleteEducation(idx)}
                        style={{ marginLeft: 8 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  {deletingEducationIdx === idx && (
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-red-500">
                      ...
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  setEditingEducationIdx(null);
                  setOpenAddEducation(true);
                }}
              >
                Add Educational Background
              </Button>
              <AddEducationalModal
                open={openAddEducation}
                onClose={() => {
                  setOpenAddEducation(false);
                  setEditingEducationIdx(null);
                }}
                onSave={handleAddEducation}
                initial={
                  editingEducationIdx !== null
                    ? {
                        school: educations[editingEducationIdx]?.school || "",
                        acronym: educations[editingEducationIdx]?.acronym || "",
                        degree: educations[editingEducationIdx]?.degree || "",
                        years: educations[editingEducationIdx]?.years || "",
                        level: educations[editingEducationIdx]?.level || "",
                        iconColor:
                          Object.entries(colorMap).find(
                            ([, v]) => v.color === educations[editingEducationIdx]?.color
                          )?.[0] || "#2563eb"
                      }
                    : undefined
                }
                editMode={editingEducationIdx !== null}
              />
            </div>
          </div>
          <hr className="border-gray-200" />

          {/* Experience Section */}
        <div className="mt-8">
          <ExperienceSection
            experiences={experiences}
            onEdit={idx => {
              setEditingExpIdx(idx);
              setOpenAddExp(true);
            }}
            onDelete={idx => handleDeleteExp(idx)}
            deletingExpIdx={deletingExpIdx}
            onAdd={() => setOpenAddExp(true)}
          />
        </div>
        <AddExpModal
          open={openAddExp}
          onClose={() => setOpenAddExp(false)}
          onSave={data => {
            setExperiences([data, ...experiences]);
            saveProfileField("experiences", [data, ...experiences]);
            setOpenAddExp(false);
          }}
          editMode={editingExpIdx !== null}
          initial={editingExpIdx !== null ? experiences[editingExpIdx] : null}
        />

          {/* Career Goals */}
          <div>
            <h3 className="font-medium mb-2">Career Goals</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Define your career aspirations and what you aim to achieve.</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write then Press enter to save"
              value={careerGoals}
              onChange={e => setCareerGoals(e.target.value)}
              onBlur={handleCareerGoalsBlur}
              onKeyDown={handleCareerGoalsKeyDown}
              disabled={loadingCareer}
            />
            <div className="flex items-center gap-2 mt-1">
              {loadingCareer && (
                <span className="flex items-center text-blue-600 text-xs">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Saving...
                </span>
              )}
            </div>
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
                <div>
                  {showSkillInput ? (
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
                        onBlur={e => {
            
                          if (e.relatedTarget == null) {
                            setShowSkillInput(false);
                            setSkillInput("");
                            setFocusedSuggestion(-1);
                          }
                        }}
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
                  ) : (
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
                {skills.slice().reverse().slice(0, 6).map((skill, idx) => (
                  <span
                    key={skill}
                    className={`relative flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${chipColors[idx % chipColors.length].color} ${chipColors[idx % chipColors.length].textColor}`}
                    style={{ minHeight: 32 }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="ml-2 absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-red-500 hover:text-red-700 focus:outline-none"
                      style={{ fontSize: 16, lineHeight: 1 }}
                      tabIndex={-1}
                      disabled={deletingSkillIdx === idx}
                    >
                      <TiDelete size={16} />
                    </button>
                    {deletingSkillIdx === idx && (
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-red-500">
                        ...
                      </span>
                    )}
                  </span>
                ))}
                {skills.length > 6 && (
                  <button
                    className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-transparent border-none shadow-none underline hover:text-blue-800"
                    style={{ minHeight: 32 }}
                    onClick={() => router.push("/students/profile?tab=skills-tab")}
                  >
                    {skills.length - 6} more...
                  </button>
                )}
              </div>
            </div>
            <hr className="border-gray-200" />

            {/* Expertise */}
            <div>
              <h3 className="font-medium mb-2">Expertise</h3>
              <p className="text-sm text-gray-500 mb-3 -mt-2">Showcase your technical expertise and areas of proficiency.</p>
              <div className="space-y-4 mb-4">
                {expertise.slice().reverse().slice(0, 3).map((exp, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ExpertiseIcon name={exp.skill} />
                        <span className="font-medium text-gray-800">{exp.skill}</span>
                      </div>
                      <span className="text-xs text-blue-600 font-semibold">{exp.mastery}%</span>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          className="flex items-center justify-center text-blue-500 hover:text-blue-700"
                          title="Edit Expertise"
                          onClick={() => handleEditExpertise(idx)}
                          style={{ marginLeft: 0 }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="flex items-center justify-center text-red-500 hover:text-red-700"
                          title="Delete Expertise"
                          onClick={() => handleDeleteExpertise(idx)}
                          style={{ marginLeft: 8 }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${exp.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
                {expertise.length > 3 && (
                  <button
                    className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-transparent border-none shadow-none underline hover:text-blue-800"
                    style={{ minHeight: 32 }}
                    onClick={() => router.push("/students/profile?tab=skills-tab")}
                  >
                    {expertise.length - 3} more...
                  </button>
                )}
              </div>
              <div className="text-left mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    setEditingExpertiseIdx(null);
                    setEditingExpertise(null);
                    setOpenAddExpertise(true);
                  }}
                >
                  + Add Expertise
                </Button>
                <AddExpertiseModal
                  open={openAddExpertise}
                  onClose={() => {
                    setOpenAddExpertise(false);
                    setExpertiseError(null);
                    setEditingExpertiseIdx(null);
                    setEditingExpertise(null);
                  }}
                  onSave={handleAddExpertise}
                  error={expertiseError}
                  initial={editingExpertise}
                  editMode={editingExpertiseIdx !== null}
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
              <h3 className="font-medium mb-2 flex items-center justify-between">
                Resume
                <Tooltip
                  title={
                    uploadedResume.length >= MAX_RESUMES
                      ? "You have reached the maximum of 3 resumes. Please delete one to upload a new file."
                      : ""
                  }
                  arrow
                  placement="top"
                >
                  <span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => setOpenUploadModal("resume")}
                      disabled={uploadedResume.length >= MAX_RESUMES}
                    >
                      Upload New
                    </Button>
                  </span>
                </Tooltip>
              </h3>
              <p className="text-sm text-gray-500 mb-3 -mt-2">Upload your latest resume to share with potential employers.</p>
              <div className="flex flex-col gap-2">
                {uploadedResume && uploadedResume.length > 0 ? (
                  uploadedResume.map((resume, idx) => (
                    <div key={resume.url} className="flex items-center gap-3 flex-1 border rounded p-2">
                      <div className="w-12 h-12 flex items-center justify-center rounded">
                        <Image
                          src={getFileIcon(resume.url)}
                          alt="icon"
                          width={40}
                          height={40}
                          className="w-10 h-10"
                          onError={() => {}}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        {renamingResumeIdx === idx ? (
                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              handleRenameResume(idx);
                            }}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={renameResumeValue}
                              onChange={e => setRenameResumeValue(e.target.value)}
                              className="border border-blue-300 rounded px-2 py-1 text-sm w-40"
                              maxLength={60}
                              autoFocus
                              disabled={savingRenameResume}
                              onBlur={() => setRenamingResumeIdx(null)}
                            />
                            <Button
                              size="sm"
                              className="px-2 py-1"
                              type="submit"
                              disabled={savingRenameResume}
                            >
                              Save
                            </Button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="text-base text-gray-800 truncate">{resume.name}</div>
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => {
                                setRenamingResumeIdx(idx);
                                setRenameResumeValue(resume.name);
                              }}
                              tabIndex={-1}
                              type="button"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">{formatDate(resume.uploadedAt)}</div>
                      </div>
                      <button
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                        onClick={e => {
                          e.preventDefault();
                          handleDownload("resume", idx);
                        }}
                        disabled={downloadingResumeIdx === idx}
                      >
                        {downloadingResumeIdx === idx ? "Downloading..." : "Download"}
                      </button>
                      <button
                        className="ml-2 flex items-center justify-center text-red-500 hover:text-red-700"
                        title="Remove Resume"
                        onClick={() => {
                          if (dontShowDeleteResumeModal) {
                            handleDeleteResume(idx)
                          } else {
                            setPendingDeleteResumeIdx(idx)
                            setShowDeleteResumeModal(true)
                          }
                        }}
                        disabled={pendingDeleteResumeIdx === idx}
                        style={{ position: "relative" }}
                      >
                        <MuiTooltip title="Delete" arrow>
                          <span>
                            {pendingDeleteResumeIdx === idx ? (
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                              </svg>
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </span>
                        </MuiTooltip>
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No file uploaded</span>
                )}
              </div>
            </div>
            <hr className="border-gray-200" />
            <div>
              <h3 className="font-medium mb-2 flex items-center justify-between">
                Cover Letter
                <Tooltip
                  title={
                    uploadedCover.length >= MAX_COVERS
                      ? "You have reached the maximum of 3 cover letters. Please delete one to upload a new file."
                      : ""
                  }
                  arrow
                  placement="top"
                >
                  <span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => setOpenUploadModal("cover")}
                      disabled={uploadedCover.length >= MAX_COVERS}
                    >
                      Upload New
                    </Button>
                  </span>
                </Tooltip>
              </h3>
              <p className="text-sm text-gray-500 mb-3 -mt-2">Upload a cover letter to personalize your job applications.</p>
              <div className="flex flex-col gap-2">
                {uploadedCover && uploadedCover.length > 0 ? (
                  uploadedCover.map((cover, idx) => (
                    <div key={cover.url} className="flex items-center gap-3 flex-1 border rounded p-2">
                      <div className="w-12 h-12 flex items-center justify-center rounded">
                        <Image
                          src={getFileIcon(cover.url)}
                          alt="icon"
                          width={40}
                          height={40}
                          className="w-10 h-10"
                          onError={() => {}}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        {renamingCoverIdx === idx ? (
                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              handleRenameCover(idx);
                            }}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={renameCoverValue}
                              onChange={e => setRenameCoverValue(e.target.value)}
                              className="border border-blue-300 rounded px-2 py-1 text-sm w-40"
                              maxLength={60}
                              autoFocus
                              disabled={savingRenameCover}
                              onBlur={() => setRenamingCoverIdx(null)}
                            />
                            <Button
                              size="sm"
                              className="px-2 py-1"
                              type="submit"
                              disabled={savingRenameCover}
                            >
                              Save
                            </Button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="text-base text-gray-800 truncate">{cover.name}</div>
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => {
                                setRenamingCoverIdx(idx);
                                setRenameCoverValue(cover.name);
                              }}
                              tabIndex={-1}
                              type="button"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">{formatDate(cover.uploadedAt)}</div>
                      </div>
                      <button
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                        onClick={e => {
                          e.preventDefault();
                          handleDownload("cover", idx);
                        }}
                        disabled={downloadingCoverIdx === idx}
                      >
                        {downloadingCoverIdx === idx ? "Downloading..." : "Download"}
                      </button>
                      <button
                        className="ml-2 flex items-center justify-center text-red-500 hover:text-red-700"
                        title="Remove Cover Letter"
                        onClick={() => handleDeleteCover(idx)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
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
            <LuTrophy  className="text-blue-600" size={20} />
            Achievements
          </h2>
          <p className="text-sm text-gray-500">Add your achievements to showcase your accomplishments.</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {certs.slice().reverse().slice(0, 4).map((cert, idx) => (
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
                  <button
                    className="ml-2 flex items-center justify-center text-blue-500 hover:text-blue-700"
                    title="Edit Certificate"
                    onClick={() => {
                      setEditingCertIdx(idx);
                      setOpenAddCert(true);
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="ml-2 flex items-center justify-center text-red-500 hover:text-red-700"
                    title="Delete Certificate"
                    disabled={deletingCertIdx === idx}
                    onClick={() => handleDeleteCert(idx)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {cert.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {cert.description}
                  </p>
                )}
                <div className="mt-auto flex w-full justify-end gap-2">
                  {cert.attachmentUrl ? (
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
                {deletingCertIdx === idx && (
                  <div className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    Deleting...
                  </div>
                )}
              </div>
            ))}
            <div className="border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer min-h-[232px] w-full"
              style={{ gridColumn: "span 1 / span 1" }}
              onClick={() => setOpenAddCert(true)}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
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
            <div className="flex flex-col items-center justify-center min-h-[232px] w-full"
              style={{ gridColumn: "span 1 / span 1" }}
            >
              <button
                type="button"
                className="flex flex-col items-center focus:outline-none"
                onClick={() => router.push("/students/profile?tab=skills-tab")}
                tabIndex={0}
                style={{ outline: "none" }}
              >
                <span className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="text-xs text-blue-700 mt-1 font-medium">View All</span>
              </button>
            </div>
          </div>
          <AddCertModal
            open={openAddCert}
            onClose={() => {
              setOpenAddCert(false);
              setEditingCertIdx(null);
            }}
            onSave={handleAddCert}
            initial={
              editingCertIdx !== null
                ? certs[editingCertIdx]
                : undefined
            }
            editMode={editingCertIdx !== null}
          />
          <ViewCertModal
            open={openViewCert}
            onClose={() => setOpenViewCert(false)}
            cert={
              selectedCert
                ? { ...selectedCert, student_id: (session?.user as { studentId?: string })?.studentId || "student_001" }
                : {
                    student_id: (session?.user as { studentId?: string })?.studentId || "student_001",
                    title: "",
                    issuer: "",
                    issueDate: "",
                    description: "",
                    attachment: null,
                    category: ""
                  }
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <PiFiles  className="text-blue-600" size={20} />
            Portfolio
          </h2>
          <p className="text-sm text-gray-500">Showcase your portfolio projects and works.</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {portfolio.slice(0, 4).map((item, idx) => (
              <div key={idx} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow min-h-[232px] flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    <TbFileSmile  size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg text-gray-800">{item.title}</h3>
                      {item.category && (
                        <span className="ml-2 px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">{item.category}</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate max-w-[120px]">{item.link}</a>
                      )}
                    </div>
                  </div>
                  <button
                    className="ml-2 flex items-center justify-center text-blue-500 hover:text-blue-700"
                    title="Edit Portfolio"
                    onClick={() => {
                      setEditingPortfolioIdx(idx);
                      setOpenAddPortfolio(true);
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                   
                    className="ml-2 flex items-center justify-center text-red-500 hover:text-red-700"
                    title="Delete Portfolio"
                    disabled={deletingPortfolioIdx === idx}
                    onClick={() => handleDeletePortfolio(idx)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-auto flex w-full justify-end gap-2">
                  {item.attachmentUrl ? (
                    <>
                      <Button
                        size="sm"
                        className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                        variant="default"
                        style={{ minHeight: 32 }}
                        onClick={() => {
                          setSelectedPortfolio(item);
                          setOpenViewPortfolio(true);
                        }}
                      >
                        View Portfolio
                      </Button>
                      {item.link && (
                        <Button
                          size="sm"
                          className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                          variant="default"
                          style={{ minHeight: 32 }}
                          onClick={e => {
                            e.stopPropagation();
                            window.open(item.link, "_blank", "noopener,noreferrer");
                          }}
                        >
                          Open Link
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {item.link ? (
                        <Button
                          size="sm"
                          className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                          variant="default"
                          style={{ minHeight: 32 }}
                          onClick={e => {
                            e.stopPropagation();
                            window.open(item.link, "_blank", "noopener,noreferrer");
                          }}
                        >
                          Open Link
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                          variant="outline"
                        >
                          No File
                        </Button>
                      )}
                    </>
                  )}
                </div>
                {deletingPortfolioIdx === idx && (
                  <div className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    ...
                  </div>
                )}
              </div>
            ))}
            <div className="border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer min-h-[232px] w-full"
              style={{ gridColumn: "span 1 / span 1" }}
              onClick={() => setOpenAddPortfolio(true)}

            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
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
                <p className="text-sm text-blue-600 mt-2">Add Portfolio</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center min-h-[232px] w-full"
              style={{ gridColumn: "span 1 / span 1" }}
            >
              <button
                type="button"
                className="flex flex-col items-center focus:outline-none"
                onClick={() => router.push("/students/profile?tab=skills-tab")}
                tabIndex={0}
                style={{ outline: "none" }}
              >
                <span className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="text-xs text-blue-700 mt-1 font-medium">View All</span>
              </button>
            </div>
          </div>
          <AddPortfolioModal
            open={openAddPortfolio}
            onClose={() => {
              setOpenAddPortfolio(false);
              setEditingPortfolioIdx(null);
            }}
            onSave={handleAddPortfolio}
            initial={
              editingPortfolioIdx !== null
                ? portfolio[editingPortfolioIdx]
                : undefined
            }
            editMode={editingPortfolioIdx !== null}
          />
          <ViewPortfolioModal
            open={openViewPortfolio}
            onClose={() => setOpenViewPortfolio(false)}
            portfolio={
              selectedPortfolio
                ? { ...selectedPortfolio, student_id: (session?.user as { studentId?: string })?.studentId || "student_001" }
                : {
                    student_id: (session?.user as { studentId?: string })?.studentId || "student_001",
                    title: "",
                    description: "",
                    link: "",
                    attachment: null,
                    category: ""
                  }
            }
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
                  <p className="text-sm text-gray-600">
                    {contactInfo.email
                      ? contactInfo.email
                      : <span className="italic text-gray-400">No email provided</span>
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Phone</p>
                  <p className="text-sm text-gray-600">
                    {contactInfo.countryCode && contactInfo.phone
                      ? `+${contactInfo.countryCode} ${contactInfo.phone}`
                      : <span className="italic text-gray-400">No phone number provided</span>
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-center justify-center">
              {contactInfo.socials.length > 0 ? (
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
              ) : (
                <div className="w-full flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-800 mb-1 text-center">My Socials</p>
                  <span className="italic text-gray-400 text-sm">No socials added</span>
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

      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdWorkOutline className="text-blue-600" size={20} />
            Job Matches for you
          </h2>
          <p className="text-xs italic text-gray-500">Explore job opportunities tailored to your profile.</p>
        </div>
        <div className="p-4 relative">
          <JobMatchesSection />
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
        onUpload={openUploadModal === "resume"
          ? handleResumeUpload
          : fetchUploads
        }
        uploadedFiles={
          openUploadModal === "resume"
            ? uploadedResume.map(f => f.url)
            : openUploadModal === "cover"
            ? uploadedCover.map(f => f.url)
            : []
        }
      />
      <AddEditContactModal
        open={openEditContact}
        onClose={() => setOpenEditContact(false)}
        onSave={handleSaveContact}
        initial={contactInfo}
      />
      {showDeleteResumeModal && pendingDeleteResumeIdx !== null && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div className="mb-4 text-center">
        <div className="text-lg font-semibold mb-2">Are you sure you want to delete this resume?</div>
        <div className="text-sm text-gray-500 mb-2">This action cannot be undone.</div>
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="dontShowDeleteResumeModal"
          checked={dontShowDeleteResumeModal}
          onChange={e => setDontShowDeleteResumeModal(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="dontShowDeleteResumeModal" className="text-xs text-gray-600">Don&apos;t show again</label>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-red-600 text-white hover:bg-red-700"
          onClick={() => {
            setShowDeleteResumeModal(false)
            handleDeleteResume(pendingDeleteResumeIdx)
          }}
        >
          Delete
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={() => {
            setShowDeleteResumeModal(false)
            setPendingDeleteResumeIdx(null)
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
  
)}

{showAiSuggestionsModal && aiSuggestions && (
  <AiSuggestionsModal
  open={showAiSuggestionsModal}
  onClose={() => setShowAiSuggestionsModal(false)}
  onSuggestionsAdded={fetchProfile}
  skills={aiSuggestions.skills}
  expertise={
    Array.isArray(aiSuggestions.expertise)
      ? aiSuggestions.expertise.map(e =>
          typeof e === "string"
            ? e
            : e.name || ""
        )
      : []
  }
 experience={
    Array.isArray(aiSuggestions.experience)
      ? aiSuggestions.experience.map(exp =>
          typeof exp === "string"
            ? { jobTitle: exp, company: "", years: "", iconColor: "#2563eb" }
            : exp
        )
      : []
  }
  certificates={
    Array.isArray(aiSuggestions.certificates)
      ? aiSuggestions.certificates.map(c =>
          typeof c === "string"
            ? { title: c }
            : {
                title: c.title || "",
                issuer: c.issuer || "",
                description: c.description || ""
              }
        )
      : []
  }
  bio={aiSuggestions.bio}
  educations={aiSuggestions.educations}
/>
)}

    </div>
  )
}