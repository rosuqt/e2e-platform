"use client"
import React, { useState } from "react"
import { Search } from "lucide-react"
import CtaModal from "./cta-modal"

export default function SearchDemoSection() {
  const [ctaOpen, setCtaOpen] = useState(false)

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 text-center">
      <h2 className="text-3xl font-bold mb-8">Powerful Search Capabilities</h2>
      <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
        Find exactly who you&apos;re looking for with our advanced search functionality.
      </p>
      <div className="max-w-3xl mx-auto bg-white rounded-full shadow-lg border border-blue-200 overflow-hidden flex items-center p-2">
        <div className="bg-blue-100 text-blue-600 px-6 py-3 rounded-full text-sm font-semibold">People</div>
        <input type="text" placeholder="First name" className="px-4 py-3 text-sm w-full outline-none" />
        <input
          type="text"
          placeholder="Last name"
          className="px-4 py-3 text-sm w-full outline-none border-l border-gray-200"
        />
        <button
          className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
          onClick={() => setCtaOpen(true)}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      <CtaModal isOpen={ctaOpen} onClose={() => setCtaOpen(false)} />
    </section>
  )
}
