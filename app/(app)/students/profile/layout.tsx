"use client";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { TbSettings } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import { FaUser, FaStar } from "react-icons/fa";
import { Camera, Pencil } from "lucide-react";
import AboutPage from "./components/profile-page";
import SkillsPage from "./components/tabs/skills-tab";
import RatingsPage from "./components/tabs/ratings-tab";
import ActivityLogPage from "./components/tabs/activity-tab";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import ProfileCompletion from "./components/profile-completion";
import { HiRocketLaunch } from "react-icons/hi2";
import { RiProgress6Fill } from "react-icons/ri";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { MdVerified, MdOutlineVerified, MdErrorOutline } from "react-icons/md";

export default function ProfileLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState(0);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const profileCompletionRef = useRef<() => void>(null)
  const [editingBio, setEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string>("");
  const { data: session } = useSession();
  const verifyStatus = session?.user?.verifyStatus || "basic";

  function getStatusColor(status: string) {
    switch (status) {
      case "Exploring Opportunities":
        return { bg: "#FFD6D6", text: "#7A2E2E" }
      case "Actively Looking for Opportunities":
        return { bg: "#FFF2B2", text: "#7A6A1A" }
      case "Application in progress":
        return { bg: "#B2E0FF", text: "#1A4B6A" }
      case "Job landed":
        return { bg: "#C3F7C0", text: "#217A2E" }
      default:
        return { bg: "#D6C6FF", text: "#5B3A7A" }
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "Job landed":
        return <HiRocketLaunch className="inline-block mr-1 -mt-0.5" size={16} />
      case "Application in progress":
        return <RiProgress6Fill className="inline-block mr-1 -mt-0.5" size={16} />
      case "Actively Looking for Opportunities":
        return <FaMagnifyingGlass className="inline-block mr-1 -mt-0.5" size={15} />
      case "Exploring Opportunities":
        return <IoTelescope className="inline-block mr-1 -mt-0.5" size={16} />
      default:
        return null
    }
  }

  function getVerificationLabel(status: string) {
    if (status === "full") return "Fully Verified";
    if (status === "standard") return "Partially Verified";
    return "Unverified";
  }

  function getVerificationIcon(status: string) {
    if (status === "full") return <MdVerified className="text-green-500 mr-1" size={16} />;
    if (status === "standard") return <MdOutlineVerified className="text-yellow-500 mr-1" size={16} />;
    return <MdErrorOutline className="text-red-500 mr-1" size={16} />;
  }

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "Me", href: "/students/profile" },
      { icon: FiCalendar, text: "Calendar", href: "/students/calendar" },
      { icon: TbSettings, text: "Settings", href: "/students/settings" },
    ],
    []
  );

  async function getSignedUrlIfNeeded(img: string | null, bucket: string): Promise<string | null> {
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
    let ignore = false;
    (async () => {
      if (!profileImage) {
        setProfileImageUrl(null);
        return;
      }
      const url = await getSignedUrlIfNeeded(profileImage, "user.avatars");
      if (!ignore) setProfileImageUrl(url);
    })();
    return () => { ignore = true; };
  }, [profileImage]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!coverImage) {
        setCoverImageUrl(null);
        return;
      }
      const url = await getSignedUrlIfNeeded(coverImage, "user.covers");
      if (!ignore) setCoverImageUrl(url);
    })();
    return () => { ignore = true; };
  }, [coverImage]);

  useEffect(() => {
    if (pathname === "/profile") {
      setActiveTab(0);
    } else if (pathname === "/profile/skills") {
      setActiveTab(1);
    } else if (pathname === "/profile/ratings") {
      setActiveTab(2);
    } else if (pathname === "/profile/activity") {
      setActiveTab(3);
    }
  }, [pathname]);

  useEffect(() => {
    if (tabParam === "skills-tab") setActiveTab(1);
    else if (tabParam === "ratings-tab") setActiveTab(2);
    else if (tabParam === "activity-tab") setActiveTab(3);
    else if (tabParam === "verification-tab") setActiveTab(4);
    else setActiveTab(0);
  }, [tabParam]);

  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/students/get-student-details");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const details = await res.json();
      setFirstName(details.first_name || "");
      setLastName(details.last_name || "");
      setYear(details.year ? String(details.year) : "");
      setSection(details.section ? String(details.section) : "");
      setCourse(details.course ? String(details.course) : "");
      setProfileImage(
        details.profile_img ||
        "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default.png"
      );
      setCoverImage(
        details.cover_image ||
        "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default_cover.jpg"
      );
      setStudentId(details.id || null);
      setBio(details.short_bio || "");
      setLoading(false);
    })();
    (async () => {
      const res = await fetch("/api/students/applications");
      if (res.ok) {
        const data = await res.json();
        setApplicationStatus(data.applicationStatus || "");
      }
    })();
  }, []);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !studentId) return;
    setUploadingProfile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "user.avatars");
    formData.append("student_id", studentId);
    formData.append("fileType", "avatar");
    const uploadRes = await fetch("/api/students/upload-avatar", { method: "POST", body: formData });
    if (uploadRes.ok) {
      const { publicUrl } = await uploadRes.json();
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, profile_img: publicUrl }),
      });
      const signedUrl = await getSignedUrlIfNeeded(publicUrl, "user.avatars");
      setProfileImage(publicUrl);
      setProfileImageUrl(signedUrl);
      if (profileCompletionRef.current) profileCompletionRef.current()
      sessionStorage.removeItem("sidebarUserData");
      window.dispatchEvent(new Event("profilePictureUpdated"));
    }
    setUploadingProfile(false);
  };



  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !studentId) return;
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "user.covers");
    formData.append("student_id", studentId);
    formData.append("fileType", "cover");
    const uploadRes = await fetch("/api/students/upload-avatar", { method: "POST", body: formData });
    if (uploadRes.ok) {
      const { publicUrl } = await uploadRes.json();
      setCoverImage(publicUrl);
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, cover_image: publicUrl }),
      });
      if (profileCompletionRef.current) profileCompletionRef.current()
    }
    setUploadingCover(false);
  };

  const triggerProfileInput = () => {
    document.getElementById("profile-image-input")?.click();
  };

  const triggerCoverInput = () => {
    document.getElementById("cover-image-input")?.click();
  };

  const handleMuiTabChange = (_: React.SyntheticEvent, v: number) => {
    setActiveTab(v);
    let tab = "about-tab";
    if (v === 1) tab = "skills-tab";
    else if (v === 2) tab = "ratings-tab";
    else if (v === 3) tab = "activity-tab";
    else tab = "about-tab";
    router.push(`/students/profile?tab=${tab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <AboutPage />;
      case 1:
        return <SkillsPage />;
      case 2:
        return <RatingsPage />;
      case 3:
        return <ActivityLogPage />;
      case 4:
        return (
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            {getVerificationIcon(verifyStatus)}
            <span className="font-semibold text-lg">{getVerificationLabel(verifyStatus)}</span>
          </div>
        );
      default:
        return <AboutPage />;
    }
  };



  const handleBioBlur = async () => {
    if (!studentId) return;
    setSavingBio(true);
    await fetch("/api/students/student-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, short_bio: bio }),
    });
    setSavingBio(false);
    setEditingBio(false);
    if (profileCompletionRef.current) profileCompletionRef.current();
  };

  const handleBioKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && studentId) {
      e.preventDefault();
      setSavingBio(true);
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, short_bio: bio }),
      });
      setSavingBio(false);
      setEditingBio(false);
      if (bioRef.current) bioRef.current.blur();
      if (profileCompletionRef.current) profileCompletionRef.current();
    }
  };

  return (
    <BaseLayout
      sidebar={
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarMinimized(!expanded)}
          menuItems={menuItems.map((item) => ({
            ...item,
            isActive: pathname === item.href || (item.text === "Verification" && activeTab === 4),
          }))}
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      <input
        id="profile-image-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleProfileImageChange}
      />
      <input
        id="cover-image-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleCoverImageChange}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-6">
            <div className="h-40 relative">
              {loading || uploadingCover ? (
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 10 }} />
              ) : coverImageUrl ? (
                <div className="w-full h-full relative">
                  <Image
                    src={coverImageUrl}
                    alt="Cover"
                    fill
                    className="w-full h-full object-cover"
                    onError={() => {}}
                    style={{ objectFit: "cover" }}
                    sizes="100vw"
                    priority
                    unoptimized
                  />
                  {uploadingCover && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20">
                      <span className="loader" />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  style={{ height: "100%" }}
                />
              )}
              <button
                className="absolute top-4 right-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full p-2"
                onClick={triggerCoverInput}
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <div className="relative px-6 pb-6 pt-4">
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="absolute -top-16 left-6 w-32 h-32">
                  <div className="relative w-full h-full">
                    <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center overflow-hidden relative">
                      {loading || uploadingProfile ? (
                        <Skeleton variant="circular" width={128} height={128} />
                      ) : profileImageUrl ? (
                        <>
                          <Image
                            src={profileImageUrl}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover rounded-full"
                            onError={() => setProfileImage(null)}
                            style={{ objectFit: "cover" }}
                            priority
                            unoptimized
                          />
                          {uploadingProfile && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20 rounded-full">
                              <span className="loader" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl select-none">
                          {(firstName && lastName)
                            ? `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase()
                            : "SKR"}
                        </div>
                      )}
                    </div>
                    <button
                      className="absolute -top-2 -right-2 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                      title="Change profile picture"
                      onClick={triggerProfileInput}
                      disabled={uploadingProfile}
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-16 md:mt-0 md:ml-36 flex-1 flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {loading ? (
                            <Skeleton variant="text" width={180} height={36} />
                          ) : (
                            <h1 className="text-2xl font-bold">
                              {firstName
                                ? lastName
                                  ? `${firstName} ${lastName}`
                                  : firstName
                                : "Full Name"}
                            </h1>
                          )}
                           <Tooltip title="This reflects your work status and cannot be changed. It is based on your actual workflow and progress." arrow>
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-xs px-4 py-1 mt-1 rounded-full cursor-pointer flex items-center"
                            style={{
                              backgroundColor: getStatusColor(applicationStatus || "Exploring Opportunities").bg,
                              color: getStatusColor(applicationStatus || "Exploring Opportunities").text,
                              fontWeight: 500,
                            }}
                          >
                            {getStatusIcon(applicationStatus || "Exploring Opportunities")}
                            {applicationStatus || "Available to work"}
                          </motion.span>
                          </Tooltip>
                        </div>
                        {loading ? (
                          <Skeleton variant="text" width={220} height={24} />
                        ) : (
                          <>
                            <p className="text-gray-600">
                              {course || "Course not specified"}
                            </p>
                            {(year || section) ? (
                              <p className="text-gray-600">
                                {(year || section)
                                  ? `${year || "Year"}${year && section ? " | " : ""}${section || "Section"}`
                                  : "Year and Section"}
                              </p>
                            ) : (
                              <Tooltip title="You’re one of our proud alumni!" arrow>
                                <span className="text-gray-600 flex items-center gap-2">
                                  <FaStar className="text-yellow-500" size={16} />
                                  STI&apos;s Alumni
                                </span>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 relative w-full text-sm">
                      <div className="relative w-full">
                        {loading ? (
                          <Skeleton variant="text" width={180} height={28} />
                        ) : (
                          <>
                            {editingBio ? (
                              <textarea
                                ref={bioRef}
                                className="w-full bg-transparent focus:outline-none text-gray-600 resize-none px-1 py-1"
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                onBlur={handleBioBlur}
                                onKeyDown={handleBioKeyDown}
                                maxLength={50}
                                rows={1}
                                style={{ minHeight: "1.5em" }}
                                disabled={savingBio || loading}
                                autoFocus
                              />
                            ) : (
                              <span
                                className={`flex items-center cursor-pointer ${!bio ? "text-gray-400" : ""}`}
                                onClick={() => setEditingBio(true)}
                              >
                                {bio || "Add a short bio"}
                                <Pencil className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-600" />
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-72 lg:w-80 shrink-0 mt-6 md:mt-0 flex flex-col">
                    <div className="flex-1 flex flex-col justify-start">
                      <ProfileCompletion onRefetch={fn => (profileCompletionRef.current = fn)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex mt-6">
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
                    onChange={handleMuiTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="student profile tabs"
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
                      label="My Ratings"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                    <Tab
                      label="Activity Log"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                    <Tab
                      label="Verification"
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
          <div className="mb-8">{renderContent()}</div>
        </div>
      </div>
    </BaseLayout>
  );
}