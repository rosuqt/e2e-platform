"use client"

import { Bookmark, Star } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

type Company = {
  name: string
  description: string
  rating: number
  logo: string
}

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 w-[350px] flex-shrink-0 border border-gray-100"
      whileHover={{
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=48&width=48"
            alt={company.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
      </div>

      <p className="text-gray-600 mb-4 h-[80px] overflow-hidden">{company.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-700 text-white px-3 py-1 rounded-lg font-bold mr-2">{company.rating.toFixed(1)}</div>
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="w-5 h-5" fill={i < Math.floor(company.rating) ? "currentColor" : "none"} />
            ))}
          </div>
        </div>

        <Link href="/sign-in">
          <motion.button
            className="bg-gray-100 hover:bg-blue-700 hover:text-white text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bookmark className="w-4 h-4" />
            <span className="font-medium">Save</span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}
