import Link from "next/link"
import Image from "next/image"
import { PhoneIcon as WhatsApp } from "lucide-react"

function Footer() {
    return (
        <footer className="w-full bg-white pt-12 pb-6 mt-12">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Logo and Description */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center">
                            <Image src="/logo.png" alt="Sunita Gems & Stones" width={77} height={80} />
                        </div>
                        <p className="text-sm text-gray-700 max-w-xs">
                            Get Personalized Gem Recommendations Based On Your Astrology. Find Your Lucky Stone To Boost Balance And
                            Success
                        </p>
                    </div>

                    {/* First Information Column */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-bold text-lg">Information</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/" className="text-gray-700 hover:text-gray-900">
                                Home
                            </Link>
                            <Link href="/gem-recommendation" className="text-gray-700 hover:text-gray-900">
                                Gem Recommendation
                            </Link>
                            <Link href="/gemstones" className="text-gray-700 hover:text-gray-900">
                                Gemstones
                            </Link>
                            <Link href="/jewellery" className="text-gray-700 hover:text-gray-900">
                                Gemstones Jewellery
                            </Link>
                        </nav>
                    </div>

                    {/* Second Information Column */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-bold text-lg">Information</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/about" className="text-gray-700 hover:text-gray-900">
                                About
                            </Link>
                            <Link href="/services" className="text-gray-700 hover:text-gray-900">
                                Services
                            </Link>
                            <Link href="/blogs" className="text-gray-700 hover:text-gray-900">
                                Blogs
                            </Link>
                        </nav>
                    </div>

                    {/* Contact and Careers */}
                    <div className="grid grid-cols-1 gap-8">
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-lg">For Careers</h3>
                            <Link href="mailto:Dummy@gmail.com" className="text-gray-700 hover:text-gray-900 underline">
                                Dummy@gmail.com
                            </Link>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-lg">Contact Us</h3>
                            <Link href="https://wa.me/" className="text-gray-700 hover:text-gray-900">
                                <WhatsApp className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center space-y-6 mb-6">
                    {/* Zodiac Icon */}
                    <div className="w-20 h-20 relative">
                        <Image src="/zodiac.png" alt="Zodiac Chart" width={80} height={80} />
                    </div>

                    {/* Tagline */}
                    <h2 className="text-2xl font-bold text-center">SHINE WITH YOUR STAR GEM.</h2>
                </div>

                {/* Copyright and Links */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-700">
                    <p>©Sunita Gem All rights reserved {new Date().getFullYear()}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy-policy" className="hover:text-gray-900">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-gray-900">
                            Terms and conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
