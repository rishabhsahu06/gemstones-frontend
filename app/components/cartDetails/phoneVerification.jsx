import { useState } from "react"
import { X, Phone, Loader2, AlertCircle } from "lucide-react"

export default function PhoneVerificationModal({ 
  isOpen, 
  onClose, 
  onVerified, 
  onSubmit,
  isSubmitting = false 
}) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '')
    if (!phone.trim()) {
      return "Phone number is required"
    }
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return "Please provide a valid phone number"
    }
    if (!phone.startsWith('+')) {
      return "Please include country code (e.g., +91 for India)"
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const validationError = validatePhone(phoneNumber)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await onSubmit(phoneNumber)
      onVerified()
    } catch (err) {
      setError(err.message || "Failed to update phone number")
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value
    setPhoneNumber(value)
    if (error) setError("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#BA8E49] bg-opacity-10 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#BA8E49]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Verify Your Phone Number
              </h2>
              <p className="text-sm text-gray-600">
                Required for order delivery updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <p className="text-sm text-gray-700">
                We need your phone number to send order updates and delivery notifications.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="+91 9876543210"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Format:</strong> Include country code (e.g., +91 for India, +1 for US)
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isSubmitting || !phoneNumber.trim()}
              className="flex-1 px-4 py-3 bg-[#BA8E49] text-white rounded-lg font-medium hover:bg-[#A67B3E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Continue to Checkout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}