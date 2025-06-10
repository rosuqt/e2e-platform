"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MdOutlineEmojiObjects, MdContactMail } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import { TbFileSmile } from "react-icons/tb";
import { LuTrophy } from "react-icons/lu";
import { MdStarOutline } from "react-icons/md";
import { PiFiles } from "react-icons/pi";
import { Mail, Phone } from "lucide-react";
import { SiIndeed } from "react-icons/si";
import { FaFacebook, FaLinkedin, FaTwitter, FaGithub, FaGlobe, FaInstagram, FaYoutube } from "react-icons/fa6";
import { ExpertiseIcon } from "../profile/components/data/expertise-icons";
import PublicViewCertModal from "./view-cert";
import PublicViewPortfolioModal from "./view-portfolio";


const SOCIALS = {
  indeed: { label: "Indeed", icon: <SiIndeed size={28} />, color: "bg-blue-900", text: "text-white" },
  linkedin: { label: "LinkedIn", icon: <FaLinkedin size={28} />, color: "bg-blue-100", text: "text-blue-600" },
  facebook: { label: "Facebook", icon: <FaFacebook size={28} />, color: "bg-blue-600", text: "text-white" },
  twitter: { label: "Twitter", icon: <FaTwitter size={28} />, color: "bg-blue-400", text: "text-white" },
  instagram: { label: "Instagram", icon: <FaInstagram size={28} />, color: "bg-pink-400", text: "text-white" },
  github: { label: "GitHub", icon: <FaGithub size={28} />, color: "bg-gray-800", text: "text-white" },
  youtube: { label: "YouTube", icon: <FaYoutube size={28} />, color: "bg-red-500", text: "text-white" },
  website: { label: "Website", icon: <FaGlobe size={28} />, color: "bg-green-200", text: "text-green-700" }
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

type Social = { key: string; url: string };
type Education = {
  acronym?: string;
  school: string;
  degree: string;
  years: string;
  level?: string;
};
type Cert = {
  title: string;
  issuer?: string;
  issueDate?: string;
  description?: string;
  attachmentUrl?: string;
  category?: string;
};
type Portfolio = {
  title: string;
  description?: string;
  link?: string;
  attachmentUrl?: string;
  category?: string;
};
type Expertise = { skill: string; mastery: number };
type ContactInfo = {
  email?: string | string[];
  countryCode?: string;
  phone?: string | string[];
  socials?: Social[];
};
type PublicProfile = {
  first_name?: string;
  last_name?: string;
  profile_img?: string;
  cover_image?: string;
  course?: string;
  year?: string;
  section?: string;
  short_bio?: string;
  introduction?: string;
  career_goals?: string;
  educations?: Education[];
  skills?: string[];
  expertise?: Expertise[];
  certs?: Cert[];
  portfolio?: Portfolio[];
  contact_info?: ContactInfo;
};

function ProfileSkeleton() {
  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 py-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-blue-200 animate-pulse">
        <div className="h-12 bg-blue-100 rounded-t-xl" />
        <div className="p-4 space-y-4">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-blue-200 animate-pulse">
        <div className="h-12 bg-blue-100 rounded-t-xl" />
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded-full" />
            <div className="h-8 w-20 bg-gray-200 rounded-full" />
            <div className="h-8 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-blue-200 animate-pulse">
        <div className="h-12 bg-blue-100 rounded-t-xl" />
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-blue-200 animate-pulse">
        <div className="h-12 bg-blue-100 rounded-t-xl" />
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-blue-200 animate-pulse">
        <div className="h-12 bg-blue-100 rounded-t-xl" />
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="h-8 w-24 bg-gray-200 rounded-full" />
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/students/public-profile?username=${username}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data: PublicProfile = await res.json();
      setProfile(data);
      setLoading(false);
    })();
  }, [username]);

  if (loading) {
    return <ProfileSkeleton />;
  }
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="text-red-500 text-lg font-semibold">Profile not found.</div>
      </div>
    );
  }

  return (
    <>
      {/* About Info content only, no header/avatar/cover */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdOutlineEmojiObjects className="text-blue-600" size={20} />
            About Info
          </h2>
        </div>
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-medium mb-2">Introduction</h3>
            <p className="text-sm text-gray-600">{profile.introduction || <span className="italic text-gray-400">No introduction provided.</span>}</p>
          </div>
          <hr className="border-gray-200" />
          <div>
            <h3 className="font-medium mb-2">Educational Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(profile.educations || []).map((edu, idx: number) => (
                <div key={idx} className="flex gap-3 items-center">
                  <div className={`bg-blue-600 p-2 rounded-md flex items-center justify-center`} style={{ minWidth: 40, minHeight: 40 }}>
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
                </div>
              ))}
              {(!profile.educations || profile.educations.length === 0) && (
                <span className="text-sm text-gray-400 italic">No educational background provided.</span>
              )}
            </div>
          </div>
          <hr className="border-gray-200" />
          <div>
            <h3 className="font-medium mb-2">Career Goals</h3>
            <p className="text-sm text-gray-600">{profile.career_goals || <span className="italic text-gray-400">No career goals provided.</span>}</p>
          </div>
        </div>
      </div>

      {/* Skills & Expertise */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <MdOutlineEmojiObjects className="text-blue-600" size={20} />
            Skills & Expertise
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-blue-100">
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(profile.skills ?? []).slice(0, 14).map((skill: string, idx: number) => (
                  <span
                    key={skill}
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${chipColors[idx % chipColors.length].color} ${chipColors[idx % chipColors.length].textColor}`}
                    style={{ minHeight: 32 }}
                  >
                    {skill}
                  </span>
                ))}
                {(profile.skills ?? []).length === 0 && (
                  <span className="text-sm text-gray-400 italic">No skills listed.</span>
                )}
                {(profile.skills ?? []).length > 14 && (
                  <button
                    className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-transparent border-none shadow-none underline cursor-pointer"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set("tab", "1");
                      window.history.replaceState({}, "", url.toString());
                      window.dispatchEvent(new Event("popstate"));
                    }}
                    type="button"
                  >
                    {(profile.skills ?? []).length - 14} more...
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="font-medium mb-2">Expertise</h3>
              <div className="space-y-4 mb-4 mr-5">
                {(profile.expertise ?? []).slice(0, 2).map((exp, idx: number) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ExpertiseIcon name={exp.skill} />
                        <span className="font-medium text-gray-800">{exp.skill}</span>
                      </div>
                      <span className="text-xs text-blue-600 font-semibold">{exp.mastery}%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${exp.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
                {(profile.expertise ?? []).length === 0 && (
                  <span className="text-sm text-gray-400 italic">No expertise listed.</span>
                )}
                {(profile.expertise ?? []).length > 2 && (
                  <button
                    className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-transparent border-none shadow-none underline cursor-pointer"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set("tab", "1");
                      window.history.replaceState({}, "", url.toString());
                      window.dispatchEvent(new Event("popstate"));
                    }}
                    type="button"
                  >
                    {(profile.expertise ?? []).length - 2} more...
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <LuTrophy className="text-blue-600" size={20} />
            Achievements
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {(profile.certs || []).slice(0, 4).map((cert, idx: number) => (
              <div key={idx} className="border rounded-lg p-6 shadow-sm min-h-[232px] flex flex-col">
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
                  {cert.attachmentUrl ? (
                    <Button
                      size="sm"
                      className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                      variant="default"
                      style={{ minHeight: 32 }}
                      onClick={() => {
                        setSelectedCert(cert);
                        setCertModalOpen(true);
                      }}
                    >
                      View Certificate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                      variant="outline"
                      disabled
                    >
                      No Certificate
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {(profile.certs || []).length === 0 && (
              <span className="text-sm text-gray-400 italic">No achievements listed.</span>
            )}
          </div>
        </div>
      </div>
      {/* Portfolio */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <PiFiles className="text-blue-600" size={20} />
            Portfolio
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {(profile.portfolio || []).slice(0, 4).map((item, idx: number) => (
              <div key={idx} className="border rounded-lg p-6 shadow-sm min-h-[232px] flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    <TbFileSmile size={24} />
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
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-auto flex w-full justify-end gap-2">
                  {item.attachmentUrl ? (
                    <Button
                      size="sm"
                      className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                      variant="default"
                      style={{ minHeight: 32 }}
                      onClick={() => {
                        setSelectedPortfolio(item);
                        setPortfolioModalOpen(true);
                      }}
                    >
                      View Portfolio
                    </Button>
                  ) : item.link ? (
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
                      disabled
                    >
                      No File
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {(profile.portfolio || []).length === 0 && (
              <span className="text-sm text-gray-400 italic">No portfolio items listed.</span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex justify-between items-center">
            <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
              <MdContactMail className="text-blue-600" size={20} />
              Contact Information
            </h2>
          </div>
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
                    {profile.contact_info?.email
                      ? Array.isArray(profile.contact_info.email)
                        ? profile.contact_info.email.join(", ")
                        : profile.contact_info.email
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
                    {profile.contact_info?.phone
                      ? (() => {
                          const phone = profile.contact_info.phone;
                          if (Array.isArray(phone)) {
                            if (phone.length === 2 && phone[0] && phone[1]) {
                              return `+${phone[0]} ${phone[1]}`;
                            }
    
                            return phone.filter(Boolean).join(", ");
                          } else if (phone) {
                            return profile.contact_info?.countryCode
                              ? `+${profile.contact_info.countryCode} ${phone}`
                              : phone;
                          }
                          return <span className="italic text-gray-400">No phone number provided</span>;
                        })()
                      : <span className="italic text-gray-400">No phone number provided</span>
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-center justify-center">
              {profile.contact_info?.socials && profile.contact_info.socials.length > 0 ? (
                <div className="w-full flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-800 mb-1 text-center">My Socials</p>
                  <div className="flex gap-4 flex-wrap justify-center">
                    {profile.contact_info.socials.map((s) => {
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
        </div>
      </div>

      {/* Modals */}
      <PublicViewCertModal
        open={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        cert={selectedCert || {
          title: "",
          issuer: "",
          issueDate: "",
          description: "",
          attachmentUrl: "",
          category: ""
        }}
      />
      <PublicViewPortfolioModal
        open={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        portfolio={selectedPortfolio || {
          title: "",
          description: "",
          link: "",
          attachmentUrl: "",
          category: ""
        }}
      />
    </>
  );
}
