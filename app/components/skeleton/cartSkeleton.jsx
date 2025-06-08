// CartLoadingSkeleton.jsx
import { ChevronRight } from "lucide-react"
import Link from "next/link"

const CartLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="font-medium text-black hover:underline">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Your Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded-md w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {/* Skeleton Item 1 */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image Skeleton */}
                <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>

                {/* Product Details Skeleton */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Product Attributes Skeleton */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {/* Quantity Controls Skeleton */}
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>

                    {/* Price Skeleton */}
                    <div className="text-right space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Item 2 */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Item 3 */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-4">
              {/* Order Summary Title */}
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>

              {/* Delivery Details Skeleton */}
              <div className="space-y-4 mb-6">
                <div className="h-5 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-48 ml-auto animate-pulse"></div>
              </div>

              {/* Price Breakdown Skeleton */}
              <div className="space-y-3 py-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>

              {/* Total Skeleton */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-7 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>

              {/* Checkout Button Skeleton */}
              <div className="w-full mt-6 h-12 bg-gray-200 rounded-lg animate-pulse"></div>

              {/* Continue Shopping Skeleton */}
              <div className="w-32 h-4 bg-gray-200 rounded mx-auto mt-3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartLoadingSkeleton