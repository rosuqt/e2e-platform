/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import Lottie from "lottie-react";
import robotLoader from "../../../../../../public/animations/robot_loader.json";
import Tooltip from "@mui/material/Tooltip";

type AiSuggestionsModalProps = {
  open: boolean;
  onClose: () => void;
  skills: string[];
  experience: string[];
  certificates: { title: string; issuer?: string; description?: string }[]; 
  bio: string;
};

export const AiSuggestionsModal: React.FC<AiSuggestionsModalProps> = ({
  open,
  onClose,
  skills,
  experience,
  certificates,
  bio,
}) => {
  const [checkedSkills, setCheckedSkills] = useState<boolean[]>(skills.map(() => false));
  const [checkedExperience, setCheckedExperience] = useState<boolean[]>(experience.map(() => false));
  const [checkedCertificates, setCheckedCertificates] = useState<boolean[]>(certificates.map(() => false));
  const [checkedBio, setCheckedBio] = useState(false);

  const handleSkillCheck = (idx: number) => {
    setCheckedSkills(arr => arr.map((v, i) => i === idx ? !v : v));
  };
  const handleExperienceCheck = (idx: number) => {
    setCheckedExperience(arr => arr.map((v, i) => i === idx ? !v : v));
  };
  const handleCertificateCheck = (idx: number) => {
    setCheckedCertificates(arr => arr.map((v, i) => i === idx ? !v : v));
  };
  const handleBioCheck = () => setCheckedBio(v => !v);

  const allSelected =
    checkedSkills.every(Boolean) &&
    checkedExperience.every(Boolean) &&
    checkedCertificates.every(Boolean) &&
    checkedBio;

  const handleSelectAllToggle = () => {
    if (allSelected) {
      setCheckedSkills(skills.map(() => false));
      setCheckedExperience(experience.map(() => false));
      setCheckedCertificates(certificates.map(() => false));
      setCheckedBio(false);
    } else {
      setCheckedSkills(skills.map(() => true));
      setCheckedExperience(experience.map(() => true));
      setCheckedCertificates(certificates.map(() => true));
      setCheckedBio(true);
    }
  };

  if (!open) return null;

  const capitalizeFirstLetter = (str: string) =>
    str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;

  const handleAddSuggestions = async () => {
    const selectedSkills = skills.filter((_, idx) => checkedSkills[idx]);
    const selectedExperience = experience.filter((_, idx) => checkedExperience[idx]);
    const selectedCertificates = certificates.filter((_, idx) => checkedCertificates[idx]);
    const selectedBio = checkedBio ? bio : null;

    await fetch("/api/students/student-profile/suggestions/addSuggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: selectedSkills,
        experience: selectedExperience,
        certificates: selectedCertificates,
        bio: selectedBio,
      }),
    });

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
 
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          minWidth: 900,
          maxWidth: 1100,
          width: "90vw",
          height: 650, 
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          position: "relative",
          boxSizing: "border-box",
        }}
      >

        <div
          style={{
            background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)", 
            width: "32%",
            minWidth: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          <Lottie
            animationData={robotLoader}
            loop={true}
            style={{ width: 330, height: 330 }}
          />
        </div>
        {/* Right Side: Content */}
        <div
          style={{
            flex: 1,
            padding: "2rem 1.5rem 1.5rem 1.5rem",
            color: "#222",
            fontFamily: "Segoe UI, Inter, Arial, sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "relative",
            overflowY: "auto",
            overflowX: "auto",
            boxSizing: "border-box",
            minWidth: 0,
            maxWidth: "100%",
            width: "100%",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            height: "100%",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "rgba(0,0,0,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              color: "#222",
              fontSize: 20,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            aria-label="Close"
          >
            ×
          </button>
          <h2
            style={{
              fontWeight: 700,
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
              letterSpacing: "0.01em",
              color: "#444",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              textAlign: "left",
              maxWidth: "100%",
            }}
          >
            We've found some suggestions for your profile!
          </h2>
          <p style={{
            marginBottom: "1.5rem",
            color: "#222",
            fontSize: "1rem",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            maxWidth: "100%",
            textAlign: "left",
          }}>
            We've detected some details from your resume that would look great in your profile. Select the ones you'd like to add!
          </p>
          {/* Select All Checkbox and Text */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1.5rem",
              cursor: "pointer",
              fontSize: "14px", 
              color: "#444",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAllToggle}
              style={{ accentColor: "#444", width: 12, height: 12 }}
            />
            {allSelected ? "Deselect All" : "Select All"}
          </label>
          {/* Skills Section */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 6 }}>
                Skills found <span style={{
                  background: "#1976d2",
                  color: "#fff",
                  borderRadius: 12,
                  padding: "2px 10px",
                  fontSize: "0.95rem",
                  marginLeft: 6,
                }}>{skills.length}</span>
              </div>
              
              <div style={{
                display: "flex",
                gap: "2.5rem", 
                maxWidth: "100%",
                width: "100%",
              }}>
                {Array.from({ length: 3 }).map((_, colIdx) => {
                  const start = colIdx * 7;
                  const end = start + 7;
                  const colSkills = skills.slice(start, end);
                  return (
                    <ul
                      key={colIdx}
                      style={{
                        margin: 0,
                        paddingLeft: 0,
                        color: "#1976d2",
                        listStyle: "none",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        maxWidth: "100%",
                        minWidth: 180,
                        flex: 1,
                      }}
                    >
                      {colSkills.map((skill, idx) => (
                        <li key={start + idx} style={{
                          marginBottom: 10,
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          minWidth: 0,
                          width: "100%",
                          paddingRight: 10,
                        }}
                          onClick={() => handleSkillCheck(start + idx)}
                        >
                          <input
                            type="checkbox"
                            checked={checkedSkills[start + idx]}
                            onChange={() => handleSkillCheck(start + idx)}
                            style={{ marginRight: 8, pointerEvents: "none" }}
                          />
                          <span style={{ userSelect: "none", fontSize: "1rem", minWidth: 0 }}>
                            {capitalizeFirstLetter(skill)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </div>
            </div>
          )}
          {/* Experience Section */}
          {experience.length > 0 && (
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 6 }}>Experience</div>
              <ul style={{
                margin: 0,
                paddingLeft: 0,
                color: "#1976d2",
                listStyle: "none",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                maxWidth: "100%",
              }}>
                {experience.map((exp, idx) => (
                  <li key={idx} style={{ marginBottom: 6, display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => handleExperienceCheck(idx)}
                  >
                    <input
                      type="checkbox"
                      checked={checkedExperience[idx]}
                      onChange={() => handleExperienceCheck(idx)}
                      style={{ marginRight: 8, pointerEvents: "none" }}
                    />
                    <span style={{ userSelect: "none" }}>{capitalizeFirstLetter(exp)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Certificates Section */}
          {certificates.length > 0 && (
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 6 }}>Certificates</div>
              <ul style={{
                margin: 0,
                paddingLeft: 0,
                color: "#1976d2",
                listStyle: "none",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                maxWidth: "100%",
              }}>
                {certificates.map((cert, idx) => (
                  <li key={idx} style={{ marginBottom: 6, display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => handleCertificateCheck(idx)}
                  >
                    <input
                      type="checkbox"
                      checked={checkedCertificates[idx]}
                      onChange={() => handleCertificateCheck(idx)}
                      style={{ marginRight: 8, pointerEvents: "none" }}
                    />
                    <span style={{ userSelect: "none" }}>
                      {cert.title ? capitalizeFirstLetter(cert.title) : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Career Goals/Bio Section */}
          {bio && (
            <div>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 6 }}>Career Goals</div>
              <div style={{
                background: "#e3f2fd",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#1976d2",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                maxWidth: "100%",
                cursor: "pointer",
              }}
                onClick={handleBioCheck}
              >
                <input
                  type="checkbox"
                  checked={checkedBio}
                  onChange={handleBioCheck}
                  style={{ marginRight: 8, pointerEvents: "none" }}
                />
                <span style={{ userSelect: "none" }}>{capitalizeFirstLetter(bio)}</span>
              </div>
            </div>
          )}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2.5rem",
            width: "100%",
          }}>
            <div style={{ display: "flex", gap: "1rem", marginLeft: "auto" }}>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1976d2",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  padding: "0.6rem 1.2rem",
                }}
              >
                No Thanks
              </button>
              <Tooltip
                title={
                  !(
                    checkedSkills.some(Boolean) ||
                    checkedExperience.some(Boolean) ||
                    checkedCertificates.some(Boolean) ||
                    checkedBio
                  )
                    ? "Select at least one suggestion to enable"
                    : ""
                }
                arrow
                placement="top"
                disableHoverListener={
                  checkedSkills.some(Boolean) ||
                  checkedExperience.some(Boolean) ||
                  checkedCertificates.some(Boolean) ||
                  checkedBio
                }
              >
                <span>
                  <button
                    disabled={
                      !(
                        checkedSkills.some(Boolean) ||
                        checkedExperience.some(Boolean) ||
                        checkedCertificates.some(Boolean) ||
                        checkedBio
                      )
                    }
                    style={{
                      background: "linear-gradient(90deg, #1976d2 0%, #a78bfa 100%)",
                      border: "none",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "1rem",
                      borderRadius: 8,
                      padding: "0.6rem 1.8rem",
                      cursor: !(
                        checkedSkills.some(Boolean) ||
                        checkedExperience.some(Boolean) ||
                        checkedCertificates.some(Boolean) ||
                        checkedBio
                      )
                        ? "not-allowed"
                        : "pointer",
                      opacity: !(
                        checkedSkills.some(Boolean) ||
                        checkedExperience.some(Boolean) ||
                        checkedCertificates.some(Boolean) ||
                        checkedBio
                      )
                        ? 0.6
                        : 1,
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                    }}
                    onClick={handleAddSuggestions}
                  >
                    Add Suggestions
                  </button>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
