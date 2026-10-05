"use client"
import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Smartphone, Mail, KeyRound } from "lucide-react"
import { countryCodes } from "@/app/constant/constant"
import api from "@/lib/axios"
import { toast } from "react-toastify"
import {
  isMsg91WidgetConfigured,
  initMsg91CustomWidget,
  sendMsg91Otp,
  retryMsg91Otp,
  verifyMsg91Otp,
  extractAccessToken,
  extractReqId,
} from "@/lib/msg91-widget"

const fieldClass =
  "border-[var(--border)] bg-white focus-visible:ring-[var(--gold)] focus-visible:border-[var(--gold)]"
const primaryBtnClass =
  "w-full bg-[var(--ink)] hover:bg-[var(--ink-soft)] text-[var(--ink-foreground)] font-medium py-2.5 tracking-wide"
const linkClass = "text-[var(--gold)] hover:opacity-80 font-medium underline underline-offset-2"

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} [props.redirectTo] - where to go after successful login (default: /cart on cart page, else /user)
 * @param {() => void} [props.onSuccess] - optional callback after login
 */
export default function AuthModal({ isOpen, onClose, redirectTo, onSuccess }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authMethod, setAuthMethod] = useState("otp")
  const [mode, setMode] = useState("signin")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  })
  const [countryCode, setCountryCode] = useState("+91")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [otpReqId, setOtpReqId] = useState(null)
  const useBrowserWidget = isMsg91WidgetConfigured()

  useEffect(() => {
    if (!isOpen || !useBrowserWidget || mode !== "signin" || authMethod !== "otp") return
    initMsg91CustomWidget().catch((err) => {
      console.error("MSG91 init:", err)
    })
  }, [isOpen, useBrowserWidget, mode, authMethod])

  useEffect(() => {
    if (resendTimer <= 0) return undefined
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const getNationalDigits = () => {
    let digits = formData.phone.replace(/\D/g, "")
    // Strip trunk prefix 0 (common India entry mistake)
    if (countryCode === "+91" && digits.startsWith("0")) digits = digits.slice(1)
    return digits
  }

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "")
    if (countryCode === "+91" && digits.startsWith("0")) digits = digits.slice(1)
    digits = digits.slice(0, countryCode === "+91" ? 10 : 15)
    if (countryCode === "+1") {
      if (digits.length >= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
      if (digits.length >= 3) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else if (digits.length >= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
    } else if (digits.length >= 3) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`
    }
    return digits
  }

  const handlePhoneChange = (e) => handleInputChange("phone", formatPhone(e.target.value))

  const getFullPhone = () => `${countryCode}${getNationalDigits()}`
  const getMsg91Identifier = () => `${countryCode.replace("+", "")}${getNationalDigits()}`

  const finishAuthenticatedSession = async (session, successMessage) => {
    if (session?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("token", session.accessToken)
    }
    toast.success(successMessage)
    resetModal()
    onClose?.()
    onSuccess?.(session)

    const target =
      redirectTo ||
      (pathname?.startsWith("/cart")
        ? "/cart"
        : pathname?.startsWith("/user")
          ? "/user"
          : "/user")

    // Open account/cart so user can see profile + cart items
    router.push(target)
    router.refresh()
  }

  const completeOtpLogin = async (accessToken, fullPhone) => {
    const result = await signIn("credentials", {
      redirect: false,
      phone: fullPhone,
      accessToken,
      isOtp: "true",
    })
    if (result?.ok && !result?.error) {
      const session = await getSession()
      if (session?.accessToken) {
        await finishAuthenticatedSession(session, "Logged in successfully with OTP!")
        return
      }
      throw new Error("Session creation failed after OTP verification.")
    }
    throw new Error(
      result?.error && result.error !== "CredentialsSignin"
        ? result.error
        : "Login failed after OTP verification."
    )
  }

  const handleSendOtp = async () => {
    const digits = getNationalDigits()
    if (countryCode === "+91") {
      if (!/^[6-9]\d{9}$/.test(digits)) {
        setError("Enter a valid 10-digit Indian mobile number")
        return
      }
    } else if (!digits || digits.length < 7) {
      setError("Please enter a valid phone number")
      return
    }

    if (!useBrowserWidget) {
      setError("MSG91 is not configured. Add NEXT_PUBLIC_MSG91_WIDGET_ID and TOKEN.")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      const data = otpSent
        ? await retryMsg91Otp(otpReqId)
        : await sendMsg91Otp(getMsg91Identifier())
      const reqId = extractReqId(data)
      if (reqId) setOtpReqId(reqId)
      setOtpSent(true)
      setResendTimer(30)
      toast.success("OTP sent to your phone")
    } catch (err) {
      console.error("Send OTP error:", err)
      const message = err.message || "Failed to send OTP"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const otpValue = formData.otp.trim()
    if (otpValue.length < 4) {
      setError("Enter the OTP sent to your mobile")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      const verifyData = await verifyMsg91Otp(otpValue, otpReqId)
      const accessToken = extractAccessToken(verifyData)
      if (!accessToken) throw new Error("MSG91 did not return an access token")
      await completeOtpLogin(accessToken, getFullPhone())
    } catch (err) {
      console.error("Verify OTP error:", err)
      const message = err.message || "Invalid OTP. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

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
        if (session?.accessToken) {
          await finishAuthenticatedSession(session, "Login successful! Welcome back.")
        } else {
          setError("Session creation failed. Please try again.")
        }
      } else {
        const errorMessage =
          result?.error === "CredentialsSignin"
            ? "Invalid credentials. Please check your email and password."
            : "Invalid email or password. Please try again."
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name")
      return
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!getNationalDigits()) {
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
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: getFullPhone(),
        role: "user",
      })
      if (response.data.success || response.status === 200 || response.status === 201) {
        toast.success("Registration successful! Logging you in...")
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })
        if (signInResult?.ok) {
          const session = await getSession()
          if (session?.accessToken) {
            await finishAuthenticatedSession(session, "Account created. Welcome!")
          } else {
            resetModal()
            onClose?.()
            router.push("/user")
          }
        } else {
          setMode("signin")
          setAuthMethod("email")
        }
      } else {
        setError(response.data?.message || "Registration failed. Please try again.")
      }
    } catch (error) {
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
    setOtpReqId(null)
    setFormData({ name: "", email: "", password: "", phone: "", otp: "" })
    setError("")
  }

  const resetModal = () => {
    setFormData({ name: "", email: "", password: "", phone: "", otp: "" })
    setError("")
    setShowPassword(false)
    setOtpSent(false)
    setResendTimer(0)
    setOtpReqId(null)
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-[var(--border)] bg-[var(--background)] p-0 overflow-hidden shadow-xl">
        <div className="bg-[var(--ink)] px-6 py-5 text-center">
          <p
            className="text-[var(--gold)] text-xs tracking-[0.28em] uppercase mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sunita Gemstones
          </p>
          <DialogHeader className="space-y-1">
            <DialogTitle
              className="text-center text-2xl font-normal text-[var(--ink-foreground)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {mode === "signin" ? "Welcome back" : "Create account"}
            </DialogTitle>
            <DialogDescription className="text-center text-[var(--ink-foreground)]/70 text-sm">
              {mode === "signin"
                ? "Sign in with phone OTP or email"
                : "Join for certified gemstones & jewellery"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[var(--radius)] text-sm">
              {error}
            </div>
          )}

          {mode === "signin" && (
            <div className="flex border-b border-[var(--border)]">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("otp")
                  setError("")
                }}
                className={`flex-1 pb-2.5 font-medium text-sm border-b-2 flex items-center justify-center gap-2 transition-colors ${
                  authMethod === "otp"
                    ? "border-[var(--gold)] text-[var(--ink)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--ink)]"
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
                className={`flex-1 pb-2.5 font-medium text-sm border-b-2 flex items-center justify-center gap-2 transition-colors ${
                  authMethod === "email"
                    ? "border-[var(--gold)] text-[var(--ink)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--ink)]"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          )}

          {/* Custom themed OTP flow (no MSG91 blue popup) */}
          {mode === "signin" && authMethod === "otp" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-phone" className="text-sm font-medium text-[var(--ink)]">
                  Mobile number
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode} disabled={otpSent || isLoading}>
                    <SelectTrigger className={`w-[110px] ${fieldClass}`}>
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
                          className="hover:bg-[var(--paper)] focus:bg-[var(--paper)] cursor-pointer"
                        >
                          <div className="flex items-center gap-3 py-1">
                            <span className="text-lg">{country.flag}</span>
                            <span className="font-medium">{country.country}</span>
                            <span className="text-[var(--muted-foreground)] ml-auto">{country.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="otp-phone"
                    type="tel"
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`flex-1 ${fieldClass}`}
                    disabled={otpSent || isLoading}
                  />
                </div>
              </div>

              {!otpSent ? (
                <Button type="button" onClick={handleSendOtp} className={primaryBtnClass} disabled={isLoading}>
                  <KeyRound className="w-4 h-4 mr-2" />
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              ) : (
                <>
                  <div className="rounded-[var(--radius)] bg-[var(--paper)] px-3 py-2 text-xs text-[var(--muted-foreground)] flex justify-between items-center">
                    <span>
                      Code sent to{" "}
                      <span className="text-[var(--ink)] font-medium">
                        {countryCode} {formData.phone}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false)
                        setOtpReqId(null)
                        handleInputChange("otp", "")
                      }}
                      className={linkClass + " text-xs"}
                      disabled={isLoading}
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp-input" className="text-sm font-medium text-[var(--ink)]">
                      Enter OTP
                    </Label>
                    <Input
                      id="otp-input"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="••••"
                      value={formData.otp}
                      onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, ""))}
                      className={`${fieldClass} text-center tracking-[0.4em] text-lg font-medium`}
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="button" onClick={handleVerifyOtp} className={primaryBtnClass} disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify & sign in"}
                  </Button>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Resend in <span className="text-[var(--ink)] font-semibold">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className={`${linkClass} text-xs`}
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

          {mode === "signin" && authMethod === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[var(--ink)]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={fieldClass}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[var(--ink)]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`${fieldClass} pr-10`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[var(--muted-foreground)]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[var(--muted-foreground)]" />
                    )}
                  </Button>
                </div>
              </div>
              <Button onClick={handleSignIn} className={primaryBtnClass} disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="text-sm font-medium text-[var(--ink)]">
                  Full name
                </Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={fieldClass}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-sm font-medium text-[var(--ink)]">
                  Email
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={fieldClass}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone" className="text-sm font-medium text-[var(--ink)]">
                  Phone
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className={`w-[110px] ${fieldClass}`}>
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
                          className="hover:bg-[var(--paper)] focus:bg-[var(--paper)]"
                        >
                          <div className="flex items-center gap-3 py-1">
                            <span className="text-lg">{country.flag}</span>
                            <span className="font-medium">{country.country}</span>
                            <span className="text-[var(--muted-foreground)] ml-auto">{country.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`flex-1 ${fieldClass}`}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-sm font-medium text-[var(--ink)]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`${fieldClass} pr-10`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[var(--muted-foreground)]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[var(--muted-foreground)]" />
                    )}
                  </Button>
                </div>
              </div>
              <Button onClick={handleRegister} className={primaryBtnClass} disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          )}

          <div className="text-center pt-2 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={toggleMode} className={linkClass} disabled={isLoading}>
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
