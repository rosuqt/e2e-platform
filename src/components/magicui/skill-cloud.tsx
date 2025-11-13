import { IconCloud } from "@/components/magicui/icon-cloud";

const words = [
  "Hello",
  "World",
  "React",
  "Next.js",
  "Magic",
  "Cloud",
  "TypeScript",
  "OpenAI",
  "Copilot",
  "Frontend",
  "Backend",
  "API",
  "UI",
  "UX",
  "Node.js",
  "Serverless",
  "GraphQL",
  "Prisma",
  "Docker",
  "CI/CD",
  "Testing",
  "Agile",
  "DevOps",
  "Design",
  "Code",
  "Deploy",
  "Monitor",
  "Scale",
  "Secure",
  "Automate",
];

export function IconCloudDemo() {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud items={words} />
    </div>
  );
}
