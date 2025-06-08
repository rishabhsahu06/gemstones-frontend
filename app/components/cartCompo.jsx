"use client"
import { useEffect, useState } from "react"
import { MapPin, Plus, Minus, ShoppingCart, AlertCircle, Loader2, ChevronRight, Trash2 } from "lucide-react"
import { useApi } from "@/hooks/useApi"
import useAccessToken from "@/hooks/userSession"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-toastify"
import api from "@/lib/axios"
import CartLoadingSkeleton from "./skeleton/cartSkeleton"


function Cart() {
  const [pincode, setPincode] = useState("480661")
  const [userCart, setUserCartDetails] = useState(null)
  const [isUpdating, setIsUpdating] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const { get, post, put, delete: del, loading, error } = useApi()
  const { accessToken } = useAccessToken()

  // Fetch cart data
  const fetchProductData = async () => {
    try {
      console.log("Fetching cart data with token:", accessToken ? "Present" : "Missing")

      const result = await get("/cart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      console.log("Cart fetch result:", result)

      if (result?.success && result?.data) {
        setUserCartDetails(result.data)
      } else {
        console.error("Invalid cart response:", result)
        toast.error("Could not retrieve your cart items. Please try again.")
      }
    } catch (err) {
      console.error("GET request failed:", err)
      console.error("Error details:", err.response?.data)
      toast.error("Failed to load your cart. Please refresh the page.")
    }
  }

  // Update item quantity
  const updateItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    setIsUpdating(itemId)
    console.log("Updating item:", itemId, "to quantity:", newQuantity)

    try {
      const result = await put(
        `/cart/${itemId}`, // Fixed: was `/cat/${itemId}`
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      console.log("Update result:", result)

      if (result?.success) {
        // Update local state to avoid refetching
        setUserCartDetails((prev) => {
          if (!prev) return prev

          const updatedItems = prev.items.map((item) => {
            if (item._id === itemId) {
              return {
                ...item,
                quantity: newQuantity,
                subtotal: item.price * newQuantity,
              }
            }
            return item
          })

          const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)

          return {
            ...prev,
            items: updatedItems,
            totalAmount: newTotalAmount,
          }
        })

        toast.success("Item quantity updated")
      } else {
        toast.error("Failed to update quantity. Please try again.")
      }
    } catch (err) {
      console.error("Update request failed:", err)
      toast.error("Failed to update item quantity. Please try again.")
    } finally {
      setIsUpdating(null)
    }
  }

  // Remove item from cart
  const removeItem = async (itemId) => {
    setIsUpdating(itemId)
    console.log("Removing item:", itemId)

    try {
      const result = await api.delete(
        `/cart/${itemId}`, // DELETE request to /cart/:itemId
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      console.log("Remove result:", result.success)

      if (result) {
        // Update local state
        setUserCartDetails((prev) => {
          if (!prev) return prev

          const updatedItems = prev.items.filter((item) => item._id !== itemId)
          const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)

          return {
            ...prev,
            items: updatedItems,
            totalAmount: newTotalAmount,
          }
        })

        toast.success( result?.message||"Item has been removed from your cart.")
      } else {
        toast.error("Failed to remove item. Please try again.")
      }
    } catch (err) {
      console.error("Remove request failed:", err)
      console.error("Error details:", err.response?.data)
      toast.error(err.response?.data?.message || "Failed to remove item from cart. Please try again.")
    } finally {
      setIsUpdating(null)
    }
  }

  // Proceed to checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true)

    try {
      // Simulate checkout process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to checkout page
      window.location.href = "/checkout"
    } catch (err) {
      console.error("Checkout failed:", err)
      toast.error("Unable to proceed to checkout. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchProductData()
    }
  }, [accessToken, get])

  console.log(userCart, "userCart")

  // Empty cart state
  if (!loading && (!userCart || !userCart.items || userCart.items.length === 0)) {
    return (
      <div className="min-h-screen ">
        {/* Breadcrumb */}
        <div className="bg-white ">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="font-medium text-black hover:underline">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span>Your Shopping Cart</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="text-gray-600 max-w-md">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/-/products"
              className="px-6 py-3 bg-[#BA8E49] text-white rounded-lg font-medium hover:bg-[#A67B3E] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="font-medium text-black hover:underline">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span>Your Shopping Cart</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Unable to load your cart</h1>
            <p className="text-gray-600 max-w-md">
              We encountered an error while trying to load your cart. Please try again.
            </p>
            <button
              onClick={fetchProductData}
              className="px-6 py-3 bg-[#BA8E49] text-white rounded-lg font-medium hover:bg-[#A67B3E] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading && !userCart) {
    return (
      <CartLoadingSkeleton />
    )
  }

  return (
    <div className=" ">
      {/* Breadcrumb */}
      <div className="bg-white mt-4">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-md text-gray-600">
            <Link href="/" className="font-medium text-black hover:underline">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Your Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="container  mx-auto px-4 py-8 mt-2 ">
        {/* <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Shopping Cart</h1> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {userCart?.items?.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-md flex-shrink-0">
                    <Image
                      src={item.product.images?.[0]?.url || "/placeholder.svg?height=128&width=128&query=gemstone"}
                      alt={item.product.images?.[0]?.alt || item.product.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-lg font-semibold text-gray-900 hover:text-[#BA8E49]"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item._id)}
                        disabled={isUpdating === item._id}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        {isUpdating === item._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5 cursor-pointer" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Origin:</span>
                        <span className="text-gray-700">{item.product.origin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Certification:</span>
                        <span className="text-gray-700">{item.product.certification}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Pooja/Energization:</span>
                        <span className="text-gray-700">{item.product.poojaEnergization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Weight:</span>
                        <span className="text-gray-700">{item.product.weightCarat} Carat</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating === item._id}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600 cursor-pointer" />
                        </button>

                        <span className="text-base font-medium text-gray-900 min-w-[1.5rem] text-center">
                          {isUpdating === item._id ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>

                        <button
                          onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock || isUpdating === item._id}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4 cursor-pointer text-gray-600" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          <span className="line-through">Rs. {item.product.originalPrice?.toLocaleString()}.00</span>
                        </p>
                        <p className="text-lg font-bold text-gray-900">Rs. {item.subtotal?.toLocaleString()}.00</p>
                      </div>
                    </div>

                    {/* Stock warning */}
                    {item.product.stock <= 5 && (
                      <p className="text-sm text-orange-600 font-medium">Only {item.product.stock} left in stock!</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Delivery Details */}
              <div className="space-y-4 mb-6">
                <h3 className="text-base font-semibold text-gray-900">Delivery Details:</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#BA8E49] focus:border-transparent"
                      placeholder="Enter pincode"
                    />
                  </div>
                  <button className="bg-green-500 hover:bg-green-600 p-2 rounded transition-colors">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 text-right">
                  <span className="font-semibold">Expected Dispatch Date: 05 Jun, 2025</span>
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({userCart?.items?.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className="font-medium">Rs. {userCart?.totalAmount?.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  Rs. {userCart?.totalAmount?.toLocaleString()}.00
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || !userCart?.items?.length}
                className="w-full mt-6 py-3 text-base font-semibold bg-[#BA8E49] text-white rounded-lg transition-colors duration-200 tracking-wide hover:bg-[#A67B3E] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  "PROCEED TO CHECKOUT"
                )}
              </button>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="block w-full mt-3 py-2 text-center text-sm font-medium text-[#BA8E49] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
