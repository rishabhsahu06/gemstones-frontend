"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, ArrowLeft } from "lucide-react"
import { countryCodes } from "@/app/constant/constant"
import api from "@/lib/axios"

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState("phone") // "phone" or "otp"
  const [mode, setMode] = useState("signin") // "signin" or "register"
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [fullphone, setFullphone] = useState("")
  const [tempUserId, setTempUserId] = useState(null)

  const handlePhoneSubmit = async () => {
    // Validate inputs for registration
    if (mode === "register" && (!name.trim() || !validateEmail(email))) {
      alert(name.trim() ? "Please enter a valid email address" : "Please enter your full name")
      return
    }
const endPoint = mode === "signin" ? "/auth/login-otp" : "/auth/send-otp"
    if (phone.trim()) {
      setIsLoading(true)
      try {
        const formattedPhone = `${countryCode}${phone.replace(/\D/g, "")}`
        setFullphone(formattedPhone)

        console.log(`Sending OTP for ${mode} to:`, formattedPhone)

        // API call to send OTP
        const response = await api.post(endPoint, {

          phone: formattedPhone,
          // type: mode, // 'signin' or 'register'
          ...(mode === "register" && { name, email }), // Include name and email only for registration
        })

        if (response.data.success || response.status === 200) {
          // Store tempUserId from response - note the nested data structure
          if (response.data.data?.tempUserId) {
            setTempUserId(response.data.data.tempUserId)
            console.log("Temp User ID stored:", response.data.data.tempUserId)
          }
          setStep("otp")
        } else {
          alert(response.data?.message || response.message  || "Failed to send OTP. Please try again.")
        }
      } catch (error) {
        console.error(`Error sending OTP:`, error)
        alert(error.response?.data?.message|| response.data?.message || response.message  ||"Failed to send OTP. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      setIsLoading(true)
      try {
        const apiEndpoint = mode === "signin" ? "/auth/verify-login-otp" : "/auth/verify-otp"

        // Prepare request body based on mode
        const requestBodyForRegistration = {
          phone: fullphone,
          otp: otpValue,
          tempUserId: tempUserId,
          password:"Password@123", // Default password for testing, should be handled securely in production
        }
     const   requestBodyForSignin = {
         
          otp: otpValue,
          tempUserId: tempUserId,
       
        }

      //  Add name and email for registration
        if (mode === "register") {
          requestBodyForRegistration.name = name
          requestBodyForRegistration.email = email
        }

        const response = await api.post(apiEndpoint, mode === "signin" ? requestBodyForSignin : requestBodyForRegistration)

        if (response.data.success || response.status === 200) {
          const data = response.data.data || response.data
          console.log(`${mode} successful:`, data)

          // Handle successful authentication
          if (mode === "signin") {
            // Store auth token, redirect, etc.
            localStorage.setItem("authToken", data.token)
            alert("Login successful!")
          } else {
            // Handle successful registration
            localStorage.setItem("authToken", data.token)
            alert("Registration successful!")
          }

          // Reset and close modal
          resetModal()
          onClose()
        } else {
          alert(response.data?.message || "Invalid OTP. Please try again.")
        }
      } catch (error) {
        console.error(`Error verifying OTP:`, error)
        alert("Failed to verify OTP. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const formatphone = (value) => {
    const digits = value.replace(/\D/g, "")

    if (countryCode === "+1") {
      if (digits.length >= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
      } else if (digits.length >= 3) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
      }
    } else {
      if (digits.length >= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      } else if (digits.length >= 3) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`
      }
    }
    return digits
  }

  const handlePhoneChange = (e) => {
    const formatted = formatphone(e.target.value)
    setPhone(formatted)
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "register" : "signin")
    setPhone("")
    setName("")
    setEmail("")
    setOtp(["", "", "", "", "", ""])
    setStep("phone")
  }

  const resetModal = () => {
    setStep("phone")
    setPhone("")
    setName("")
    setEmail("")
    setOtp(["", "", "", "", "", ""])
    setFullphone("")
    setTempUserId(null)
  }

  const goBackToPhone = () => {
    setStep("phone")
    setOtp(["", "", "", "", "", ""])
  }

  const resendOtp = async () => {
    setIsLoading(true)
    try {
      const requestBody = {
        phone: fullphone,
        // type: mode,
        tempUserId: tempUserId,
      }

      // Include name and email for registration resend
      // if (mode === "register") {
      //   requestBody.name = name
      //   requestBody.email = email
      // }

      const response = await api.post("auth/resend-otp", requestBody)

      if (response.data.success || response.status === 200) {
        // Update tempUserId from resend response - note the nested data structure
        if (response.data?.tempUserId) {
          setTempUserId(response.data.tempUserId)
          console.log("New Temp User ID stored after resend:", response.data.tempUserId)
        }
        alert("OTP resent successfully!")
        setOtp(["", "", "", "", "", ""])
      } else {
        alert("Failed to resend OTP. Please try again.")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      alert("Failed to resend OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={onClose}
            disabled={isLoading}
          >
            {/* <X className="h-4 w-4" /> */}
          </Button>

          {step === "otp" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -left-2 h-6 w-6"
              onClick={goBackToPhone}
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <DialogTitle className="text-center text-xl font-semibold">
            {step === "phone" ? (mode === "signin" ? "Welcome Back" : "Create Account") : "Verify Your Phone"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {step === "phone"
              ? mode === "signin"
                ? "Sign in to your account to continue"
                : "Create a new account to get started"
              : `We've sent a 6-digit code to ${fullphone}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {step === "phone" ? (
            <>
              {/* Registration-only fields */}
              {mode === "register" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              {/* Phone number field (for both signin and register) */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[110px] border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{selectedCountry?.flag}</span>
                          <span className="font-medium">{countryCode}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px]">
                      {countryCodes.map((country, index) => (
                        <SelectItem
                          key={`${country.code}-${country.country}-${index}`}
                          value={country.code}
                          className="hover:bg-amber-50 focus:bg-amber-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 py-1">
                            <span className="text-lg">{country.flag}</span>
                            <span className="font-medium">{country.country}</span>
                            <span className="text-gray-500 ml-auto">{country.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={countryCode === "+1" ? "(123) 456-7890" : "123 456 7890"}
                    value={phone}
                    onChange={handlePhoneChange}
                    className="flex-1 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                    disabled={isLoading}
                    maxLength={countryCode === "+1" ? 14 : 15}
                  />
                </div>
              </div>

              <Button
                onClick={handlePhoneSubmit}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2"
                disabled={
                  !phone.trim() ||
                  isLoading ||
                  (mode === "register" && (!name.trim() || !validateEmail(email)))
                }
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>

              <div className="text-center">
                <p className="text-sm cursor-pointer text-gray-600">
                  {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={toggleMode}
                    className="text-amber-700 cursor-pointer hover:text-amber-800 font-medium underline"
                    disabled={isLoading}
                  >
                    {mode === "signin" ? "Sign up" : "Sign in"}
                  </button> 
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Enter 6-digit code</Label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleOtpSubmit}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2"
                disabled={otp.join("").length !== 6 || isLoading}
              >
                {isLoading ? "Verifying..." : `${mode === "signin" ? "Sign In" : "Create Account"}`}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    onClick={resendOtp}
                    className="text-amber-700 hover:text-amber-800 font-medium underline"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                </p>
                <p className="text-sm cursor-pointer text-gray-600">
                  {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={toggleMode}
                    className="text-amber-700 cursor-pointer hover:text-amber-800 font-medium underline"
                    disabled={isLoading}
                  >
                    {mode === "signin" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
