"use client"
import { useEffect, useState } from "react"
import { Plus, Minus, ChevronRight, Trash2, Loader2 } from 'lucide-react'
import { useApi } from "@/hooks/useApi"
import useAccessToken from "@/hooks/userSession"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-toastify"
import api from "@/lib/axios"
import CartLoadingSkeleton from "../skeleton/cartSkeleton"
import UnableToLoadCart from "./unableToLoadCart"
import CartIsEmpty from "./cartIsEmpty"
import OrderSummary from "./orderSummary"
import AuthModal from "../auth-model/authModel"

function Cart() {
  const [userCart, setUserCartDetails] = useState(null)
  const [isUpdating, setIsUpdating] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
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
        `/cart/${itemId}`,
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
      const result = await api.delete(`/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

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

        toast.success(result?.message || "Item has been removed from your cart.")
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
    else  {
      setIsAuthModalOpen(true)
    }
  }, [accessToken, get])

  console.log(userCart, "userCart")

  // Show auth modal when no access token
  if (!accessToken && isAuthModalOpen) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your cart.</p>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    )
  }

  // Empty cart state
  if (!loading && (!userCart || !userCart.items || userCart.items.length === 0)) {
    return <CartIsEmpty />
  }

  // Error state
  if (error) {
    return <UnableToLoadCart />
  }

  // Loading state
  if (loading && !userCart) {
    return <CartLoadingSkeleton />
  }

  return (
    <div className="">
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

      <div className="container mx-auto px-4 py-8 mt-2">
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

          {/* Order Summary Component */}
          <OrderSummary userCart={userCart} isCheckingOut={isCheckingOut} onCheckout={handleCheckout} />
        </div>
      </div>

      {/* Auth Modal - positioned at root level for proper visibility */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}

export default Cart