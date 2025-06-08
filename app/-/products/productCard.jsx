"use client"
import React from "react"
import { Star, ShoppingCart, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const ProductCard = ({ product, onAddToCart, isAddingToCart }) => {
  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  )

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-50">
        <Link href={`/-/products/${product._id}`} >
        <Image
          src={product.images?.[0]?.url || "/placeholder.svg?height=300&width=300&query=gemstone"}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className="object-contain p-4"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-2 bg-[#BA8E49] text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.isAvailable || product.stock === 0 ? (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        ) : null}
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3 flex flex-col flex-grow">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-[#BA8E49] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        <p className="text-sm text-gray-500 capitalize">
          {product.primaryCategory.replace("-", " ")}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.ratings.average)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.ratings.average} ({product.ratings.count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            Rs. {product.discountedPrice.toLocaleString()}
          </span>
          {product.originalPrice > product.discountedPrice && (
            <span className="text-sm text-gray-500 line-through">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Product Benefits */}
        {product.productBenefits && product.productBenefits.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">Benefits:</p>
            <div className="flex flex-wrap gap-1">
              {product.productBenefits.slice(0, 2).map((benefit, index) => (
                <span
                  key={index}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                >
                  {benefit}
                </span>
              ))}
              {product.productBenefits.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{product.productBenefits.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Extra Details */}
        <div className="text-xs text-gray-600 space-y-1 mt-auto">
          <div className="flex justify-between">
            <span>Weight:</span>
            <span>{product.weightCarat} Carat</span>
          </div>
          <div className="flex justify-between">
            <span>Origin:</span>
            <span>{product.origin}</span>
          </div>
          <div className="flex justify-between">
            <span>Shape:</span>
            <span>{product.shape}</span>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.isAvailable || product.stock === 0 || isAddingToCart === product._id}
          className="w-full mt-4 py-2 px-4 bg-[#BA8E49] text-white rounded-lg font-medium hover:bg-[#A67B3E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {isAddingToCart === product._id ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
