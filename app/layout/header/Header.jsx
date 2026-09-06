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
import { AnimatePresence, motion } from "motion/react"

const ANNOUNCEMENTS = [
  "✦ Free astrologer consultation with every order",
  "✦ All stones lab-certified & energised before dispatch",
  "✦ Insured shipping · 7-day returns · Ships from Jaipur",
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
  const [isGemstonesDropdownOpen, setIsGemstonesDropdownOpen] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [gemstoneCategories, setGemstoneCategories] = useState([])
  const [isLoadingGemstones, setIsLoadingGemstones] = useState(false)
  const [gemstonesError, setGemstonesError] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [announcementIdx, setAnnouncementIdx] = useState(0)

  const serviceDropdownRef = useRef(null)
  const gemstonesDropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const hoverTimeoutRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()

  // ── Scroll detection ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── Announcement rotation ─────────────────────────────────────
  useEffect(() => {
    const t = setInterval(
      () => setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length),
      3500
    )
    return () => clearInterval(t)
  }, [])

  // ── Active path helpers ───────────────────────────────────────
  const isActivePath = (path) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const handleLogout = () => signOut({ callbackUrl: "/" })

  const getLinkClasses = (path) =>
    cn(
      "transition-colors text-sm xl:text-base whitespace-nowrap link-underline",
      isActivePath(path)
        ? "font-medium"
        : "",
      scrolled
        ? isActivePath(path) ? "text-gold" : "text-ink-foreground/80 hover:text-gold"
        : isActivePath(path) ? "text-gold" : "text-gray-700 hover:text-[#BA8E49]"
    )

  const getMobileLinkClasses = (path) =>
    cn(
      "transition-colors text-lg",
      isActivePath(path) ? "text-gold font-medium" : "text-ink hover:text-gold"
    )

  // ── Fetch gemstone categories ─────────────────────────────────
  const fetchGemstoneCategories = async () => {
    try {
      setIsLoadingGemstones(true)
      setGemstonesError(null)
      const response = await api.get("/products/primary-categories")
      if (response.data.success && response.data.data) {
        const transformedCategories = [
          {
            title: "Primary Categories",
            gemstones: response.data.data.map((item) => ({
              id: item.id,
              name: item.displayName,
              slug: item.name,
              image: `/gemstones/${item.name.toLowerCase().replace(/\s+/g, "-")}.png`,
              image2: item.primaryCategoryImage,
            })),
          },
        ]
        setGemstoneCategories(transformedCategories)
      } else {
        throw new Error("Invalid API response format")
      }
    } catch (error) {
      console.error("Error fetching gemstone categories:", error)
      setGemstonesError("Failed to load gemstone categories")
      setGemstoneCategories([])
    } finally {
      setIsLoadingGemstones(false)
    }
  }

  const ensureGemstoneCategoriesLoaded = () => {
    if (gemstoneCategories.length === 0 && !isLoadingGemstones) {
      fetchGemstoneCategories()
    }
  }

  // ── Touch device detection ────────────────────────────────────
  useEffect(() => {
    const check = () =>
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // ── Click-outside & Escape ────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target))
        setIsServiceDropdownOpen(false)
      if (gemstonesDropdownRef.current && !gemstonesDropdownRef.current.contains(e.target))
        setIsGemstonesDropdownOpen(false)
    }
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsServiceDropdownOpen(false)
        setIsGemstonesDropdownOpen(false)
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // ── Body scroll lock ──────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isMenuOpen])

  // ── Interaction helpers (unchanged logic) ─────────────────────
  const toggleMenu = () => {
    setIsMenuOpen((v) => !v)
    if (!isMenuOpen) {
      setIsServiceDropdownOpen(false)
      setIsGemstonesDropdownOpen(false)
    }
  }

  const handleServiceInteraction = (action, isHovering = false) => {
    if (isTouchDevice || window.innerWidth < 1024) {
      if (action === "click") {
        setIsServiceDropdownOpen((v) => !v)
        setIsGemstonesDropdownOpen(false)
      }
    } else {
      if (action === "hover") {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        if (isHovering) {
          setIsServiceDropdownOpen(true)
          setIsGemstonesDropdownOpen(false)
        } else {
          hoverTimeoutRef.current = setTimeout(() => setIsServiceDropdownOpen(false), 150)
        }
      } else if (action === "click") {
        setIsServiceDropdownOpen((v) => !v)
        setIsGemstonesDropdownOpen(false)
      }
    }
  }

  const handleGemstonesInteraction = (action, isHovering = false) => {
    if (isTouchDevice || window.innerWidth < 1024) {
      if (action === "click") {
        ensureGemstoneCategoriesLoaded()
        setIsGemstonesDropdownOpen((v) => !v)
        setIsServiceDropdownOpen(false)
      }
    } else {
      if (action === "hover") {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        if (isHovering) {
          ensureGemstoneCategoriesLoaded()
          setIsGemstonesDropdownOpen(true)
          setIsServiceDropdownOpen(false)
        } else {
          hoverTimeoutRef.current = setTimeout(() => setIsGemstonesDropdownOpen(false), 150)
        }
      } else if (action === "click") {
        ensureGemstoneCategoriesLoaded()
        setIsGemstonesDropdownOpen((v) => !v)
        setIsServiceDropdownOpen(false)
      }
    }
  }

  const closeAllDropdowns = () => {
    setIsServiceDropdownOpen(false)
    setIsGemstonesDropdownOpen(false)
  }

  const toggleMobileServiceDropdown = () => setIsServiceDropdownOpen((v) => !v)
  const toggleMobileGemstonesDropdown = () => {
    if (!isGemstonesDropdownOpen) ensureGemstoneCategoriesLoaded()
    setIsGemstonesDropdownOpen((v) => !v)
  }

  const handleGemstoneClick = (gemstone, event) => {
    event.stopPropagation()
    closeAllDropdowns()
    router.push(`/gemStone/${gemstone.slug}`)
  }

  // ── Nav link colour for scrolled state ───────────────────────
  const navLinkColor = scrolled ? "text-ink-foreground/80" : "text-gray-700"

  return (
    <>
      {/* ── Announcement bar ────────────────────────────────────── */}
      <div
        className="relative overflow-hidden h-9 flex items-center justify-center"
        style={{ background: "var(--ink)" }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={announcementIdx}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute eyebrow text-[0.6rem] tracking-[0.22em]"
            style={{ color: "var(--gold-soft)" }}
          >
            {ANNOUNCEMENTS[announcementIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Main header ─────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500",
          scrolled
            ? "shadow-xl border-b border-white/10"
            : "border-b border-gray-100 bg-white shadow-sm"
        )}
        style={
          scrolled
            ? {
                background: "oklch(0.19 0.045 265 / 0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }
            : {}
        }
      >
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
              <Link href="/" className={getLinkClasses("/")}>
                Home
              </Link>
              <Link href="/gem-recommendation" className={getLinkClasses("/gem-recommendation")}>
                Gem Recommendation
              </Link>

              {/* Gemstones Dropdown */}
              <div
                ref={gemstonesDropdownRef}
                className="relative"
                onMouseEnter={() => handleGemstonesInteraction("hover", true)}
                onMouseLeave={() => handleGemstonesInteraction("hover", false)}
              >
                <button
                  onClick={() => handleGemstonesInteraction("click")}
                  className={cn(
                    "flex items-center transition-colors text-sm xl:text-base focus:outline-none rounded px-2 py-1 whitespace-nowrap link-underline",
                    isActivePath("/gemStone") || isActivePath("/gemstones")
                      ? "text-gold font-medium"
                      : scrolled ? "text-ink-foreground/80 hover:text-gold" : "text-gray-700 hover:text-[#BA8E49]"
                  )}
                  aria-haspopup="true"
                  aria-expanded={isGemstonesDropdownOpen}
                >
                  Gemstones
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      isGemstonesDropdownOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200",
                    "w-[280px] sm:w-[400px] md:w-[500px] lg:w-[600px]",
                    isGemstonesDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  )}
                >
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
                            {category.gemstones.map((gemstone) => (
                              <Link
                                key={gemstone.id}
                                href={`/gemStone/${gemstone.slug}`}
                                className="flex items-center space-x-3 text-gray-600 hover:text-[#BA8E49] transition-colors group p-2 rounded hover:bg-gray-50"
                                onClick={() => setIsGemstonesDropdownOpen(false)}
                              >
                                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                                  <Image
                                    src={gemstone.image2 || gemstone.image}
                                    alt={gemstone.name}
                                    width={24}
                                    height={24}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = "none" }}
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

              <Link href="/gemstones-jewellery" className={getLinkClasses("/gemstones-jewellery")}>
                Gemstones Jewellery
              </Link>

              {/* Service Dropdown */}
              <div
                ref={serviceDropdownRef}
                className="relative"
                onMouseEnter={() => handleServiceInteraction("hover", true)}
                onMouseLeave={() => handleServiceInteraction("hover", false)}
              >
                <button
                  onClick={() => handleServiceInteraction("click")}
                  className={cn(
                    "flex items-center transition-colors text-sm xl:text-base focus:outline-none rounded px-2 py-1 whitespace-nowrap link-underline",
                    isActivePath("/get-recommendation") || isActivePath("/book-call")
                      ? "text-gold font-medium"
                      : scrolled ? "text-ink-foreground/80 hover:text-gold" : "text-gray-700 hover:text-[#BA8E49]"
                  )}
                  aria-haspopup="true"
                  aria-expanded={isServiceDropdownOpen}
                >
                  Service
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      isServiceDropdownOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-4 px-6 z-50 transition-all duration-200",
                    isServiceDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  )}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service</h3>
                  <div className="space-y-3">
                    <Link
                      href="/book-call"
                      className="block text-gray-600 hover:text-[#BA8E49] transition-colors p-2 rounded hover:bg-gray-50"
                      onClick={closeAllDropdowns}
                    >
                      Book Call
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/about" className={getLinkClasses("/about")}>
                About
              </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <Link
                href="/user"
                className={cn(
                  "hidden sm:block p-2 rounded-full transition-colors",
                  scrolled
                    ? "text-ink-foreground/80 hover:text-gold hover:bg-white/10"
                    : "text-gray-700 hover:text-[#BA8E49] hover:bg-gray-100"
                )}
              >
                <User className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="sr-only">Account</span>
              </Link>

              <Link
                href="/cart"
                className={cn(
                  "hidden sm:block p-2 rounded-full transition-colors",
                  scrolled
                    ? "text-ink-foreground/80 hover:text-gold hover:bg-white/10"
                    : "text-gray-700 hover:text-[#BA8E49] hover:bg-gray-100"
                )}
              >
                <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="sr-only">Cart</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className={cn(
                  "inline-flex items-center justify-center p-2 lg:hidden rounded-md transition-colors",
                  scrolled
                    ? "text-ink-foreground hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <motion.div
        ref={mobileMenuRef}
        initial={false}
        animate={{ x: isMenuOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 h-full w-full max-w-sm z-[60] lg:hidden overflow-y-auto"
        style={{ background: "var(--ink)" }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center" onClick={toggleMenu}>
              <Image
                src="/logo.png"
                alt="Sunita Gems & Jewels"
                width={60}
                height={60}
                className="h-10 w-10"
              />
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md transition-colors hover:bg-white/10"
              style={{ color: "var(--ink-foreground)" }}
              aria-label="Close mobile menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6">
            {[
              { href: "/", label: "Home" },
              { href: "/gem-recommendation", label: "Gem Recommendation" },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 30 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={item.href}
                  className={getMobileLinkClasses(item.href)}
                  style={{ color: isActivePath(item.href) ? "var(--gold)" : "var(--ink-foreground)" }}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Gemstones */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 30 }}
              transition={{ delay: 0.17, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <button
                onClick={toggleMobileGemstonesDropdown}
                className="flex items-center justify-between w-full text-lg font-medium transition-colors"
                style={{ color: isActivePath("/gemStone") || isActivePath("/gemstones") ? "var(--gold)" : "var(--ink-foreground)" }}
              >
                Gemstones
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isGemstonesDropdownOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  isGemstonesDropdownOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {isLoadingGemstones ? (
                  <div className="pl-4 pt-2 text-sm" style={{ color: "var(--gold-soft)" }}>Loading...</div>
                ) : gemstonesError ? (
                  <div className="pl-4 pt-2">
                    <div className="text-sm text-red-400">{gemstonesError}</div>
                    <button onClick={fetchGemstoneCategories} className="mt-1 text-sm" style={{ color: "var(--gold)" }}>Retry</button>
                  </div>
                ) : (
                  <div className="pl-4 space-y-4 pt-2">
                    {gemstoneCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="space-y-2">
                        <h4 className="text-sm font-medium" style={{ color: "var(--gold-soft)" }}>{category.title}</h4>
                        <div className="pl-3 space-y-2">
                          {category.gemstones.map((gemstone) => (
                            <button
                              key={gemstone.id}
                              onClick={(e) => { handleGemstoneClick(gemstone, e); toggleMenu() }}
                              className="flex items-center space-x-2 text-sm transition-colors w-full text-left"
                              style={{ color: "var(--ink-foreground)" }}
                            >
                              <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 bg-gray-600">
                                <Image
                                  src={gemstone.image}
                                  alt={gemstone.name}
                                  width={16}
                                  height={16}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = "none" }}
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
            </motion.div>

            {[
              { href: "/gemstones-jewellery", label: "Gemstones Jewellery", delay: 0.23 },
            ].map((item) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 30 }}
                transition={{ delay: item.delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={item.href}
                  style={{ color: isActivePath(item.href) ? "var(--gold)" : "var(--ink-foreground)" }}
                  className="text-lg font-medium transition-colors"
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Service */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 30 }}
              transition={{ delay: 0.29, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <button
                onClick={toggleMobileServiceDropdown}
                className="flex items-center justify-between w-full text-lg font-medium transition-colors"
                style={{ color: isActivePath("/get-recommendation") || isActivePath("/book-call") ? "var(--gold)" : "var(--ink-foreground)" }}
              >
                Service
                <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isServiceDropdownOpen ? "rotate-180" : "")} />
              </button>
              <div className={cn("overflow-hidden transition-all duration-300", isServiceDropdownOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0")}>
                <div className="pl-4 space-y-3 pt-2">
                  <Link
                    href="/book-call"
                    className="block text-base transition-colors"
                    style={{ color: "var(--ink-foreground)" }}
                    onClick={toggleMenu}
                  >
                    Book Call
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 30 }}
              transition={{ delay: 0.35, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/about"
                style={{ color: isActivePath("/about") ? "var(--gold)" : "var(--ink-foreground)" }}
                className="text-lg font-medium transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
            </motion.div>

            {/* Mobile icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isMenuOpen ? 1 : 0 }}
              transition={{ delay: 0.42, duration: 0.35 }}
              className="flex items-center space-x-4 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
            >
              <Link href="/user" className="p-2 rounded-full hover:bg-white/10 transition-colors" style={{ color: "var(--ink-foreground)" }} onClick={toggleMenu}>
                <User className="h-6 w-6" />
                <span className="sr-only">Account</span>
              </Link>
              <Link href="/cart" className="p-2 rounded-full hover:bg-white/10 transition-colors" style={{ color: "var(--ink-foreground)" }} onClick={toggleMenu}>
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Cart</span>
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.div>
    </>
  )
}

export default Header