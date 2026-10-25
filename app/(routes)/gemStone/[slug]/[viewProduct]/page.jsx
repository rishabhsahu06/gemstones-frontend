"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import FAQ from "@/app/Home/faq"
import BookService from "@/app/Home/book-service"
import { useParams } from "next/navigation"
import api from "@/lib/axios"
import useAccessToken from "@/hooks/userSession"
import { useApi } from "@/hooks/useApi"
import AuthModal from "@/app/components/auth-model/authModel"
import { toast } from "react-toastify"

function SpecGrid({ rows }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2">
      {rows.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className={`flex gap-3 px-4 py-3 border-b border-gray-200 ${
            index % 2 === 1 ? "bg-[#F5F5F5] sm:bg-transparent" : ""
          } ${Math.floor(index / 2) % 2 === 1 ? "sm:bg-[#F5F5F5]" : ""}`}
        >
          <dt className="w-28 sm:w-36 shrink-0 font-medium text-gray-700 text-sm">{label}</dt>
          <dd className="text-gray-900 text-sm break-words min-w-0">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

const GemstonePageViewPage = () => {
  const searchParams = useParams()
  const { accessToken, user } = useAccessToken()
  const { post, loading, error } = useApi()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const pendingProductId = useRef(null)
  const [selectedCertification, setSelectedCertification] = useState("Free Lab Certificate")
  const [selectedEnergization, setSelectedEnergization] = useState("No Energization")
  const [selectedOption, setSelectedOption] = useState("Loose Gemstone")
  const [productData, setProductData] = useState(null)

  const { slug, viewProduct } = searchParams

  const fetchProductData = async () => {
    try {
      const response = await api.get(`/products/${viewProduct}`)
      const apiData = response.data
      setProductData(apiData.data)
    } catch (error) {
      console.error("Error fetching product data:", error)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [slug, viewProduct])

  const handleAddCarWithToken = async (id, token = accessToken) => {
    try {
      const cartData = {
        productId: id,
        quantity: 1,
      }
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }

      // Using your useApi hook's post method
      const response = await post("/cart", cartData, options)

      toast.success("Product added to cart successfully!")
    } catch (err) {
      console.error("❌ Error Details:", {
        message: err.message || err.data?.message,
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

  const handleAddToCart = (id) => {
    console.log("🛒 Add to cart clicked for product:", id)

    if (!accessToken) {
      console.log("🔒 No access token, opening auth modal")
      pendingProductId.current = id
      setIsAuthModalOpen(true)
    } else {
      console.log("🔑 Access token found, proceeding with cart addition")
      handleAddCarWithToken(id)
    }
  }

  // Loading state
  if (!productData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#BA8E49]"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  // Safe data access with fallbacks
  const isJewellery = productData?.productType === "jewellery"
  const formatLabel = (value) =>
    value
      ? String(value)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : "Not specified"

  const safeProductData = {
    name: productData?.name || (isJewellery ? "Jewellery" : "Gemstone"),
    images: productData?.images || [],
    discountedPrice: productData?.discountedPrice || 0,
    originalPrice: productData?.originalPrice || 0,
    stock: productData?.stock || 0,
    _id: productData?._id || "",
    origin: productData?.origin || "Unknown",
    certification: productData?.certification || "Not Certified",
    poojaEnergization: productData?.poojaEnergization || "No Energization",
    description: productData?.description || "No description available",
    features: productData?.features || [],
    treatment: productData?.treatment || "Unknown",
    treatmentType: productData?.treatmentType || "Unknown",
    shape: productData?.shape || "Unknown",
    composition: productData?.composition || "Unknown",
    weightCarat: productData?.weightCarat || 0,
    colour: productData?.colour || "Unknown",
    dimensions: {
      length: productData?.dimensions?.length || 0,
      width: productData?.dimensions?.width || 0,
      height: productData?.dimensions?.height || 0,
    },
    specificGravity: productData?.specificGravity || "Unknown",
    refractiveIndex: {
      min: productData?.refractiveIndex?.min || 0,
      max: productData?.refractiveIndex?.max || 0,
    },
    dimensionType: productData?.dimensionType || "Unknown",
    weightRatti: productData?.weightRatti || 0,
    weight: productData?.weight || 0,
    isActive: productData?.isAvailable || false,
    metal: productData?.metal || "",
    jewelleryType: productData?.jewelleryType || "",
    goldPurity: productData?.goldPurity || "",
    size: productData?.size || "",
  }

  const breadcrumbs = [
    { name: "Home", href: "#" },
    { name: isJewellery ? "Jewellery" : "Gemstones", href: "#" },
    { name: safeProductData.name, href: "#" },
  ]

  // Safe image handling
  const currentImage = safeProductData.images[selectedImage] || null
  const hasImages = safeProductData.images.length > 0

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="px-4 py-3 border-gray-200">
        <div className="max-w-7xl mx-auto">
          <ol className="flex flex-wrap items-center gap-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center min-w-0 max-w-full">
                {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400 mx-1 shrink-0" />}
                <p className="text-black text-sm sm:text-base font-bold break-words">{item.name}</p>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-[#f7f5f0] rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={currentImage?.url || "/placeholder.svg?height=400&width=400&query=gemstone"}
                alt={currentImage?.alt || `${safeProductData.name} image`}
                width={800}
                height={1000}
                className="w-full h-auto max-h-[70vh] object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail Images */}
            {hasImages && (
              <div className="flex flex-wrap gap-3">
                {safeProductData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-lg overflow-hidden p-1.5 shrink-0 ${
                      selectedImage === index ? "border-orange-400" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image?.url || "/placeholder.svg?height=80&width=80&query=gemstone-thumbnail"}
                      alt={image?.alt || `${safeProductData.name} thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-5 lg:pt-2">
            <div className="space-y-4">
              <h1
                className="text-[1.65rem] sm:text-3xl leading-tight text-[#0f2e28] break-words"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {safeProductData.name}
              </h1>

              <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                <span className="text-2xl sm:text-[1.7rem] font-semibold text-[#0f2e28] leading-none">
                  {safeProductData.discountedPrice > 0
                    ? `Rs. ${safeProductData.discountedPrice.toLocaleString("en-IN")}`
                    : "Price not available"}
                </span>
                {safeProductData.originalPrice > safeProductData.discountedPrice &&
                  safeProductData.originalPrice > 0 && (
                    <span className="text-sm text-gray-400 line-through pb-0.5">
                      Rs. {safeProductData.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                {safeProductData.stock > 0 && (
                  <span className="mb-0.5 rounded-full bg-red-50 text-red-600 px-2.5 py-0.5 text-xs font-medium">
                    Only {safeProductData.stock} left
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#f7f5f0] px-3 py-1 text-xs text-gray-600">
                  SKU {safeProductData._id ? safeProductData._id.slice(-8).toUpperCase() : "N/A"}
                </span>
                {isJewellery ? (
                  <>
                    <span className="rounded-full bg-[#f7f5f0] px-3 py-1 text-xs text-gray-600">
                      {formatLabel(safeProductData.jewelleryType)}
                    </span>
                    <span className="rounded-full bg-[#f7f5f0] px-3 py-1 text-xs text-gray-600">
                      {formatLabel(safeProductData.metal)}
                    </span>
                  </>
                ) : (
                  <span className="rounded-full bg-[#f7f5f0] px-3 py-1 text-xs text-gray-600">
                    Origin: {safeProductData.origin}
                  </span>
                )}
              </div>

              {safeProductData.description && (
                <p className="text-sm sm:text-[15px] leading-relaxed text-gray-600 max-w-xl">
                  {safeProductData.description}
                </p>
              )}
            </div>

            {isJewellery ? (
              <>
                {safeProductData.goldPurity && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gold Purity</label>
                    <input
                      type="text"
                      value={safeProductData.goldPurity}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-md bg-[#F5F5F5] text-gray-900 cursor-not-allowed"
                    />
                  </div>
                )}
                {safeProductData.size && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <input
                      type="text"
                      value={safeProductData.size}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-md bg-[#F5F5F5] text-gray-900 cursor-not-allowed"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={safeProductData.certification}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-md bg-[#F5F5F5] text-gray-900 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pooja / Energization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={safeProductData.poojaEnergization}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-md bg-[#F5F5F5] text-gray-900 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select For Ring / Pendant / Bracelet <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: "Loose Gemstone", icon: "💎" },
                      { name: "Ring", icon: "💍" },
                      { name: "Pendant", icon: "📿" },
                      { name: "Bracelet", icon: "🔗" },
                    ].map((option) => (
                      <button
                        key={option.name}
                        onClick={() => setSelectedOption(option.name)}
                        title="This option is not available for now"
                        className={`p-4 cursor-not-allowed text-center border rounded-lg transition-colors flex flex-col items-center space-y-2 ${
                          selectedOption === option.name
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-2xl">{option.icon}</div>
                        <div className="text-xs font-medium text-gray-700">{option.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              onClick={safeProductData.stock > 0 ? () => handleAddToCart(safeProductData._id) : null}
              disabled={!safeProductData._id || !safeProductData.isActive || safeProductData.stock === 0}
              className="inline-flex items-center justify-center rounded-md bg-[#BA8E49] px-6 py-2 text-xs sm:text-sm font-semibold tracking-[0.12em] text-white hover:bg-[#a67b38] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {safeProductData.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
            </button>
          </div>
          
        </div>

        {/* Product Details Section */}
        <div className="mt-12 rounded-lg">
          <h2 className="text-base sm:text-xl font-bold text-gray-900 text-center mb-6 bg-[#BA8E4980] p-3 rounded break-words">
            Product Details: {safeProductData.name}
            {isJewellery
              ? safeProductData.jewelleryType
                ? ` - ${formatLabel(safeProductData.jewelleryType)}`
                : ""
              : safeProductData.weightCarat > 0
                ? ` - ${safeProductData.weightCarat} carats`
                : ""}
          </h2>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">{safeProductData.description}</p>
          </div>

          {/* Benefits Icons */}
          {safeProductData.features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
              {safeProductData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg- border border-[#BA8E49] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#BA8E49]" />
                  </div>
                  <span className="text-gray-700 font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* Specifications Table */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            {isJewellery ? (
              <SpecGrid
                rows={[
                  ["Jewellery", safeProductData.name],
                  ["Type", formatLabel(safeProductData.jewelleryType)],
                  ["Metal", formatLabel(safeProductData.metal)],
                  ["Purity", safeProductData.goldPurity || "Not specified"],
                  ["Size", safeProductData.size || "Not specified"],
                  [
                    "Weight (grams)",
                    safeProductData.weight > 0 ? safeProductData.weight : "Not specified",
                  ],
                ]}
              />
            ) : (
              <SpecGrid
                rows={[
                  ["Gemstone", safeProductData.name],
                  ["Treatment", safeProductData.treatment],
                  ["Treatment Type", safeProductData.treatmentType],
                  ["Certification", safeProductData.certification],
                  ["Shape", safeProductData.shape],
                  ["Composition", safeProductData.composition],
                  [
                    "Return Policy",
                    <span key="returns" className="text-black">
                      10 Day Money-Back <span className="text-[#BA8E49]">return policy</span>
                    </span>,
                  ],
                  [
                    "Weight (carat)",
                    safeProductData.weightCarat > 0 ? safeProductData.weightCarat : "Not specified",
                  ],
                  ["Colour", safeProductData.colour],
                  [
                    "Exact Dimensions",
                    safeProductData.dimensions.length > 0 &&
                    safeProductData.dimensions.width > 0 &&
                    safeProductData.dimensions.height > 0
                      ? `${safeProductData.dimensions.length}x${safeProductData.dimensions.width}x${safeProductData.dimensions.height} mm`
                      : "Not specified",
                  ],
                  ["Origin", safeProductData.origin],
                  ["Specific Gravity", safeProductData.specificGravity],
                  [
                    "Refractive Index",
                    safeProductData.refractiveIndex.min > 0 && safeProductData.refractiveIndex.max > 0
                      ? `${safeProductData.refractiveIndex.min} - ${safeProductData.refractiveIndex.max}`
                      : "Not specified",
                  ],
                  ["Dimension Type", safeProductData.dimensionType],
                  [
                    "Weight (ratti)",
                    safeProductData.weightRatti > 0 ? safeProductData.weightRatti : "Not specified",
                  ],
                  [
                    "Weight (grams)",
                    safeProductData.weight > 0 ? safeProductData.weight : "Not specified",
                  ],
                ]}
              />
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      <button className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50">
        <MessageCircle className="w-6 h-6" />
      </button>

      <FAQ />
      <BookService />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo="/cart"
        onSuccess={async (session) => {
          const id = pendingProductId.current
          pendingProductId.current = null
          if (!id || !session?.accessToken) return
          await handleAddCarWithToken(id, session.accessToken)
        }}
      />
    </div>
  )
}

export default GemstonePageViewPage
