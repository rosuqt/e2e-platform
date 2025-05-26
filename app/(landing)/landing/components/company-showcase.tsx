"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { useState } from "react"

export default function CompaniesShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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

  const topRow = companies.slice(0, 3)
  const bottomRow = companies.slice(3)

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

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {topRow.map((company, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center w-full max-w-xs"
              style={{
                transform: hoveredIndex === index ? "translateY(-10px)" : "translateY(0)",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < Math.floor(company.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} ${
                        i === Math.floor(company.rating) && company.rating % 1 > 0
                          ? "text-yellow-400 fill-yellow-400 opacity-60"
                          : ""
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium text-gray-700">{company.rating}</span>
                </div>
              </div>
              <div
                className="mb-4 mt-4 relative overflow-hidden rounded-lg p-2"
                style={{
                  background: `linear-gradient(120deg, ${getRandomColor(index)}, ${getRandomColor(index + 2)})`,
                }}
              >
                <div
                  className={`absolute inset-0 rounded-lg transform transition-transform duration-300 z-0
                    ${hoveredIndex === index ? "scale-95" : ""}
                  `}
                  style={{
                    background: hoveredIndex === index
                      ? `linear-gradient(120deg, ${getRandomColor(index)}, ${getRandomColor(index + 3)})`
                      : `linear-gradient(120deg, #fff 80%, #fff 100%)`,
                    opacity: hoveredIndex === index ? 0.7 : 0.8,
                  }}
                ></div>
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={company.logoHeight * 2}
                  height={company.logoHeight}
                  className="h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-center mt-2">
                <h3 className="font-medium text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-500 mt-1 italic">&quot;{company.quote}&quot;</p>
              </div>
              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-pink-100/30 group-hover:via-blue-100/30 group-hover:to-purple-100/30 rounded-xl transition-colors duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom row: 2 companies, centered */}
        <div className="flex flex-wrap justify-center gap-8">
          {bottomRow.map((company, idx) => {
            const index = idx + 3
            return (
              <div
                key={index}
                className="relative group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center w-full max-w-xs"
                style={{
                  transform: hoveredIndex === index ? "translateY(-10px)" : "translateY(0)",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < Math.floor(company.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} ${
                          i === Math.floor(company.rating) && company.rating % 1 > 0
                            ? "text-yellow-400 fill-yellow-400 opacity-60"
                            : ""
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-medium text-gray-700">{company.rating}</span>
                  </div>
                </div>
                <div
                  className="mb-4 mt-4 relative overflow-hidden rounded-lg p-2"
                  style={{
                    background: `linear-gradient(120deg, ${getRandomColor(index)}, ${getRandomColor(index + 2)})`,
                  }}
                >
                  <div
                    className={`absolute inset-0 rounded-lg transform transition-transform duration-300 z-0
                      ${hoveredIndex === index ? "scale-95" : ""}
                    `}
                    style={{
                      background: hoveredIndex === index
                        ? `linear-gradient(120deg, ${getRandomColor(index)}, ${getRandomColor(index + 3)})`
                        : `linear-gradient(120deg, #fff 80%, #fff 100%)`,
                      opacity: hoveredIndex === index ? 0.7 : 0.8,
                    }}
                  ></div>
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={company.logoHeight * 2}
                    height={company.logoHeight}
                    className="h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-center mt-2">
                  <h3 className="font-medium text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 italic">&quot;{company.quote}&quot;</p>
                </div>
                <div className="absolute -z-10 inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-pink-100/30 group-hover:via-blue-100/30 group-hover:to-purple-100/30 rounded-xl transition-colors duration-500"></div>
              </div>
            )
          })}
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

function getRandomColor(seed: number) {
  const colors = [
    "rgba(239, 246, 255, 0.6)",
    "rgba(236, 253, 245, 0.6)",
    "rgba(254, 242, 242, 0.6)",
    "rgba(255, 251, 235, 0.6)",
    "rgba(250, 245, 255, 0.6)",
    "rgba(239, 246, 255, 0.6)",
    "rgba(254, 243, 199, 0.6)",
    "rgba(240, 253, 250, 0.6)", 
  ]

  return colors[Math.abs(seed) % colors.length]
}
