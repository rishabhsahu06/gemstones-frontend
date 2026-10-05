import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import api from "@/lib/axios"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        reqId: { label: "MSG91 Request ID", type: "text" },
        accessToken: { label: "MSG91 Access Token", type: "text" },
        isOtp: { label: "Is OTP Login", type: "text" },
      },

      async authorize(credentials) {
        try {
          // Phone OTP login (Widget REST: phone + otp + reqId)
          if (
            credentials?.isOtp === "true" ||
            credentials?.accessToken ||
            (credentials?.phone && credentials?.otp)
          ) {
            const { verifyOtpLogic } = await import("@/app/api/auth/verify-otp/route")
            const verifyData = await verifyOtpLogic({
              phone: credentials.phone,
              otp: credentials.otp,
              reqId: credentials.reqId,
              accessToken: credentials.accessToken,
            })

            if (verifyData?.success && verifyData.user && verifyData.token) {
              const token = verifyData.token
              const isDemoToken =
                typeof token === "string" &&
                (token.startsWith("demo_otp_") || token.startsWith("token_otp_"))

              if (isDemoToken && process.env.NODE_ENV === "production") {
                throw new Error(
                  "OTP verified but no real account token was issued. Backend POST /auth/mobile-user is required for cart/account access."
                )
              }

              return {
                id: verifyData.user.id || `phone_${credentials.phone}`,
                name: verifyData.user.name || `User (${credentials.phone})`,
                email: verifyData.user.email || null,
                phone: verifyData.user.phone || credentials.phone,
                role: verifyData.user.role || "user",
                token,
              }
            }

            throw new Error(verifyData?.message || "Invalid OTP verification")
          }

          // Email + password login
          const res = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          })

          const responseData = res.data.data || res.data

          if (responseData?.user && responseData?.token) {
            return {
              id: responseData.user.id,
              name: responseData.user.name,
              email: responseData.user.email,
              phone: responseData.user.phone,
              role: responseData.user.role,
              token: responseData.token,
            }
          }

          return null
        } catch (error) {
          const message =
            error.response?.data?.message || error.message || "Authorization failed"
          console.error("Authorization error:", message)
          // Re-throw so NextAuth surfaces a useful error for OTP failures
          if (
            credentials?.isOtp === "true" ||
            credentials?.accessToken ||
            (credentials?.phone && credentials?.otp)
          ) {
            throw new Error(message)
          }
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.phone = user.phone
        token.role = user.role
        token.accessToken = user.token
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.phone = token.phone
        session.user.role = token.role
        session.accessToken = token.accessToken
      }
      return session
    },

    async signIn({ user, account }) {
      console.log("SignIn callback:", { user, account })
      if (account?.provider === "credentials") {
        return user ? true : false
      }
      return true
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  events: {
    async signIn({ user, account }) {
      console.log("User signed in:", { user, account })
    },
    async signOut({ session, token }) {
      console.log("User signed out:", { session, token })
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }