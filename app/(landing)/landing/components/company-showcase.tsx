"use client"

import { Marquee } from "@/components/magicui/marquee"

export default function CompaniesShowcase() {
  const companies = [
    {
      name: "Zeyn Enterprises",
      rating: 4.8,
      quote: "Transformed our business completely!",
      logoHeight: 60,
      logo: "/images/logo-test.png",
    },
    {
      name: "Ally Co.",
      rating: 4.9,
      quote: "Best decision we've made this year.",
      logoHeight: 50,
      logo: "/images/logo-test2.png",
    },
    {
      name: "FB Mark-it Place",
      rating: 4.7,
      quote: "Incredible results in just weeks.",
      logoHeight: 65,
      logo: "/images/logo-test.png",
    },
    {
      name: "Adrian Inc.",
      rating: 5.0,
      quote: "Exceeded all our expectations.",
      logoHeight: 55,
      logo: "/images/logo-test2.png",
    },
    {
      name: "Kemly and Friends",
      rating: 4.9,
      quote: "A game-changer for our team.",
      logoHeight: 60,
      logo: "/images/logo-test.png",
    },
  ]

  const firstRow = companies.slice(0, Math.ceil(companies.length / 2))
  const secondRow = companies.slice(Math.ceil(companies.length / 2))

  function ReviewCard({ logo, name, rating, quote, logoHeight }: typeof companies[0]) {
    return (
      <figure className="relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] flex flex-col items-center">
        <img className="rounded-full mb-2" width={logoHeight * 2} height={logoHeight} alt={name} src={logo} />
        <figcaption className="text-sm font-medium dark:text-white text-center">{name}</figcaption>
        <div className="mt-1 flex flex-row items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < Math.round(rating)
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-xs text-gray-500">{rating}</span>
        </div>
        <blockquote className="mt-2 text-sm text-center italic">&quot;{quote}&quot;</blockquote>
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
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:40s]">
            {firstRow.map((company, i) => (
              <ReviewCard key={company.name + i} {...company} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s]">
            {secondRow.map((company, i) => (
              <ReviewCard key={company.name + i} {...company} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-gray-500 mb-4">And many more companies trust us with their business</p>
          <button className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-700 to-blue-400 px-6 py-3 text-sm font-medium text-white shadow transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950">
            Join them today
          </button>
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
