/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Marquee } from "@/components/magicui/marquee"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function CompaniesShowcase() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/fetchCompanies")
      .then(res => res.json())
      .then(data => setCompanies(data || []))
      .finally(() => setLoading(false))
  }, [])

  const firstRow = companies.slice(0, Math.ceil(companies.length / 2))
  const secondRow = companies.slice(Math.ceil(companies.length / 2))

  function ReviewCard({ logo_url, company_name, company_industry, avg_company_rating }: any) {
    const industry =
      typeof company_industry === "string" && company_industry.length > 0
        ? company_industry.charAt(0).toUpperCase() + company_industry.slice(1)
        : company_industry;
    return (
      <figure className="relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] flex flex-col items-center">
        <div className="mb-2 rounded-full overflow-hidden w-20 h-20 relative flex items-center justify-center">
          <Image
            src={logo_url || "/images/logo-test.png"}
            alt={company_name}
            fill
            className="object-cover"
            sizes="80px"
            priority={false}
          />
        </div>
        <figcaption className="text-sm font-medium dark:text-white text-center">{company_name}</figcaption>
        <div className="text-xs text-gray-500 text-center mb-1">{industry}</div>
        <div className="mt-1 flex flex-row items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < Math.round(avg_company_rating ?? 0)
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }
            >
              ★
            </span>
          ))}
          {avg_company_rating !== null && avg_company_rating !== undefined && (
            <span className="ml-1 text-xs text-gray-500">{Number(avg_company_rating).toFixed(1)}</span>
          )}
        </div>
      </figure>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mt-20 mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Companies Using Our Platform Today
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These are just a few of the many companies currently using our platform to drive growth and innovation.
          </p>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden min-h-[180px]">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <span className="inline-block w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <>
              <Marquee pauseOnHover className="[--duration:40s]">
                {firstRow.map((company) => (
                  <ReviewCard key={company.id + "-1"} {...company} />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:40s]">
                {secondRow.map((company) => (
                  <ReviewCard key={company.id + "-2"} {...company} />
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
            </>
          )}
        </div>
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-gray-500 mb-4">And many more companies trust us with their business</p>
          <Link href="/sign-in">
          <button className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-700 to-blue-400 px-6 py-3 text-sm font-medium text-white shadow transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950">
            Join them today
          </button></Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
