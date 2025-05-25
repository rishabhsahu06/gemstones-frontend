"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, User, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
    const [isGemstonesDropdownOpen, setIsGemstonesDropdownOpen] = useState(false)
    const router = useRouter()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleServiceHover = (isHovering) => {
        setIsServiceDropdownOpen(isHovering)
    }

    const handleServiceClick = () => {
        setIsServiceDropdownOpen(!isServiceDropdownOpen)
    }

    const handleGemstonesHover = (isHovering) => {
        setIsGemstonesDropdownOpen(isHovering)
    }

    const handleGemstonesClick = () => {
        setIsGemstonesDropdownOpen(!isGemstonesDropdownOpen)
    }

    // Gemstone data - you can add your images here
    const gemstoneCategories = [
        {
            title: "Rashi Ratna",
            gemstones: [
                { name: "Yellow Sapphire/Pukhraj", image: "/pukhraj.png" },
                { name: "Blue Sapphire/Neelam", image: "/neelam.png" },
                { name: "Ruby/Manik", image: "/manik.png" },
                { name: "Emerald/Panna", image: "/panna.png" },
                { name: "Red Coral/Moonga", image: "/moonga.png" },
                { name: "Hessonite/Gomed", image: "/gomed.png" },
                { name: "Pearl", image: "/pearl.png" },
                { name: "Cat's Eye/Lehsuniya", image: "/lehsuniya.png" },
                { name: "Opal", image: "/opal.png" }
            ]
        },
        {
            title: "SEMI PRECIOUS (Upratna)",
            gemstones: [
                { name: "Yellow Sapphire/Pukhraj", image: "/pukhraj.png" },
                { name: "Blue Sapphire/Neelam", image: "/neelam.png" },
                { name: "Ruby/Manik", image: "/manik.png" },
                { name: "Emerald/Panna", image: "/panna.png" },
                { name: "Red Coral/Moonga", image: "/moonga.png" },
                { name: "Hessonite/Gomed", image: "/gomed.png" },
                { name: "Pearl", image: "/pearl.png" },
                { name: "Cat's Eye/Lehsuniya", image: "/lehsuniya.png" },
                { name: "Opal", image: "/opal.png" }
            ]
        },
        {
            title: "BY ZODIAC (Rashi)",
            gemstones: [
                { name: "Yellow Sapphire/Pukhraj", image: "/pukhraj.png" },
                { name: "Blue Sapphire/Neelam", image: "/neelam.png" },
                { name: "Ruby/Manik", image: "/manik.png" },
                { name: "Emerald/Panna", image: "/panna.png" },
                { name: "Red Coral/Moonga", image: "/moonga.png" },
                { name: "Hessonite/Gomed", image: "/gomed.png" },
                { name: "Pearl", image: "/pearl.png" },
                { name: "Cat's Eye/Lehsuniya", image: "/lehsuniya.png" },
                { name: "Opal", image: "/opal.png" }
            ]
        }
    ]

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

                        {/* Gemstones Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleGemstonesHover(true)}
                            onMouseLeave={() => handleGemstonesHover(false)}
                        >
                            <button
                                onClick={handleGemstonesClick}
                                className="flex items-center text-gray-700 hover:text-primary transition-colors"
                            >
                                Gemstones
                                <ChevronDown className={cn(
                                    "ml-1 h-4 w-4 transition-transform duration-200",
                                    isGemstonesDropdownOpen ? "rotate-180" : ""
                                )} />
                            </button>

                            {/* Gemstones Dropdown Menu */}
                            <div className={cn(
                                "absolute top-full left-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50 transition-all duration-200",
                                isGemstonesDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                            )}>
                                <div className="grid grid-cols-3 gap-8">
                                    {gemstoneCategories.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                                {category.title}
                                            </h3>
                                            <div className="space-y-3">
                                                {category.gemstones.map((gemstone, gemIndex) => (
                                                    <Link
                                                        key={gemIndex}
                                                        href={`/-/gemstone/${gemstone.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                                        className="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors group"
                                                        onClick={() => setIsGemstonesDropdownOpen(false)}
                                                    >
                                                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={gemstone.image}
                                                                alt={gemstone.name}
                                                                width={24}
                                                                height={24}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-sm group-hover:text-primary">
                                                            {gemstone.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link href="/-/gemstones-jewellery" className="text-gray-700 hover:text-primary transition-colors">
                            Gemstones Jewellery
                        </Link>

                        {/* Service Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleServiceHover(true)}
                            onMouseLeave={() => handleServiceHover(false)}
                        >
                            <button
                                onClick={handleServiceClick}
                                className="flex items-center text-gray-700 hover:text-primary transition-colors"
                            >
                                Service
                                <ChevronDown className={cn(
                                    "ml-1 h-4 w-4 transition-transform duration-200",
                                    isServiceDropdownOpen ? "rotate-180" : ""
                                )} />
                            </button>

                            {/* Dropdown Menu */}
                            <div className={cn(
                                "absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-4 px-6 z-50 transition-all duration-200",
                                isServiceDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                            )}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service</h3>
                                <div className="space-y-3">
                                    <Link
                                        href="/-/get-recommendation"
                                        className="block text-gray-600 hover:text-primary transition-colors"
                                        onClick={() => setIsServiceDropdownOpen(false)}
                                    >
                                        Get Recommendation Now
                                    </Link>
                                    <Link
                                        href="/-/book-call"
                                        className="block text-gray-600 hover:text-primary transition-colors"
                                        onClick={() => setIsServiceDropdownOpen(false)}
                                    >
                                        Book Call
                                    </Link>
                                </div>
                            </div>
                        </div>

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

                    {/* Mobile Gemstones Section */}
                    <div className="space-y-3">
                        <span className="text-gray-700 text-lg font-medium">Gemstones</span>
                        <div className="pl-4 space-y-4">
                            {gemstoneCategories.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-800">{category.title}</h4>
                                    <div className="pl-3 space-y-2">
                                        {category.gemstones.slice(0, 3).map((gemstone, gemIndex) => (
                                            <Link
                                                key={gemIndex}
                                                href={`/-/gemstone/${gemstone.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                                className="flex items-center space-x-2 text-gray-600 hover:text-primary text-sm"
                                                onClick={toggleMenu}
                                            >
                                                <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={gemstone.image}
                                                        alt={gemstone.name}
                                                        width={16}
                                                        height={16}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span>{gemstone.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Link href="/jewellery" className="text-gray-700 hover:text-primary text-lg" onClick={toggleMenu}>
                        Gemstones Jewellery
                    </Link>

                    {/* Mobile Service Section */}
                    <div className="space-y-3">
                        <span className="text-gray-700 text-lg font-medium">Service</span>
                        <div className="pl-4 space-y-3">
                            <Link href="/-/get-recommendation" className="block text-gray-600 hover:text-primary text-base" onClick={toggleMenu}>
                                Get Recommendation Now
                            </Link>
                            <Link href="/-/book-call" className="block text-gray-600 hover:text-primary text-base" onClick={toggleMenu}>
                                Book Call
                            </Link>
                        </div>
                    </div>

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