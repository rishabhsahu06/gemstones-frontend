"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AuthModal from "../auth-model/authModel"
import useAccessToken from "@/hooks/userSession"
import { useApi } from "@/hooks/useApi" // Import your useApi hook
import { toast } from "react-toastify"

export default function CategoryCard({ product, slug }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { accessToken, user } = useAccessToken()
  const { post, loading, error } = useApi() // Use the useApi hook

  const handleAddCarWithToken = async (id) => {
     try {
      const cartData = {
        productId: id,
        quantity: 1,
      }
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }

      // Using your useApi hook's post method
      const response = await post("/cart", cartData, options)

      toast.success("Product added to cart successfully!")

    } catch (err) {
      console.error("❌ Error Details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      })
      
      // Handle different error scenarios
      if (err.response?.status === 401) {
        toast.error("Please log in to add items to your cart.")
        setIsAuthModalOpen(true)
      } else if (err.response?.status === 400) {
        toast.error(err.response.data?.message || "Invalid request. Please check the product details.")
      } else if (err.response?.status === 404) {
        toast.error("Product not found or cart endpoint unavailable.")
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later.")
      } else {
        // The error from useApi hook will be in the error state
        toast.error(error || "Failed to add product to cart. Please try again.")
      }
    }
  }

  // Alternative version with different endpoints to try


  const handleAddToCart = (id) => {
    console.log("🛒 Add to cart clicked for product:", id)
    
    if (!accessToken) {
      console.log("🔒 No access token, opening auth modal")
      setIsAuthModalOpen(true)
    } else {
      console.log("🔑 Access token found, proceeding with cart addition")
      handleAddCarWithToken(id)
      // Uncomment below to try alternative method if the above doesn't work
      // handleAddCarWithTokenAlternative(id)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden duration-300 transition-shadow">
        <div className="p-2 flex items-center justify-center">
          <Link href={`/-/gemStone/${slug}/${product._id}`}>
            <Image
              src={product.images[0].url || "/placeholder.svg?height=200&width=200&query=gemstone"}
              alt={product.name}
              width={200}
              height={500}
              className="object-cover w-full h-[300px] rounded-lg hover:scale-105 duration-300 transition-transform"
            />
          </Link>
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-gray-900 mb-2 overflow-hidden h-[30px]">
            {product.name.slice(0, 50)}
          </h3>
          <p className="text-sm text-gray-600 mb-2">Origin: {product.origin}</p>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-lg font-bold text-gray-900 mb-4">
              ₹ {product.discountedPrice}
            </span>
            <p className="text-sm font-bold text-gray-500 line-through mb-4">
              ₹ {product.originalPrice}
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => handleAddToCart(product._id)}
              variant="outline"
              type="button"
              size="sm"
              disabled={loading} // Disable button while loading
              className="flex-1 text-amber-700 border-amber-700 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "ADDING..." : "ADD CART"}
            </Button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}