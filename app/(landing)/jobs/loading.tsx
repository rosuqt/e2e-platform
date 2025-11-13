export default function JobsLoading() {
  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-8 p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="h-6 w-48 bg-blue-400/40 rounded mb-2 animate-pulse" />
            <div className="h-4 w-80 bg-blue-200/40 rounded mb-6 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-between mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-blue-100 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-blue-100 rounded animate-pulse" />
            <div className="h-8 w-24 bg-blue-100 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-full max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-l-blue-100 relative overflow-hidden animate-pulse"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div>
                        <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-6 w-16 bg-gray-100 rounded-full" />
                    ))}
                  </div>
                  <div className="h-4 w-3/4 bg-gray-100 rounded mt-3" />
                  <div className="h-6 w-1/2 bg-green-100 rounded-lg mt-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 w-24 bg-gray-100 rounded" />
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-10 w-32 bg-blue-100 rounded-full" />
                    <div className="h-10 w-32 bg-blue-50 rounded-full" />
                  </div>
                </div>
              ))}
              {/* Blurred/locked jobs */}
              <div className="relative pointer-events-none">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />
                <div className="pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="mb-4">
                      <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-l-gray-100 relative overflow-hidden animate-pulse">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full" />
                          <div>
                            <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                            <div className="h-4 w-24 bg-gray-100 rounded" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="h-6 w-16 bg-gray-100 rounded-full" />
                          ))}
                        </div>
                        <div className="h-4 w-3/4 bg-gray-100 rounded mt-3" />
                        <div className="mt-4 flex gap-2">
                          <div className="h-10 w-32 bg-blue-100 rounded-full" />
                          <div className="h-10 w-32 bg-blue-50 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* JobDetails skeleton */}
          <div className="hidden lg:block w-1/2 sticky top-8 h-[calc(100vh-8rem)] shadow-lg rounded-lg overflow-hidden bg-white animate-pulse">
            <div className="p-6">
              <div className="flex items-start gap-4 mt-12">
                <div className="bg-gray-200 rounded-full w-14 h-14" />
                <div className="flex-1">
                  <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <div className="h-10 w-32 bg-blue-100 rounded-full" />
                <div className="h-10 w-24 bg-blue-50 rounded-full" />
              </div>
              <div className="mt-4 h-4 w-full bg-gray-100 rounded" />
            </div>
            <div className="border-t" />
            <div className="p-6">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 w-28 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
            <div className="border-t" />
            <div className="p-6 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full" />
              <div className="flex-1">
                <div className="h-5 w-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="border-t" />
            <div className="p-6">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-100 rounded mb-2" />
              ))}
              <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
            </div>
            <div className="border-t" />
            <div className="p-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
              <div className="ml-auto h-8 w-20 bg-blue-100 rounded-full" />
            </div>
            <div className="border-t" />
            <div className="p-6">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-100 rounded mb-1" />
                  <div className="h-3 w-20 bg-gray-100 rounded mb-1" />
                  <div className="h-3 w-28 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded mt-4" />
              <div className="h-4 w-1/2 bg-gray-100 rounded mt-2" />
              <div className="mt-2 flex justify-end">
                <div className="h-4 w-20 bg-blue-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
