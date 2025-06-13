"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "react-toastify" // or your preferred toast library

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useApi } from "@/hooks/useApi"

// Utility function for API calls (import from your API utils)


// Enhanced Zod validation schema
const formSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be less than 50 characters" }),
    gender: z.enum(["male", "female", "other"], { 
        required_error: "Please select a gender" 
    }),
    email: z.string()
        .email({ message: "Please enter a valid email address" })
        .max(100, { message: "Email must be less than 100 characters" }),
    phone: z.string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number" }),
    dob: z.string()
        .min(1, { message: "Date of birth is required" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter date in YYYY-MM-DD format" }),
    time: z.string()
        .min(1, { message: "Time of birth is required" })
        .regex(/^\d{2}:\d{2}$/, { message: "Please enter time in HH:MM format" }),
    birthplace: z.string()
        .min(2, { message: "Birth place must be at least 2 characters" })
        .max(100, { message: "Birth place must be less than 100 characters" }),
    purpose: z.enum(["Gemstone Consultation", "Career Guidance", "Health Issues", "Relationship Advice", "Business Consultation", "Other"], {
        required_error: "Please select a purpose"
    }),
    message: z.string()
        .min(10, { message: "Message must be at least 10 characters" })
        .max(500, { message: "Message must be less than 500 characters" }),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
})

const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
]

const PURPOSE_OPTIONS = [
    { value: "Gemstone Consultation", label: "Gemstone Consultation" },
    { value: "Career Guidance", label: "Career Guidance" },
    { value: "Health Issues", label: "Health Issues" },
    { value: "Relationship Advice", label: "Relationship Advice" },
    { value: "Business Consultation", label: "Business Consultation" },
    { value: "Other", label: "Other" },
]

export default function BookService() {
    const [isSubmitting, setIsSubmitting] = useState(false)
const { post } = useApi()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            gender: "",
            email: "",
            phone: "",
            dob: "",
            time: "",
            birthplace: "",
            purpose: "",
            message: "",
            terms: false,
        },
    })

    const onSubmit = async (formData) => {
        setIsSubmitting(true)

        try {
            // Map form data to API schema
            const bookingData = {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phone,
                gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1), // Capitalize first letter
                dateOfBirth: formData.dob,
                timeOfBirth: `${formData.time}:00`, // Convert HH:MM to HH:MM:SS
                birthPlace: formData.birthplace,
                purpose: formData.purpose.charAt(0).toUpperCase() + formData.purpose.slice(1),
                message: formData.message,
                status: "Pending",
                scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default to tomorrow
                notes: `Gemstone recommendation request for ${formData.purpose}`
            }

            const result = await post("/booking-call", bookingData)

            if (result?.success) {
                toast.success("Booking request submitted successfully! We'll contact you soon.")
                form.reset() // Reset the form
            } else {
                toast.error(result?.message || "Failed to submit booking request. Please try again.")
            }
        } catch (error) {
            console.error("Booking submission failed:", error)
            toast.error( error?.response?.data?.message || error?.message||"Something went wrong. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCallUs = () => {
        // Add your call functionality here
        window.open("tel:+1234567890", "_self") // Replace with your actual phone number
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex-col border  lg:flex-row min-h-screen mt-12">
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative ">
                    <Image 
                        src="/stones.png" 
                        alt="Colorful gemstones collection" 
                        fill 
                        className="object-cover" 
                        priority 
                    />
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-1/2 p-8 md:p-10 overflow-y-auto">
                    <div className="max-w-2xl mx-auto">
                        <header className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2 mt-4">
                                Gem Recommendation Service | Online Astrology & Stone Picker
                            </h1>
                            <p className="text-base md:text-lg font-helvetica text-gray-600 mb-10">
                                Find your ideal gemstone using your birth details and zodiac sign. Get personalized, 
                                astrology-based stone recommendations to boost luck, success, and balance.
                            </p>
                        </header>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-sm">
                                                    Name<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Enter your full name" 
                                                        {...field} 
                                                        className="rounded-md" 
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Gender */}
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Gender<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <Select 
                                                    onValueChange={field.onChange} 
                                                    defaultValue={field.value}
                                                    disabled={isSubmitting}
                                                    className=""
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-md  w-full">
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {GENDER_OPTIONS.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Email<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="email" 
                                                        placeholder="Enter your email address" 
                                                        {...field} 
                                                        className="rounded-md"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Phone Number<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="tel" 
                                                        placeholder="Enter phone number (e.g., +919876543210)" 
                                                        {...field} 
                                                        className="rounded-md"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Date of Birth */}
                                    <FormField
                                        control={form.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Date of Birth<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        className="rounded-md"
                                                        disabled={isSubmitting}
                                                        max={new Date().toISOString().split('T')[0]} // Prevent future dates
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Time of Birth */}
                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Time of Birth<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        {...field}
                                                        className="rounded-md"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Birth Place */}
                                    <FormField
                                        control={form.control}
                                        name="birthplace"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Birth Place<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Enter your birth place (city, state)" 
                                                        {...field} 
                                                        className="rounded-md"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Purpose */}
                                    <FormField
                                        control={form.control}
                                        name="purpose"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Purpose<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <Select 
                                                    onValueChange={field.onChange} 
                                                    defaultValue={field.value}
                                                    disabled={isSubmitting}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-md">
                                                            <SelectValue placeholder="Select purpose" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {PURPOSE_OPTIONS.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Message - Full Width */}
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                Your Message<span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us about your specific needs, concerns, or questions..."
                                                    rows={5}
                                                    {...field}
                                                    className="rounded-md resize-none"
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Terms */}
                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox 
                                                    checked={field.value} 
                                                    onCheckedChange={field.onChange}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm text-gray-700 font-normal cursor-pointer">
                                                    I have read and agree to the{" "}
                                                    <Link href="/privacy-policy" className="font-medium text-black underline hover:text-amber-700">
                                                        Privacy Policy
                                                    </Link>{" "}
                                                    and{" "}
                                                    <Link href="/terms-of-service" className="font-medium text-black underline hover:text-amber-700">
                                                        Terms of Service
                                                    </Link>
                                                    .
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-end mt-8">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCallUs}
                                        className="border-amber-600 text-amber-700 hover:bg-amber-50 rounded-md px-8 py-6 font-medium transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        CALL US
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-md px-8 py-6 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "SUBMITTING..." : "GET RECOMMENDATION NOW"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}