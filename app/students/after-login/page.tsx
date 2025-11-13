"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Loader from "@/components/loader-smiley";

export default function AfterLogin() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      const user = session?.user as { role?: string; newStudent?: boolean };
      if (user?.role === "student") {
        if (user.newStudent === true) {
          router.replace("/students/welcome");
        } else if (user.newStudent === false) {
          router.replace("/students/dashboard");
        } else {
          router.replace("/students/landing");
        }
      } else {
        router.replace("/students/landing");
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader />
    </div>
  );
}
