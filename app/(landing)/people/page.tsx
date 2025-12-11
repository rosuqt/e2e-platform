import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Star,
  UserPlus,
  UserCheck,
  Users,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchDemoSection from "./search-demo-section";
import LandingFooter from "../landing/components/landing-footer";

async function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default async function PeopleLandingPage() {
  await delay(1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-blue-600 text-2xl font-bold">
            InternConnect
          </Link>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/people">Explore People</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Connect, Follow, and Discover with{" "}
            <span className="text-blue-600">People</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build your professional network, follow employers, and discover new
            connections to enhance your internship and career opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100">
            {/* Connections Preview */}
            <FeatureCard
              icon={<UserCheck className="h-8 w-8 text-blue-500" />}
              title="Connections"
              description="Manage your network of classmates, friends, and professional contacts."
              color="blue"
              link="/sign-in"
              avatars={3}
            />

            {/* Following Preview */}
            <FeatureCard
              icon={<Star className="h-8 w-8 text-amber-500" />}
              title="Following"
              description="Keep track of employers and companies you're interested in."
              color="amber"
              link="/sign-in"
              avatars={2}
            />

            {/* Suggestions Preview */}
            <FeatureCard
              icon={<UserPlus className="h-8 w-8 text-emerald-500" />}
              title="Suggestions"
              description="Discover students, employers, and companies to expand your network."
              color="emerald"
              link="/sign-in"
              avatars={3}
            />
          </div>
        </div>
      </section>
      {/* Compact Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-2xl font-bold text-blue-700">
              What You Can Do
            </h2>
            <p className="text-gray-600">
              Explore the powerful features of the People module
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Connections Feature */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Manage Connections</h3>
                </div>
                <p className="text-gray-600">
                  View and manage your classmates, friends, and network. Accept
                  or ignore requests, favorite people, and unfriend connections.
                </p>
                <ul className="space-y-2">
                  <FeatureItem>Accept and manage friend requests</FeatureItem>
                  <FeatureItem>Organize with favorites</FeatureItem>
                  <FeatureItem>Search your connections</FeatureItem>
                </ul>
                <Link
                  href="/sign-in"
                  className="text-blue-600 font-medium flex items-center hover:underline"
                >
                  Explore Connections <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {/* Following Feature */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Building2 className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Follow Companies</h3>
                </div>
                <p className="text-gray-600">
                  Keep track of employers and companies you&apos;re interested
                  in. Sort, favorite, and unfollow to manage your professional
                  interests.
                </p>
                <ul className="space-y-2">
                  <FeatureItem color="amber">
                    Follow potential employers
                  </FeatureItem>
                  <FeatureItem color="amber">
                    Stay updated on company news
                  </FeatureItem>
                  <FeatureItem color="amber">
                    Discover job opportunities
                  </FeatureItem>
                </ul>
                <Link
                  href="/sign-in"
                  className="text-amber-600 font-medium flex items-center hover:underline"
                >
                  Explore Following <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {/* Suggestions Feature */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <GraduationCap className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Discover Connections
                  </h3>
                </div>
                <p className="text-gray-600">
                  Find students, employers, and companies you may know or want
                  to connect with. Explore and expand your network.
                </p>
                <ul className="space-y-2">
                  <FeatureItem color="emerald">
                    Find people you may know
                  </FeatureItem>
                  <FeatureItem color="emerald">
                    Discover relevant employers
                  </FeatureItem>
                  <FeatureItem color="emerald">
                    Explore companies in your field
                  </FeatureItem>
                </ul>
                <Link
                  href="/sign-in"
                  className="text-emerald-600 font-medium flex items-center hover:underline"
                >
                  Explore Suggestions <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Demo Section */}
      <SearchDemoSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Expand Your Network?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start connecting with classmates, following employers, and
            discovering new opportunities today.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            <Link href="/sign-in">Join us now!</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>
          <LandingFooter />
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  color,
  link,
  avatars,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "amber" | "emerald";
  link: string;
  avatars: number;
}) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200",
    amber: "from-amber-50 to-amber-100 border-amber-200",
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200",
  };

  const randomAvatars = [
    "/images/random-profiles/1.png",
    "/images/random-profiles/2.png",
    "/images/random-profiles/3.png",
    "/images/random-profiles/4.png",
    "/images/random-profiles/5.png",
    "/images/random-profiles/6.png",
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col h-full">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <div
        className={`mt-auto rounded-xl bg-gradient-to-br ${colorClasses[color]} p-4 border`}
      >
        <div className="flex justify-center -space-x-4 mb-4">
          {Array.from({ length: avatars }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-full border-2 border-white overflow-hidden"
            >
              <Image
                src={randomAvatars[(i + title.length) % randomAvatars.length]}
                alt="User avatar"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <Link
          href={link}
          className="flex items-center justify-center text-sm font-medium hover:underline"
        >
          Explore {title} <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}

function FeatureItem({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: "blue" | "amber" | "emerald";
}) {
  const colorClasses = {
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
  };

  return (
    <li className="flex items-start">
      <div className={`${colorClasses[color]} rounded-full p-1 mr-3 mt-1`}>
        <svg
          className="h-3 w-3 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span className="text-sm text-gray-700">{children}</span>
    </li>
  );
}