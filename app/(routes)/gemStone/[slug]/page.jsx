"use client"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CategoryCard from "@/app/components/category-cards/categoryCards"
import api from "@/lib/axios"
import GemstoneLoading from "@/app/components/skeleton/gemstoneLoading"

export default function GemstoneDetailPage({ params }) {
  // Unwrap the params Promise
  const unwrappedParams = use(params)

  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [filters, setFilters] = useState({
    price: "",
    weight: "",
    shape: "",
    origin: "",
  })

  // Fetch gemstone data when params change
  useEffect(() => {
    const fetchGemstoneData = async () => {
      if (!unwrappedParams.slug) return

      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/products/get-primaryCategory/${unwrappedParams.slug}`)
        const apiData = response.data

        console.log("API Response:", apiData)

        if (apiData.success && apiData.data && apiData.data.length > 0) {
          setAllProducts(apiData.data)
          setFilteredProducts(apiData.data)

          // Use the first product to get category information
          const firstProduct = apiData.data[0]

          // Get all unique product benefits from all products
          const allBenefits = apiData.data.reduce((acc, product) => {
            if (product.productBenefits && product.productBenefits.length > 0) {
              product.productBenefits.forEach((benefit) => {
                if (!acc.includes(benefit)) {
                  acc.push(benefit)
                }
              })
            }
            return acc
          }, [])

          setCategoryInfo({
            name: firstProduct.primaryCategory.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            description: `Discover our premium collection of ${firstProduct.primaryCategory.replace("-", " ")} gemstones. Each piece is carefully selected and certified for quality and authenticity.`,
            productBenefits: allBenefits,
          })
        } else {
          setError("No products found for this category")
        }
      } catch (err) {
        console.error("Error fetching gemstone data:", err)
        setError("Failed to load gemstone data")
      } finally {
        setLoading(false)
      }
    }

    fetchGemstoneData()
  }, [unwrappedParams.slug])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let filtered = [...allProducts]

    // Price filter
    if (filters.price) {
      if (filters.price === "low-to-high") {
        filtered.sort((a, b) => (a.discountedPrice || a.originalPrice) - (b.discountedPrice || b.originalPrice))
      } else if (filters.price === "high-to-low") {
        filtered.sort((a, b) => (b.discountedPrice || b.originalPrice) - (a.discountedPrice || a.originalPrice))
      }
    }

    // Weight filter
    if (filters.weight) {
      filtered = filtered.filter((product) => {
        const carat = product.weightCarat
        switch (filters.weight) {
          case "1-3":
            return carat >= 1 && carat <= 3
          case "3-5":
            return carat > 3 && carat <= 5
          case "5-10":
            return carat > 5 && carat <= 10
          case "10+":
            return carat > 10
          default:
            return true
        }
      })
    }

    // Shape filter
    if (filters.shape) {
      filtered = filtered.filter(
        (product) => product.shape && product.shape.toLowerCase() === filters.shape.toLowerCase(),
      )
    }

    // Origin filter
    if (filters.origin) {
      filtered = filtered.filter(
        (product) => product.origin && product.origin.toLowerCase().includes(filters.origin.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }, [filters, allProducts])

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      price: "",
      weight: "",
      shape: "",
      origin: "",
    })
  }

  // Simulating a token check (replace with actual authentication logic)
  const token = false

  const AddToCart = (productId) => {
    if (!token) {
      alert("Please login to add products to cart.")
    } else {
      console.log("Adding product to cart:", productId)
    }
  }

  // Get unique values for filter options
  const getUniqueShapes = () => {
    const shapes = allProducts.map((p) => p.shape).filter(Boolean)
    return [...new Set(shapes)]
  }

  const getUniqueOrigins = () => {
    const origins = allProducts.map((p) => p.origin).filter(Boolean)
    return [...new Set(origins)]
  }

  // Loading state
  if (loading) {
    return (
      <div >
        <GemstoneLoading />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white mt-4">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  // Not found state
  if (!categoryInfo && !loading) {
    return (
      <div className="min-h-screen bg-white mt-4">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="text-lg">No products found for this category</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white mt-4">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 ">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <div className="hover:text-gray-900">Gemstones</div>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{categoryInfo?.name || unwrappedParams.slug}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-12 ">
        <h1 className="text-4xl font-bold text-gray-900 my-4  ">{categoryInfo?.name || unwrappedParams.slug}</h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-5 max-w-4xl">{categoryInfo?.description}</p>

        {/* Benefits section */}
        {categoryInfo?.productBenefits && categoryInfo.productBenefits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose {categoryInfo.name} Stone?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryInfo.productBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg- border border-[#BA8E49] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#BA8E49]" />
                  </div>
                  <span className="text-gray-700 font-semibold">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Products ({filteredProducts.length} of {allProducts.length})
            </h3>
            {(filters.price || filters.weight || filters.shape || filters.origin) && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="text-sm">
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.price} onValueChange={(value) => handleFilterChange("price", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low-to-high">Low to High</SelectItem>
                <SelectItem value="high-to-low">High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.weight} onValueChange={(value) => handleFilterChange("weight", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Weight(Carat)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1-3 Carats</SelectItem>
                <SelectItem value="3-5">3-5 Carats</SelectItem>
                <SelectItem value="5-10">5-10 Carats</SelectItem>
                <SelectItem value="10+">10+ Carats</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.shape} onValueChange={(value) => handleFilterChange("shape", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Shape" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueShapes().map((shape) => (
                  <SelectItem key={shape} value={shape.toLowerCase()}>
                    {shape}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.origin} onValueChange={(value) => handleFilterChange("origin", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Origin" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueOrigins().map((origin) => (
                  <SelectItem key={origin} value={origin.toLowerCase()}>
                    {origin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <CategoryCard key={product._id} product={product} slug={unwrappedParams.slug} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products match your current filters.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
