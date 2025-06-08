"use client"

export default function GemstoneLoading() {
  return (
    <div className="min-h-screen bg-white mt-4">
      <div className="container mx-auto px-4 py-8">
        {/* Header Loading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>

        {/* Benefits Section Loading */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-80 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6  rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Loading */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded border animate-pulse"></div>
          ))}
        </div>

        {/* Products Grid Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              {/* Gemstone Image Skeleton */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-100 h-48 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <div className="flex items-center justify-center h-full">
                  <div className="w-20 h-12 bg-gray-300/50 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Product Info Skeleton */}
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20 mb-4"></div>

                {/* Buttons Skeleton */}
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse flex-1"></div>
                  <div className="h-8  rounded animate-pulse flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Message */}
        <div className="flex items-center justify-center mt-12">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-yellow-100 border-t-yellow-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-yellow-300 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-lg font-medium text-gray-700">Discovering precious gemstones...</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  )
}
