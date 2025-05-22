"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className="border-b border-gray-100 bg-white shadow-sm py-4">
            <div className="container mx-auto ">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="Sunita Gems & Jewels" width={50} height={50} />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex lg:items-center lg:space-x-8">
                        <Link href="/" className="border-b-2 border-primary pb-1 text-primary font-medium">
                            Home
                        </Link>
                        <Link href="/-/gem-recommendation" className="text-gray-700 hover:text-primary transition-colors">
                            Gem Recommendation
                        </Link>
                        <Link href="/-/gemStone" className="text-gray-700 hover:text-primary transition-colors">
                            Gemstones
                        </Link>
                        <Link href="/-/gemstones-jewellery" className="text-gray-700 hover:text-primary transition-colors">
                            Gemstones Jewellery
                        </Link>
                        <Link href="/-/service" className="text-gray-700 hover:text-primary transition-colors">
                            Service
                        </Link>
                        <Link href="/-/about" className="text-gray-700 hover:text-primary transition-colors">
                            About
                        </Link>
                    </nav>

                    {/* Right Side Icons and Button */}
                    <div className="flex items-center space-x-4">
                        <Link href="/account" className="hidden md:block text-gray-700 hover:text-primary">
                            <User className="h-6 w-6" />
                            <span className="sr-only">Account</span>
                        </Link>
                        <Link href="/search" className="hidden md:block text-gray-700 hover:text-primary">
                            <Search className="h-6 w-6" />
                            <span className="sr-only">Search</span>
                        </Link>
                        <Button className="hidden md:inline-flex bg-primary hover:bg-primary text-white font-medium px-6 py-6 rounded-md">
                            CONTACT US
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 text-gray-700 lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-white p-6 lg:hidden transform transition-transform duration-300 ease-in-out",
                    isMenuOpen ? "translate-x-0" : "translate-x-full",
                )}
            >
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="Sunita Gems & Jewels" width={80} height={80} className="h-auto w-auto" />
                    </Link>
                    <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 text-gray-700">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>

                <nav className="flex flex-col space-y-6">
                    <Link href="/" className="text-primary font-medium text-lg" onClick={toggleMenu}>
                        Home
                    </Link>
                    <Link href="/gem-recommendation" className="text-gray-700 hover:text-primary text-lg" onClick={toggleMenu}>
                        Gem Recommendation
                    </Link>
                    <Link href="/gemstones" className="text-gray-700 hover:text-primary text-lg" onClick={toggleMenu}>
                        Gemstones
                    </Link>
                    <Link href="/jewellery" className="text-gray-700 hover:text-primary text-lg" onClick={toggleMenu}>
                        Gemstones Jewellery
                    </Link>
                    <Link href="/service" className="text-gray-700 hover:text-primary text-lg" onClick={toggleMenu}>
                        Service
                    </Link>
                    <Link href="/about" className="text-gray-700 hover:text-primary text-lg" onClick={toggleMenu}>
                        About
                    </Link>

                    <div className="flex items-center space-x-4 pt-4">
                        <Link href="/account" className="text-gray-700 hover:text-primary">
                            <User className="h-6 w-6" />
                            <span className="sr-only">Account</span>
                        </Link>
                        <Link href="/search" className="text-gray-700 hover:text-primary">
                            <Search className="h-6 w-6" />
                            <span className="sr-only">Search</span>
                        </Link>
                    </div>

                    <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-md">
                        CONTACT US
                    </Button>
                </nav>
            </div>
        </header>
    )
}

export default Header
