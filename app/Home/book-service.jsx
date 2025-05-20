"use client"
import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Phone } from "lucide-react"

export default function BookService() {
    // Split form state to isolate select values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        time: '',
        birthplace: '',
        message: '',
        terms: false
    })

    // Separate state for dropdowns to prevent re-rendering issues
    const [gender, setGender] = useState('')
    const [purpose, setPurpose] = useState('')

    // Validation state
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
        clearError(id)
    }

    // Handle select changes - with useCallback to prevent re-renders
    const handleSelectChange = useCallback((value, field) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error when user selects
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }, [errors])

    // Handle checkbox change
    const handleTermsChange = (checked) => {
        setFormData(prev => ({ ...prev, terms: checked }))
        clearError('terms')
    }

    // Clear error for a specific field
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    // Form validation
    const validateForm = () => {
        const newErrors = {}
        const formFields = {
            name: formData.name,
            gender: gender,
            email: formData.email,
            phone: formData.phone,
            dob: formData.dob,
            time: formData.time,
            birthplace: formData.birthplace,
            purpose: purpose,
            message: formData.message,
            terms: formData.terms
        }

        // Check all required fields
        Object.entries(formFields).forEach(([field, value]) => {
            if (field === 'terms') {
                if (!value) newErrors[field] = 'You must agree to the terms'
            } else if (!value || (typeof value === 'string' && !value.trim())) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
            }
        })

        // Additional email validation
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)

        if (validateForm()) {
            // Combine all form data for submission
            const completeFormData = {
                ...formData,
                gender,
                purpose
            }

            // Form is valid, handle submission
            console.log("Form submitted:", completeFormData)
            // You would typically send this data to your backend here
            alert("Form submitted successfully!")
        }
    }

    // Custom Select component that doesn't cause re-renders
    const CustomSelect = ({ id, label, placeholder, options, value, onChange }) => {
        const hasError = errors[id] && submitted;

        return (
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    {label}<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <select
                        id={id}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full rounded-md border ${hasError ? "border-red-500" : "border-gray-300"} 
                       bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500`}
                    >
                        <option value="" disabled>{placeholder}</option>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {hasError && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
            </div>
        );
    };

    // Reusable form field component
    const FormField = ({ id, label, type = "text", placeholder, icon }) => {
        const hasError = errors[id] && submitted;

        return (
            <div className="space-y-1">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={formData[id] || ''}
                        onChange={handleChange}
                        className={`w-full ${hasError ? "border-red-500" : ""}`}
                    />
                    {icon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {icon}
                        </div>
                    )}
                </div>
                {hasError && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8 mt-4 md:mt-8">
                {/* Left side - Image */}
                <div className="w-full lg:w-2/5 xl:w-1/2 order-2 lg:order-1">
                    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-full rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src="/stones.png"
                            alt="Colorful gemstones collection"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="w-full lg:w-3/5 xl:w-1/2 order-1 lg:order-2 space-y-6">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Gem Recommendation Service
                        </h1>
                        <h2 className="text-xl md:text-2xl font-medium text-amber-600 mt-1">
                            Online Astrology & Stone Picker
                        </h2>
                        <p className="mt-4 text-gray-600 text-sm md:text-base">
                            Find your ideal gemstone using your birth details and zodiac sign. Get personalized,
                            astrology-based stone recommendations to boost luck, success, and balance.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                                {/* Personal Information */}
                                <FormField
                                    id="name"
                                    label="Name"
                                    placeholder="Enter your full name"
                                />

                                <CustomSelect
                                    id="gender"
                                    label="Gender"
                                    placeholder="Select gender"
                                    value={gender}
                                    onChange={setGender}
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "other", label: "Other" }
                                    ]}
                                />

                                <FormField
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    placeholder="your@email.com"
                                />

                                <FormField
                                    id="phone"
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    icon={<Phone className="h-4 w-4" />}
                                />

                                {/* Birth Information */}
                                <FormField
                                    id="dob"
                                    label="Date of Birth"
                                    placeholder="MM/DD/YYYY"
                                    icon={<CalendarIcon className="h-4 w-4" />}
                                />

                                <FormField
                                    id="time"
                                    label="Time of Birth"
                                    placeholder="HH:MM"
                                    icon={<Clock className="h-4 w-4" />}
                                />

                                <FormField
                                    id="birthplace"
                                    label="Birth Place"
                                    placeholder="City, Country"
                                />

                                <CustomSelect
                                    id="purpose"
                                    label="Purpose"
                                    placeholder="Select purpose"
                                    value={purpose}
                                    onChange={setPurpose}
                                    options={[
                                        { value: "health", label: "Health" },
                                        { value: "wealth", label: "Wealth" },
                                        { value: "relationship", label: "Relationship" },
                                        { value: "career", label: "Career" }
                                    ]}
                                />
                            </div>

                            {/* Message Field - Full Width */}
                            <div className="mt-5 space-y-1">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Your Message<span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="Please share any specific concerns or questions you have..."
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={errors.message && submitted ? "border-red-500" : ""}
                                />
                                {errors.message && submitted && (
                                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="terms"
                                checked={formData.terms}
                                onCheckedChange={handleTermsChange}
                                className={errors.terms && submitted ? "border-red-500" : ""}
                            />
                            <div>
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I have read and agree to the{" "}
                                    <Link href="#" className="font-medium text-amber-600 hover:text-amber-700 underline">
                                        Privacy Policy
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="#" className="font-medium text-amber-600 hover:text-amber-700 underline">
                                        Terms of Service
                                    </Link>
                                    .
                                </label>
                                {errors.terms && submitted && (
                                    <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-amber-600 text-amber-600 hover:bg-amber-50 w-full sm:w-auto"
                            >
                                CALL US
                            </Button>
                            <Button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto"
                            >
                                GET RECOMMENDATION NOW
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}