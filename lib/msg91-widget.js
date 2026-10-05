const SCRIPT_URLS = [
  "https://verify.msg91.com/otp-provider.js",
  "https://verify.phone91.com/otp-provider.js",
]
const SCRIPT_ID = "msg91-otp-provider"
const METHOD_TIMEOUT_MS = 25000

let methodsReadyPromise = null
let pendingOp = null

function getWidgetConfig() {
  return {
    widgetId: (process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || "").trim(),
    tokenAuth: (process.env.NEXT_PUBLIC_MSG91_WIDGET_TOKEN || "").trim(),
  }
}

export function isMsg91WidgetConfigured() {
  const { widgetId, tokenAuth } = getWidgetConfig()
  return Boolean(widgetId && tokenAuth)
}

function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingOp = null
      reject(new Error(`${label} timed out. Keep Captcha & Invisible OTP OFF in MSG91 Widget settings.`))
    }, ms)
    promise.then(
      (v) => {
        clearTimeout(timer)
        resolve(v)
      },
      (e) => {
        clearTimeout(timer)
        reject(e)
      }
    )
  })
}

function loadScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("MSG91 widget can only run in the browser"))
  }
  if (typeof window.initSendOTP === "function") return Promise.resolve()

  return new Promise((resolve, reject) => {
    let i = 0
    const attempt = () => {
      const script = document.createElement("script")
      if (i === 0) script.id = SCRIPT_ID
      script.src = SCRIPT_URLS[i]
      script.async = true
      script.onload = () =>
        typeof window.initSendOTP === "function"
          ? resolve()
          : reject(new Error("MSG91 script loaded but initSendOTP is missing"))
      script.onerror = () => {
        i += 1
        if (i < SCRIPT_URLS.length) attempt()
        else reject(new Error("Failed to load MSG91 OTP script"))
      }
      document.head.appendChild(script)
    }
    attempt()
  })
}

function settlePending(ok, payload) {
  if (!pendingOp) return
  const op = pendingOp
  pendingOp = null
  if (ok) op.resolve(payload)
  else op.reject(normalizeWidgetError(payload, "MSG91 OTP failed"))
}

/** Init custom-UI methods (no MSG91 blue popup) */
export async function initMsg91CustomWidget() {
  const { widgetId, tokenAuth } = getWidgetConfig()
  if (!widgetId || !tokenAuth) {
    throw new Error("MSG91 widget is not configured")
  }

  if (methodsReadyPromise) return methodsReadyPromise

  methodsReadyPromise = (async () => {
    await loadScript()
    await new Promise((resolve, reject) => {
      try {
        window.initSendOTP({
          widgetId,
          tokenAuth,
          exposeMethods: true,
          success: (data) => settlePending(true, data),
          failure: (error) => settlePending(false, error),
        })
        const start = Date.now()
        const poll = () => {
          if (typeof window.sendOtp === "function" && typeof window.verifyOtp === "function") {
            resolve()
            return
          }
          if (Date.now() - start > 8000) {
            reject(new Error("MSG91 methods unavailable. Check widget ID/token."))
            return
          }
          setTimeout(poll, 50)
        }
        poll()
      } catch (err) {
        reject(err)
      }
    })
  })().catch((err) => {
    methodsReadyPromise = null
    throw err
  })

  return methodsReadyPromise
}

export function friendlyMsg91Message(message) {
  const lower = String(message || "").toLowerCase()
  if (lower.includes("ipblocked") || lower.includes("ip blocked")) {
    return "MSG91 blocked this IP. Whitelist it under OTP → Tokens → IPs."
  }
  if (lower.includes("captcha")) {
    return "MSG91 captcha blocked the request. Turn Captcha Validation OFF in Widget Settings."
  }
  if (lower.includes("authenticationfailure")) {
    return "MSG91 authentication failed. Check Widget Token."
  }
  return null
}

function normalizeWidgetError(error, fallback) {
  if (!error) return new Error(fallback)
  if (typeof error === "string") return new Error(friendlyMsg91Message(error) || error)
  const message =
    error.message || error.error || error.msg || (typeof error.type === "string" ? error.type : null) || fallback
  return new Error(friendlyMsg91Message(message) || message)
}

function callSdk(kind, invoke) {
  return withTimeout(
    new Promise((resolve, reject) => {
      pendingOp = { resolve, reject, kind }
      try {
        const maybe = invoke(
          (data) => {
            if (pendingOp) {
              pendingOp = null
              resolve(data)
            }
          },
          (error) => {
            if (pendingOp) {
              pendingOp = null
              reject(normalizeWidgetError(error, `${kind} failed`))
            }
          }
        )
        if (maybe && typeof maybe.then === "function") {
          maybe
            .then((data) => {
              if (pendingOp) {
                pendingOp = null
                resolve(data)
              }
            })
            .catch((error) => {
              if (pendingOp) {
                pendingOp = null
                reject(normalizeWidgetError(error, `${kind} failed`))
              }
            })
        }
      } catch (err) {
        pendingOp = null
        reject(err)
      }
    }),
    METHOD_TIMEOUT_MS,
    kind
  )
}

export async function sendMsg91Otp(identifier) {
  await initMsg91CustomWidget()
  return callSdk("Send OTP", (ok, fail) => window.sendOtp(identifier, ok, fail))
}

export async function retryMsg91Otp(reqId) {
  await initMsg91CustomWidget()
  return callSdk("Resend OTP", (ok, fail) => window.retryOtp(null, ok, fail, reqId || undefined))
}

export async function verifyMsg91Otp(otp, reqId) {
  await initMsg91CustomWidget()
  return callSdk("Verify OTP", (ok, fail) => window.verifyOtp(otp, ok, fail, reqId || undefined))
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

export function extractReqId(data) {
  if (!data) return null
  if (typeof data.message === "string" && data.message.length > 8 && !/\s/.test(data.message)) {
    if (!String(data.message).toLowerCase().includes("success")) return data.message
  }
  return data.reqId || data.request_id || data.message?.reqId || data.data?.reqId || null
}
