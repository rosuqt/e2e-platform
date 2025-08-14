import Image from "next/image"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-indigo-700 w-full">
      <div className="w-full flex items-center gap-4 mb-4 relative" style={{ minHeight: 56 }}>
        <div className="ml-8">
          <Image src="/images/logo.white.png" alt="Seekr Logo" width={120} height={40} />
        </div>
        <span className="absolute left-1/2 transform -translate-x-1/2 text-white text-2xl font-medium text-center">
          Create New Employer Account
        </span>
      </div>
      {children}
    </div>
  )
}
