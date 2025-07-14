"use client"
import { signIn, getSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import { countryCodes } from "@/app/constant/constant"
import api from "@/lib/axios"
import { toast } from "react-toastify"

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("signin") // "signin" or "register"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })
  const [countryCode, setCountryCode] = useState("+1")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

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

  const validateForm = () => {
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (mode === "register") {
      if (!formData.name.trim()) {
        setError("Please enter your full name")
        return false
      }
      if (!formData.phone.trim()) {
        setError("Please enter your phone number")
        return false
      }
    }

    return true
  }

  const handleSignIn = async () => {
    if (!validateForm()) return

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

  const handleRegister = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const formattedPhone = `${countryCode}${formData.phone.replace(/\D/g, "")}`

      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formattedPhone,
        role: "user", // Default role as specified
      })

      if (response.data.success || response.status === 200 || response.status === 201) {
        toast.success("Registration successful! Please sign in.")
        setMode("signin")
        setFormData((prev) => ({ ...prev, name: "", phone: "" }))
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const result = await signIn("google", { 
        redirect: false,
        callbackUrl: window.location.href // Use current page as callback
      })

      if (result?.ok && !result?.error) {
        // Wait a moment for session to be created
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const session = await getSession()
        if (session) {
          toast.success("Google sign-in successful! Welcome.")
          resetModal()
          onClose()
        } else {
          setError("Session creation failed after Google sign-in. Please try again.")
        }
      } else if (result?.error) {
        console.error("Google sign-in error:", result.error)
        
        let errorMessage = "Google sign-in failed. Please try again."
        
        if (result.error === "OAuthSignin") {
          errorMessage = "Google sign-in was cancelled or failed. Please try again."
        } else if (result.error === "OAuthCallback") {
          errorMessage = "Google authentication callback failed. Please check your configuration."
        } else if (result.error === "AccessDenied") {
          errorMessage = "Access denied. Please allow permissions and try again."
        }
        
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("Google sign-in failed. Please try again.")
      toast.error("Google sign-in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

  const toggleMode = () => {
    setMode(mode === "signin" ? "register" : "signin")
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
    })
    setError("")
  }

  const resetModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
    })
    setError("")
    setShowPassword(false)
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {mode === "signin" ? "Sign in to your account to continue" : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

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
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                  disabled={isLoading}
                />
              </div>

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
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="flex-1 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                    disabled={isLoading}
                    maxLength={countryCode === "+1" ? 14 : 15}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email field */}
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

          {/* Password field */}
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

          {/* Submit button */}
          <Button
            onClick={mode === "signin" ? handleSignIn : handleRegister}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2"
            disabled={isLoading}
          >
            {isLoading
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with.</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Toggle mode */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
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