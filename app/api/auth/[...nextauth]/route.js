import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import api from "@/lib/axios"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("Credentials received:", credentials)
        try {
          // Call your API to verify email and password
          const res = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          })

          console.log("API Response:", res.data)

          // Access the nested data structure correctly
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

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],


  pages: {
    signIn: "/auth", // Optional: your custom auth page
    error: "/auth/error", // Error page
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.phone = user.phone
        token.role = user.role
        token.accessToken = user.token // Store the API token
      }

      // Handle Google OAuth
      if (account && account.provider === "google") {
        try {
          console.log("Processing Google OAuth for:", token.email)
          
          // Create or update user in your database
          const res = await api.post("/auth/google-login", {
            email: token.email,
            name: token.name,
            googleId: token.sub,
            image: token.picture, // Google profile picture
          })

          console.log("Google OAuth API response:", res.data)

          if (res.data.success && res.data.data) {
            token.id = res.data.data.user.id
            token.phone = res.data.data.user.phone
            token.role = res.data.data.user.role
            token.accessToken = res.data.data.token
          }
        } catch (error) {
          console.error("Google OAuth callback error:", error.response?.data || error.message)
          // Don't throw error, just log it - allow sign in to continue
        }
      }

      return token
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id
        session.user.phone = token.phone
        session.user.role = token.role
        session.accessToken = token.accessToken // Make API token available in session
      }
      return session
    },

    async signIn({ user, account, profile }) {
      console.log("SignIn callback:", { user, account, profile })
      
      // For Google OAuth, always allow sign in
      if (account?.provider === "google") {
        console.log("Google sign in attempted for:", user.email)
        return true
      }
      
      // For credentials, allow if user exists
      if (account?.provider === "credentials") {
        return user ? true : false
      }
      
      return true
    },

    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl })
      
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      
      return baseUrl
    },
  },

  events: {
    async signIn({ user, account, profile }) {
      console.log("User signed in:", { user, account, profile })
    },
    async signOut({ session, token }) {
      console.log("User signed out:", { session, token })
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
})

export { handler as GET, handler as POST }