"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AuthModal from "../auth-model/authModel"

export default function CategoryCard({ product, slug }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Simulate checking for authentication token
  const getAuthToken = () => {
    // Replace this with your actual token checking logic
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || null
    }
    return null
  }



  const handleAddToCart = () => {
    const token = getAuthToken()

    if (!token) {
      setIsAuthModalOpen(true)
    } else {
      console.log("Proceeding to checkout for:", product.id)
      alert(`Proceeding to buy ${product.title}`)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gradient-to-br from-yellow-200 to-yellow-400 p-8 flex items-center justify-center">
          <Link href={`/-/gemStone/${slug}/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg?height=200&width=200&query=gemstone"}
              alt={product.title}
              width={200}
              height={200}
              className="object-cover w-full h-full rounded-lg hover:scale-105 transition-transform"
            />
          </Link>
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
          <p className="text-sm text-gray-600 mb-2">Origin: {product.origin}</p>
          <p className="text-lg font-bold text-gray-900 mb-4">{product.price}</p>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleAddToCart(product.id)}
              variant="outline"
              type="button"
              size="sm"
              className="flex-1 text-amber-700 border-amber-700 hover:bg-amber-50"
            >
              ADD CART
            </Button>
            {/* <Button size="sm" className="flex-1 bg-amber-700 hover:bg-amber-800">
              BUY NOW
            </Button> */}
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
