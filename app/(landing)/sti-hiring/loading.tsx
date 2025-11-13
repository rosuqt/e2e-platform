export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Skeleton header */}
      <div className="w-full max-w-xl mb-8">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
      </div>
      {/* Skeleton job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-gray-50 rounded-lg shadow animate-pulse flex flex-col gap-4">
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            <div className="flex gap-2 mt-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
