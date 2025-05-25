"use client"

import { useState, useEffect, useRef } from "react"
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
    const [isTouchDevice, setIsTouchDevice] = useState(false)

    const serviceDropdownRef = useRef(null)
    const gemstonesDropdownRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const hoverTimeoutRef = useRef(null)
    const router = useRouter()

    // Detect touch device
    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
        }
        checkTouchDevice()
        window.addEventListener('resize', checkTouchDevice)
        return () => window.removeEventListener('resize', checkTouchDevice)
    }, [])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
                setIsServiceDropdownOpen(false)
            }
            if (gemstonesDropdownRef.current && !gemstonesDropdownRef.current.contains(event.target)) {
                setIsGemstonesDropdownOpen(false)
            }
        }

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setIsServiceDropdownOpen(false)
                setIsGemstonesDropdownOpen(false)
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscapeKey)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscapeKey)
        }
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
        // Close any open dropdowns when opening mobile menu
        if (!isMenuOpen) {
            setIsServiceDropdownOpen(false)
            setIsGemstonesDropdownOpen(false)
        }
    }

    const handleServiceInteraction = (action, isHovering = false) => {
        if (isTouchDevice || window.innerWidth < 1024) {
            // Touch devices and mobile - only respond to clicks
            if (action === 'click') {
                setIsServiceDropdownOpen(!isServiceDropdownOpen)
                setIsGemstonesDropdownOpen(false)
            }
        } else {
            // Desktop with mouse - respond to hover
            if (action === 'hover') {
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                }

                if (isHovering) {
                    setIsServiceDropdownOpen(true)
                    setIsGemstonesDropdownOpen(false)
                } else {
                    hoverTimeoutRef.current = setTimeout(() => {
                        setIsServiceDropdownOpen(false)
                    }, 150) // Small delay to prevent flickering
                }
            } else if (action === 'click') {
                setIsServiceDropdownOpen(!isServiceDropdownOpen)
                setIsGemstonesDropdownOpen(false)
            }
        }
    }

    const handleGemstonesInteraction = (action, isHovering = false) => {
        if (isTouchDevice || window.innerWidth < 1024) {
            // Touch devices and mobile - only respond to clicks
            if (action === 'click') {
                setIsGemstonesDropdownOpen(!isGemstonesDropdownOpen)
                setIsServiceDropdownOpen(false)
            }
        } else {
            // Desktop with mouse - respond to hover
            if (action === 'hover') {
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                }

                if (isHovering) {
                    setIsGemstonesDropdownOpen(true)
                    setIsServiceDropdownOpen(false)
                } else {
                    hoverTimeoutRef.current = setTimeout(() => {
                        setIsGemstonesDropdownOpen(false)
                    }, 150) // Small delay to prevent flickering
                }
            } else if (action === 'click') {
                setIsGemstonesDropdownOpen(!isGemstonesDropdownOpen)
                setIsServiceDropdownOpen(false)
            }
        }
    }

    const closeAllDropdowns = () => {
        setIsServiceDropdownOpen(false)
        setIsGemstonesDropdownOpen(false)
    }

    // Handle mobile dropdown toggle - clicking heading or arrow closes dropdown
    const toggleMobileServiceDropdown = () => {
        setIsServiceDropdownOpen(!isServiceDropdownOpen)
    }

    const toggleMobileGemstonesDropdown = () => {
        setIsGemstonesDropdownOpen(!isGemstonesDropdownOpen)
    }

    // Handle gemstone link clicks
    const handleGemstoneClick = (gemstoneName, event) => {
        // Prevent event bubbling to parent dropdown handlers
        event.stopPropagation()

        // Close all dropdowns
        closeAllDropdowns()

        // Navigate to gemstone page
        const slug = gemstoneName.toLowerCase().replace(/[^a-z0-9]/g, '-')
        router.push(`/-/gemstone/${slug}`)
    }

    // Gemstone data
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
        <header className="border-b border-gray-100 bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Sunita Gems & Jewels"
                            width={40}
                            height={40}
                            className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-6 2xl:space-x-8">
                        <Link href="/" className="border-b-2 border-primary pb-1 text-primary font-medium text-sm xl:text-base whitespace-nowrap">
                            Home
                        </Link>
                        <Link href="/-/gem-recommendation" className="text-gray-700 hover:text-primary transition-colors text-sm xl:text-base whitespace-nowrap">
                            Gem Recommendation
                        </Link>

                        {/* Gemstones Dropdown */}
                        <div
                            ref={gemstonesDropdownRef}
                            className="relative"
                            onMouseEnter={() => handleGemstonesInteraction('hover', true)}
                            onMouseLeave={() => handleGemstonesInteraction('hover', false)}
                        >
                            <button
                                onClick={() => handleGemstonesInteraction('click')}
                                className="flex items-center text-gray-700 hover:text-primary transition-colors text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-2 py-1 whitespace-nowrap"
                                aria-haspopup="true"
                                aria-expanded={isGemstonesDropdownOpen}
                            >
                                Gemstones
                                <ChevronDown className={cn(
                                    "ml-1 h-4 w-4 transition-transform duration-200",
                                    isGemstonesDropdownOpen ? "rotate-180" : ""
                                )} />
                            </button>

                            {/* Gemstones Dropdown Menu */}
                            <div className={cn(
                                "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200",
                                "w-[280px] sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[800px] 2xl:w-[900px]",
                                isGemstonesDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                            )}>
                                <div className="p-4 lg:p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                                        {gemstoneCategories.map((category, categoryIndex) => (
                                            <div key={categoryIndex} className="space-y-3">
                                                <h3 className="text-sm lg:text-base xl:text-lg font-semibold text-gray-900 border-b pb-2">
                                                    {category.title}
                                                </h3>
                                                <div className="space-y-2">
                                                    {category.gemstones.map((gemstone, gemIndex) => (
                                                        <button
                                                            key={gemIndex}
                                                            onClick={(e) => handleGemstoneClick(gemstone.name, e)}
                                                            className="flex items-center space-x-2 lg:space-x-3 text-gray-600 hover:text-primary transition-colors group p-1 rounded hover:bg-gray-50 w-full text-left cursor-pointer"
                                                        >
                                                            <div className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded-full overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={gemstone.image}
                                                                    alt={gemstone.name}
                                                                    width={24}
                                                                    height={24}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="text-xs lg:text-sm xl:text-base group-hover:text-primary">
                                                                {gemstone.name}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/-/gemstones-jewellery" className="text-gray-700 hover:text-primary transition-colors text-sm xl:text-base whitespace-nowrap">
                            Gemstones Jewellery
                        </Link>

                        {/* Service Dropdown */}
                        <div
                            ref={serviceDropdownRef}
                            className="relative"
                            onMouseEnter={() => handleServiceInteraction('hover', true)}
                            onMouseLeave={() => handleServiceInteraction('hover', false)}
                        >
                            <button
                                onClick={() => handleServiceInteraction('click')}
                                className="flex items-center text-gray-700 hover:text-primary transition-colors text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-2 py-1 whitespace-nowrap"
                                aria-haspopup="true"
                                aria-expanded={isServiceDropdownOpen}
                            >
                                Service
                                <ChevronDown className={cn(
                                    "ml-1 h-4 w-4 transition-transform duration-200",
                                    isServiceDropdownOpen ? "rotate-180" : ""
                                )} />
                            </button>

                            {/* Service Dropdown Menu */}
                            <div className={cn(
                                "absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-4 px-6 z-50 transition-all duration-200",
                                isServiceDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                            )}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service</h3>
                                <div className="space-y-3">
                                    <Link
                                        href="/-/get-recommendation"
                                        className="block text-gray-600 hover:text-primary transition-colors p-2 rounded hover:bg-gray-50"
                                        onClick={closeAllDropdowns}
                                    >
                                        Get Recommendation Now
                                    </Link>
                                    <Link
                                        href="/-/book-call"
                                        className="block text-gray-600 hover:text-primary transition-colors p-2 rounded hover:bg-gray-50"
                                        onClick={closeAllDropdowns}
                                    >
                                        Book Call
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/-/about" className="text-gray-700 hover:text-primary transition-colors text-sm xl:text-base whitespace-nowrap">
                            About
                        </Link>
                    </nav>

                    {/* Right Side Icons and Button */}
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                        <Link href="/account" className="hidden sm:block text-gray-700 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <User className="h-5 w-5 lg:h-6 lg:w-6" />
                            <span className="sr-only">Account</span>
                        </Link>
                        <Link href="/search" className="hidden sm:block text-gray-700 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Search className="h-5 w-5 lg:h-6 lg:w-6" />
                            <span className="sr-only">Search</span>
                        </Link>
                        <Button className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-white font-medium px-3 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-6 rounded-md text-xs lg:text-sm xl:text-base transition-colors whitespace-nowrap">
                            CONTACT US
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 text-gray-700 lg:hidden hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-opacity duration-300",
                    isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={toggleMenu}
            />

            {/* Mobile Menu */}
            <div
                ref={mobileMenuRef}
                className={cn(
                    "fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto",
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center" onClick={toggleMenu}>
                            <Image
                                src="/logo.png"
                                alt="Sunita Gems & Jewels"
                                width={60}
                                height={60}
                                className="h-12 w-12"
                            />
                        </Link>
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Close mobile menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="flex flex-col space-y-6">
                        <Link href="/" className="text-primary font-medium text-lg" onClick={toggleMenu}>
                            Home
                        </Link>
                        <Link href="/-/gem-recommendation" className="text-gray-700 hover:text-primary text-lg transition-colors" onClick={toggleMenu}>
                            Gem Recommendation
                        </Link>

                        {/* Mobile Gemstones Section */}
                        <div className="space-y-3">
                            <button
                                onClick={toggleMobileGemstonesDropdown}
                                className="flex items-center justify-between w-full text-gray-700 text-lg font-medium hover:text-primary transition-colors"
                            >
                                Gemstones
                                <ChevronDown className={cn(
                                    "h-5 w-5 transition-transform duration-200",
                                    isGemstonesDropdownOpen ? "rotate-180" : ""
                                )} />
                            </button>
                            <div className={cn(
                                "overflow-hidden transition-all duration-300",
                                isGemstonesDropdownOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <div className="pl-4 space-y-4 pt-2">
                                    {gemstoneCategories.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="space-y-2">
                                            <h4 className="text-sm font-medium text-gray-800">{category.title}</h4>
                                            <div className="pl-3 space-y-2">
                                                {category.gemstones.slice(0, 5).map((gemstone, gemIndex) => (
                                                    <button
                                                        key={gemIndex}
                                                        onClick={(e) => {
                                                            handleGemstoneClick(gemstone.name, e)
                                                            toggleMenu()
                                                        }}
                                                        className="flex items-center space-x-2 text-gray-600 hover:text-primary text-sm transition-colors w-full text-left"
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
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link href="/-/gemstones-jewellery" className="text-gray-700 hover:text-primary text-lg transition-colors" onClick={toggleMenu}>
                            Gemstones Jewellery
                        </Link>

                        {/* Mobile Service Section */}
                        <div className="space-y-3">
                            <button
                                onClick={toggleMobileServiceDropdown}
                                className="flex items-center justify-between w-full text-gray-700 text-lg font-medium hover:text-primary transition-colors"
                            >
                                Service
                                <ChevronDown className={cn(
                                    "h-5 w-5 transition-transform duration-200",
                                    isServiceDropdownOpen ? "rotate-180" : ""
                                )} />
                            </button>
                            <div className={cn(
                                "overflow-hidden transition-all duration-300",
                                isServiceDropdownOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <div className="pl-4 space-y-3 pt-2">
                                    <Link href="/-/get-recommendation" className="block text-gray-600 hover:text-primary text-base transition-colors" onClick={toggleMenu}>
                                        Get Recommendation Now
                                    </Link>
                                    <Link href="/-/book-call" className="block text-gray-600 hover:text-primary text-base transition-colors" onClick={toggleMenu}>
                                        Book Call
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/-/about" className="text-gray-700 hover:text-primary text-lg transition-colors" onClick={toggleMenu}>
                            About
                        </Link>

                        {/* Mobile Icons */}
                        <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                            <Link href="/account" className="text-gray-700 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={toggleMenu}>
                                <User className="h-6 w-6" />
                                <span className="sr-only">Account</span>
                            </Link>
                            <Link href="/search" className="text-gray-700 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={toggleMenu}>
                                <Search className="h-6 w-6" />
                                <span className="sr-only">Search</span>
                            </Link>
                        </div>

                        <Button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-medium py-6 rounded-md transition-colors" onClick={toggleMenu}>
                            CONTACT US
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header