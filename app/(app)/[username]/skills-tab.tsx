"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import PublicViewCertModal from "./view-cert";
import PublicViewPortfolioModal from "./view-portfolio";

type Cert = {
  title: string;
  issuer?: string;
  issueDate?: string;
  description?: string;
  attachmentUrl?: string;
  category?: string;
};
type Expertise = { skill: string; mastery: number };
type Portfolio = {
  title: string;
  description?: string;
  link?: string;
  attachment?: File | null;
  category?: string;
  attachmentUrl?: string;
};

export default function PublicSkillsTab() {
  const [skills, setSkills] = useState<string[]>([]);
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  const [openViewCert, setOpenViewCert] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [openViewPortfolio, setOpenViewPortfolio] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  const params = useParams();
  const username = typeof params?.username === "string" ? params.username : Array.isArray(params?.username) ? params.username[0] : "";

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const res = await fetch(`/api/students/public-profile?username=${encodeURIComponent(username)}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);
      if (data.expertise && Array.isArray(data.expertise))
        setExpertise(data.expertise);
      if (data.certs && Array.isArray(data.certs)) setCerts(data.certs);
      if (data.portfolio && Array.isArray(data.portfolio))
        setPortfolio(data.portfolio);
      setLoading(false);
    };
    if (username) {
      fetchProfile();
    }
  }, [username]);

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Skills & Expertise</h2>
        <div className="space-y-8">
          {loading ? (
            <div className="space-y-8">
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-4 w-64 bg-gray-100 rounded mb-3 animate-pulse" />
                <div className="flex flex-wrap gap-2 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              </div>
              <hr className="border-gray-300 my-6" />
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-4 w-64 bg-gray-100 rounded mb-3 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 bg-gray-200 rounded-sm animate-pulse"></span>
                          <span className="h-4 w-20 bg-gray-200 rounded animate-pulse"></span>
                        </div>
                        <span className="h-3 w-8 bg-gray-200 rounded animate-pulse"></span>
                        <span className="h-4 w-4 bg-gray-200 rounded-full animate-pulse ml-2"></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2 animate-pulse"></div>
                    </div>
                  ))}
                  <div className="h-8 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
                </div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-6 shadow-sm min-h-[232px] flex flex-col animate-pulse bg-gray-100"
                    />
                  ))}
                  <div className="border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[232px] w-full" />
                  <div className="flex flex-col items-center justify-center min-h-[232px] w-full" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-medium mb-4">Skills</h3>
                <p className="text-sm text-gray-500 mb-3 -mt-2">
                  Highlight your top skills to attract employers.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm bg-blue-100 text-blue-700"
                      style={{ minHeight: 32 }}
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-sm text-gray-400 italic">
                      No skills listed.
                    </span>
                  )}
                </div>
              </div>
              <hr className="border-gray-300 my-6" />
              <div>
                <h3 className="text-lg font-medium mb-4">Expertise</h3>
                <p className="text-sm text-gray-500 mb-3 -mt-2">
                  Showcase your technical expertise and areas of proficiency.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {expertise.map((exp, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 bg-yellow-400 rounded-sm"></span>
                          <span className="font-medium text-gray-800">{exp.skill}</span>
                        </div>
                        <span className="text-xs text-blue-600 font-semibold">
                          {exp.mastery}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${exp.mastery}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {expertise.length === 0 && (
                    <span className="text-sm text-gray-400 italic">
                      No expertise listed.
                    </span>
                  )}
                </div>
              </div>
              <hr className="border-gray-300 my-6" />
              <div>
                <h3 className="text-lg font-medium mb-4">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                  {certs.slice(0, 4).map((cert, idx) => (
                    <div key={idx} className="border rounded-lg p-6 shadow-sm min-h-[232px] flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-7 h-7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 17.25l6.16 3.73-1.64-7.03L21 9.75l-7.19-.61L12 2.25l-1.81 6.89L3 9.75l5.48 4.2-1.64 7.03L12 17.25z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg text-gray-800">
                              {cert.title}
                            </h3>
                            {cert.category && (
                              <span className="ml-2 px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">
                                {cert.category}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <span>{cert.issuer}</span>
                            {cert.issueDate && (
                              <>
                                <span className="mx-2 text-gray-400">|</span>
                                <span className="text-xs text-gray-500">
                                  {cert.issueDate}
                                </span>
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
                          <a
                            href="#"
                            className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                            style={{ minHeight: 32 }}
                            onClick={e => {
                              e.preventDefault();
                              setSelectedCert(cert);
                              setOpenViewCert(true);
                            }}
                          >
                            View Certificate
                          </a>
                        ) : (
                          <span className="w-full text-xs border-blue-300 text-blue-600 bg-blue-50 rounded px-3 py-1 flex items-center justify-center" style={{ minHeight: 32 }}>
                            No Certificate
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-gray-300 my-6" />
              <div>
                <h3 className="text-lg font-medium mb-4">Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                  {portfolio.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-6 shadow-sm min-h-[232px] flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-7 h-7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 17.25l-6-6 6-6m4.5 12l6-6-6-6"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg text-gray-800">
                              {item.title}
                            </h3>
                            {item.category && (
                              <span className="ml-2 px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline truncate max-w-[120px]"
                              >
                                {item.link}
                              </a>
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
                          <>
                            <a
                              href="#"
                              className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                              style={{ minHeight: 32 }}
                              onClick={e => {
                                e.preventDefault();
                                setSelectedPortfolio(item);
                                setOpenViewPortfolio(true);
                              }}
                            >
                              View Portfolio
                            </a>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                                style={{ minHeight: 32 }}
                              >
                                Open Link
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                                style={{ minHeight: 32 }}
                              >
                                Open Link
                              </a>
                            ) : (
                              <span className="w-full text-xs border-blue-300 text-blue-600 bg-blue-50 rounded px-3 py-1 flex items-center justify-center" style={{ minHeight: 32 }}>
                                No File
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <PublicViewCertModal
                open={openViewCert}
                onClose={() => setOpenViewCert(false)}
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
                open={openViewPortfolio}
                onClose={() => setOpenViewPortfolio(false)}
                portfolio={selectedPortfolio || {
                  title: "",
                  description: "",
                  link: "",
                  attachmentUrl: "",
                  category: ""
                }}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
