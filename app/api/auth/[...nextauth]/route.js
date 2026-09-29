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
        isOtp: { label: "Is OTP Login", type: "text" },
      },

      async authorize(credentials) {
        console.log("Credentials received:", credentials)
        try {
          // Check if this is a Phone OTP login
          if (credentials?.isOtp === "true" || (credentials?.phone && credentials?.otp)) {
            // Import and call verifyOtpLogic directly
            const { verifyOtpLogic } = await import("@/app/api/auth/verify-otp/route")
            const verifyData = await verifyOtpLogic({
              phone: credentials.phone,
              otp: credentials.otp,
            })

            if (verifyData && verifyData.success && verifyData.user) {
              return {
                id: verifyData.user.id || `phone_${credentials.phone}`,
                name: verifyData.user.name || `User (${credentials.phone})`,
                email: verifyData.user.email || null,
                phone: verifyData.user.phone || credentials.phone,
                role: verifyData.user.role || "user",
                token: verifyData.token || `otp_token_${Date.now()}`,
              }
            }

            console.error("OTP verification failed:", verifyData?.message)
            throw new Error(verifyData?.message || "Invalid OTP verification")
          }

          // Otherwise, handle standard Email + Password login
          const res = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          })

          console.log("API Response:", res.data)
          const responseData = res.data.data || res.data

          if (responseData && responseData.user && responseData.token) {
            return {
              id: responseData.user.id,
              name: responseData.user.name,
              email: responseData.user.email,
              phone: responseData.user.phone,
              role: responseData.user.role,
              token: responseData.token,
            }
          }

          console.log("No user or token found in response")
          return null
        } catch (error) {
          console.error("Authorization error:", error.response?.data || error.message)
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