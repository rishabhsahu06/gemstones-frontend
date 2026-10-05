/**
 * MSG91 OTP Widget REST APIs (server-side).
 *
 * Auth rules (MSG91):
 * - sendOtp / retryOtp / verifyOtp → use Widget token as `tokenAuth` (do not mix with authkey)
 * - verifyAccessToken → use account `authkey` in the JSON body
 */

function getWidgetId() {
  return (
    process.env.MSG91_WIDGET_ID ||
    process.env.NEXT_PUBLIC_MSG91_WIDGET_ID ||
    ""
  ).trim()
}

function getAuthKey() {
  return (process.env.MSG91_AUTH_KEY || "").trim()
}

function getTokenAuth() {
  return (
    process.env.MSG91_WIDGET_TOKEN ||
    process.env.NEXT_PUBLIC_MSG91_WIDGET_TOKEN ||
    ""
  ).trim()
}

export function isMsg91WidgetServerConfigured() {
  return Boolean(getWidgetId() && (getTokenAuth() || getAuthKey()))
}

async function msg91Post(path, { body, headers = {} }) {
  const response = await fetch(`https://control.msg91.com/api/v5/widget/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (
    data.type === "error" ||
    data.status === "fail" ||
    data.hasError === true ||
    data.code === "201" ||
    data.code === 201
  ) {
    let message = data.message || `MSG91 ${path} failed`
    const lower = String(message).toLowerCase()
    if (lower.includes("ipblocked") || lower.includes("ip blocked")) {
      message =
        "MSG91 IPBlocked — Token → Settings (gear) → IPs → Whitelist/unblock this IP (or raise Throttle Limit). Prefer browser Widget send so the end-user IP is used."
    } else if (lower.includes("authenticationfailure")) {
      message =
        "MSG91 AuthenticationFailure — disable IP security on Authkey (or whitelist server IP) in MSG91 Authkey settings."
    } else if (lower.includes("captcha")) {
      message =
        "MSG91 requires captcha for this Widget. Open MSG91 → OTP Widget → your widget → turn Captcha Validation OFF, then try again."
    }
    const err = new Error(message)
    err.status = 401
    err.payload = data
    throw err
  }

  if (!response.ok && data.type !== "success") {
    const err = new Error(data.message || `MSG91 ${path} failed (${response.status})`)
    err.status = response.status
    err.payload = data
    throw err
  }

  return data
}

/** Widget OTP ops authenticate with tokenAuth (recommended for OTP Widget) */
async function msg91WidgetTokenPost(path, fields) {
  const tokenAuth = getTokenAuth()
  const authkey = getAuthKey()

  // Prefer Widget token. Fallback to authkey-only if token missing.
  if (tokenAuth) {
    return msg91Post(path, {
      headers: { token: tokenAuth },
      body: {
        widgetId: getWidgetId(),
        tokenAuth,
        ...fields,
      },
    })
  }

  if (authkey) {
    return msg91Post(path, {
      headers: { authkey },
      body: {
        widgetId: getWidgetId(),
        authkey,
        ...fields,
      },
    })
  }

  throw new Error("MSG91_WIDGET_TOKEN or MSG91_AUTH_KEY is required")
}

export function extractReqId(data) {
  if (!data) return null
  if (typeof data.message === "string" && data.message.length > 8 && !/\s/.test(data.message)) {
    return data.message
  }
  return data.reqId || data.request_id || data.data?.reqId || data.message?.reqId || null
}

export function extractAccessToken(data) {
  if (!data) return null
  if (typeof data === "string" && data.length > 20) return data
  return (
    data.message ||
    data.accessToken ||
    data.access_token ||
    data["access-token"] ||
    data.data?.message ||
    data.data?.accessToken ||
    null
  )
}

export async function widgetSendOtp(identifier) {
  const data = await msg91WidgetTokenPost("sendOtp", { identifier })
  const reqId = extractReqId(data)
  if (!reqId) {
    throw new Error("MSG91 sendOtp succeeded but no reqId was returned")
  }
  return { data, reqId }
}

export async function widgetRetryOtp(reqId, retryChannel = null) {
  const fields = { reqId }
  if (retryChannel != null) fields.retryChannel = retryChannel
  const data = await msg91WidgetTokenPost("retryOtp", fields)
  return { data, reqId: extractReqId(data) || reqId }
}

export async function widgetVerifyOtp({ reqId, otp }) {
  const data = await msg91WidgetTokenPost("verifyOtp", {
    reqId,
    otp: String(otp),
  })
  const accessToken = extractAccessToken(data)
  if (!accessToken) {
    throw new Error("MSG91 verifyOtp succeeded but no access token was returned")
  }
  return { data, accessToken }
}

/** Server-side access-token check uses Authkey (MSG91 dashboard snippet) */
export async function widgetVerifyAccessToken(accessToken) {
  const authkey = getAuthKey()
  if (!authkey) {
    throw new Error("MSG91_AUTH_KEY is required to verify access tokens")
  }

  const data = await msg91Post("verifyAccessToken", {
    body: {
      authkey,
      "access-token": accessToken,
    },
  })

  const identifier =
    typeof data.message === "string" &&
    !String(data.message).toLowerCase().includes("success")
      ? data.message
      : null
  return { data, identifier }
}
