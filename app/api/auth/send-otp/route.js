import { NextResponse } from "next/server"
import api from "@/lib/axios"

export async function POST(request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      )
    }

    // Clean phone number: keep numbers and plus sign
    const cleanedPhone = phone.replace(/[^\d+]/g, "")
    // Ensure standard format without '+' for MSG91 (e.g., 919876543210)
    const msg91Mobile = cleanedPhone.replace(/^\+/, "")

    // 1. First, check if backend API has a send-otp endpoint
    try {
      const backendRes = await api.post("/auth/send-otp", { phone: cleanedPhone, mobile: msg91Mobile })
      if (backendRes.data?.success) {
        return NextResponse.json({ success: true, message: backendRes.data.message || "OTP sent successfully" })
      }
    } catch (backendErr) {
      // Backend route might not exist or failed; proceed to direct MSG91 API call
      console.log("Backend /auth/send-otp not reachable or not implemented, using MSG91 direct API:", backendErr.message)
    }

    // 2. Direct call to MSG91 Send OTP API v5
    const authKey = process.env.MSG91_AUTH_KEY
    const templateId = process.env.MSG91_TEMPLATE_ID

    if (!authKey || !templateId) {
      console.warn("MSG91_AUTH_KEY or MSG91_TEMPLATE_ID is missing in environment variables.")
      // In development mode without keys, simulate OTP sending so development/testing works smoothly
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          success: true,
          message: "OTP sent successfully (Dev Mode Demo OTP: 1234)",
          demo: true,
        })
      }
      return NextResponse.json(
        { success: false, message: "MSG91 configuration missing on server" },
        { status: 500 }
      )
    }

    console.log("Calling MSG91 API with mobile:", msg91Mobile, "and templateId:", templateId)
    const msg91Response = await fetch(
      `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${msg91Mobile}`,
      {
        method: "POST",
        headers: {
          authkey: authKey,
          "Content-Type": "application/json",
        },
      }
    )

    const data = await msg91Response.json()
    console.log("MSG91 API Raw Response:", data)

    if (msg91Response.ok && (data.type === "success" || data.status === "success")) {
      return NextResponse.json({
        success: true,
        message: data.message || "OTP sent successfully to your phone",
      })
    } else {
      console.error("MSG91 Error Response:", data)
      return NextResponse.json(
        { success: false, message: data.message || "Failed to send OTP via MSG91" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Send OTP Error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send OTP" },
      { status: 500 }
    )
  }
}
