"use client"
import React, { useState, useEffect } from 'react';
import { User, Package, Eye, Calendar, MapPin, CreditCard, ArrowLeft, RefreshCw, LogOut, AlertCircle, Wifi, WifiOff } from 'lucide-react';

import AuthModal from '@/app/components/auth-model/authModel';
import useAccessToken from '@/hooks/userSession';
import { useApi } from '@/hooks/useApi';
import { signOut } from 'next-auth/react';

// Loading Skeleton Components
const OrderSkeleton = () => (
  <div className="border rounded-lg p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center space-x-4 mb-2">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
    
    <div className="flex items-center space-x-4 mb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
    
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-48"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

const OrderDetailSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-8 bg-gray-200 rounded w-32"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>

      <div>
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8">
      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="text-right">
              <div className="h-5 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error, onRetry, type = "general" }) => {
  const getErrorIcon = () => {
    if (error?.includes('network') || error?.includes('fetch')) {
      return <WifiOff className="h-8 w-8 text-red-400" />;
    }
    return <AlertCircle className="h-8 w-8 text-red-400" />;
  };

  const getErrorMessage = () => {
    if (error?.includes('network')) return 'Network connection error. Please check your internet connection.';
    if (error?.includes('unauthorized')) return 'Session expired. Please sign in again.';
    if (error?.includes('404')) return 'The requested data could not be found.';
    return error || 'An unexpected error occurred. Please try again.';
  };

  return (
    <div className="text-center py-12">
      {getErrorIcon()}
      <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
        {type === 'orders' ? 'Failed to Load Orders' : 'Something went wrong'}
      </h3>
      <p className="text-gray-600 mb-4 max-w-md mx-auto">{getErrorMessage()}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-golden text-white px-4 py-2 rounded-lg hover:bg-golden-dark transition-colors mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

const UserProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);
  const [error, setError] = useState(null);
  const [orderDetailsError, setOrderDetailsError] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { get } = useApi();
  const { accessToken } = useAccessToken();

  useEffect(() => {
    if (!accessToken) {
      setIsAuthModalOpen(true);
      setIsInitialLoading(false);
      return;
    }
    fetchOrders();
  }, [accessToken]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await get("/orders", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.status === 401) {
        setError('Session expired. Please sign in again.');
      } else {
        setError('An error occurred while fetching orders. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setIsLoadingOrderDetails(true);
      setOrderDetailsError(null);
      
      const result = await get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (result.success) {
        setSelectedOrder(result.data);
      } else {
        setOrderDetailsError(result.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        setOrderDetailsError('Network error. Please check your connection and try again.');
      } else if (err.status === 401) {
        setOrderDetailsError('Session expired. Please sign in again.');
      } else {
        setOrderDetailsError('Failed to fetch order details. Please try again.');
      }
    } finally {
      setIsLoadingOrderDetails(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(price || 0);
    } catch (error) {
      return `₹${price || 0}`;
    }
  };

  // Show auth modal if not authenticated
  if (!accessToken) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600">Please sign in to access your profile and orders.</p>
          </div>
        </div>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </>
    );
  }

  // Show order details view
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoadingOrderDetails ? (
            <OrderDetailSkeleton />
          ) : orderDetailsError ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setOrderDetailsError(null);
                  }}
                  className="flex items-center text-golden hover:text-golden-dark transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </button>
              </div>
              <ErrorDisplay 
                error={orderDetailsError} 
                onRetry={() => fetchOrderDetails(selectedOrder._id)}
                type="order-details"
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center text-golden hover:text-golden-dark transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </button>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status || 'Unknown'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Order ID:</span> #{selectedOrder._id?.slice(-8) || 'N/A'}</p>
                    <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                    <p><span className="font-medium">Total Amount:</span> {formatPrice(selectedOrder.totalAmount)}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentInfo?.method || 'N/A'}</p>
                    <p><span className="font-medium">Payment Status:</span> 
                      <span className="ml-2 capitalize text-green-600">{selectedOrder.paymentInfo?.status || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p>{selectedOrder.shippingAddress?.street || 'N/A'}</p>
                        <p>{selectedOrder.shippingAddress?.city || 'N/A'}, {selectedOrder.shippingAddress?.state || 'N/A'}</p>
                        <p>{selectedOrder.shippingAddress?.postalCode || 'N/A'}</p>
                        <p>{selectedOrder.shippingAddress?.country || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.length > 0 ? selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name || 'Unknown Product'}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price)}</p>
                        <p className="text-sm text-gray-600">each</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-600 text-center py-4">No items found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main profile view
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-golden-light p-3 rounded-full">
                <User className="h-8 w-8 text-golden" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your orders and account information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchOrders}
                disabled={isLoading}
                className="flex cursor-pointer items-center space-x-2 bg-golden text-white px-4 py-2 rounded-lg hover:bg-golden-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4  w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold">My Orders</h2>
            <span className="bg-golden-light text-golden px-2 py-1 rounded-full text-sm">
              {orders.length} orders
            </span>
          </div>

          {/* Error Display */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Error loading orders</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={fetchOrders}
                className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Loading State */}
          {(isLoading || isInitialLoading) ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <OrderSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorDisplay 
              error={error} 
              onRetry={fetchOrders}
              type="orders"
            />
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">When you place your first order, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold">Order #{order._id?.slice(-8) || 'N/A'}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          {order.paymentInfo?.method || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatPrice(order.totalAmount)}</p>
                      <p className="text-sm text-gray-600">{order.items?.length || 0} item(s)</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <img
                        key={index}
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.name || 'Product'}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ))}
                    {(order.items?.length || 0) > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
                        +{(order.items?.length || 0) - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {order.items?.[0]?.name || 'Unknown Product'}
                      {(order.items?.length || 0) > 1 && ` and ${(order.items?.length || 0) - 1} more item(s)`}
                    </div>
                    <button
                      onClick={() => fetchOrderDetails(order._id)}
                      className="flex items-center space-x-2 text-golden hover:text-golden-dark transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span className='cursor-pointer'>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen && !accessToken} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <style jsx>{`
        .bg-golden {
          background-color: #BA8E49;
        }
        .bg-golden-dark {
          background-color: #9f7639;
        }
        .bg-golden-light {
          background-color: #f4ead5;
        }
        .text-golden {
          color: #BA8E49;
        }
        .text-golden-dark {
          color: #9f7639;
        }
        .hover\\:bg-golden-dark:hover {
          background-color: #9f7639;
        }
        .hover\\:text-golden-dark:hover {
          color: #9f7639;
        }
      `}</style>
    </div>
  );
};

export default UserProfilePage;