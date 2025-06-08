"use client"

import { use, useEffect, useState } from "react"
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
     const { accessToken, user } = useAccessToken();
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
    fetchProductData();
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
           'Content-Type': 'application/json',
         },
       }
 
       // Using your useApi hook's post method
       const response = await post("/cart", cartData, options)
 
       toast.success("Product added to cart successfully!")

 
     } catch (err) {
       console.error("❌ Error Details:", {
         message: err.message || err.data.message,
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

  const breadcrumbs = [
    { name: "Home", href: "#" },
    { name: "Gemstones", href: "#" },
    { name: productData.name, href: "#" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className=" px-4 py-3  border-gray-200">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400 mx-1" />}
                <p
                  className={` text-black text-[16px] font-bold hover:text-black`}
                >
                  {item.name}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4  py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-8">
          {/* Image Section */}
          <div className="space-y-4 ">
            {/* Main Image aspect-square */}
            <div className="   bg-white   border-gray-200  flex items-center justify-center">
              <Image
                src={productData.images?.[selectedImage]?.url || "/placeholder.svg?height=400&width=400"}
                alt={productData.images?.[selectedImage]?.alt || "Product image"}
                width={400}
                height={400}
                className="w-full  h-full object-fill rounded-lg "
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {productData.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border-2 rounded-lg overflow-hidden p-2 ${
                    selectedImage === index ? "border-orange-400" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image.url || "/placeholder.svg?height=80&width=80"}
                    alt={image.alt}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl  font-bold text-gray-900 mb-3">{productData.name}</h1>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-2xl font-bold text-gray-900">Rs. {productData.discountedPrice?.toLocaleString()}</span>
                {productData.originalPrice > productData.discountedPrice && (
                  <span className="text-lg text-gray-500 line-through">Rs. {productData.originalPrice?.toLocaleString()}</span>
                )}
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  Only {productData.stock} Left
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                <span>
                  <strong className="">SKU:</strong> {productData._id?.slice(-8).toUpperCase()}
                </span>
                <span>
                  <strong>Origin:</strong> {productData.origin}
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
                value={productData.certification}
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
                value={productData.poojaEnergization}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md bg-[#F5F5F5] text-gray-900 cursor-not-allowed"
              />
            </div>

            {/* Selection Options */}
            <div>
              <label className="block  text-sm font-medium text-gray-700 mb-3">
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
            <button  onClick={() => handleAddToCart(productData._id)} className="w-full bg-[#BA8E49] text-white py-2 px-6 rounded-md font-bold text-lg hover:bg-[#BA8E49] cursor-pointer transition-colors">
              ADD CART
            </button> 
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12  rounded-lg ">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6 bg-[#BA8E4980] p-3 rounded">
            Product Details: {productData.name} - {productData.weightCarat} carats
          </h2>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              {productData.description}
            </p>
          </div>

          {/* Benefits Icons */}
          {productData.features && productData.features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-[70%]">
              {productData.features.map((feature, index) => (
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
                  <td className="px-4 py-3 font-medium text-gray-700 ">Gemstone</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.name}</td>
                  <td className="px-4 py-3 font-medium text-gray-700 ">Treatment</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.treatment}</td>
                  <td className="px-4 py-3 font-medium text-gray-700 ">Treatment Type</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.treatmentType}</td>
                </tr>
                <tr className="border-b border-gray-200 bg-[#F5F5F5]">
                  <td className="px-4 py-3 font-medium text-gray-700">Certification</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.certification}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Shape</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.shape}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Composition</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.composition}</td>
                </tr>
                <tr className="border-b border-gray-200 ">
                  <td className="px-4 py-3 font-medium text-gray-700">Return Policy</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    <span className="text-black">10 Day Money-Back <span className="text-[#BA8E49]">return policy</span></span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">Weight (carat)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.weightCarat}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Colour</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.colour}</td>
                </tr>
                <tr className="border-b border-gray-200 bg-[#F5F5F5]">
                  <td className="px-4 py-3 font-medium text-gray-700">Exact Dimensions</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    {productData.dimensions.length}x{productData.dimensions.width}x{productData.dimensions.height} mm
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">Origin</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.origin}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Specific Gravity</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.specificGravity}</td>
                </tr>
                <tr className="border-b border-gray-200 ">
                  <td className="px-4 py-3 font-medium text-gray-700">Refractive Index</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    {productData.refractiveIndex.min} - {productData.refractiveIndex.max}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">Dimension Type</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.dimensionType}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Weight (ratti)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.weightRatti}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-700 bg-[#F5F5F5]">Weight (grams)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">{productData.weight}</td>
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