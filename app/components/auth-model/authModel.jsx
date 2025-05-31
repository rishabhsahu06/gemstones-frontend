"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export default function AuthModal({ isOpen, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGetOtp = async () => {
    if (phoneNumber.trim()) {
      setIsLoading(true)
      try {
        // Simulate API call
        console.log("Sending OTP to:", phoneNumber)

        // Replace this with your actual OTP API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        alert(`OTP sent to ${phoneNumber}`)
        onClose()
      } catch (error) {
        console.error("Error sending OTP:", error)
        alert("Failed to send OTP. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format as (XXX) XXX-XXXX
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else {
      return digits
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={onClose}
            disabled={isLoading}
          >
            {/* <X className="h-4 w-4" /> */}
          </Button>
          <DialogTitle className="text-center text-xl font-semibold">Registered Customers</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            If you have an account with us, please log in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="w-full"
              disabled={isLoading}
              maxLength={14}
            />
          </div>

          <Button
            onClick={handleGetOtp}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2"
            disabled={!phoneNumber.trim() || isLoading}
          >
            {isLoading ? "Sending..." : "Get Otp"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
