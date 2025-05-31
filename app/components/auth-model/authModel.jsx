"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import {countryCodes} from "@/app/constant/constant"


export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("signin") // "signin" or "register"
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (phoneNumber.trim()) {
      setIsLoading(true)
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`
        console.log(`${mode === "signin" ? "Signing in" : "Registering"} with:`, fullPhoneNumber)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        alert(`OTP sent to ${fullPhoneNumber}`)
        onClose()
      } catch (error) {
        console.error(`Error ${mode === "signin" ? "signing in" : "registering"}:`, error)
        alert("Failed to send OTP. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format based on country code
    if (countryCode === "+1") {
      // US/Canada format: (XXX) XXX-XXXX
      if (digits.length >= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
      } else if (digits.length >= 3) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
      }
    } else {
      // International format: XXX XXX XXXX
      if (digits.length >= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      } else if (digits.length >= 3) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`
      }
    }
    return digits
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "register" : "signin")
    setPhoneNumber("")
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode)

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
          <DialogTitle className="text-center text-xl font-semibold">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {mode === "signin" ? "Sign in to your account to continue" : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[110px] border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedCountry?.flag}</span>
                      <span className="font-medium">{countryCode}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {countryCodes.map((country, index) => (
                    <SelectItem
                      key={`${country.code}-${country.country}-${index}`}
                      value={country.code}
                      className="hover:bg-amber-50 focus:bg-amber-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-medium">{country.country}</span>
                        <span className="text-gray-500 ml-auto">{country.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder={countryCode === "+1" ? "(123) 456-7890" : "123 456 7890"}
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="flex-1 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                disabled={isLoading}
                maxLength={countryCode === "+1" ? 14 : 15}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2"
            disabled={!phoneNumber.trim() || isLoading}
          >
            {isLoading ? "Sending..." : `${mode === "signin" ? "Sign In" : "Create Account"}`}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-amber-700 hover:text-amber-800 font-medium underline"
                disabled={isLoading}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
