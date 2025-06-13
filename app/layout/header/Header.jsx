"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, User, X, ChevronDown, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
    import { signOut } from "next-auth/react"
import api from "@/lib/axios"

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
    const [isGemstonesDropdownOpen, setIsGemstonesDropdownOpen] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    const [gemstoneCategories, setGemstoneCategories] = useState([])
    const [isLoadingGemstones, setIsLoadingGemstones] = useState(false)
    const [gemstonesError, setGemstonesError] = useState(null)

    const serviceDropdownRef = useRef(null)
    const gemstonesDropdownRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const hoverTimeoutRef = useRef(null)
    const router = useRouter()
    const pathname = usePathname()

    // Function to check if a path is active
    const isActivePath = (path) => {
        if (path === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(path)
    }

    const handleLogout = () => {
        signOut(
            { callbackUrl: '/' } // Redirect to home after logout
        )
    }

    // Function to get link classes based on active state
    const getLinkClasses = (path, baseClasses = "transition-colors text-sm xl:text-base whitespace-nowrap") => {
        const isActive = isActivePath(path)
        return cn(
            baseClasses,
            isActive
                ? "text-[#BA8E49] font-medium border-b-2 border-[#BA8E49] pb-1"
                : "text-gray-700 hover:text-[#BA8E49]"
        )
    }

    // Function to get mobile link classes
    const getMobileLinkClasses = (path, baseClasses = "transition-colors text-lg") => {
        const isActive = isActivePath(path)
        return cn(
            baseClasses,
            isActive
                ? "text-[#BA8E49] font-medium"
                : "text-gray-700 hover:text-[#BA8E49]"
        )
    }

    // Fetch gemstone categories from API
    const fetchGemstoneCategories = async () => {
        try {
            setIsLoadingGemstones(true)
            setGemstonesError(null)
            
            const response = await api.get('/products/primary-categories')
            
            if (response.data.success && response.data.data) {
                // Transform API data to match the expected structure
                const transformedCategories = [
                    {
                        title: "Primary Categories",
                        gemstones: response.data.data.map(item => ({
                            id: item.id,
                            name: item.displayName,
                            slug: item.name,
                            image: `/gemstones/${item.name.toLowerCase().replace(/\s+/g, '-')}.png` // Fallback image path
                        }))
                    }
                ]
                setGemstoneCategories(transformedCategories)
            } else {
                throw new Error('Invalid API response format')
            }
        } catch (error) {
            console.error('Error fetching gemstone categories:', error)
            setGemstonesError('Failed to load gemstone categories')
            // Fallback to empty categories or default data
            setGemstoneCategories([])
        } finally {
            setIsLoadingGemstones(false)
        }
    }

    // Detect touch device
    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
        }
        checkTouchDevice()
        window.addEventListener('resize', checkTouchDevice)
        return () => window.removeEventListener('resize', checkTouchDevice)
    }, [])

    // Fetch gemstone categories on component mount
    useEffect(() => {
        fetchGemstoneCategories()
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
    const handleGemstoneClick = (gemstone, event) => {
        // Prevent event bubbling to parent dropdown handlers
        event.stopPropagation()

        // Close all dropdowns
        closeAllDropdowns()

        // Navigate to gemstone page using the slug from API
        router.push(`/-/gemStone/${gemstone.slug}`)
    }

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
                        <Link href="/" className={getLinkClasses('/')}>
                            Home
                        </Link>
                        <Link href="/-/gem-recommendation" className={getLinkClasses('/-/gem-recommendation')}>
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
                                className={cn(
                                    "flex items-center transition-colors text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:ring-opacity-50 rounded px-2 py-1 whitespace-nowrap",
                                    isActivePath('/-/gemStone') || isActivePath('/-/gemstones')
                                        ? "text-[#BA8E49] font-medium"
                                        : "text-gray-700 hover:text-[#BA8E49]"
                                )}
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
                                "w-[280px] sm:w-[400px] md:w-[500px] lg:w-[600px]",
                                isGemstonesDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                            )}>
                                {isLoadingGemstones ? (
                                    <div className="p-6 text-center">
                                        <div className="animate-pulse text-gray-500">Loading gemstones...</div>
                                    </div>
                                ) : gemstonesError ? (
                                    <div className="p-6 text-center">
                                        <div className="text-red-500 text-sm">{gemstonesError}</div>
                                        <button 
                                            onClick={fetchGemstoneCategories}
                                            className="mt-2 text-[#BA8E49] hover:underline text-sm"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : gemstoneCategories.length > 0 ? (
                                    <div className="p-5">
                                        {gemstoneCategories.map((category, categoryIndex) => (
                                            <div key={categoryIndex} className="space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                                    {category.title}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {category.gemstones.map((gemstone, gemIndex) => (
                                                        <Link
                                                            key={gemstone.id}
                                                            href={`/-/gemStone/${gemstone.slug}`}
                                                            className="flex items-center space-x-3 text-gray-600 hover:text-[#BA8E49] transition-colors group p-2 rounded hover:bg-gray-50"
                                                            onClick={() => setIsGemstonesDropdownOpen(false)}
                                                        >
                                                          
                                                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                                                                <Image
                                                                    src={gemstone.image}
                                                                    alt={gemstone.name}
                                                                    width={24}
                                                                    height={24}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        // Fallback to a default gemstone icon if image fails to load
                                                                        e.target.style.display = 'none'
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-sm group-hover:text-[#BA8E49]">
                                                                {gemstone.name}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <div className="text-gray-500 text-sm">No gemstones available</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Link href="/-/gemstones-jewellery" className={getLinkClasses('/-/gemstones-jewellery')}>
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
                                className={cn(
                                    "flex items-center transition-colors text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:ring-opacity-50 rounded px-2 py-1 whitespace-nowrap",
                                    isActivePath('/-/get-recommendation') || isActivePath('/-/book-call')
                                        ? "text-[#BA8E49] font-medium"
                                        : "text-gray-700 hover:text-[#BA8E49]"
                                )}
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
                                        href="/-/book-call"
                                        className="block text-gray-600 hover:text-[#BA8E49] transition-colors p-2 rounded hover:bg-gray-50"
                                        onClick={closeAllDropdowns}
                                    >
                                        Book Call
                                    </Link>
                                </div>  
                            </div>
                        </div>

                        <Link href="/-/about" className={getLinkClasses('/-/about')}>
                            About
                        </Link>
                    </nav>

                    {/* Right Side Icons and Button */}
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                        {/* <Link onClick={handleLogout} className="hidden sm:block text-gray-700 hover:text-[#BA8E49] p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"> */}
                        <Link href="/-/user" className="hidden sm:block text-gray-700 hover:text-[#BA8E49] p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            <User className="h-5 w-5 lg:h-6 lg:w-6" />
                            <span className="sr-only">Account</span>
                        </Link>
                        <Link href="/search" className="hidden sm:block text-gray-700 hover:text-[#BA8E49] p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Search className="h-5 w-5 lg:h-6 lg:w-6" />
                            <span className="sr-only">Search</span>
                        </Link>

                        <Link href="/-/cart" className="hidden sm:block text-gray-700 hover:text-[#BA8E49] p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                            <span className="sr-only">Cart</span>
                        </Link>

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
                        <Link href="/" className={getMobileLinkClasses('/')} onClick={toggleMenu}>
                            Home
                        </Link>
                        <Link href="/-/gem-recommendation" className={getMobileLinkClasses('/-/gem-recommendation')} onClick={toggleMenu}>
                            Gem Recommendation
                        </Link>

                        {/* Mobile Gemstones Section */}
                        <div className="space-y-3">
                            <button
                                onClick={toggleMobileGemstonesDropdown}
                                className={cn(
                                    "flex items-center justify-between w-full text-lg font-medium transition-colors",
                                    isActivePath('/-/gemStone') || isActivePath('/-/gemstones')
                                        ? "text-[#BA8E49]"
                                        : "text-gray-700 hover:text-[#BA8E49]"
                                )}
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
                                {isLoadingGemstones ? (
                                    <div className="pl-4 pt-2 text-sm text-gray-500">Loading...</div>
                                ) : gemstonesError ? (
                                    <div className="pl-4 pt-2">
                                        <div className="text-sm text-red-500">{gemstonesError}</div>
                                        <button 
                                            onClick={fetchGemstoneCategories}
                                            className="mt-1 text-[#BA8E49] hover:underline text-sm"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pl-4 space-y-4 pt-2">
                                        {gemstoneCategories.map((category, categoryIndex) => (
                                            <div key={categoryIndex} className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-800">{category.title}</h4>
                                                <div className="pl-3 space-y-2">
                                                    {category.gemstones.map((gemstone) => (
                                                        <button
                                                            key={gemstone.id}
                                                            onClick={(e) => {
                                                                handleGemstoneClick(gemstone, e)
                                                                toggleMenu()
                                                            }}
                                                            className="flex items-center space-x-2 text-gray-600 hover:text-[#BA8E49] text-sm transition-colors w-full text-left"
                                                        >
                                                            <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                                                                <Image
                                                                    src={gemstone.image}
                                                                    alt={gemstone.name}
                                                                    width={16}
                                                                    height={16}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none'
                                                                    }}
                                                                />
                                                            </div>
                                                            <span>{gemstone.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Link href="/-/gemstones-jewellery" className={getMobileLinkClasses('/-/gemstones-jewellery')} onClick={toggleMenu}>
                            Gemstones Jewellery
                        </Link>

                        {/* Mobile Service Section */}
                        <div className="space-y-3">
                            <button
                                onClick={toggleMobileServiceDropdown}
                                className={cn(
                                    "flex items-center justify-between w-full text-lg font-medium transition-colors",
                                    isActivePath('/-/get-recommendation') || isActivePath('/-/book-call')
                                        ? "text-[#BA8E49]"
                                        : "text-gray-700 hover:text-[#BA8E49]"
                                )}
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
                                  
                                    <Link href="/-/book-call" className="block text-gray-600 hover:text-[#BA8E49] text-base transition-colors" onClick={toggleMenu}>
                                        Book Call
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/-/about" className={getMobileLinkClasses('/-/about')} onClick={toggleMenu}>
                            About
                        </Link>

                        {/* Mobile Icons */}
                        <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                            <Link href="/account" className="text-gray-700 hover:text-[#BA8E49] p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={toggleMenu}>
                                <User className="h-6 w-6" />
                                <span className="sr-only">Account</span>
                            </Link>
                            <Link href="/search" className="text-gray-700 hover:text-[#BA8E49] p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={toggleMenu}>
                                <Search className="h-6 w-6" />
                                <span className="sr-only">Search</span>
                            </Link>
                            <Link href="/cart" className="text-gray-700 hover:text-[#BA8E49] p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={toggleMenu}>
                                <ShoppingCart className="h-6 w-6" />
                                <span className="sr-only">Cart</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header