"use client"

import { useState, useRef, useEffect } from "react"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"

// Sample data for the reels
const initialReelItems = [
    {
        id: 1,
        type: "image",
        src: "/api/placeholder/400/300",
        title: "Ruby Collection",
    },
    {
        id: 2,
        type: "image",
        src: "/api/placeholder/500/400",
        title: "Sapphire Collection",
    },
    {
        id: 3,
        type: "image",
        src: "/api/placeholder/400/300",
        title: "Emerald Collection",
    },
    {
        id: 4,
        type: "video",
        src: "/placeholder-video.mp4",
        thumbnail: "/api/placeholder/400/300",
        title: "Diamond Collection",
    },
    {
        id: 5,
        type: "image",
        src: "/api/placeholder/400/300",
        title: "Amethyst Collection",
    },
]

function ReelsSection() {
    const [reelItems, setReelItems] = useState(initialReelItems)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [hoveredId, setHoveredId] = useState(null)
    const [isPlaying, setIsPlaying] = useState({})

    const videoRefs = useRef({})

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === reelItems.length - 1 ? 0 : prevIndex + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? reelItems.length - 1 : prevIndex - 1))
    }

    const goToSlide = (index) => {
        setCurrentIndex(index)
    }

    const handleMouseEnter = (id) => {
        setHoveredId(id)
        const item = reelItems.find((item) => item.id === id)

        if (item?.type === "video" && videoRefs.current[id]) {
            videoRefs.current[id]?.play().catch((err) => console.error("Video play error:", err))
            setIsPlaying((prev) => ({ ...prev, [id]: true }))
        }
    }

    const handleMouseLeave = (id) => {
        setHoveredId(null)
        const item = reelItems.find((item) => item.id === id)

        if (item?.type === "video" && videoRefs.current[id]) {
            videoRefs.current[id]?.pause()
            setIsPlaying((prev) => ({ ...prev, [id]: false }))
        }
    }

    const toggleVideoPlay = (id) => {
        const video = videoRefs.current[id]
        if (!video) return

        if (video.paused) {
            video.play().catch((err) => console.error("Video play error:", err))
            setIsPlaying((prev) => ({ ...prev, [id]: true }))
        } else {
            video.pause()
            setIsPlaying((prev) => ({ ...prev, [id]: false }))
        }
    }

    // Check if mobile view
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)

        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    // Get the items to display based on screen size
    const getVisibleItems = () => {
        if (isMobile) {
            // Mobile: show only current item
            return [{ ...reelItems[currentIndex], position: 'center' }]
        } else {
            // Desktop: show 3 items (previous, current, next)
            const prevIndex = currentIndex === 0 ? reelItems.length - 1 : currentIndex - 1
            const nextIndex = currentIndex === reelItems.length - 1 ? 0 : currentIndex + 1

            return [
                { ...reelItems[prevIndex], position: 'left' },
                { ...reelItems[currentIndex], position: 'center' },
                { ...reelItems[nextIndex], position: 'right' }
            ]
        }
    }

    const visibleItems = getVisibleItems()

    return (
        <div className="container mx-auto  overflow-hidden">
            {/* Heading Section */}
            <div className="text-center mb-8 md:mb-10 mt-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4 ">Discover the Sparkle: Gemstone Stories</h2>
                <p className="text-base md:text-lg max-w-4xl mx-auto text-gray-700 px-4">
                    Explore the fascinating journey of each gemstone — from deep within the earth to stunning works of art. Dive
                    into captivating videos that reveal the beauty, craftsmanship, and unique stories behind every sparkling gem.
                </p>
            </div>

            {/* Carousel Section */}
            <div className="relative max-w-6xl mx-auto">
                {/* Left Navigation Arrow */}
                <button
                    onClick={prevSlide}
                    className={`absolute ${isMobile ? 'left-2' : 'left-4'} top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full ${isMobile ? 'p-2' : 'p-3'} shadow-lg hover:bg-white transition-all`}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </button>

                {/* Carousel Container */}
                <div className={`flex items-center justify-center ${isMobile ? 'gap-0 px-12' : 'gap-4 px-16'}`}>
                    {visibleItems.map((item, index) => {
                        const isCenter = item.position === 'center'
                        let itemSize

                        if (isMobile) {
                            itemSize = 'h-80 w-72'
                        } else {
                            itemSize = isCenter ? 'h-96 w-80' : 'h-72 w-64'
                        }

                        return (
                            <div
                                key={`${item.id}-${item.position}`}
                                className={`${itemSize} relative rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${isMobile ? 'shadow-2xl' :
                                    isCenter ? 'shadow-2xl scale-105' : 'shadow-lg opacity-75'
                                    }`}
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={() => handleMouseLeave(item.id)}
                            >
                                {item.type === "image" ? (
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                ) : (
                                    <>
                                        {!isPlaying[item.id] && (
                                            <img
                                                src={item.thumbnail}
                                                alt={`${item.title} thumbnail`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <video
                                            ref={(el) => (videoRefs.current[item.id] = el)}
                                            src={item.src}
                                            className={`w-full h-full object-cover ${!isPlaying[item.id] ? "hidden" : ""}`}
                                            loop
                                            muted
                                            playsInline
                                        />
                                    </>
                                )}

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        className="bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all rounded-full p-4"
                                        aria-label={`Play ${item.title} ${item.type}`}
                                        onClick={() => item.type === "video" && toggleVideoPlay(item.id)}
                                    >
                                        <Play className="h-8 w-8 text-white" fill="white" />
                                    </button>
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h3 className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>{item.title}</h3>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Right Navigation Arrow */}
                <button
                    onClick={nextSlide}
                    className={`absolute ${isMobile ? 'right-2' : 'right-4'} top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full ${isMobile ? 'p-2' : 'p-3'} shadow-lg hover:bg-white transition-all`}
                    aria-label="Next slide"
                >
                    <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6 md:mt-8">
                {reelItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`${isMobile ? 'h-2' : 'h-3'} rounded-full transition-all duration-300 ${currentIndex === index ?
                            `${isMobile ? 'w-6' : 'w-8'} bg-amber-500` :
                            `${isMobile ? 'w-2' : 'w-3'} bg-gray-300 hover:bg-gray-400`
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ReelsSection