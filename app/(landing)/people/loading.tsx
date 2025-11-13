"use client"
import React from "react"

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 ${className}`} />
}

function PeopleLandingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Skeleton className="h-8 w-40 rounded" />
          <Skeleton className="h-10 w-36 rounded" />
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6 rounded" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8 rounded" />
          <div className="flex flex-wrap justify-center gap-4">
            <Skeleton className="h-12 w-40 rounded" />
          </div>
        </div>
        {/* Feature Cards Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 md:p-8 flex flex-col h-full">
                <Skeleton className="h-8 w-8 mb-4 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mb-2 rounded mx-auto" />
                <Skeleton className="h-4 w-40 mb-6 rounded mx-auto" />
                <div className="mt-auto rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-4 border">
                  <div className="flex justify-center -space-x-4 mb-4">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="w-12 h-12 rounded-full border-2 border-white" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-24 mx-auto rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Features Skeleton */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
            <Skeleton className="h-8 w-56 mb-2 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded" />
                  </div>
                  <Skeleton className="h-4 w-48 rounded" />
                  <ul className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <li key={j} className="flex items-start">
                        <Skeleton className="h-4 w-4 rounded-full mr-3 mt-1" />
                        <Skeleton className="h-4 w-32 rounded" />
                      </li>
                    ))}
                  </ul>
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Demo Skeleton */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <Skeleton className="h-8 w-80 mx-auto mb-8 rounded" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-12 rounded" />
        <div className="max-w-3xl mx-auto bg-white rounded-full shadow-lg border border-blue-200 overflow-hidden flex items-center p-2">
          <Skeleton className="h-10 w-24 rounded-full mr-2" />
          <Skeleton className="h-10 w-full rounded mr-2" />
          <Skeleton className="h-10 w-full rounded mr-2" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-10 w-96 mx-auto mb-6 rounded" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8 rounded" />
          <Skeleton className="h-12 w-40 mx-auto rounded" />
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-white border-t border-blue-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-4 w-56 mx-auto mb-4 rounded" />
            <div className="flex justify-center gap-4 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-24 rounded" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PeopleLandingLoading
