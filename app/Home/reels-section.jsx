"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"

// Sample data for the reels - Video only
const initialReelItems = [
    {
        id: 1,
        type: "video",
        src: "/video1.mp4",
        title: "Ruby Collection",
    },
    {
        id: 2,
        type: "video",
        src: "/video1.mp4",
        title: "Sapphire Collection",
    },
    {
        id: 3,
        type: "video",
        src: "/video1.mp4",
        title: "Emerald Collection",
    },
    {
        id: 4,
        type: "video",
        src: "/video1.mp4",
        title: "Diamond Collection",
    },
    {
        id: 5,
        type: "video",
        src: "/video1.mp4",
        title: "Amethyst Collection",
    },
]

function ReelsSection() {
    // State management
    const [reelItems] = useState(initialReelItems)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [hoveredId, setHoveredId] = useState(null)
    const [playingVideos, setPlayingVideos] = useState({})
    const [isMobile, setIsMobile] = useState(false)

    // Refs
    const videoRefs = useRef({})

    // Mobile detection effect
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)
        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    // Navigation functions
    const navigateToSlide = (direction) => {
        if (direction === 'next') {
            setCurrentIndex(prev => prev === reelItems.length - 1 ? 0 : prev + 1)
        } else {
            setCurrentIndex(prev => prev === 0 ? reelItems.length - 1 : prev - 1)
        }
    }

    const goToSlide = (index) => {
        setCurrentIndex(index)
    }

    // Video control functions
    const playVideo = async (id) => {
        const video = videoRefs.current[id]
        if (!video) return

        try {
            await video.play()
            setPlayingVideos(prev => ({ ...prev, [id]: true }))
        } catch (error) {
            console.error('Video play error:', error)
        }
    }

    const pauseVideo = (id) => {
        const video = videoRefs.current[id]
        if (!video) return

        video.pause()
        setPlayingVideos(prev => ({ ...prev, [id]: false }))
    }

    const toggleVideoPlayback = (id) => {
        const isPlaying = playingVideos[id]
        if (isPlaying) {
            pauseVideo(id)
        } else {
            playVideo(id)
        }
    }

    // Mouse event handlers
    const handleMouseEnter = (id) => {
        setHoveredId(id)
        const item = reelItems.find(item => item.id === id)
        if (item?.type === "video") {
            playVideo(id)
        }
    }

    const handleMouseLeave = (id) => {
        setHoveredId(null)
        const item = reelItems.find(item => item.id === id)
        if (item?.type === "video") {
            pauseVideo(id)
        }
    }

    // Get visible items based on screen size
    const getVisibleItems = () => {
        if (isMobile) {
            return [{ ...reelItems[currentIndex], position: 'center' }]
        }

        const prevIndex = currentIndex === 0 ? reelItems.length - 1 : currentIndex - 1
        const nextIndex = currentIndex === reelItems.length - 1 ? 0 : currentIndex + 1

        return [
            { ...reelItems[prevIndex], position: 'left' },
            { ...reelItems[currentIndex], position: 'center' },
            { ...reelItems[nextIndex], position: 'right' }
        ]
    }

    // Get item size classes
    const getItemSizeClasses = (position) => {
        if (isMobile) {
            return 'h-80 w-72'
        }
        return position === 'center' ? 'h-96 w-80' : 'h-72 w-64'
    }

    // Get item styling classes
    const getItemStyleClasses = (position) => {
        if (isMobile) {
            return 'shadow-2xl'
        }
        return position === 'center'
            ? 'shadow-2xl scale-105'
            : 'shadow-lg opacity-75'
    }

    const visibleItems = getVisibleItems()

    // Render media content
    const renderMediaContent = (item) => {
        if (item.type === "image") {
            return (
                <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
            )
        }

        return (
            <video
                ref={(el) => (videoRefs.current[item.id] = el)}
                src={item.src}
                className="w-full h-full object-cover cursor-pointer"
                loop
                playsInline
                onClick={() => toggleVideoPlayback(item.id)}
            />
        )
    }

    // Render play button overlay
    const renderPlayOverlay = (item) => {
        const isVideoPlaying = playingVideos[item.id]
        const IconComponent = isVideoPlaying ? Pause : Play

        return (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button
                    className="bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all rounded-full p-4"
                    aria-label={`${isVideoPlaying ? 'Pause' : 'Play'} ${item.title}`}
                    onClick={() => toggleVideoPlayback(item.id)}
                >
                    <IconComponent
                        className="h-8 w-8 text-white"
                        fill={!isVideoPlaying ? "white" : undefined}
                    />
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto overflow-hidden">
            {/* Header Section */}
            <div className="text-center mb-8 md:mb-10 mt-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
                    Discover the Sparkle: Gemstone Stories
                </h2>
                <p className="text-base md:text-lg max-w-4xl mx-auto text-gray-700 px-4">
                    Explore the fascinating journey of each gemstone — from deep within the earth to stunning works of art.
                    Dive into captivating videos that reveal the beauty, craftsmanship, and unique stories behind every sparkling gem.
                </p>
            </div>

            {/* Carousel Section */}
            <div className="relative max-w-6xl mx-auto">
                {/* Navigation Buttons */}
                <button
                    onClick={() => navigateToSlide('prev')}
                    className={`absolute ${isMobile ? 'left-2' : 'left-4'} top-1/2 -translate-y-1/2 z-10 
                               bg-white/80 rounded-full ${isMobile ? 'p-2' : 'p-3'} shadow-lg 
                               hover:bg-white transition-all`}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </button>

                <button
                    onClick={() => navigateToSlide('next')}
                    className={`absolute ${isMobile ? 'right-2' : 'right-4'} top-1/2 -translate-y-1/2 z-10 
                               bg-white/80 rounded-full ${isMobile ? 'p-2' : 'p-3'} shadow-lg 
                               hover:bg-white transition-all`}
                    aria-label="Next slide"
                >
                    <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </button>

                {/* Carousel Items */}
                <div className={`flex items-center justify-center ${isMobile ? 'gap-0 px-12' : 'gap-4 px-16'
                    }`}>
                    {visibleItems.map((item) => {
                        const isCenter = item.position === 'center'

                        return (
                            <div
                                key={`${item.id}-${item.position}`}
                                className={`${getItemSizeClasses(item.position)} relative rounded-2xl overflow-hidden 
                                           transition-all duration-500 ease-in-out ${getItemStyleClasses(item.position)}`}
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={() => handleMouseLeave(item.id)}
                            >
                                {/* Media Content */}
                                {renderMediaContent(item)}

                                {/* Play Button Overlay */}
                                {renderPlayOverlay(item)}

                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h3 className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-lg'
                                        }`}>
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6 md:mt-8">
                {reelItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`${isMobile ? 'h-2' : 'h-3'} rounded-full transition-all duration-300 ${currentIndex === index
                                ? `${isMobile ? 'w-6' : 'w-8'} bg-amber-500`
                                : `${isMobile ? 'w-2' : 'w-3'} bg-gray-300 hover:bg-gray-400`
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ReelsSection