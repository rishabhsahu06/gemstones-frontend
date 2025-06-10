"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock, 
  MapPin, 
  CreditCard, 
  Download,
  ArrowLeft,
  Loader2,
  AlertCircle,
  XCircle,
  User
} from "lucide-react"
import { useApi } from "@/hooks/useApi"
import useAccessToken from "@/hooks/userSession"
import { toast } from "react-toastify"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderDetails
  console.log("Order ID:", params)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  
  const { get, put } = useApi()
  const { accessToken } = useAccessToken()

  useEffect(() => {
    if (orderId && accessToken) {
      fetchOrderDetails()
    }
  }, [orderId, accessToken])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response?.success) {
        setOrder(response.data)
      } else {
        setError(response?.message || "Order not found")
      }
    } catch (err) {
      console.error("Error fetching order:", err)
      const errorMessage = err?.response?.data?.message || "Failed to load order details"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return
    }

    try {
      setCancelling(true)
      const response = await put(`/orders/${orderId}/cancel`, {
        reason: "Cancelled by customer"
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response?.success) {
        setOrder(response.data)
        toast.success("Order cancelled successfully")
      } else {
        toast.error(response?.message || "Failed to cancel order")
      }
    } catch (err) {
      console.error("Error cancelling order:", err)
      const errorMessage = err?.response?.data?.message || "Failed to cancel order"
      toast.error(errorMessage)
    } finally {
      setCancelling(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const getEstimatedDelivery = (orderDate) => {
    if (!orderDate) return 'N/A'
    const orderDateObj = new Date(orderDate)
    const estimatedDate = new Date(orderDateObj.getTime() + (5 * 24 * 60 * 60 * 1000)) // Add 5 days
    return estimatedDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const canCancelOrder = (status) => {
    return ['pending', 'confirmed', 'processing'].includes(status?.toLowerCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#BA8E49]" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
          <Link
            href="/-/orders"
            className="inline-flex items-center px-4 py-2 bg-[#BA8E49] text-white rounded-lg hover:bg-[#A67B3E] transition-colors mr-4"
          >
            View All Orders
          </Link>
          <Link
            href="/-/products"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-[#BA8E49] hover:text-[#A67B3E] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
                {order.deliveredAt && (
                  <p className="text-green-600 text-sm mt-1">
                    Delivered on {formatDate(order.deliveredAt)}
                  </p>
                )}
                {order.cancelledAt && (
                  <p className="text-red-600 text-sm mt-1">
                    Cancelled on {formatDate(order.cancelledAt)}
                    {order.cancellationReason && ` - ${order.cancellationReason}`}
                  </p>
                )}
              </div>
              
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2 capitalize">{order.status}</span>
                </div>
                
                {/* {canCancelOrder(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {cancelling ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )} */}
              </div>
            </div>

            {/* Success Message for Recent Orders */}
            {order.status?.toLowerCase() === 'pending' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">
                      Order Placed Successfully!
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      Thank you for your order. We'll process it soon and send you updates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Number */}
            {order.trackingNumber && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">
                      Tracking Number
                    </h3>
                    <p className="text-sm text-blue-700 mt-1 font-mono">
                      {order.trackingNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Information */}
            {order.user && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500" />
                  Customer Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{order.user.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{order.user.email || 'N/A'}</p>
                  </div>
                  {order.user.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{order.user.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Items */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || item.product?.images?.[0]?.url || "/api/placeholder/80/80"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/80/80"
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      {item.product?.category && (
                        <p className="text-xs text-gray-400 capitalize">
                          {item.product.category}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                Shipping Address
              </h2>
              
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress?.street || 'N/A'}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>{order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-gray-500" />
                Delivery Information
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">
                    {order.deliveredAt 
                      ? formatDate(order.deliveredAt)
                      : getEstimatedDelivery(order.createdAt)
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping Method:</span>
                  <span className="font-medium">Standard Delivery</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tracking Status:</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>

                {order.trackingNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tracking Number:</span>
                    <span className="font-mono text-sm">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            
            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                Payment Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{order.paymentInfo?.method || 'Razorpay'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentInfo?.status === 'captured' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentInfo?.status === 'captured' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs text-gray-500">
                    {order.paymentInfo?.id?.slice(-8) || 'N/A'}
                  </span>
                </div>

                {order.paymentInfo?.orderId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Razorpay Order ID:</span>
                    <span className="font-mono text-xs text-gray-500">
                      {order.paymentInfo.orderId.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({order.summary?.totalItems || order.items?.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order.summary?.subtotal || order.totalAmount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Included</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </button>
                
                <Link
                  href="/-/user"
                  className="w-full flex items-center justify-center px-4 py-2 border border-[#BA8E49] text-[#BA8E49] rounded-lg hover:bg-[#BA8E49] hover:text-white transition-colors"
                >
                  View All Orders
                </Link>
                
                <Link
                  href="/-/products"
                  className="w-full flex items-center justify-center px-4 py-2 bg-[#BA8E49] text-white rounded-lg hover:bg-[#A67B3E] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}