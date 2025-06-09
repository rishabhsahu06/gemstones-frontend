import { AlertCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function UnableToLoadCart() {
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

        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Unable to load your cart</h1>
            <p className="text-gray-600 max-w-md">
              We encountered an error while trying to load your cart. Please try again.
            </p>
            <button
              onClick={fetchProductData}
              className="px-6 py-3 bg-[#BA8E49] text-white rounded-lg font-medium hover:bg-[#A67B3E] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
  )
}

export default UnableToLoadCart
