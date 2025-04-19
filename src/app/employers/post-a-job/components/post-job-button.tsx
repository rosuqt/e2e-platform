"use client";

import { Button } from "@/components/ui/button";

interface PostJobButtonProps {
  employerId: string;
}

export function PostJobButton({ employerId }: PostJobButtonProps) {
  const handleAction = async (action: "saveDraft" | "postJob") => {
    const formData = JSON.parse(sessionStorage.getItem("formData") || "{}");

    const response = await fetch("/api/employers/post-a-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData, action, employerId }),
    });

    const result = await response.json();
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex gap-4">
      <Button onClick={() => handleAction("saveDraft")}>Save Draft</Button>
      <Button onClick={() => handleAction("postJob")} className="bg-blue-600 text-white">
        Post Job
      </Button>
    </div>
  );
}
