"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"

// Sample data for the reels
const initialReelItems = [
    {
        id: 1,
        type: "image",
        src: "/blog-img1.png",
        title: "Ruby Collection",
    },
    {
        id: 2,
        type: "image",
        src: "/blog-img2.png",
        title: "Sapphire Collection",
    },
    {
        id: 3,
        type: "image",
        src: "/blog-img3.png",
        title: "Emerald Collection",
    },
    {
        id: 4,
        type: "video",
        src: "/placeholder-video.mp4",
        thumbnail: "/placeholder-ieybm.png",
        title: "Diamond Collection",
    },
    {
        id: 5,
        type: "image",
        src: "/amethyst-jewelry-set.png",
        title: "Amethyst Collection",
    },
]

function ReelsSection() {
    const [reelItems, setReelItems] = useState(initialReelItems)
    const [currentIndex, setCurrentIndex] = useState(1)
    const [width, setWidth] = useState(0)
    const [hoveredId, setHoveredId] = useState(null)
    const [isPlaying, setIsPlaying] = useState({})

    const carousel = useRef(null)
    const videoRefs = useRef({})

    useEffect(() => {
        if (carousel.current) {
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
        }
    }, [reelItems])

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === reelItems.length - 2 ? 0 : prevIndex + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? reelItems.length - 2 : prevIndex - 1))
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

    return (
        <div className="container mx-auto px-4 py-12 overflow-hidden">
            {/* Heading Section */}
            <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Discover the Sparkle: Gemstone Stories</h2>
                <p className="text-lg max-w-4xl mx-auto text-gray-700">
                    Explore the fascinating journey of each gemstone — from deep within the earth to stunning works of art. Dive
                    into captivating videos that reveal the beauty, craftsmanship, and unique stories behind every sparkling gem.
                </p>
            </div>

            {/* Carousel Section */}
            <div className="relative">
                {/* Left Navigation Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-all"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Carousel Container */}
                <div ref={carousel} className="overflow-hidden mx-12">
                    <motion.div
                        className="flex gap-4"
                        animate={{ x: -currentIndex * (100 / 3) + "%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {reelItems.map((item) => (
                            <motion.div
                                key={item.id}
                                className="min-w-[calc(33.333%-16px)] md:min-w-[calc(33.333%-16px)] relative rounded-lg overflow-hidden aspect-square"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={() => handleMouseLeave(item.id)}
                            >
                                {item.type === "image" ? (
                                    <motion.img
                                        src={item.src || "/placeholder.svg"}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        animate={hoveredId === item.id ? { scale: 1.05 } : { scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                ) : (
                                    <>
                                        {!isPlaying[item.id] && (
                                            <img
                                                src={item.thumbnail || "/placeholder.svg"}
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
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        className="bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all rounded-full p-4"
                                        aria-label={`Play ${item.title} ${item.type}`}
                                        onClick={() => item.type === "video" && toggleVideoPlay(item.id)}
                                    >
                                        <Play className="h-8 w-8 text-white" fill="white" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Navigation Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-all"
                    aria-label="Next slide"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {reelItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${currentIndex === index ? "w-4 bg-amber-500" : "w-2 bg-gray-300"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ReelsSection
