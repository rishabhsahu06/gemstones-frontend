"use client"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import { Filter, Search, ChevronRight, Loader2 } from "lucide-react"
import { debounce } from "lodash"
import { useRouter } from "next/navigation"
import useAccessToken from "@/hooks/userSession"
import { toast } from "react-toastify"
import ProductSkeleton from "@/app/components/skeleton/productSkeleton"
import ProductCard from "./productCard"
import { useApi } from "@/hooks/useApi"
import Link from "next/link"
import AuthModal from "@/app/components/auth-model/authModel"

function Products() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [isAvailable, setIsAvailable] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
 const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { get, post, loading, error } = useApi()
  const { accessToken } = useAccessToken()
  const router = useRouter()
  // Intersection Observer ref
  const loadMoreRef = useRef(null)
  const observerRef = useRef(null)

  // Build query parameters for API
  const buildQueryParams = useCallback(
    (page = 1) => {
      const params = new URLSearchParams()

      // Search
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim())
      }

      // Category filtering
      if (selectedCategory !== "all") {
        params.append("primaryCategory", selectedCategory)
      }

      // Price filtering
      if (minPrice) {
        params.append("minPrice", minPrice)
      }
      if (maxPrice) {
        params.append("maxPrice", maxPrice)
      }

      // Availability
      if (isAvailable !== "all") {
        params.append("isAvailable", isAvailable)
      }

      // Sorting
      let sortQuery = ""
      switch (sortBy) {
        case "price-low":
          sortQuery = "discountedPrice"
          break
        case "price-high":
          sortQuery = "-discountedPrice"
          break
        case "rating":
          sortQuery = "-ratings.average"
          break
        case "name":
          sortQuery = "name"
          break
        case "newest":
        default:
          sortQuery = "-createdAt"
          break
      }
      params.append("sort", sortQuery)

      // Pagination
      params.append("page", page.toString())
      params.append("limit", "20") // Increased limit for better infinite scroll experience

      return params.toString()
    },
    [searchTerm, selectedCategory, sortBy, minPrice, maxPrice, isAvailable],
  )

  // Fetch products data
  const fetchProducts = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) {
          setIsInitialLoading(true)
        } else {
          setIsLoadingMore(true)
        }

        const queryString = buildQueryParams(page)
        console.log("Fetching products with query:", queryString)

        const headers = {}
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`
        }

        const result = await get(`/products?${queryString}`, {
          headers: Object.keys(headers).length > 0 ? headers : undefined,
        })

        console.log("Products fetch result:", result)

        if (result?.success && result?.data) {
          const newProducts = result.data

          if (append && page > 1) {
            // Append new products for infinite scroll
            setProducts((prevProducts) => {
              // Remove duplicates based on product ID
              const existingIds = new Set(prevProducts.map((p) => p._id))
              const uniqueNewProducts = newProducts.filter((p) => !existingIds.has(p._id))
              return [...prevProducts, ...uniqueNewProducts]
            })
          } else {
            // Replace products for new search/filter
            setProducts(newProducts)
          }

          setTotalProducts(result.total || 0)
          setHasNextPage(result.pagination?.hasNextPage || false)
          setCurrentPage(page)
        } else {
          console.error("Invalid products response:", result)
          toast.error("Could not retrieve products. Please try again.")
        }
      } catch (err) {
        console.error("GET request failed:", err)
        console.error("Error details:", err.response?.data)
        toast.error("Failed to load products. Please refresh the page.")
      } finally {
        setIsInitialLoading(false)
        setIsLoadingMore(false)
      }
    },
    [buildQueryParams, accessToken, get],
  )

  // Load more products for infinite scroll
  const loadMoreProducts = useCallback(() => {
    if (!isLoadingMore && hasNextPage && !loading) {
      fetchProducts(currentPage + 1, true)
    }
  }, [fetchProducts, currentPage, hasNextPage, isLoadingMore, loading])

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasNextPage && !isLoadingMore && !isInitialLoading) {
          loadMoreProducts()
        }
      },
      {
        root: null,
        rootMargin: "100px", // Start loading 100px before the element comes into view
        threshold: 0.1,
      },
    )

    observerRef.current = observer

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreProducts, hasNextPage, isLoadingMore, isInitialLoading])

  // Debounced search to avoid too many API calls
  const debouncedFetchProducts = useCallback(
    debounce(() => {
      setCurrentPage(1)
      setProducts([]) // Clear existing products
      fetchProducts(1, false)
    }, 500),
    [fetchProducts],
  )

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
if(response?.success) {
  toast.success("Product added to cart successfully!")
 
}
    

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
  // Add to cart function
  const handleAddToCart = async (product) => {
   console.log("🛒 Add to cart clicked for product:", product._id)

    if (!accessToken) {
      console.log("🔒 No access token, opening auth modal")
      setIsAuthModalOpen(true)
    } else {
      console.log("🔑 Access token found, proceeding with cart addition")
      handleAddCarWithToken(product._id)
      // Uncomment below to try alternative method if the above doesn't work
      // handleAddCarWithTokenAlternative(id)
    }
  }

  // Get unique categories from current products
  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.primaryCategory))]
  }, [products])

  // Fetch products when filters change
  useEffect(() => {
    debouncedFetchProducts()
    return () => {
      debouncedFetchProducts.cancel()
    }
  }, [debouncedFetchProducts])

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSortBy("newest")
    setMinPrice("")
    setMaxPrice("")
    setIsAvailable("all")
    setCurrentPage(1)
    setProducts([])
  }

  // Memoized product cards for performance
  const productCards = useMemo(() => {
    return products.map((product) => (
      <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} isAddingToCart={isAddingToCart} />
    ))
  }, [products, isAddingToCart, handleAddToCart])

  return (
    <div className="min-h-screen ">
      {/* Breadcrumb */}
      <div className="bg-white my-2 ">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="font-medium text-black hover:underline">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Products</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our premium collection of gemstones</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="col-span-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="col-span-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Availability */}
            <div className="col-span-1">
              <select
                value={isAvailable}
                onChange={(e) => setIsAvailable(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:border-transparent"
              >
                <option value="all">All Products</option>
                <option value="true">Available Only</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Price Range + Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Price Range */}
            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Price Range:</label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:border-transparent"
              />
            </div>

            {/* Total Count or Loading */}
            <div className="flex items-center text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              {isInitialLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </div>
              ) : (
                <>
                  {products.length} of {totalProducts} products
                  {hasNextPage && <span className="ml-2 text-sm text-gray-500">(scroll for more)</span>}
                </>
              )}
            </div>

            {/* Clear Filters */}
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load products. Please try again.</p>
            <button
              onClick={() => fetchProducts(1, false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isInitialLoading
            ? // Loading skeletons for initial load
              [...Array(8)].map((_, index) => <ProductSkeleton key={index} />)
            : // Actual products (memoized for performance)
              productCards}
        </div>

        {/* Infinite Scroll Loading Indicator */}
        {!isInitialLoading && hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center items-center mt-8 py-8">
            {isLoadingMore ? (
              <div className="flex items-center text-gray-600">
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Loading more products...
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Scroll down to load more products</div>
            )}
          </div>
        )}

        {/* End of Results Indicator */}
        {!isInitialLoading && !hasNextPage && products.length > 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm">You've reached the end of the results</div>
          </div>
        )}

        {/* No Products Found */}
        {!isInitialLoading && products.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#BA8E49] text-white rounded-lg hover:bg-[#A67B3E] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
    </div>
  )
}

export default Products
