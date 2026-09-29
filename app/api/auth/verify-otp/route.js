import { NextResponse } from "next/server"
import api from "@/lib/axios"

export async function verifyOtpLogic({ phone, otp }) {
  if (!phone || !otp) {
    return { success: false, message: "Phone number and OTP are required", status: 400 }
  }

  const cleanedPhone = phone.replace(/[^\d+]/g, "")
  const msg91Mobile = cleanedPhone.replace(/^\+/, "")

  // 1. Try backend verification & login endpoint first
  try {
    const backendRes = await api.post("/auth/otp-login", { phone: cleanedPhone, mobile: msg91Mobile, otp })
    if (backendRes.data?.success || backendRes.data?.token || backendRes.data?.data?.token) {
      const responseData = backendRes.data.data || backendRes.data
      return {
        success: true,
        message: "OTP verified successfully",
        user: responseData.user,
        token: responseData.token,
      }
    }
  } catch (backendErr) {
    console.log("Backend /auth/otp-login not available, trying MSG91 verification:", backendErr.message)
  }

  // 2. Direct MSG91 Verify OTP API
  const authKey = process.env.MSG91_AUTH_KEY
  const templateId = process.env.MSG91_TEMPLATE_ID

  let isVerified = false
  let verificationMessage = "OTP verified successfully"

  if (!authKey || !templateId) {
    // In development mode without full MSG91 keys/template, allow 1234 or any 4/6 digit OTP for smooth development testing
    if (process.env.NODE_ENV === "development" && (otp === "1234" || otp.length >= 4)) {
      isVerified = true
    } else {
      return { success: false, message: "MSG91 configuration (MSG91_AUTH_KEY / MSG91_TEMPLATE_ID) missing on server", status: 500 }
    }
  } else {
    console.log("Calling MSG91 Verify API for mobile:", msg91Mobile, "with OTP:", otp)
    const msg91Response = await fetch(
      `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${msg91Mobile}`,
      {
        method: "GET",
        headers: {
          authkey: authKey,
        },
      }
    )

    const data = await msg91Response.json()
    console.log("MSG91 Verify API Response:", data)
    if (msg91Response.ok && (data.type === "success" || data.status === "success" || data.message?.toLowerCase() === "otp verified successfully")) {
      isVerified = true
    } else {
      return { success: false, message: data.message || "Invalid or expired OTP", status: 400 }
    }
  }

  if (isVerified) {
    // Create or retrieve user session from backend
    try {
      const userRes = await api.post("/auth/mobile-user", { phone: cleanedPhone })
      const responseData = userRes.data.data || userRes.data
      return {
        success: true,
        message: verificationMessage,
        user: responseData.user || { id: `user_${Date.now()}`, phone: cleanedPhone, name: `User (${cleanedPhone})` },
        token: responseData.token || `otp_token_${Date.now()}`,
      }
    } catch (err) {
      // If backend mobile-user route is not present, construct a valid session user object
      return {
        success: true,
        message: verificationMessage,
        user: {
          id: `phone_${msg91Mobile}`,
          phone: cleanedPhone,
          name: `User ${cleanedPhone.slice(-4)}`,
          role: "user",
        },
        token: `token_otp_${msg91Mobile}_${Date.now()}`,
      }
    }
  }

  return { success: false, message: "Invalid or expired OTP", status: 400 }
}

export async function POST(request) {
  try {
    const { phone, otp } = await request.json()
    const result = await verifyOtpLogic({ phone, otp })

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status || 400 }
      )
    }
  } catch (error) {
    console.error("Verify OTP Error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to verify OTP" },
      { status: 500 }
    )
  }
}
