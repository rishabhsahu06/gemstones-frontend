"use client"
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, Clock } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
} from "@/components/ui/form"

// Zod validation schema
const formSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    gender: z.string().min(1, { message: "Gender is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(5, { message: "Phone number is required" }),
    dob: z.string().min(1, { message: "Date of birth is required" }),
    time: z.string().min(1, { message: "Time of birth is required" }),
    birthplace: z.string().min(2, { message: "Birth place is required" }),
    purpose: z.string().min(1, { message: "Purpose is required" }),
    message: z.string().min(5, { message: "Message is required" }),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms",
    }),
})

export default function BookService() {
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

    const onSubmit = (data) => {
        console.log("Form submitted:", data)
        alert("Form submitted successfully!")
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row min-h-screen mt-12">
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative">
                    <Image src="/stones.png" alt="Colorful gemstones collection" fill className="object-cover" priority />
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 overflow-y-auto">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-black">
                                Gem Recommendation Service | Online Astrology & Stone Picker
                            </h1>
                            <p className="mt-4 text-gray-700">
                                Find your ideal gemstone using your birth details and zodiac sign. Get personalized, astrology-based stone
                                recommendations to boost luck, success, and balance.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Name<span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Your Name" {...field} className="rounded-md" />
                                                </FormControl>
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
                                                    Select<span className="text-red-500">*</span>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-md">
                                                            <SelectValue placeholder="Gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                                    Email<span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter Your Email" {...field} className="rounded-md" />
                                                </FormControl>
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
                                                    Phone Number<span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="Enter Phone Number" {...field} className="rounded-md" />
                                                </FormControl>
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
                                                    Date Of Birth<span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="MM/DD/YYYY"
                                                            {...field}
                                                            className="rounded-md"
                                                            onFocus={(e) => (e.target.type = "date")}
                                                            onBlur={(e) => (e.target.type = "text")}
                                                        />
                                                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    </div>
                                                </FormControl>
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
                                                    Time Of Birth<span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="00:00:00"
                                                            {...field}
                                                            className="rounded-md"
                                                            onFocus={(e) => (e.target.type = "time")}
                                                            onBlur={(e) => (e.target.type = "text")}
                                                        />
                                                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Birthplace */}
                                    <FormField
                                        control={form.control}
                                        name="birthplace"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">
                                                    Birth Place<span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter" {...field} className="rounded-md" />
                                                </FormControl>
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
                                                    Select<span className="text-red-500">*</span>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-md">
                                                            <SelectValue placeholder="Purpose" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="health">Health</SelectItem>
                                                        <SelectItem value="wealth">Wealth</SelectItem>
                                                        <SelectItem value="relationship">Relationship</SelectItem>
                                                        <SelectItem value="career">Career</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Message */}
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                Your Message<span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter Your Message"
                                                    rows={5}
                                                    {...field}
                                                    className="rounded-md resize-none"
                                                />
                                            </FormControl>
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
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm text-gray-700 font-normal">
                                                    I have read and agree to the{" "}
                                                    <Link href="#" className="font-medium text-black underline">
                                                        Privacy Policy
                                                    </Link>{" "}
                                                    and{" "}
                                                    <Link href="#" className="font-medium text-black underline">
                                                        Terms of Service
                                                    </Link>
                                                    .
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-end mt-8">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-amber-700 text-amber-700 hover:bg-amber-50 rounded-md px-8 py-6 font-medium"
                                    >
                                        CALL US
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-amber-700 hover:bg-amber-800 text-white rounded-md px-8 py-6 font-medium"
                                    >
                                        GET RECOMMENDATION NOW
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
