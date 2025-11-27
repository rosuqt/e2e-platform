"use client";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { TbSettings, TbBug } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { Camera, Pencil } from "lucide-react";
import AboutPage from "./components/profile-page";
import SkillsPage from "./components/tabs/skills-tab";
import RatingsPage from "./components/tabs/ratings-tab";
import ActivityLogPage from "./components/tabs/activity-tab";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import ProfileCompletion from "./components/profile-completion";
import { HiRocketLaunch } from "react-icons/hi2";
import { RiProgress6Fill } from "react-icons/ri";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";

interface ProfileLayoutProps {
  username: string;
}

export default function Page() {
  const username = null; // personal profile has no username param
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState(0);

  // profile data shown on the page (can be owner's or other's)
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string>("");

  // UI & behaviour states
  const [loading, setLoading] = useState(true);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const profileCompletionRef = useRef<() => void>(null);
  const [editingBio, setEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  // owner detection
  
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [viewingProfileUsername, setViewingProfileUsername] = useState<string | null>(username || null);
  const isOwner = Boolean(loggedInUsername && viewingProfileUsername && loggedInUsername === viewingProfileUsername);

  function getStatusColor(status: string) {
    switch (status) {
      case "Exploring Opportunities":
        return { bg: "#FFD6D6", text: "#7A2E2E" };
      case "Actively Looking for Opportunities":
        return { bg: "#FFF2B2", text: "#7A6A1A" };
      case "Application in progress":
        return { bg: "#B2E0FF", text: "#1A4B6A" };
      case "Job landed":
        return { bg: "#C3F7C0", text: "#217A2E" };
      default:
        return { bg: "#D6C6FF", text: "#5B3A7A" };
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "Job landed":
        return <HiRocketLaunch className="inline-block mr-1 -mt-0.5" size={16} />;
      case "Application in progress":
        return <RiProgress6Fill className="inline-block mr-1 -mt-0.5" size={16} />;
      case "Actively Looking for Opportunities":
        return <FaMagnifyingGlass className="inline-block mr-1 -mt-0.5" size={15} />;
      case "Exploring Opportunities":
        return <IoTelescope className="inline-block mr-1 -mt-0.5" size={16} />;
      default:
        return null;
    }
  }

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "Me", href: "/students/profile" },
      { icon: FiCalendar, text: "Calendar", href: "/students/calendar" },
      { icon: TbBug, text: "Report a bug", href: "#" },
      { icon: TbSettings, text: "Settings", href: "/students/settings" },
    ],
    []
  );

  const presetCovers = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    "https://plus.unsplash.com/premium_photo-1667680403630-014f531d9664?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  async function getSignedUrlIfNeeded(img: string | null, bucket: string): Promise<string | null> {
    if (!img) return null;
    if (/^https?:\/\//.test(img)) return img;
    try {
      const res = await fetch("/api/students/get-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket, path: img }),
      });
      if (!res.ok) return null;
      const { signedUrl } = await res.json();
      return signedUrl || null;
    } catch (e) {
      return null;
    }
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
    return () => {
      ignore = true;
    };
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
    return () => {
      ignore = true;
    };
  }, [coverImage]);

  // sync active tab with pathname/tab param
  useEffect(() => {
    if (!username) return;
    if (pathname === "/profile") setActiveTab(0);
    else if (pathname === "/profile/skills-tab") setActiveTab(1);
    else if (pathname === "/profile/ratings-tab") setActiveTab(2);
    else if (pathname === "/profile/activity-tab") setActiveTab(3);
  }, [pathname, username]);

  useEffect(() => {
    if (tabParam === "skills-tab") setActiveTab(1);
    else if (tabParam === "ratings-tab") setActiveTab(2);
    else if (tabParam === "activity-tab") setActiveTab(3);
    else setActiveTab(0);
  }, [tabParam]);

  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

  // LOAD: who is logged in, and then load profile data for `username`
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        // 1) get current session user details (to know loggedInUsername)
        const meRes = await fetch("/api/students/get-student-details");
        const me = meRes.ok ? await meRes.json() : null;
        if (!ignore) setLoggedInUsername(me?.username || null);

        // 2) fetch the profile we want to view (by username param)
        // if no username passed, fallback to current user
        const targetUsername = username || me?.username;
        setViewingProfileUsername(targetUsername || null);

        let profileData = null;
        if (targetUsername && me?.username && targetUsername !== me.username) {
          // viewing someone else's profile; fetch by username
          const profileRes = await fetch(`/api/students/get-student-by-username?username=${encodeURIComponent(targetUsername)}`);
          if (profileRes.ok) profileData = await profileRes.json();
        } else {
          // viewing own profile (or no username) — use me
          profileData = me;
        }

        if (!profileData) {
          // if profile not found, keep showing nothing but stop loading
          setLoading(false);
          return;
        }

        if (!ignore) {
          setFirstName(profileData.first_name || "");
          setLastName(profileData.last_name || "");
          setYear(profileData.year ? String(profileData.year) : "");
          setSection(profileData.section ? String(profileData.section) : "");
          setCourse(profileData.course ? String(profileData.course) : "");
          setProfileImage(profileData.profile_img || null);
          setCoverImage(profileData.cover_image || null);
          setStudentId(profileData.id || null);
          setBio(profileData.short_bio || "");
        }

        // load application status (only used for badge)
        const appRes = await fetch("/api/students/applications");
        if (appRes.ok) {
          const data = await appRes.json();
          if (!ignore) setApplicationStatus(data.applicationStatus || "");
        }
      } catch (e) {
        // ignore errors for now
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [username]);

  // BLOCK helpers — used at start of handlers
  const blockIfNotOwner = () => {
    if (!isOwner) {
      // optionally show a toast/snackbar in the future
      console.warn("Attempted edit on view-only profile");
      return true;
    }
    return false;
  };

  // handlers (most preserve logic but early-return for non-owners)
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (blockIfNotOwner()) return;
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
      if (profileCompletionRef.current) profileCompletionRef.current();
      sessionStorage.removeItem("sidebarUserData");
      window.dispatchEvent(new Event("profilePictureUpdated"));
    }
    setUploadingProfile(false);
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (blockIfNotOwner()) return;
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
      if (profileCompletionRef.current) profileCompletionRef.current();
    }
    setUploadingCover(false);
  };

  const handlePresetCover = async (url: string) => {
    if (blockIfNotOwner()) return;
    setCoverImage(url);
    if (studentId) {
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, cover_image: url }),
      });
      if (profileCompletionRef.current) profileCompletionRef.current();
    }
    setCoverDialogOpen(false);
  };

  const closeCoverDialog = () => setCoverDialogOpen(false);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);

  const triggerProfileInput = () => {
    if (blockIfNotOwner()) return;
    document.getElementById("profile-image-input")?.click();
  };

  const triggerCoverInput = () => {
    if (blockIfNotOwner()) return;
    document.getElementById("cover-image-input")?.click();
  };

const handleMuiTabChange = (_: React.SyntheticEvent, v: number) => {
  setActiveTab(v);

  let tab = "about-tab";
  if (v === 1) tab = "skills-tab";
  else if (v === 2) tab = "ratings-tab";
  else if (v === 3) tab = "activity-tab";

  // Always the same route — cleaner and no more bugs
  router.push(`/students/profile/?tab=${tab}`);
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
      default:
        return <AboutPage />;
    }
  };

  const [coverMenuAnchor, setCoverMenuAnchor] = useState<null | HTMLElement>(null);
  const openCoverMenu = (e: React.MouseEvent<HTMLButtonElement>) => setCoverMenuAnchor(e.currentTarget);
  const closeCoverMenu = () => setCoverMenuAnchor(null);
  const handleCoverMenuUpload = () => {
    closeCoverMenu();
    triggerCoverInput();
  };
  const handleCoverMenuPreset = () => {
    closeCoverMenu();
    setCoverDialogOpen(true);
  };

  const handleBioBlur = async () => {
    if (blockIfNotOwner()) {
      setEditingBio(false);
      return;
    }
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
    if (blockIfNotOwner()) return;
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
            isActive: pathname === item.href,
          }))}
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      {/* file inputs only active for owner */}
      {isOwner && (
        <>
          <input id="profile-image-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleProfileImageChange} />
          <input id="cover-image-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverImageChange} />
        </>
      )}

      <Menu anchorEl={coverMenuAnchor} open={Boolean(coverMenuAnchor)} onClose={closeCoverMenu}>
        {isOwner && <MenuItem onClick={handleCoverMenuUpload}>Upload from device</MenuItem>}
        {isOwner && <MenuItem onClick={handleCoverMenuPreset}>Select preset</MenuItem>}
      </Menu>

      <Dialog open={coverDialogOpen} onClose={() => setCoverDialogOpen(false)}>
        <DialogTitle>Choose a preset cover</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {presetCovers.map((url, i) => (
                <Image
                  key={i}
                  src={url}
                  alt={`Preset ${i + 1}`}
                  width={96}
                  height={64}
                  className={`w-24 h-16 object-cover rounded cursor-pointer border-2 border-transparent ${isOwner ? 'hover:border-blue-500' : ''}`}
                  onClick={() => isOwner && handlePresetCover(url)}
                  style={{ objectFit: "cover" }}
                />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCoverDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

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
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ height: "100%" }} />
              )}

              {/* cover edit button only for owner */}
              {isOwner && (
                <button className="absolute top-4 right-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full p-2" onClick={openCoverMenu}>
                  <Camera className="h-5 w-5" />
                </button>
              )}
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
                          {(firstName && lastName) ? `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() : "SKR"}
                        </div>
                      )}
                    </div>

                    {/* profile image edit control only for owner */}
                    {isOwner && (
                      <button className="absolute -top-2 -right-2 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow" title="Change profile picture" onClick={triggerProfileInput} disabled={uploadingProfile}>
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
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
                            <h1 className="text-2xl font-bold">{(firstName && lastName) ? `${firstName} ${lastName}` : "Full Name"}</h1>
                          )}

                          <Tooltip title="This reflects your work status and cannot be changed. It is based on your actual workflow and progress." arrow>
                            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.98 }} className="text-xs px-4 py-1 mt-1 rounded-full cursor-pointer flex items-center" style={{ backgroundColor: getStatusColor(applicationStatus || "Exploring Opportunities").bg, color: getStatusColor(applicationStatus || "Exploring Opportunities").text, fontWeight: 500 }}>
                              {getStatusIcon(applicationStatus || "Exploring Opportunities")}
                              {applicationStatus || "Available to work"}
                            </motion.span>
                          </Tooltip>
                        </div>

                        {loading ? (
                          <Skeleton variant="text" width={220} height={24} />
                        ) : (
                          <>
                            <p className="text-gray-600">{course || "Course not specified"}</p>
                            <p className="text-gray-600">{(year || section) ? `${year || "Year"}${year && section ? " | " : ""}${section || "Section"}` : "Year and Section"}</p>
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
                              <textarea ref={bioRef} className="w-full bg-transparent focus:outline-none text-gray-600 resize-none px-1 py-1" value={bio} onChange={(e) => setBio(e.target.value)} onBlur={handleBioBlur} onKeyDown={handleBioKeyDown} maxLength={50} rows={1} style={{ minHeight: "1.5em" }} disabled={savingBio || loading || !isOwner} autoFocus />
                            ) : (
                              <span className={`flex items-center ${!isOwner ? 'cursor-default' : 'cursor-pointer'} ${!bio ? "text-gray-400" : ""}"`} onClick={() => isOwner && setEditingBio(true)}>
                                {bio || "Add a short bio"}
                                {isOwner && <Pencil className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-600" />}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-72 lg:w-80 shrink-0 mt-6 md:mt-0 flex flex-col">
                    <div className="flex-1 flex flex-col justify-start">
                      <ProfileCompletion onRefetch={(fn) => (profileCompletionRef.current = fn)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex mt-6">
                <Box sx={{ borderBottom: 1, borderColor: "divider", width: "fit-content", minWidth: 0 }}>
                  <Tabs value={activeTab} onChange={handleMuiTabChange} textColor="primary" indicatorColor="primary" aria-label="student profile tabs" variant="scrollable" scrollButtons="auto">
                    <Tab label="About" sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: 14, "&:hover": { color: "#2563eb" } }} />
                    <Tab label="Skills" sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: 14, "&:hover": { color: "#2563eb" } }} />
                    <Tab label="My Ratings" sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: 14, "&:hover": { color: "#2563eb" } }} />
                    <Tab label="Activity Log" sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: 14, "&:hover": { color: "#2563eb" } }} />
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
