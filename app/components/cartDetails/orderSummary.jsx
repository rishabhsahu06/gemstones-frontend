"use client"
import { useState, useEffect } from "react"
import { MapPin, Loader2, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/useApi"
import useAccessToken from "@/hooks/userSession"
import { toast } from "react-toastify"
import { useSession } from "next-auth/react"
import PhoneVerificationModal from "./phoneVerification" // Import the modal component

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function OrderSummary({ userCart, isCheckingOut, onCheckout }) {
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressSubmitted, setAddressSubmitted] = useState(false)
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false)
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  })

  const { post,put } = useApi()
  const { accessToken } = useAccessToken()
  const { data: session, update: updateSession } = useSession()

  // Load Razorpay script on component mount
  useEffect(() => {
    loadRazorpayScript()
  }, [])

  const handleAddressChange = (field, value) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateAddress = () => {
    const { street, city, state, postalCode, country } = addressData
    return street.trim() && city.trim() && state.trim() && postalCode.trim() && country.trim()
  }

  const submitAddress = async () => {
    if (!validateAddress()) {
      toast.error("Please fill in all address fields")
      return
    }

    setIsSubmittingAddress(true)

    try {
      const result = await post("/auth/checkout-address", addressData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (result?.success) {
        setAddressSubmitted(true)
        setShowAddressForm(false)
        toast.success("Address saved successfully!")
      } else {
        toast.error("Failed to save address. Please try again.")
      }
    } catch (err) {
      console.error("Address submission failed:", err)
      toast.error("Failed to save address. Please try again.")
    } finally {
      setIsSubmittingAddress(false)
    }
  }

  // Phone verification functions
  const checkPhoneRequired = () => {
    return !session?.user?.phone
  }

  const handlePhoneSubmit = async (phoneNumber) => {
    setIsUpdatingPhone(true)
    
    try {
      // Updated API call to match backend structure
      const result = await put("/auth/updateprofile", 
        { phone: phoneNumber }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      // Handle backend response structure
      if (result?.success) {
        // Update the session with the new phone number from backend response
        const updatedUserData = result.data || result.user
        
        await updateSession({
          ...session,
          user: {
            ...session.user,
            phone: updatedUserData.phone || phoneNumber
          }
        })
        
        toast.success("Phone number updated successfully!")
        setShowPhoneModal(false)
        
        // Now proceed with checkout
        proceedToPayment()
      } else {
        const errorMessage = result?.message || "Failed to update phone number"
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Phone update failed:", error)
      
      // Handle different error types
      let errorMessage = "Failed to update phone number"
      
      if (error.response) {
        // API returned an error response
        errorMessage = error.response?.data?.message || errorMessage
      } else if (error.message) {
        // Custom error message
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsUpdatingPhone(false)
    }
  }

  const createRazorpayOrder = async () => {
    try {
      const response = await post("/orders/create-order", {
        shippingAddress: addressData
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response?.success) {
        return response
      } else {
        throw new Error(response?.message || "Failed to create order")
      }
    } catch (error) {
      console.error("Error creating Razorpay order:", error)
      throw error
    }
  }

  const verifyPayment = async (paymentData) => {
    try {
      const response = await post("/orders/verify-payment", paymentData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response?.success) {
        return response
      } else {
        throw new Error(response?.message || "Payment verification failed")
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      throw error
    }
  }

  const handleRazorpayPayment = async (orderData) => {
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Sunita Gemstone", 
      description: "Order Payment",
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          setIsProcessingPayment(true)
          
          // Verify payment with backend
          const verificationResult = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })

          if (verificationResult.success) {
            toast.success("Payment successful! Your order has been placed.")
            
            // Redirect to order confirmation or success page
            if (typeof window !== 'undefined') {
              window.location.href = `/orders/${verificationResult.orderId}`
            }
          }
        } catch (error) {
          console.error("Payment verification failed:", error)
          toast.error("Payment verification failed. Please contact support.")
        } finally {
          setIsProcessingPayment(false)
        }
      },
      prefill: {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        contact: session?.user?.phone || "",
      },
      notes: {
        address: `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.postalCode}`,
      },
      theme: {
        color: "#BA8E49",
      },
      modal: {
        ondismiss: function() {
          setIsProcessingPayment(false)
          toast.info("Payment cancelled")
        }
      }
    }

    if (window.Razorpay) {
      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error)
        toast.error(`Payment failed: ${response.error.description}`)
        setIsProcessingPayment(false)
      })
      razorpay.open()
    } else {
      toast.error("Razorpay is not loaded. Please refresh the page and try again.")
      setIsProcessingPayment(false)
    }
  }

  const proceedToPayment = async () => {
    try {
      setIsProcessingPayment(true)
      
      // Check if Razorpay script is loaded
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error("Payment system is not available. Please try again later.")
        return
      }

      // Create Razorpay order
      const orderData = await createRazorpayOrder()
      
      // Initialize Razorpay payment
      await handleRazorpayPayment(orderData)
      
    } catch (error) {
      console.error("Checkout failed:", error)
      toast.error(error.message || "Failed to initiate payment. Please try again.")
      setIsProcessingPayment(false)
    }
  }

  const handleCheckoutClick = async () => {
    if (!addressSubmitted) {
      setShowAddressForm(true)
      toast.info("Please provide your delivery address first")
      return
    }

    if (!userCart?.items?.length) {
      toast.error("Your cart is empty")
      return
    }

    // Check if phone verification is required
    if (checkPhoneRequired()) {
      setShowPhoneModal(true)
      return
    }

    // If phone is available, proceed directly to payment
    proceedToPayment()
  }

  return (
    <>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

          {/* Address Section */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Delivery Address</h3>
              {addressSubmitted && (
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-1" />
                  <span className="text-sm">Saved</span>
                </div>
              )}
            </div>

            {!addressSubmitted && !showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#BA8E49] hover:text-[#BA8E49] transition-colors"
              >
                <MapPin className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Add Delivery Address</span>
              </button>
            )}

            {addressSubmitted && !showAddressForm && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{addressData.street}</p>
                  <p>
                    {addressData.city}, {addressData.state} {addressData.postalCode}
                  </p>
                  <p>{addressData.country}</p>
                </div>
                <button onClick={() => setShowAddressForm(true)} className="text-sm text-[#BA8E49] hover:underline mt-2">
                  Edit Address
                </button>
              </div>
            )}

            {showAddressForm && (
              <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    value={addressData.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#BA8E49] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      value={addressData.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      placeholder="Mumbai"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#BA8E49] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={addressData.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#BA8E49] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      value={addressData.postalCode}
                      onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                      placeholder="400001"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#BA8E49] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      value={addressData.country}
                      onChange={(e) => handleAddressChange("country", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#BA8E49] focus:border-transparent"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={submitAddress}
                    disabled={isSubmittingAddress || !validateAddress()}
                    className="flex-1 py-2 px-4 bg-[#BA8E49] text-white rounded text-sm font-medium hover:bg-[#A67B3E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmittingAddress ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Address"
                    )}
                  </button>
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {addressSubmitted && (
              <p className="text-sm text-gray-600 text-right">
                <span className="font-semibold">Expected Dispatch Date: within 3-5 days</span>
              </p>
            )}
          </div>

          {/* Phone Number Warning for Google Users */}
          {checkPhoneRequired() && addressSubmitted && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-700">Phone number required for delivery updates</p>
            </div>
          )}

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
            <span className="text-xl font-bold text-gray-900">Rs. {userCart?.totalAmount?.toLocaleString()}.00</span>
          </div>

          {/* Address Required Warning */}
          {!addressSubmitted && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-700">Please add your delivery address to proceed</p>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckoutClick}
            disabled={isCheckingOut || isProcessingPayment || !userCart?.items?.length}
            className={`w-full mt-6 py-3 text-base font-semibold rounded-lg transition-colors duration-200 tracking-wide flex items-center justify-center ${
              addressSubmitted && !isProcessingPayment
                ? "bg-[#BA8E49] text-white hover:bg-[#A67B3E]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                PROCESSING PAYMENT...
              </>
            ) : isCheckingOut ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                PROCESSING...
              </>
            ) : (
              "PAY NOW"
            )}
          </button>

          {/* Payment Security Info */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              🔒 Secure payment powered by Razorpay
            </p>
          </div>

          {/* Continue Shopping */}
          <Link
            href="/products"
            className="block w-full mt-3 py-2 text-center text-sm font-medium text-[#BA8E49] hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onVerified={() => setShowPhoneModal(false)}
        onSubmit={handlePhoneSubmit}
        isSubmitting={isUpdatingPhone}
      />
    </>
  )
}