"use client"

import { useEffect, useState } from "react"
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

const GemstonePageViewPage = () => {
  const searchParams = useParams()
  const { accessToken, user } = useAccessToken()
  const { post, loading, error } = useApi()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
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

  const handleAddCarWithToken = async (id) => {
    try {
      const cartData = {
        productId: id,
        quantity: 1,
      }
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  const safeProductData = {
    name: productData?.name || "Gemstone",
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
  }

  const breadcrumbs = [
    { name: "Home", href: "#" },
    { name: "Gemstones", href: "#" },
    { name: safeProductData.name, href: "#" },
  ]

  // Safe image handling
  const currentImage = safeProductData.images[selectedImage] || null
  const hasImages = safeProductData.images.length > 0

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className=" px-4 py-3  border-gray-200">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400 mx-1" />}
                <p className={` text-black text-[16px] font-bold hover:text-black`}>{item.name}</p>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4  py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-8">
          {/* Image Section */}
          <div className="space-y-4 ">
            {/* Main Image */}
            <div className="bg-white border-gray-200 flex items-center justify-center">
              <Image
                src={currentImage?.url || "/placeholder.svg?height=400&width=400&query=gemstone"}
                alt={currentImage?.alt || `${safeProductData.name} image`}
                width={400}
                height={400}
                className="w-full h-full object-fill rounded-lg"
              />
            </div>

            {/* Thumbnail Images */}
            {hasImages && (
              <div className="flex space-x-3">
                {safeProductData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 border-2 rounded-lg overflow-hidden p-2 ${
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
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{safeProductData.name}</h1>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-2xl font-bold text-gray-900">
                  Rs.{" "}
                  {safeProductData.discountedPrice > 0
                    ? safeProductData.discountedPrice.toLocaleString()
                    : "Price not available"}
                </span>
                {safeProductData.originalPrice > safeProductData.discountedPrice &&
                  safeProductData.originalPrice > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      Rs. {safeProductData.originalPrice.toLocaleString()}
                    </span>
                  )}
                {safeProductData.stock > 0 && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    Only {safeProductData.stock} Left
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                <span>
                  <strong>SKU:</strong> {safeProductData._id ? safeProductData._id.slice(-8).toUpperCase() : "N/A"}
                </span>
                <span>
                  <strong>Origin:</strong> {safeProductData.origin}
                </span>
              </div>
            </div>

            {/* Certification Dropdown */}
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

            {/* Pooja Energization Dropdown */}
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

            {/* Selection Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select For Ring / Pendant / Bracelet <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
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

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(safeProductData._id)}
              disabled={!safeProductData._id}
              className="w-full bg-[#BA8E49] text-white py-2 px-6 rounded-md font-bold text-lg hover:bg-[#BA8E49] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              ADD CART
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6 bg-[#BA8E4980] p-3 rounded">
            Product Details: {safeProductData.name} -{" "}
            {safeProductData.weightCarat > 0 ? `${safeProductData.weightCarat} carats` : "Weight not specified"}
          </h2>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">{safeProductData.description}</p>
          </div>

          {/* Benefits Icons */}
          {safeProductData.features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-[70%]">
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
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700">Gemstone</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.name}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Treatment</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.treatment}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Treatment Type</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.treatmentType}</td>
                </tr>
                <tr className="border-b border-gray-200 bg-[#F5F5F5]">
                  <td className="px-4 py-3 font-medium text-gray-700">Certification</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.certification}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Shape</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.shape}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Composition</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.composition}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700">Return Policy</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    <span className="text-black">
                      10 Day Money-Back <span className="text-[#BA8E49]">return policy</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">Weight (carat)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    {safeProductData.weightCarat > 0 ? safeProductData.weightCarat : "Not specified"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">Colour</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.colour}</td>
                </tr>
                <tr className="border-b border-gray-200 bg-[#F5F5F5]">
                  <td className="px-4 py-3 font-medium text-gray-700">Exact Dimensions</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    {safeProductData.dimensions.length > 0 &&
                    safeProductData.dimensions.width > 0 &&
                    safeProductData.dimensions.height > 0
                      ? `${safeProductData.dimensions.length}x${safeProductData.dimensions.width}x${safeProductData.dimensions.height} mm`
                      : "Not specified"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">Origin</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.origin}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Specific Gravity</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.specificGravity}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700">Refractive Index</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    {safeProductData.refractiveIndex.min > 0 && safeProductData.refractiveIndex.max > 0
                      ? `${safeProductData.refractiveIndex.min} - ${safeProductData.refractiveIndex.max}`
                      : "Not specified"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">Dimension Type</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{safeProductData.dimensionType}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Weight (ratti)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    {safeProductData.weightRatti > 0 ? safeProductData.weightRatti : "Not specified"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-700 bg-[#F5F5F5]">Weight (grams)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    {safeProductData.weight > 0 ? safeProductData.weight : "Not specified"}
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-2 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-2 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      <button className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50">
        <MessageCircle className="w-6 h-6" />
      </button>

      <FAQ />
      <BookService />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}

export default GemstonePageViewPage
