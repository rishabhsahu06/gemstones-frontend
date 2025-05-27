"use client"

import { useState } from "react"
import { Check, ChevronRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import FAQ from "@/app/Home/faq"
import BookService from "@/app/Home/book-service"

const GemstonePageViewPage = ({ productData }) => {
  console.log("Product Data:", productData)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedCertification, setSelectedCertification] = useState("Free Lab Certificate")
  const [selectedEnergization, setSelectedEnergization] = useState("No Energization")
  const [selectedOption, setSelectedOption] = useState("Loose Gemstone")

  // Sample data structure based on your provided data
  const data = productData || {
    name: "Yellow Sapphire (Pukhraj)",
    originalPrice: 8500,
    discountedPrice: 8500,
    origin: "Sri Lanka",
    certification: "Free Lab Certificate",
    poojaEnergization: "No Energization",
    images: [
      { url: "/ankles.png", alt: "Yellow Sapphire main view" },
      { url: "/earring.png", alt: "Yellow Sapphire side view" },
      { url: "/choker.png", alt: "Yellow Sapphire close view" },
    ],
    dimensions: { length: 11.8, width: 9.0, height: 4.1 },
    weight: 0.84,
    shape: "Oval",
    treatment: "Unheated and Untreated (No Indications Observed)",
    treatmentType: "Faceted",
    composition: "Natural",
    returnPolicy: "10 Day Money-back Returns Policy",
    colour: "Yellow",
    dimensionType: "Not Calibrated",
    stock: 1,
    sku: "GM91953",
  }

  const breadcrumbs = [
    { name: "Home", href: "#" },
    { name: "Gemstones", href: "#" },
    { name: "Yellow Sapphire", href: "#" },
    { name: "Yellow Sapphire - 7.56 carats/G", href: "#", current: true },
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center">
              <Image
                src={data.images?.[selectedImage]?.url || "/placeholder.svg?height=400&width=400"}
                alt={data.images?.[selectedImage]?.alt || "Product image"}
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {data.images?.map((image, index) => (
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
              <h1 className="text-2xl  font-bold text-gray-900 mb-3">{data.name}</h1>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-2xl font-bold text-gray-900">Rs. {data.discountedPrice?.toLocaleString()}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">Only 1 Left</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                <span>
                  <strong className="">SKU:</strong> {data.sku}
                </span>
                <span>
                  <strong>Origin:</strong> {data.origin}
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
                value={data.certification}
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
                value={data.poojaEnergization}
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
            <button className="w-full bg-[#BA8E49] text-white py-2 px-6 rounded-md font-bold text-lg hover:bg-[#BA8E49] cursor-pointer transition-colors">
              ADD CART
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12  rounded-lg ">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6 bg-[#BA8E4980] p-3 rounded">
            Product Details: Yellow Sapphire - 7.56 carats
          </h2>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              Here is a brilliant Yellow Sapphire of 4.25 carats. (1.65 ratti) in a regal oval shape. The Sapphire
              exhibits a captivating yellow colour with a higher clarity grade and excellent lustre, bringing a aura.
              The incredible gemstone's expert mixed cut gives it a charming shine.
            </p>
          </div>

          {/* Benefits Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-[70%]">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg- border border-[#BA8E49] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#BA8E49]" />
              </div>
              <span className="text-gray-700 font-semibold">Financial Growth</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg- border border-[#BA8E49] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#BA8E49]" />
              </div>
              <span className="text-gray-700 font-semibold">Promotes Good Health</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg- border border-[#BA8E49] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#BA8E49]" />
              </div>
              <span className="text-gray-700 font-semibold">Reduces Stress</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg- border border-[#BA8E49] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#BA8E49]" />
              </div>
              <span className="text-gray-700 font-semibold">Enhances Memory</span>
            </div>
         
          </div>

          {/* Specifications Table */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700 ">Gemstone</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Yellow Sapphire</td>
                  <td className="px-4 py-3 font-medium text-gray-700 ">Treatment</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Unheated and Untreated (No Indications Observed)</td>
                  <td className="px-4 py-3 font-medium text-gray-700 ">Treatment</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Faceted</td>
                </tr>
                <tr className="border-b border-gray-200 bg-[#F5F5F5]">
                  <td className="px-4 py-3 font-medium text-gray-700">Certification</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Free Lab Certificate</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Shape</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Oval</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Composition</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Natural</td>
                </tr>
                <tr className="border-b border-gray-200 ">
                  <td className="px-4 py-3 font-medium text-gray-700">Return Policy</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">
                    <span className="text-black">10 Day Money-Back <span className="text-[#BA8E49]">return policy</span></span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">Weight (carat)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">0.84</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Colour</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Yellow</td>
                </tr>
                <tr className="border-b border-gray-200 bg-[#F5F5F5]">
                  <td className="px-4 py-3 font-medium text-gray-700">Exact Dimensions</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">11.8x9.0x4.1 mm</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Origin</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Sri Lanka (Ceylon)</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Specific Gravity</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">4</td>
                </tr>
                <tr className="border-b border-gray-200 ">
                  <td className="px-4 py-3 font-medium text-gray-700">Refractive Index</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">1.760 - 1.770</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Dimension Type</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">Not Calibrated</td>
                  <td className="px-4 py-3 font-medium text-gray-700">Weight (ratti)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">4.60</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-700 bg-[#F5F5F5]">Weight (grams)</td>
                  <td className="px-2 py-3 text-center">:</td>
                  <td className="px-4 py-3 text-gray-900">0.84</td>
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
    </div>
  )
}

export default GemstonePageViewPage
