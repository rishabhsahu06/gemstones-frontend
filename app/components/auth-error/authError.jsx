// app/auth/error/AuthErrorPageInner.tsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react"

export default function AuthErrorPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState("")
  const [errorDetails, setErrorDetails] = useState("")

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)
      setErrorDetails(getErrorDetails(errorParam))
    }
  }, [searchParams])

  const getErrorDetails = (errorCode) => {
    const errorMessages = {
      OAuthSignin: "There was an error signing in with the OAuth provider. Please try again.",
      OAuthCallback: "There was an error during the OAuth callback. Please check your configuration.",
      OAuthCreateAccount: "Could not create an account with the OAuth provider. The account may already exist.",
      EmailCreateAccount: "Could not create an account with the email provider.",
      OAuthAccountNotLinked: "The account is not linked to any existing account. Please sign in with your original method first.",
      SessionRequired: "You must be signed in to access this page.",
      Signin: "There was an error signing in. Please check your credentials and try again.",
      AccessDenied: "Access denied. You don't have permission to access this resource.",
      Verification: "The verification token is invalid or has expired.",
      Configuration: "There is a configuration error. Please contact support.",
      Default: "An unexpected error occurred during authentication. Please try again."
    }
    return errorMessages[errorCode] || errorMessages.Default
  }

  const getErrorTitle = (errorCode) => {
    const errorTitles = {
      OAuthSignin: "OAuth Sign-in Error",
      OAuthCallback: "OAuth Callback Error",
      OAuthCreateAccount: "Account Creation Error",
      EmailCreateAccount: "Email Account Error",
      OAuthAccountNotLinked: "Account Not Linked",
      SessionRequired: "Session Required",
      Signin: "Sign-in Error",
      AccessDenied: "Access Denied",
      Verification: "Verification Error",
      Configuration: "Configuration Error",
      Default: "Authentication Error"
    }
    return errorTitles[errorCode] || errorTitles.Default
  }

  const handleRetry = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nextauth.message")
    }
    router.push("/user")
  }

  const handleGoHome = () => router.push("/")
  const handleGoBack = () => router.back()

  const getSuggestedActions = (errorCode) => {
    const actions = {
      OAuthSignin: ["Check your internet connection", "Try signing in with a different method", "Clear browser cache", "Disable extensions"],
      OAuthCallback: ["Check OAuth configuration", "Verify redirect URLs", "Try signing in again", "Contact support"],
      OAuthCreateAccount: ["Try signing in instead", "Check for existing account", "Contact support"],
      OAuthAccountNotLinked: ["Sign in with original method", "Link accounts in settings", "Contact support"],
      SessionRequired: ["Sign in first", "Check if session expired", "Clear cookies and try again"],
      Signin: ["Check credentials", "Ensure account is active", "Reset password", "Contact support"],
      AccessDenied: ["Check permissions", "Try a different account", "Contact admin"],
      Verification: ["Check for a new verification email", "Request a new link", "Contact support"],
      Configuration: ["Contact technical support", "Try again later"],
      Default: ["Try again", "Clear cache", "Contact support"]
    }
    return actions[errorCode] || actions.Default
  }

  const suggestedActions = getSuggestedActions(error)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {getErrorTitle(error)}
          </CardTitle>
          <CardDescription className="text-gray-600">
            We encountered an issue while trying to authenticate you.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errorDetails}
            </AlertDescription>
          </Alert>

          {error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Error Code:</h4>
              <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {error}
              </code>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Suggested Actions:</h4>
            <ul className="space-y-2">
              {suggestedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full bg-amber-700 hover:bg-amber-800 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleGoBack} className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>

              <Button variant="outline" onClick={handleGoHome} className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              If you continue to experience issues, please contact our support team with the error code above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
