import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import api from "@/lib/axios"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        tempUserId: { label: "TempUserId", type: "text" },
        otp: { label: "OTP", type: "text" },
      },

      async authorize(credentials) {
        console.log("Credentials received:", credentials)
        try {
          // Call your API to verify the OTP
          const res = await api.post("/auth/verify-login-otp", {
            otp: credentials.otp,
            tempUserId: credentials.tempUserId,
          })

          console.log("API Response:", res.data)

          // Fix: Access the nested data structure correctly
          const responseData = res.data.data // Access the nested data object

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
    // signIn: "/auth", // Optional: your custom auth page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.phone = user.phone
        token.role = user.role
        token.accessToken = user.token // Store the API token
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.phone = token.phone
      session.user.role = token.role
      session.accessToken = token.accessToken // Make API token available in session
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
})

export { handler as GET, handler as POST }
