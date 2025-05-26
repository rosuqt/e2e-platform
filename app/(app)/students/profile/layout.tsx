"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { TbSettings, TbBug } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Camera, LogOut } from "lucide-react";
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

export default function ProfileLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [coverMenuAnchor, setCoverMenuAnchor] = useState<null | HTMLElement>(null);

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "Me", href: "/student/profile" },
      { icon: FiCalendar, text: "Calendar", href: "student/calendar" },
      { icon: TbBug, text: "Report a bug", href: "/calendar" },
      { icon: TbSettings, text: "Settings", href: "student/settings" },
      { icon: LogOut, text: "Logout", href: "/landing" },
    ],
    []
  );

  const presetCovers = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
"https://plus.unsplash.com/premium_photo-1667680403630-014f531d9664?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

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
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("profileImage");
    if (savedProfile) setProfileImage(savedProfile);
    const savedCover = localStorage.getItem("coverImage");
    if (savedCover) setCoverImage(savedCover);
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setProfileImage(result);
      localStorage.setItem("profileImage", result);
    };
    reader.readAsDataURL(file);
  };

  const closeCoverDialog = () => setCoverDialogOpen(false);

  const handlePresetCover = (url: string) => {
    setCoverImage(url);
    localStorage.setItem("coverImage", url);
    setCoverDialogOpen(false);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setCoverImage(result);
      localStorage.setItem("coverImage", result);
      setCoverDialogOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerProfileInput = () => {
    document.getElementById("profile-image-input")?.click();
  };

  const triggerCoverInput = () => {
    document.getElementById("cover-image-input")?.click();
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
      <Menu
        anchorEl={coverMenuAnchor}
        open={Boolean(coverMenuAnchor)}
        onClose={closeCoverMenu}
      >
        <MenuItem onClick={handleCoverMenuUpload}>Upload from device</MenuItem>
        <MenuItem onClick={handleCoverMenuPreset}>Select preset</MenuItem>
      </Menu>
      <Dialog open={coverDialogOpen} onClose={closeCoverDialog}>
        <DialogTitle>Choose a preset cover</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {presetCovers.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preset ${i + 1}`}
                  className="w-24 h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
                  onClick={() => handlePresetCover(url)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCoverDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-6">
            {/* Cover Image */}
            <div className="h-40 relative">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  style={{ height: "100%" }}
                />
              )}
              <button
                className="absolute top-4 right-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full p-2"
                onClick={openCoverMenu}
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6 pt-4">
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="absolute -top-16 left-6 w-32 h-32">
                  <div className="relative w-full h-full">
                    {/* Profile initials or image */}
                    <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl select-none">
                          KR
                        </div>
                      )}
                    </div>
                    {/* Floating camera button */}
                    <button
                      className="absolute -top-2 -right-2 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                      title="Change profile picture"
                      onClick={triggerProfileInput}
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-16 md:mt-0 md:ml-36 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Kemly Rose</h1>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Available to work
                        </span>
                      </div>
                      <p className="text-gray-600">
                        4th Year | BS- Information Technology
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 relative w-full text-sm">
                    <div className="relative w-full">
                      {!bio && (
                        <div className="absolute left-0 top-0 flex items-center text-gray-400 pointer-events-none px-1 py-1">
                          <span>Add a short bio</span>
                          <MdEdit className="ml-1 h-4 w-4" />
                        </div>
                      )}
                      <textarea
                        className="w-full bg-transparent focus:outline-none text-gray-600 resize-none px-1 py-1"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={50}
                        rows={1}
                        style={{ minHeight: "1.5em" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* MUI Tabs */}
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
                    onChange={(_, v) => setActiveTab(v)}
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
                  </Tabs>
                </Box>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">{renderContent()}</div>
        </div>
      </div>
    </BaseLayout>
  );
}