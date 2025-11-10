/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { AiSuggestionsModal } from "../students/profile/components/modals/ai-suggestions-modal";

export default function TestModalPage() {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const handleOpen = async () => {
    const res = await fetch("/api/students/student-profile/suggestions/test-fetch");
    const data = await res.json();
    console.log(data); // <-- add this line
    setModalData(data);
    setOpen(true);
  };

  return (
    <div style={{ padding: 40 }}>
      <button
        style={{
          padding: "0.7rem 1.5rem",
          fontSize: "1.1rem",
          borderRadius: 8,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        Test AI Suggestions Modal
      </button>
      {open && modalData && (
        <AiSuggestionsModal
          open={open}
          onClose={() => setOpen(false)}
          skills={modalData.skills || []}
          experience={modalData.experience || []}
          certificates={modalData.certificates || []}
          bio={modalData.bio || ""}
        />
      )}
    </div>
  );
}
