import { NextResponse } from "next/server"
import api from "@/lib/axios"
import {
  cleanPhone,
  toMsg91Mobile,
  validateOtpPhone,
  isDemoOtpAllowed,
  isValidDemoOtp,
} from "@/lib/otp"
import {
  isMsg91WidgetServerConfigured,
  widgetVerifyOtp,
  widgetVerifyAccessToken,
} from "@/lib/msg91-server"

function normalizeOtp(otp) {
  return String(otp || "").trim().replace(/\s/g, "")
}

function isUsableAppToken(token) {
  if (!token || typeof token !== "string") return false
  // Reject local demo tokens in any environment that hits cart APIs
  if (token.startsWith("demo_otp_") || token.startsWith("token_otp_")) return false
  return token.length > 10
}

/**
 * Create/find backend user and return a real app JWT for cart/account APIs.
 * Tries /auth/mobile-user then /auth/otp-login.
 */
async function createOrFetchMobileUser(cleanedPhone, msg91Mobile, extras = {}) {
  const attempts = [
    {
      path: "/auth/mobile-user",
      body: { phone: cleanedPhone, mobile: msg91Mobile, ...extras },
    },
    {
      path: "/auth/otp-login",
      body: {
        phone: cleanedPhone,
        mobile: msg91Mobile,
        ...extras,
      },
    },
  ]

  let lastError = null

  for (const attempt of attempts) {
    try {
      const userRes = await api.post(attempt.path, attempt.body)
      const responseData = userRes.data?.data || userRes.data
      const token = responseData?.token
      const user = responseData?.user

      if (isUsableAppToken(token) && user) {
        return {
          success: true,
          message: "OTP verified successfully",
          user: {
            id: user.id,
            name: user.name || `User ${cleanedPhone.slice(-4)}`,
            email: user.email || null,
            phone: user.phone || cleanedPhone,
            role: user.role || "user",
          },
          token,
        }
      }

      if (isUsableAppToken(token)) {
        return {
          success: true,
          message: "OTP verified successfully",
          user: {
            id: user?.id || `user_${msg91Mobile}`,
            name: user?.name || `User ${cleanedPhone.slice(-4)}`,
            email: user?.email || null,
            phone: user?.phone || cleanedPhone,
            role: user?.role || "user",
          },
          token,
        }
      }

      lastError = new Error(`${attempt.path} response missing a valid app token`)
    } catch (err) {
      lastError = err
      console.warn(
        `Backend ${attempt.path} failed:`,
        err?.response?.data?.message || err?.message || err
      )
    }
  }

  // Dev-only fallback — cart will NOT work with this token against real APIs
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "Backend mobile-user/otp-login unavailable; using local demo session (cart APIs will fail):",
      lastError?.message || lastError
    )
    return {
      success: true,
      message:
        "OTP verified (demo session). Deploy backend POST /auth/mobile-user for cart access.",
      user: {
        id: `phone_${msg91Mobile}`,
        phone: cleanedPhone,
        name: `User ${cleanedPhone.slice(-4)}`,
        role: "user",
      },
      token: `demo_otp_${msg91Mobile}`,
      demo: true,
    }
  }

  const backendMsg =
    lastError?.response?.data?.message ||
    lastError?.message ||
    "unknown backend error"

  return {
    success: false,
    message: `OTP verified with MSG91, but account setup failed (${backendMsg}). Backend must implement POST /auth/mobile-user returning { user, token }.`,
    status: 502,
  }
}

/**
 * @param {{ phone?: string, otp?: string, reqId?: string, accessToken?: string }} params
 */
export async function verifyOtpLogic({ phone, otp, reqId, accessToken }) {
  // Path A: browser Widget already verified OTP → MSG91 JWT access token
  if (accessToken && !otp) {
    let identifierPhone = phone
    try {
      const tokenResult = await widgetVerifyAccessToken(accessToken)
      if (tokenResult.identifier) identifierPhone = tokenResult.identifier
    } catch (err) {
      console.warn("verifyAccessToken skipped/failed:", err?.message || err)
      // Production still continues if phone was collected in the UI
      if (process.env.NODE_ENV !== "development" && !phone) {
        return {
          success: false,
          message:
            err.message ||
            "MSG91 access token verification failed. Check MSG91_AUTH_KEY / IP whitelist.",
          status: 401,
        }
      }
    }

    const phoneError = validateOtpPhone(identifierPhone || phone)
    if (phoneError) {
      return { success: false, message: phoneError, status: 400 }
    }
    const cleanedPhone = cleanPhone(identifierPhone || phone)
    return createOrFetchMobileUser(cleanedPhone, toMsg91Mobile(cleanedPhone), {
      accessToken,
    })
  }

  const phoneError = validateOtpPhone(phone)
  if (phoneError) {
    return { success: false, message: phoneError, status: 400 }
  }

  const cleanedOtp = normalizeOtp(otp)
  if (!cleanedOtp || cleanedOtp.length < 4 || cleanedOtp.length > 8) {
    return { success: false, message: "Please enter a valid OTP", status: 400 }
  }

  const cleanedPhone = cleanPhone(phone)
  const msg91Mobile = toMsg91Mobile(phone)

  // Path B: Widget REST verify (reqId + otp)
  if (isMsg91WidgetServerConfigured() && reqId && !String(reqId).startsWith("demo_")) {
    try {
      const { accessToken: jwt } = await widgetVerifyOtp({
        reqId,
        otp: cleanedOtp,
      })

      try {
        await widgetVerifyAccessToken(jwt)
      } catch (tokenErr) {
        console.warn("verifyAccessToken warning:", tokenErr?.message || tokenErr)
      }

      return createOrFetchMobileUser(cleanedPhone, msg91Mobile, {
        otp: cleanedOtp,
        accessToken: jwt,
      })
    } catch (err) {
      console.error("MSG91 widget verify failed:", err?.message || err, err?.payload)
      return {
        success: false,
        message: err.message || "Invalid or expired OTP",
        status: 400,
      }
    }
  }

  // Path C: backend otp-login with raw OTP
  try {
    const backendRes = await api.post("/auth/otp-login", {
      phone: cleanedPhone,
      mobile: msg91Mobile,
      otp: cleanedOtp,
    })
    const responseData = backendRes.data?.data || backendRes.data
    if (isUsableAppToken(responseData?.token)) {
      return {
        success: true,
        message: "OTP verified successfully",
        user: responseData.user,
        token: responseData.token,
      }
    }
  } catch (backendErr) {
    console.log("Backend /auth/otp-login unavailable:", backendErr?.message || backendErr)
  }

  // Path D: local demo OTP
  if (isDemoOtpAllowed() && isValidDemoOtp(cleanedOtp)) {
    return createOrFetchMobileUser(cleanedPhone, msg91Mobile)
  }

  return {
    success: false,
    message: "Invalid or expired OTP. Please request a new code.",
    status: 400,
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const result = await verifyOtpLogic({
      phone: body.phone,
      otp: body.otp,
      reqId: body.reqId,
      accessToken: body.accessToken || body["access-token"],
    })

    if (result.success) {
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { success: false, message: result.message },
      { status: result.status || 400 }
    )
  } catch (error) {
    console.error("Verify OTP Error:", error?.message || error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to verify OTP" },
      { status: 500 }
    )
  }
}
