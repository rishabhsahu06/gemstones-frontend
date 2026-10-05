"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthModal from "@/app/components/auth-model/authModel"

export default function AuthPage() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
      <AuthModal isOpen={isOpen} onClose={handleClose} redirectTo="/user" />
    </div>
  )
}
