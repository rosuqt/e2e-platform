import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { HiRocketLaunch } from "react-icons/hi2";
import { RiProgress6Fill } from "react-icons/ri";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";

interface Profile {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  short_bio?: string;
  profile_img?: string;
  cover_image?: string;
  year?: string;
  section?: string;
  course?: string;
  applicationStatus?: string;
}

interface ProfileViewProps {
  profile: Profile;
  isOwner: boolean;
  loading: boolean;
  uploadingProfile: boolean;
  uploadingCover: boolean;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  bio: string;
  setBio: (bio: string) => void;
  editingBio: boolean;
  setEditingBio: (editing: boolean) => void;
  savingBio: boolean;
  handleBioBlur: () => void;
  handleBioKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  triggerProfileInput: () => void;
  triggerCoverInput: () => void;
  openCoverMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  closeCoverMenu: () => void;
  handleCoverMenuUpload: () => void;
  handleCoverMenuPreset: () => void;
  setCoverDialogOpen: (open: boolean) => void;
  handlePresetCover: (url: string) => void;
  closeCoverDialog: () => void;
  renderContent: () => React.ReactNode;
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export default function ProfileView({
  profile,
  isOwner,
  loading,
  uploadingProfile,
  uploadingCover,
  profileImageUrl,
  coverImageUrl,
  bio,
  setBio,
  editingBio,
  setEditingBio,
  savingBio,
  handleBioBlur,
  handleBioKeyDown,
  triggerProfileInput,
  triggerCoverInput,
  openCoverMenu,
  closeCoverMenu,
  handleCoverMenuUpload,
  handleCoverMenuPreset,
  setCoverDialogOpen,
  handlePresetCover,
  closeCoverDialog,
  renderContent,
  activeTab,
  setActiveTab,
}: ProfileViewProps) {
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

  const presetCovers = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    "https://plus.unsplash.com/premium_photo-1667680403630-014f531d9664?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-6">
          <div className="h-40 relative">
            {loading || uploadingCover ? (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            ) : coverImageUrl ? (
              <div className="w-full h-full relative">
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                />
                {uploadingCover && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20">
                    <span className="loader" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400" />
            )}

            {isOwner && (
              <button 
                className="absolute top-4 right-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full p-2"
                onClick={openCoverMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          <div className="relative px-6 pb-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end">
              <div className="absolute -top-16 left-6 w-32 h-32">
                <div className="relative w-full h-full">
                  <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center overflow-hidden relative">
                    {loading || uploadingProfile ? (
                      <div className="w-full h-full bg-gray-200 rounded-full animate-pulse" />
                    ) : profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl select-none">
                        {(profile.first_name && profile.last_name) 
                          ? `${profile.first_name[0] || ""}${profile.last_name[0] || ""}`.toUpperCase()
                          : "SKR"}
                      </div>
                    )}
                  </div>

                  {isOwner && (
                    <button 
                      className="absolute -top-2 -right-2 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                      title="Change profile picture"
                      onClick={triggerProfileInput}
                      disabled={uploadingProfile}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
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
                          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          <h1 className="text-2xl font-bold">
                            {(profile.first_name && profile.last_name) 
                              ? `${profile.first_name} ${profile.last_name}`
                              : "Full Name"}
                          </h1>
                        )}

                        {profile.applicationStatus && (
                          <Tooltip title="This reflects your work status and cannot be changed. It is based on your actual workflow and progress." arrow>
                            <motion.span 
                              whileHover={{ scale: 1.1 }} 
                              whileTap={{ scale: 0.98 }} 
                              className="text-xs px-4 py-1 mt-1 rounded-full cursor-pointer flex items-center"
                              style={{
                                backgroundColor: getStatusColor(profile.applicationStatus).bg,
                                color: getStatusColor(profile.applicationStatus).text,
                                fontWeight: 500,
                              }}
                            >
                              {getStatusIcon(profile.applicationStatus)}
                              {profile.applicationStatus}
                            </motion.span>
                          </Tooltip>
                        )}
                      </div>

                      {loading ? (
                        <div className="mt-2 h-6 w-64 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <>
                          <p className="text-gray-600">{profile.course || "Course not specified"}</p>
                          <p className="text-gray-600">
                            {(profile.year || profile.section) 
                              ? `${profile.year || "Year"}${profile.year && profile.section ? " | " : ""}${profile.section || "Section"}`
                              : "Year and Section"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 relative w-full text-sm">
                    {loading ? (
                      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <div className="relative w-full">
                        {editingBio ? (
                          <textarea
                            className="w-full bg-transparent focus:outline-none text-gray-600 resize-none px-1 py-1"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
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
                            className={`flex items-center ${!isOwner ? 'cursor-default' : 'cursor-pointer'} ${!bio ? "text-gray-400" : ""}`}
                            onClick={() => isOwner && setEditingBio(true)}
                          >
                            {bio || "Add a short bio"}
                            {isOwner && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-400 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-72 lg:w-80 shrink-0 mt-6 md:mt-0 flex flex-col">
                  {/* Profile completion widget would go here for owner */}
                </div>
              </div>
            </div>

            <div className="flex mt-6">
              <div className="border-b border-gray-200 w-full">
                <div className="flex space-x-8">
                  {isOwner && (
                    <>
                      <button 
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        onClick={() => setActiveTab(0)}
                      >
                        About
                      </button>
                      <button 
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 1 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        onClick={() => setActiveTab(1)}
                      >
                        Skills
                      </button>
                      <button 
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 2 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        onClick={() => setActiveTab(2)}
                      >
                        My Ratings
                      </button>
                      <button 
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 3 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        onClick={() => setActiveTab(3)}
                      >
                        Activity Log
                      </button>
                    </>
                  )}
                  {!isOwner && (
                    <button 
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      onClick={() => setActiveTab(0)}
                    >
                      About
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">{renderContent()}</div>
      </div>

      {/* Cover Image Menu */}
      {isOwner && (
        <div className="relative">
          <button 
            className="absolute top-4 right-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full p-2 hidden"
            onClick={openCoverMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Cover Image Dialog */}
      {isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Choose a preset cover</h3>
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
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={closeCoverDialog}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}