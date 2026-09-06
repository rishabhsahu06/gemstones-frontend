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
import { consultSteps } from "@/lib/site-data"
import { SectionHeading, Reveal } from "./Reveal"

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
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCallUs = () => {
        // Add your call functionality here
        window.open("tel:+1234567890", "_self") // Replace with your actual phone number
    }

    return (
        <section id="consult" className="py-16 xl:py-24" style={{ background: "var(--paper)" }}>
            {/* Section heading */}
            <div className="container mx-auto px-4 mb-14 text-center">
                <SectionHeading
                    eyebrow="Personalised Guidance"
                    title="Free Astrologer Consultation"
                    copy="Share your birth details and receive a personalised gemstone recommendation within 24 hours."
                    align="center"
                    delay={0}
                />
            </div>

            <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-0 border rounded-sm overflow-hidden shadow-xl min-h-[600px]">

                {/* ── Left: image + steps ──────────────────── */}
                <div className="w-full lg:w-1/2 relative flex flex-col">
                    {/* Background image */}
                    <div className="relative flex-1" style={{ minHeight: "280px" }}>
                        <Image
                            src="/stones.png"
                            alt="Colorful gemstones collection"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: "oklch(0.19 0.045 265 / 0.55)" }}
                            aria-hidden="true"
                        />
                    </div>

                    {/* Steps panel */}
                    <div
                        className="relative p-8 flex flex-col gap-0"
                        style={{ background: "var(--ink)" }}
                    >
                        {consultSteps.map((step, idx) => (
                            <div key={step.step} className="flex gap-5 relative">
                                {/* Connector line */}
                                {idx < consultSteps.length - 1 && (
                                    <div
                                        className="absolute left-[18px] top-10 bottom-0 w-px"
                                        style={{ background: "var(--gold)", opacity: 0.4 }}
                                        aria-hidden="true"
                                    />
                                )}
                                {/* Step circle */}
                                <div
                                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium z-10"
                                    style={{
                                        background: "var(--gold)",
                                        color: "var(--gold-foreground)",
                                        fontFamily: "var(--font-sans)",
                                    }}
                                >
                                    {step.step}
                                </div>
                                {/* Step text */}
                                <div className="pb-8">
                                    <h3
                                        className="text-base mb-1"
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontWeight: 300,
                                            color: "var(--ink-foreground)",
                                        }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: "oklch(0.65 0.02 265)" }}
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 overflow-y-auto" style={{ background: "white" }}>
                    <div className="max-w-2xl mx-auto">
                        <header className="text-center mb-8">
                            <h2
                                className="text-2xl sm:text-3xl mb-2 mt-2"
                                style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--ink)" }}
                            >
                                Gem Recommendation Service
                            </h2>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                Find your ideal gemstone using your birth details and zodiac sign.
                            </p>
                        </header>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
                                {/* Mobile: Single column, Desktop: Two columns */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                    {/* Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-1">
                                                <FormLabel className="font-medium text-sm text-gray-700">
                                                    Name<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter Your Name"
                                                        {...field}
                                                        className="h-11 lg:h-12 rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500"
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
                                            <FormItem className="lg:col-span-1">
                                                <FormLabel className="font-medium text-sm text-gray-700">
                                                    Select<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    disabled={isSubmitting}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 lg:h-12 rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                                                            <SelectValue placeholder="Gender" />
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
                                </div>

                                {/* Second Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium text-sm text-gray-700">
                                                    Email<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter Your Email"
                                                        {...field}
                                                        className="h-11 lg:h-12 rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500"
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
                                                <FormLabel className="font-medium text-sm text-gray-700">
                                                    Phone Number<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="Enter Phone Number"
                                                        {...field}
                                                        className="h-11 lg:h-12 rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Third Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                    {/* Date of Birth */}
                                    <FormField
                                        control={form.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium text-sm text-gray-700">
                                                    Date Of Birth<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        className="h-11 lg:h-12 rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500"
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
                                                <FormLabel className="font-medium text-sm text-gray-700">
                                                    Date Of Time<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        {...field}
                                                        className="h-11 lg:h-12 rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Fourth Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                    {/* Birth Place */}
                                    <FormField
                                        control={form.control}
                                        name="birthplace"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium text-sm text-gray-700">
                                                    Birth Place<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter"
                                                        {...field}
                                                        className="h-11 lg:h-12 rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500"
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
                                                <FormLabel className="font-medium text-sm text-gray-700">
                                                    Select<span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    disabled={isSubmitting}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 lg:h-12 rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                                                            <SelectValue placeholder="Purpose" />
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

                                {/* Message - Full Width - FIXED */}
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium text-sm text-gray-700">
                                                Your Message<span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter Your Message"
                                                    rows={4}
                                                    {...field}
                                                    className="rounded-md resize-none w-full min-h-[120px] whitespace-pre-wrap"
                                                    disabled={isSubmitting}
                                                    style={{
                                                        whiteSpace: 'pre-wrap',
                                                        wordWrap: 'break-word',
                                                        overflowWrap: 'break-word'
                                                    }}
                                                    onKeyDown={(e) => {
                                                        // Ensure spaces are allowed
                                                        if (e.key === ' ') {
                                                            e.stopPropagation();
                                                        }
                                                    }}
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
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-4 pb-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isSubmitting}
                                                    className="w-5 h-5 rounded border-2 border-gray-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                                />
                                            </FormControl>
                                            <div className="flex-1">
                                                <FormLabel className="text-sm font-medium text-gray-800 cursor-pointer leading-relaxed">
                                                    I have read and agree to the{" "}
                                                    <Link href="/privacy-policy" className="font-bold text-gray-900 underline hover:text-amber-700 transition-colors">
                                                        Privacy Policy
                                                    </Link>{" "}
                                                    and{" "}
                                                    <Link href="/term-conditions" className="font-bold text-gray-900 underline hover:text-amber-700 transition-colors">
                                                        Terms of Service
                                                    </Link>
                                                    .
                                                </FormLabel>
                                                <FormMessage className="mt-2" />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-end mt-6 lg:mt-8 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCallUs}
                                        className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 rounded-md px-8 py-3 h-12 font-medium transition-colors order-2 sm:order-1"
                                        disabled={isSubmitting}
                                    >
                                        CALL US
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-md px-8 py-3 h-12 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
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
        </section>
    )
}