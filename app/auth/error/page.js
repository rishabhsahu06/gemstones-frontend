// app/auth/error/page.tsx
import { Suspense } from "react"
import AuthErrorPageInner from "@/app/components/auth-error/authError"

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading error details...</div>}>
      <AuthErrorPageInner />
    </Suspense>
  )
}
