"use client";
import { SkillAbsorptionAnimation } from "../students/jobs/job-matches/components/success-match";

export default function TestModalPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Skill Absorption Animation Test</h1>
        <SkillAbsorptionAnimation skills={["JavaScript", "React", "TypeScript"]} />
      </div>
    </div>
  );
}
