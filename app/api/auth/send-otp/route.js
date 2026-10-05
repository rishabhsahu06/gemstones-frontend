import { NextResponse } from "next/server"
import {
  cleanPhone,
  toMsg91Mobile,
  validateOtpPhone,
  isDemoOtpAllowed,
  DEMO_OTP,
} from "@/lib/otp"
import {
  isMsg91WidgetServerConfigured,
  widgetSendOtp,
  widgetRetryOtp,
} from "@/lib/msg91-server"

export async function POST(request) {
  try {
    const { phone, reqId } = await request.json()
    const phoneError = validateOtpPhone(phone)
    if (phoneError) {
      return NextResponse.json({ success: false, message: phoneError }, { status: 400 })
    }

    const identifier = toMsg91Mobile(phone)

    // Production path: MSG91 Widget REST (no client captcha)
    if (isMsg91WidgetServerConfigured()) {
      try {
        const result = reqId
          ? await widgetRetryOtp(reqId)
          : await widgetSendOtp(identifier)

        return NextResponse.json({
          success: true,
          message: "OTP sent successfully to your phone",
          reqId: result.reqId,
        })
      } catch (err) {
        console.error("MSG91 widget send/retry failed:", err?.message || err, err?.payload)
        return NextResponse.json(
          {
            success: false,
            message: err.message || "Failed to send OTP via MSG91",
          },
          { status: err.status || 400 }
        )
      }
    }

    // Local demo when Authkey / Widget ID missing
    if (isDemoOtpAllowed()) {
      return NextResponse.json({
        success: true,
        message: `OTP sent successfully (Dev Mode Demo OTP: ${DEMO_OTP})`,
        reqId: `demo_${cleanPhone(phone)}`,
        demo: true,
      })
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "MSG91 not configured. Set MSG91_AUTH_KEY and NEXT_PUBLIC_MSG91_WIDGET_ID in .env.local",
      },
      { status: 500 }
    )
  } catch (error) {
    console.error("Send OTP Error:", error?.message || error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send OTP" },
      { status: 500 }
    )
  }
}
