"use client";
import { useEffect, useState, useRef } from "react";
import { CheckCircle, ExternalLink, Users, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Confetti component
const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces: {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];

    const colors = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE", "#EFF6FF"];

    for (let i = 0; i < 200; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.2 - 0.1,
      });
    }

    let animationFrame: number;

    const animate = () => {
      if (!isActive) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let stillFalling = false;

      confettiPieces.forEach((piece) => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);

        ctx.fillStyle = piece.color;
        ctx.globalAlpha = opacity;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);

        ctx.restore();

        piece.y += piece.speed;
        piece.x += Math.sin(piece.angle) * 1.5;
        piece.rotation += piece.rotationSpeed;

        if (piece.y < canvas.height) {
          stillFalling = true;
        }
      });

      if (stillFalling) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          const fadeInterval = setInterval(() => {
            setOpacity((prev) => {
              if (prev <= 0) {
                clearInterval(fadeInterval);
                setIsActive(false);
                return 0;
              }
              return prev - 0.05;
            });
          }, 50);
        }, 1000);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isActive, opacity]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

export default function JobPostingLive() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-3xl p-12 md:p-16 max-w-[70rem] w-full mx-auto mt-[-50px]">
        {/* Confetti */}
        <Confetti />

        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <motion.div
            className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.5,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping" />
                <CheckCircle size={120} className="text-blue-500 mb-10" />
              </div>
            </motion.div>
          </motion.div>

          {/* Congratulations Text */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-blue-600 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Your job posting is now live
          </motion.h1>

          <motion.p
            className="text-gray-700 text-medium max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            Your job posting has been successfully published and is now visible to potential candidates. You can start
            receiving applications and manage them from your dashboard.
          </motion.p>

          {/* Next Steps Section */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-blue-700 mb-6">Next Steps</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* View Job Post */}
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 transition-all duration-300"
              >
                <Link href="#" className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <ExternalLink size={28} className="text-blue-500" />
                  </div>
                  <h4 className="font-bold text-blue-700 mb-2">View Job Post</h4>
                  <p className="text-blue-600 text-sm">See how your job posting appears to candidates</p>
                </Link>
              </motion.div>

              {/* Manage Applications */}
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 transition-all duration-300"
              >
                <Link href="#" className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Users size={28} className="text-blue-500" />
                  </div>
                  <h4 className="font-bold text-blue-700 mb-2">Manage Applications</h4>
                  <p className="text-blue-600 text-sm">Review and respond to candidate applications</p>
                </Link>
              </motion.div>

              {/* Share Job Post */}
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 transition-all duration-300"
              >
                <button
             
                  className="flex flex-col items-center text-center w-full"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Share2 size={28} className="text-blue-500" />
                  </div>
                  <h4 className="font-bold text-blue-700 mb-2">Share Job Post</h4>
                  <p className="text-blue-600 text-sm">Share your job posting on social media</p>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
