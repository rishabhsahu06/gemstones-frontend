"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AuthModal from "../auth-model/authModel"
import useAccessToken from "@/hooks/userSession"
export default function CategoryCard({ product, slug }) {
  console.log("Rendering CategoryCard for product:", product.images[0].url)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
   const { accessToken, user } = useAccessToken();

const handleAddToCart = () => {
   if (!accessToken) {
     
      setIsAuthModalOpen(true)
    } else {
      console.log("Proceeding to checkout for:", product.id)
      alert(`Proceeding to buy ${product.title}`)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden  duration-300 transition-shadow">
        <div className=" p-2 flex items-center  justify-center">
          <Link href={`/-/gemStone/${slug}/${product._id}`}>
            <Image
              src={product.images[0].url || "/placeholder.svg?height=200&width=200&query=gemstone"}
              alt={product.name}
              width={200}
              height={500}
              className="object-cover w-full h-[300px] rounded-lg hover:scale-105 duration-300  transition-transform"
            />
          </Link>
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-gray-900 mb-2 overflow-hidden h-[30px]">{product.name.slice(0, 50)}</h3>
          <p className="text-sm text-gray-600 mb-2">Origin: {product.origin}</p>
         <div className="flex justify-center items-center space-x-2 mb-4">
  <span className="text-lg font-bold text-gray-900 mb-4">
    ₹ {" "} {product.discountedPrice}
  </span>
  <p className="text-sm font-bold text-gray-500 line-through mb-4">
    ₹ {" "}{product.originalPrice}
  </p>
</div>

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
