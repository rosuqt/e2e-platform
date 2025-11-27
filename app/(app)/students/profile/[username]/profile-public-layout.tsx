"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../side-nav/sidebar";
import BaseLayout from "../../../base-layout";
import { FaUser } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { TbSettings, TbBug } from "react-icons/tb";
import AboutPage from "../components/profile-page";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { HiRocketLaunch } from "react-icons/hi2";
import { RiProgress6Fill } from "react-icons/ri";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";

export default function ProfilePublicLayout({
  username,
}: {
  username: string;
}) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [year, setYear] = useState<string | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "Me", href: "/students/profile" },
      { icon: FiCalendar, text: "Calendar", href: "/students/calendar" },
      { icon: TbBug, text: "Report a bug", href: "#" },
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
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

  // Fetch profile and check ownership
  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        // Check if current user is the owner
        const meRes = await fetch("/api/students/get-student-details");
        const me = meRes.ok ? await meRes.json() : null;
        
        if (me?.username && me.username === username) {
          setIsOwner(true);
          // Redirect owner to personal profile page
          router.push('/students/profile/personal');
          return;
        }

        // Fetch public profile
        const tryPublic = await fetch(`/api/students/public-profile?username=${encodeURIComponent(username)}`);
        let res = tryPublic;
        if (!tryPublic.ok) {
          res = await fetch(`/api/students/get-student-by-username?u=${encodeURIComponent(username)}`);
        }
        if (!res.ok) {
          setFirstName("");
          setLastName("");
          setProfileImage(null);
          setCoverImage(null);
          setBio("");
          setCourse("");
          setYear(null);
          setSection(null);
          setLoading(false);
          return;
        }
        const details = await res.json();

        setFirstName(details.first_name || details.firstName || "");
        setLastName(details.last_name || details.lastName || "");
        setYear(details.year ? String(details.year) : "");
        setSection(details.section ? String(details.section) : "");
        setCourse(details.course || "");
        setProfileImage(details.profile_img || details.profile_img_url || null);
        setCoverImage(details.cover_image || details.cover_image_url || null);
        setBio(details.short_bio || details.bio || "");
      } catch (e) {
        console.error("Error loading profile:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [username, router]);

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

  const renderContent = () => {
    return <AboutPage />;
  };

  return (
    <BaseLayout
      sidebar={
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarMinimized(!expanded)}
          menuItems={menuItems.map((item) => ({
            ...item,
            isActive: false, // Simplified for public view
          }))}
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-6">
            {/* Cover Image - View Only */}
            <div className="h-40 relative">
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              ) : coverImageUrl ? (
                <div className="w-full h-full relative">
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
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400" />
              )}
            </div>

            <div className="relative px-6 pb-6 pt-4">
              <div className="flex flex-col md:flex-row md:items-end">
                {/* Profile Picture - View Only */}
                <div className="absolute -top-16 left-6 w-32 h-32">
                  <div className="relative w-full h-full">
                    <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center overflow-hidden">
                      {loading ? (
                        <Skeleton variant="circular" width={128} height={128} />
                      ) : profileImageUrl ? (
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
                          {(firstName && lastName) ? `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() : "SKR"}
                        </div>
                      )}
                    </div>
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
                              {(firstName && lastName) ? `${firstName} ${lastName}` : "Full Name"}
                            </h1>
                          )}

                          {/* Status Badge - Always shows "Available to work" for public view */}
                          <Tooltip title="This reflects the user's work status." arrow>
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.98 }}
                              className="text-xs px-4 py-1 mt-1 rounded-full cursor-pointer flex items-center"
                              style={{
                                backgroundColor: getStatusColor("Exploring Opportunities").bg,
                                color: getStatusColor("Exploring Opportunities").text,
                                fontWeight: 500,
                              }}
                            >
                              {getStatusIcon("Exploring Opportunities")}
                              {"Available to work"}
                            </motion.span>
                          </Tooltip>
                        </div>

                        {loading ? (
                          <Skeleton variant="text" width={220} height={24} />
                        ) : (
                          <>
                            <p className="text-gray-600">{course || "Course not specified"}</p>
                            <p className="text-gray-600">
                              {(year || section) ? `${year || "Year"}${year && section ? " | " : ""}${section || "Section"}` : "Year and Section"}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bio - View Only */}
                    <div className="mt-2 relative w-full text-sm">
                      {loading ? (
                        <Skeleton variant="text" width={180} height={28} />
                      ) : (
                        <span className={`flex items-center ${!bio ? "text-gray-400" : ""}`}>
                          {bio || "No bio available"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-72 lg:w-80 shrink-0 mt-6 md:mt-0 flex flex-col">
                    {/* Empty space for consistency */}
                  </div>
                </div>
              </div>

              {/* Tabs - Only "About" for public view */}
              <div className="flex mt-6">
                <div className="border-b border-gray-200 w-full">
                  <div className="flex space-x-8">
                    <button 
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${true ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      About
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">{renderContent()}</div>
        </div>
      </div>
    </BaseLayout>
  );
}