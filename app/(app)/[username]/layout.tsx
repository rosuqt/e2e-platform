"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Sidebar from "../side-nav/sidebar";
import BaseLayout from "../base-layout";
import { TbUserCheck, TbUserHeart, TbUserStar } from "react-icons/tb";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import PublicSkillsTab from "./skills-tab";
import PublicRatingsTab from "./ratings-tab";

export default function PublicProfileLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);

  const [profile, setProfile] = useState<{
    first_name?: string;
    last_name?: string;
    course?: string;
    year?: string;
    section?: string;
    short_bio?: string;
    profile_img?: string;
    cover_image?: string;
  }>({});

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const routeParams = useParams();
  let username = routeParams?.username;
  if (Array.isArray(username)) {
    username = username[0];
  }

  const pathname = usePathname();

  const menuItems = [
    { icon: TbUserStar, text: "Suggestions", href: "/students/people/suggestions" },
    { icon: TbUserHeart, text: "Connections", href: "/students/people/connections" },
    { icon: TbUserCheck, text: "Following", href: "/students/people/following" },
  ];

  async function getSignedUrlIfNeeded(img: string | null | undefined, bucket: string): Promise<string | null> {
    if (!img) return null;
    if (/^https?:\/\//.test(img)) return img;
    const res = await fetch("/api/students/get-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, path: img }),
    });
    if (!res.ok) return null;
    const { signedUrl } = await res.json();
    return signedUrl || null;
  }

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetch(`/api/students/public-profile?username=${encodeURIComponent(username)}`)
      .then(res => res.ok ? res.json() : null)
      .then(async data => {
        console.log("Fetched student details:", data); 

        if (data) {
          console.log("first_name:", data.first_name, "last_name:", data.last_name, "course:", data.course, "year:", data.year, "section:", data.section);
        }
        if (!data) {
          setProfile({
            first_name: "",
            last_name: "",
            course: "",
            year: "",
            section: "",
            short_bio: "",
            profile_img: "",
            cover_image: ""
          });
          setProfileImageUrl(null);
          setCoverImageUrl(null);
          setLoading(false);
          return;
        }
        setProfile({
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          course: data.course ?? "",
          year: data.year !== undefined && data.year !== null && data.year !== "" ? String(data.year) : "",
          section: data.section !== undefined && data.section !== null && data.section !== "" ? String(data.section) : "",
          short_bio: data.short_bio ?? "",
          profile_img: data.profile_img ?? "",
          cover_image: data.cover_image ?? ""
        });
        let avatarUrl = null;
        let coverUrl = null;
        if (data.profile_img) {
          avatarUrl = await getSignedUrlIfNeeded(data.profile_img, "user.avatars");
        }
        if (data.cover_image) {
          coverUrl = await getSignedUrlIfNeeded(data.cover_image, "user.covers");
        }
        setProfileImageUrl(avatarUrl);
        setCoverImageUrl(coverUrl);
        setLoading(false);
      })
      .catch(() => {
        setProfile({
          first_name: "",
          last_name: "",
          course: "",
          year: "",
          section: "",
          short_bio: "",
          profile_img: "",
          cover_image: ""
        });
        setProfileImageUrl(null);
        setCoverImageUrl(null);
        setLoading(false);
      });
  }, [username]);

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam && !isNaN(Number(tabParam))) {
      setActiveTab(Number(tabParam));
    }
  }, [searchParams]);

  const handleTabChange = (_: React.SyntheticEvent, v: number) => {
    setActiveTab(v);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", String(v));
    window.history.replaceState({}, "", url.toString());
  };

  useEffect(() => {
    if (isSidebarMinimized) {
      document.body.classList.add("sidebar-minimized");
    } else {
      document.body.classList.remove("sidebar-minimized");
    }

    const event = new CustomEvent("sidebarToggle", { detail: { isSidebarMinimized } });
    window.dispatchEvent(event);

    setTimeout(() => {
      const recalcEvent = new CustomEvent("forceRecalc");
      window.dispatchEvent(recalcEvent);
    }, 300);
  }, [isSidebarMinimized]);

  function LayoutSkeleton() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-6 animate-pulse">
            <div className="h-40 bg-blue-100" />
            <div className="relative px-6 pb-6 pt-4">
              <div className="absolute -top-16 left-6 w-32 h-32">
                <div className="w-full h-full rounded-full bg-gray-200 border-4 border-white" />
              </div>
              <div className="mt-16 md:mt-0 md:ml-36 flex-1 flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/4 mb-1" />
                  <div className="h-4 bg-gray-100 rounded w-1/6 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="mt-6 flex gap-4">
                    <div className="h-8 w-20 bg-gray-200 rounded-full" />
                    <div className="h-8 w-20 bg-gray-200 rounded-full" />
                    <div className="h-8 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md border border-blue-200 h-96 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <BaseLayout
        sidebar={
          <Sidebar
            onToggle={(expanded: boolean) => setIsSidebarMinimized(!expanded)}
            menuItems={menuItems.map((item) => ({
              ...item,
              isActive: pathname === item.href,
            }))}
          />
        }
        isSidebarMinimized={isSidebarMinimized}
      >
        <LayoutSkeleton />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      sidebar={
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarMinimized(!expanded)}
          menuItems={menuItems.map((item) => ({
            ...item,
            isActive: pathname === item.href,
          }))}
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-6">
            <div className="h-40 relative">
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt="Cover"
                  fill
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ height: "100%" }} />
              )}
            </div>
            <div className="relative px-6 pb-6 pt-4">
              {/* Buttons absolutely positioned at the very right inside this section */}
              <div className="hidden md:flex gap-2 absolute right-6 top-4 z-10">
                <button
                  className="flex items-center rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-blue-700 transition"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Connect
                </button>
                <button
                  className="flex items-center rounded-full border border-blue-600 text-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zm-5 4H8m8 0a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2" />
                  </svg>
                  Message
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="absolute -top-16 left-6 w-32 h-32">
                  <div className="relative w-full h-full">
                    <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center overflow-hidden relative">
                      {profileImageUrl ? (
                        <Image
                          src={profileImageUrl}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover rounded-full"
                          style={{ objectFit: "cover" }}
                          priority
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl select-none">
                          {(profile.first_name || profile.last_name)
                            ? `${(profile.first_name?.[0] || "")}${(profile.last_name?.[0] || "")}`.toUpperCase()
                            : "SKR"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-16 md:mt-0 md:ml-36 flex-1 flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 w-full relative">
                          <h1 className="text-2xl font-bold">
                            {(profile.first_name || profile.last_name)
                              ? `${profile.first_name || ""}${profile.first_name && profile.last_name ? " " : ""}${profile.last_name || ""}`
                              : "Full Name"}
                          </h1>
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-green-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer"
                          >
                            Available to work
                          </motion.span>
                          <Tooltip title="This reflects work status and cannot be changed." arrow>
                            <span className="ml-1 text-blue-500 cursor-help">🛈</span>
                          </Tooltip>
                          <div className="flex-1" />
                        </div>
                        <p className="text-gray-600">
                          {profile.course
                            ? profile.course
                            : "Course not specified"}
                        </p>
                        <p className="text-gray-600">
                          {(profile.year || profile.section)
                            ? `${profile.year || "Year"}${profile.year && profile.section ? " | " : ""}${profile.section || "Section"}`
                            : "Year and Section"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 relative w-full text-sm">
                      <div className="relative w-full">
                        <textarea
                          className="w-full bg-transparent focus:outline-none text-gray-600 resize-none px-1 py-1"
                          value={profile.short_bio || ""}
                          readOnly
                          rows={1}
                          style={{ minHeight: "1.5em" }}
                          disabled
                        />
                      </div>
                    </div>
                    {/* Tabs moved below student info, flush to the very left edge */}
                    <div className="w-full" style={{ marginLeft: '-9rem', marginTop: "1.5rem" }}>
                      <Box
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                          width: "fit-content",
                          minWidth: 0,
                        }}
                      >
                        <Tabs
                          value={activeTab}
                          onChange={handleTabChange}
                          textColor="primary"
                          indicatorColor="primary"
                          aria-label="public profile tabs"
                          variant="scrollable"
                          scrollButtons="auto"
                        >
                          <Tab
                            label="About"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 500,
                              fontSize: 14,
                              "&:hover": { color: "#2563eb" },
                            }}
                          />
                          <Tab
                            label="Skills"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 500,
                              fontSize: 14,
                              "&:hover": { color: "#2563eb" },
                            }}
                          />
                          <Tab
                            label="Ratings"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 500,
                              fontSize: 14,
                              "&:hover": { color: "#2563eb" },
                            }}
                          />
                        </Tabs>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8">
            {activeTab === 0 && children}
            {activeTab === 1 && <PublicSkillsTab />}
            {activeTab === 2 && <PublicRatingsTab />}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
