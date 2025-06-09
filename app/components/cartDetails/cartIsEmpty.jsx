import { ChevronRight, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function CartIsEmpty() {
  return (
    <div>
        <div className="min-h-screen ">
        {/* Breadcrumb */}
        <div className="bg-white ">
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

        <div className="container  mx-auto px-4 py-16 ">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="text-gray-600 max-w-md">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/-/products"
              className="px-6 py-3 bg-[#BA8E49] text-white rounded-lg font-medium hover:bg-[#A67B3E] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartIsEmpty
