"use client"
import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyRound, Smartphone, ShieldCheck, X } from "lucide-react"
import { countryCodes } from "@/app/constant/constant"
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
  "h-12 border-[var(--border)] bg-white shadow-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/35 focus-visible:border-[var(--gold)]"
const primaryBtnClass =
  "w-full h-12 rounded-full bg-[var(--ink)] hover:bg-[var(--ink-soft)] text-[var(--ink-foreground)] font-medium tracking-[0.08em] uppercase text-sm shadow-sm"
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
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [otpReqId, setOtpReqId] = useState(null)
  const useBrowserWidget = isMsg91WidgetConfigured()

  useEffect(() => {
    if (!isOpen || !useBrowserWidget) return
    initMsg91CustomWidget().catch((err) => {
      console.error("MSG91 init:", err)
    })
  }, [isOpen, useBrowserWidget])

  useEffect(() => {
    if (resendTimer <= 0) return undefined
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  /** Phone state stores digits only — formatting is display-only */
  const getNationalDigits = () => {
    let digits = String(formData.phone || "").replace(/\D/g, "")
    if (countryCode === "+91" && digits.startsWith("0")) digits = digits.slice(1)
    return digits
  }

  const formatPhoneDisplay = (digits) => {
    const d = String(digits || "").replace(/\D/g, "")
    if (!d) return ""
    if (countryCode === "+1") {
      if (d.length >= 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`
      if (d.length >= 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`
      return d
    }
    if (d.length > 6) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
    if (d.length > 3) return `${d.slice(0, 3)} ${d.slice(3)}`
    return d
  }

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value
    const prevDigits = getNationalDigits()
    const prevDisplay = formatPhoneDisplay(prevDigits)
    let nextDigits = inputValue.replace(/\D/g, "")

    // Backspace landed on a formatting space/paren — digit count unchanged but display shorter
    if (
      inputValue.length < prevDisplay.length &&
      nextDigits.length === prevDigits.length &&
      prevDigits.length > 0
    ) {
      nextDigits = prevDigits.slice(0, -1)
    }

    if (countryCode === "+91" && nextDigits.startsWith("0")) {
      nextDigits = nextDigits.slice(1)
    }
    nextDigits = nextDigits.slice(0, countryCode === "+91" ? 10 : 15)
    handleInputChange("phone", nextDigits)
  }

  const handleOtpChange = (e) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, 6)
    handleInputChange("otp", next)
  }

  const getFullPhone = () => `${countryCode}${getNationalDigits()}`
  const getMsg91Identifier = () => `${countryCode.replace("+", "")}${getNationalDigits()}`

  const finishAuthenticatedSession = async (session, successMessage) => {
    if (session?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("token", session.accessToken)
    }
    toast.success(successMessage)
    resetModal()
    onClose?.()
    if (onSuccess) {
      await onSuccess(session)
    }

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

  const resetModal = () => {
    setFormData({ name: "", email: "", password: "", phone: "", otp: "" })
    setError("")
    setOtpSent(false)
    setResendTimer(0)
    setOtpReqId(null)
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0]

  const phoneDigits = getNationalDigits()
  const phoneDisplay = formatPhoneDisplay(phoneDigits)
  const phoneHint =
    countryCode === "+91"
      ? `${phoneDigits.length}/10 digits`
      : `${phoneDigits.length} digits`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-[420px] border-0 bg-[var(--background)] p-0 overflow-hidden shadow-2xl rounded-2xl gap-0">
        <DialogClose
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </DialogClose>
        <div className="relative bg-[var(--ink)] px-6 pt-7 pb-8 text-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(196,163,90,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(224,201,138,0.2), transparent 40%)",
            }}
          />
          <div className="relative">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-white/5 text-[var(--gold-soft)]">
              <Smartphone className="h-5 w-5" />
            </div>
            <p
              className="text-[var(--gold)] text-[10px] tracking-[0.3em] uppercase mb-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sunita Gemstones
            </p>
            <DialogHeader className="space-y-1.5">
              <DialogTitle
                className="text-center text-[1.75rem] font-semibold text-[var(--ink-foreground)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Welcome back
              </DialogTitle>
              <DialogDescription className="text-center text-[var(--ink-foreground)]/70 text-sm">
                Enter your mobile number to receive a one-time password
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6 -mt-3 relative">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-sm">
                {error}
              </div>
            )}

            {!otpSent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="otp-phone" className="text-sm font-medium text-[var(--ink)]">
                      Mobile number
                    </Label>
                    <span className="text-[11px] text-[var(--muted-foreground)] tabular-nums">
                      {phoneHint}
                    </span>
                  </div>
                  <div className="flex h-12 items-stretch overflow-hidden rounded-xl border border-[var(--border)] bg-white focus-within:ring-2 focus-within:ring-[var(--gold)]/35">
                    <Select
                      value={countryCode}
                      onValueChange={setCountryCode}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-12! w-[7.5rem] shrink-0 rounded-none border-0 border-r border-[var(--border)] bg-transparent px-3 py-0 shadow-none focus:ring-0 focus-visible:ring-0">
                        <SelectValue>
                          <span className="flex items-center gap-1.5 leading-none">
                            <span className="text-base leading-none">{selectedCountry?.flag}</span>
                            <span className="text-sm font-medium leading-none">{countryCode}</span>
                          </span>
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
                              <span className="text-[var(--muted-foreground)] ml-auto">
                                {country.code}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="otp-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder={countryCode === "+91" ? "98765 43210" : "Mobile number"}
                      value={phoneDisplay}
                      onChange={handlePhoneChange}
                      className="h-12! min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-0 text-base tracking-wide shadow-none focus-visible:ring-0 md:text-base"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleSendOtp}
                  className={primaryBtnClass}
                  disabled={isLoading || (countryCode === "+91" && phoneDigits.length !== 10)}
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-[var(--paper)] px-3.5 py-3 text-xs text-[var(--muted-foreground)] flex justify-between items-center gap-3">
                  <span>
                    Code sent to{" "}
                    <span className="text-[var(--ink)] font-semibold">
                      {countryCode} {phoneDisplay}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setOtpReqId(null)
                      handleInputChange("otp", "")
                    }}
                    className={linkClass + " text-xs shrink-0"}
                    disabled={isLoading}
                  >
                    Change
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="otp-input" className="text-sm font-medium text-[var(--ink)]">
                      Enter OTP
                    </Label>
                    <span className="text-[11px] text-[var(--muted-foreground)] tabular-nums">
                      {formData.otp.length}/6
                    </span>
                  </div>
                  <Input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={formData.otp}
                    onChange={handleOtpChange}
                    className={`${fieldClass} rounded-xl text-center tracking-[0.55em] text-xl font-semibold`}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  className={primaryBtnClass}
                  disabled={isLoading || formData.otp.length < 4}
                >
                  {isLoading ? "Verifying..." : "Verify & sign in"}
                </Button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Resend in{" "}
                      <span className="text-[var(--ink)] font-semibold">{resendTimer}s</span>
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
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 text-[11px] text-[var(--muted-foreground)] leading-relaxed px-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
            <p>
              Secure login via OTP. New numbers are registered automatically after verification.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
