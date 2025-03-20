import { useState } from "react";
import { Instagram, Facebook, X, Youtube, Linkedin } from "lucide-react";

export default function ShareJobPostOverlay() {
  const [copied, setCopied] = useState(false);
  const [jobLink, setJobLink] = useState("https://www.prosple.com");
  const handleCopy = () => {
    {
      /*when copy link is clicked*/
    }
    navigator.clipboard.writeText(jobLink);
    {
      /*copies the link*/
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    {
      /*delay*/
    }
  };
  {
    /*platform is when the social media button is clicked it will redirect to the link */
  }
  const handleShare = (
    platform: "Facebook" | "X" | "linkedin" | "Youtube" | "Instagram"
  ) => {
    let shareUrl = "";
    const encodedLink = encodeURIComponent(jobLink);

    switch (platform) {
      case "Instagram":
        alert("Instagram does not support web link sharing. Share manually.");
        return;
        break;
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case "X":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}`;
        break;
      case "Youtube":
        alert("YouTube does not support direct link sharing. Share manually.");
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    {
      /*opens a new browser*/
    }
  };
  return (
    <div className="max-w-md mx-auto p-5 rounded-2xl shadow-lg bg-white border"></div>
  );
}
