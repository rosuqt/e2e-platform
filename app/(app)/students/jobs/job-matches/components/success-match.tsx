"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Lottie from "lottie-react"
import { ConfettiStars } from "@/components/magicui/star"

interface SuccessMatchProps {
  skills: string[]
  profileImgUrl?: string
  onFinish?: () => void
}

interface Skill {
  id: string
  name: string
  angle: number
  delay: number
}

export function SkillAbsorptionAnimation({ skills, profileImgUrl, onFinish }: { skills: string[], profileImgUrl?: string, onFinish?: () => void }) {
  const [skillObjs, setSkillObjs] = useState<Skill[]>([])
  const [currentSkill, setCurrentSkill] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAbsorbing, setIsAbsorbing] = useState(false)
  const [profileScale, setProfileScale] = useState(1)
  const [showAbsorb, setShowAbsorb] = useState(false)
  const [charging, setCharging] = useState(false)
  const [chargeProgress, setChargeProgress] = useState(0)
  const [isAbsorbingSkill, setIsAbsorbingSkill] = useState(false)
  const [borderAnimKey, setBorderAnimKey] = useState(0)
  const [showGreenBorder, setShowGreenBorder] = useState(false)
  const [showLottie, setShowLottie] = useState(false)
  const lottieData = require("@/../public/animations/star_pop.json")

  useEffect(() => {
    const arcStart = 210
    const arcEnd = 330
    const newSkills: Skill[] = skills.map((skill, index) => {
      const angle = arcStart + (arcEnd - arcStart) * (index / (skills.length - 1 || 1))
      return {
        id: `${skill}-${index}`,
        name: skill,
        angle,
        delay: index * 0.25, // slower delay between skills
      }
    })
    setSkillObjs(newSkills)
  }, [skills])

  useEffect(() => {
    if (isAbsorbing && currentSkill === null) {
      setCurrentSkill(0)
    }
  }, [isAbsorbing, currentSkill])

  useEffect(() => {
    if (isAbsorbing && currentSkill !== null && currentSkill < skillObjs.length) {
      setIsAnimating(true)
      setShowAbsorb(false)
      setIsAbsorbingSkill(false)
      const popInDuration = 700 // slower pop-in
      const pauseDuration = 1100 // slower pause
      setTimeout(() => {
        setShowAbsorb(true)
        setIsAbsorbingSkill(true)
        setTimeout(() => {
          setIsAnimating(false)
          setProfileScale(1.25)
          setBorderAnimKey(prev => prev + 1)
          setTimeout(() => {
            setProfileScale(1)
            setIsAbsorbingSkill(false)
            setCurrentSkill((prev) => (prev !== null ? prev + 1 : null))
          }, 1100) // slower shrink
        }, pauseDuration)
      }, popInDuration)
    }
    if (currentSkill !== null && currentSkill >= skillObjs.length) {
      setCharging(true)
      setChargeProgress(0)
      let progress = 0
      let lottieShown = false
      const interval = setInterval(() => {
        progress += 4
        setChargeProgress(progress)
        if (!lottieShown && progress >= 80) {
          setShowLottie(true)
          lottieShown = true
        }
        if (progress >= 100) {
          clearInterval(interval)
          setShowGreenBorder(true)
          setTimeout(() => {
            setCharging(false)
            setIsAbsorbing(false)
            setCurrentSkill(null)
            setShowGreenBorder(false)
            if (onFinish) setTimeout(onFinish, 3000)
          }, 1200)
        }
      }, 32)
      return () => clearInterval(interval)
    }
  }, [currentSkill, skillObjs.length, onFinish])

  useEffect(() => {
    setIsAbsorbing(true)
  }, [])

  const getPositionFromAngle = (angle: number, distance = 180) => {
    const radians = (angle * Math.PI) / 180
    const x = distance * Math.cos(radians)
    const y = distance * Math.sin(radians)
    return { x, y }
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: 340, maxHeight: 420 }}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-2xl" />
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative flex items-center justify-center w-[260px] h-[44px] pointer-events-none">
          {currentSkill !== null && currentSkill < skillObjs.length && (() => {
            const skill = skillObjs[currentSkill]
            const { x, y } = getPositionFromAngle(skill.angle, 130) // smaller radius
            return (
              <motion.div
                key={skill.id}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${x}px)`,
                  top: `calc(44px + ${y}px)`,
                  zIndex: isAnimating ? 1 : 2,
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={
                  isAnimating
                    ? { x: 0, y: 0, opacity: 1, scale: 1.1 }
                    : showAbsorb
                      ? { x: -x, y: -y + 80, opacity: 0, scale: 0.6 }
                      : { x: 0, y: 0, opacity: 1, scale: 1.1 }
                }
                transition={
                  isAnimating
                    ? {
                        type: "spring",
                        stiffness: 600,
                        damping: 30,
                        duration: 0.8,
                      }
                    : {
                        duration: 1.1,
                        ease: "easeInOut",
                      }
                }
              >
                <motion.div
                  className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-xs font-semibold shadow-lg cursor-default"
                  animate={
                    isAnimating
                      ? { scale: 1, opacity: 1 }
                      : showAbsorb
                        ? { scale: 0.6, opacity: 0.3 }
                        : { scale: 1, opacity: 1 }
                  }
                  transition={
                    isAnimating
                      ? {
                          type: "spring",
                          stiffness: 600,
                          damping: 30,
                          duration: 0.8,
                        }
                      : {
                          duration: 1.1,
                          ease: "easeIn",
                        }
                  }
                >
                  {skill.name}
                </motion.div>
              </motion.div>
            )
          })()}
        </div>
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center"
          animate={{ scale: isAbsorbingSkill ? profileScale : 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 28,
          }}
        >
          {!showLottie ? (
            <motion.div
              className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600"
              animate={isAbsorbing ? { boxShadow: "0 0 40px rgba(59, 130, 246, 0.8)" } : {}}
              transition={{
                delay: 0.2,
                duration: 1.1,
              }}
            >
              <img src={profileImgUrl || "/profile-picture-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
            </motion.div>
          ) : (
            <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-white">
              <Lottie animationData={lottieData} loop={false} />
            </div>
          )}
          <motion.div
            key={borderAnimKey}
            className="absolute inset-0 rounded-full border-4 border-blue-400/50"
            initial={{ scale: 1, opacity: 1 }}
            animate={isAbsorbingSkill ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          />
          {showGreenBorder && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-500 pointer-events-none"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}
        </motion.div>
        {showLottie && <ConfettiStars />}
        {(isAbsorbing || charging) && !showLottie && (
          <motion.div
            className="mt-4 flex justify-center items-center w-full"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span
              className="text-base font-semibold text-center bg-clip-text text-transparent mt-5"
              style={{
                backgroundImage: "linear-gradient(to right, #3b82f6, #6366f1, #0ea5e9)",
              }}
            >
              Adding your new skills — you’re leveling up fast!
            </span>
          </motion.div>
        )}
        {showLottie && (
          <motion.div
            className="mt-4 flex justify-center items-center w-full"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span
              className="text-base font-semibold text-center bg-clip-text text-transparent mt-5"
              style={{
                backgroundImage: "linear-gradient(to right, #3b82f6, #6366f1, #0ea5e9)",
              }}
            >
              New skills added successfully!
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function SuccessMatch({ skills, profileImgUrl, onFinish }: SuccessMatchProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center" style={{ minHeight: 340, maxHeight: 420 }}>
      <SkillAbsorptionAnimation skills={skills} profileImgUrl={profileImgUrl} onFinish={onFinish} />
    </div>
  )
}
