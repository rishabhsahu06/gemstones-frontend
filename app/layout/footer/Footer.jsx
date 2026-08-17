import Link from "next/link"
import Image from "next/image"
import { PhoneIcon as WhatsApp } from "lucide-react"

function Footer() {
    return (
        <footer className="w-full bg-white pt-8 sm:pt-12 pb-6 mt-8 sm:mt-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
                    {/* Logo and Description */}
                    <div className="flex flex-col space-y-3 sm:space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-center sm:justify-start">
                            <Image
                                src="/logo.png"
                                alt="Sunita Gems & Stones"
                                width={77}
                                height={80}
                                className="w-16 h-16 sm:w-[77px] sm:h-20"
                            />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 max-w-xs mx-auto sm:mx-0 text-center sm:text-left leading-relaxed">
                            Get Personalized Gem Recommendations Based On Your Astrology. Find Your Lucky Stone To Boost Balance And
                            Success
                        </p>
                    </div>

                    {/* First Information Column */}
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        <h3 className="font-bold text-base sm:text-lg text-center sm:text-left">Information</h3>
                        <nav className="flex flex-col space-y-2 items-center sm:items-start">
                            <Link href="/" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                Home
                            </Link>
                            <Link href="/gem-recommendation" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                Gem Recommendation
                            </Link>
                            <Link href="/products" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                Gemstones
                            </Link>
                            <Link href="/gemstones-jewellery" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                Gemstones Jewellery
                            </Link>
                        </nav>
                    </div>

                    {/* Second Information Column */}
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        <h3 className="font-bold text-base sm:text-lg text-center sm:text-left">Information</h3>
                        <nav className="flex flex-col space-y-2 items-center sm:items-start">
                            <Link href="/about" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                About
                            </Link>
                            <Link href="/book-call" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                Services
                            </Link>
                            {/* <Link href="/privacy-policy" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                Privacy Policy
                            </Link> */}
                        </nav>
                    </div>

                    {/* Contact and Careers */}
                    <div className="flex flex-col space-y-6 sm:space-y-8">
                        {/* Careers Section */}
                        <div className="flex flex-col space-y-2 sm:space-y-4 text-center sm:text-left">
                            <h3 className="font-bold text-base sm:text-lg">For Careers</h3>
                            <Link
                                href="mailto:sunitagemstones@gmail.com"
                                className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 underline break-all sm:break-normal transition-colors duration-200"
                            >
                                sunitagemstones@gmail.com
                            </Link>
                        </div>

                        {/* Contact Section */}
                        <div className="flex flex-col items-center sm:items-start space-y-2 sm:space-y-4">
                            <h3 className="font-bold text-base sm:text-lg">Contact Us</h3>
                            <Link
                                href="https://wa.me/919993409376"
                                className="flex items-center justify-start sm:justify-start text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 sm:p-0 hover:bg-gray-50 sm:hover:bg-transparent rounded"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <WhatsApp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                                <span className="ml-2 text-sm sm:text-base font-medium">+91 9993409376</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4 sm:my-6"></div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center space-y-4 sm:space-y-6 mb-4 sm:mb-6">
                    {/* Zodiac Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                        <Image
                            src="/zodiac.png"
                            alt="Zodiac Chart"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Tagline */}
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center px-4 leading-tight">
                        SHINE WITH YOUR STAR GEM.
                    </h2>
                </div>

                {/* Copyright and Links */}
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-xs sm:text-sm text-gray-700 pt-4 border-t border-gray-100">
                    <p className="text-center sm:text-left">
                        ©Sunita Gem All rights reserved {new Date().getFullYear()}
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-center">
                        <Link
                            href="/privacy-policy"
                            className="hover:text-gray-900 transition-colors duration-200 px-2 py-1 sm:px-0 sm:py-0"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/term-conditions"
                            className="hover:text-gray-900 transition-colors duration-200 px-2 py-1 sm:px-0 sm:py-0"
                        >
                            Terms and conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer