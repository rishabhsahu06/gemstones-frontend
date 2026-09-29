"use client"
import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Smartphone, Mail, Lock, KeyRound } from "lucide-react"
import { countryCodes } from "@/app/constant/constant"
import api from "@/lib/axios"
import { toast } from "react-toastify"

export default function AuthModal({ isOpen, onClose }) {
  const [authMethod, setAuthMethod] = useState("otp") // "otp" or "email"
  const [mode, setMode] = useState("signin") // "signin" or "register"
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  })
  
  const [countryCode, setCountryCode] = useState("+91") // Default +91 for India
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // OTP state
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const formatPhone = (value) => {
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
    const formatted = formatPhone(e.target.value)
    handleInputChange("phone", formatted)
  }

  const getFullPhone = () => {
    const digits = formData.phone.replace(/\D/g, "")
    return `${countryCode}${digits}`
  }

  // --- Send OTP via MSG91 ---
  const handleSendOtp = async () => {
    const digits = formData.phone.replace(/\D/g, "")
    if (!digits || digits.length < 7) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const fullPhone = getFullPhone()
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setOtpSent(true)
        setResendTimer(30)
        toast.success(data.message || "OTP sent to your phone!")
      } else {
        setError(data.message || "Failed to send OTP. Please try again.")
        toast.error(data.message || "Failed to send OTP")
      }
    } catch (err) {
      console.error("Send OTP error:", err)
      setError("Network error sending OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // --- Verify OTP & Login ---
  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.trim().length < 4) {
      setError("Please enter the OTP sent to your mobile")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const fullPhone = getFullPhone()
      const result = await signIn("credentials", {
        redirect: false,
        phone: fullPhone,
        otp: formData.otp.trim(),
        isOtp: "true",
      })

      if (result?.ok && !result?.error) {
        const session = await getSession()
        if (session) {
          toast.success("Logged in successfully with OTP!")
          resetModal()
          onClose()
        } else {
          setError("Session creation failed after OTP verification.")
        }
      } else {
        const errorMessage = result?.error || "Invalid OTP. Please check and try again."
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (err) {
      console.error("OTP login error:", err)
      setError("Network error verifying OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // --- Email/Password Sign In ---
  const handleSignIn = async () => {
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.ok && !result?.error) {
        const session = await getSession()
        if (session) {
          toast.success("Login successful! Welcome back.")
          resetModal()
          onClose()
        } else {
          setError("Session creation failed. Please try again.")
        }
      } else {
        let errorMessage = "Invalid email or password. Please try again."
        if (result?.error === "CredentialsSignin") {
          errorMessage = "Invalid credentials. Please check your email and password."
        }
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Sign-in error:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // --- Registration ---
  const handleRegister = async () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name")
      return
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!formData.phone.trim()) {
      setError("Please enter your phone number")
      return
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const formattedPhone = getFullPhone()

      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formattedPhone,
        role: "user",
      })

      if (response.data.success || response.status === 200 || response.status === 201) {
        toast.success("Registration successful! Logging you in...")
        // Automatically sign in with NextAuth Credentials
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })
        if (signInResult?.ok) {
          resetModal()
          onClose()
        } else {
          setMode("signin")
          setAuthMethod("email")
        }
      } else {
        setError(response.data?.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "register" : "signin")
    setOtpSent(false)
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      otp: "",
    })
    setError("")
  }

  const resetModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      otp: "",
    })
    setError("")
    setShowPassword(false)
    setOtpSent(false)
    setResendTimer(0)
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {mode === "signin" ? "Welcome to Gemstones" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {mode === "signin"
              ? "Sign in using Phone OTP or Email credentials"
              : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Mode Tabs for Sign In */}
          {mode === "signin" && (
            <div className="flex border-b border-gray-200 mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("otp")
                  setError("")
                }}
                className={`flex-1 pb-2 font-medium text-sm border-b-2 flex items-center justify-center gap-2 transition-colors ${
                  authMethod === "otp"
                    ? "border-amber-700 text-amber-800"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Phone OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("email")
                  setError("")
                }}
                className={`flex-1 pb-2 font-medium text-sm border-b-2 flex items-center justify-center gap-2 transition-colors ${
                  authMethod === "email"
                    ? "border-amber-700 text-amber-800"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email & Password
              </button>
            </div>
          )}

          {/* PHONE OTP LOGIN FLOW */}
          {mode === "signin" && authMethod === "otp" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-phone" className="text-sm font-medium">
                  Mobile Number
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode} disabled={otpSent || isLoading}>
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
                    id="otp-phone"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="flex-1 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                    disabled={otpSent || isLoading}
                  />
                </div>
              </div>

              {!otpSent ? (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <KeyRound className="w-4 h-4" />
                  {isLoading ? "Sending OTP..." : "Send OTP via MSG91"}
                </Button>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="otp-input" className="text-sm font-medium">
                        Enter OTP Code
                      </Label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-xs text-amber-700 hover:underline"
                        disabled={isLoading}
                      >
                        Change Number
                      </button>
                    </div>
                    <Input
                      id="otp-input"
                      type="text"
                      maxLength={6}
                      placeholder="Enter 4 or 6 digit OTP"
                      value={formData.otp}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 text-center tracking-widest text-lg"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </Button>

                  <div className="text-center pt-1">
                    {resendTimer > 0 ? (
                      <p className="text-xs text-gray-500">
                        Resend OTP in <span className="font-semibold text-gray-700">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs text-amber-700 hover:text-amber-800 font-medium underline"
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* EMAIL/PASSWORD SIGN IN FLOW */}
          {mode === "signin" && authMethod === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleSignIn}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          )}

          {/* REGISTRATION FLOW */}
          {mode === "register" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone" className="text-sm font-medium">
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
                    id="reg-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="flex-1 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleRegister}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          )}

          {/* Toggle between Sign in & Registration */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-amber-700 hover:text-amber-800 font-medium underline"
                disabled={isLoading}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}