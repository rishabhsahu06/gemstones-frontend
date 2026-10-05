const DEMO_OTP = "1234"

/** Normalize to E.164-ish string with leading + when possible */
export function cleanPhone(phone) {
  if (!phone) return ""
  const cleaned = String(phone).replace(/[^\d+]/g, "")
  if (cleaned.startsWith("+")) return `+${cleaned.slice(1).replace(/\D/g, "")}`
  return cleaned.replace(/\D/g, "")
}

/** MSG91 expects digits only, country code included (e.g. 919876543210) */
export function toMsg91Mobile(phone) {
  return cleanPhone(phone).replace(/^\+/, "")
}

/**
 * Validate mobile for OTP.
 * India (+91): exactly 10 digits after country code.
 * Others: 7–15 national digits.
 */
export function validateOtpPhone(phone) {
  const cleaned = cleanPhone(phone)
  if (!cleaned) return "Phone number is required"

  const digits = cleaned.replace(/\D/g, "")
  if (digits.startsWith("91") && digits.length === 12) {
    const national = digits.slice(2)
    if (!/^[6-9]\d{9}$/.test(national)) {
      return "Enter a valid 10-digit Indian mobile number"
    }
    return null
  }

  if (digits.length < 8 || digits.length > 15) {
    return "Please enter a valid phone number with country code"
  }

  return null
}

/** Server can verify Widget access tokens when Authkey is present */
export function isMsg91AuthConfigured() {
  return Boolean(process.env.MSG91_AUTH_KEY)
}

export function isDemoOtpAllowed() {
  return process.env.NODE_ENV === "development" && !isMsg91AuthConfigured()
}

export function isValidDemoOtp(otp) {
  return String(otp).trim() === DEMO_OTP
}

export { DEMO_OTP }
