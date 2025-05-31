"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"

// Sample data for the reels - Video only
const initialReelItems = [
    {
        id: 1,
        type: "video",
        src: "video-1.mp4",
        title: "Ruby Collection",
    },
    {
        id: 2,
        type: "video",
        src: "video-1.mp4",
        title: "Sapphire Collection",
    },
    {
        id: 3,
        type: "video",
        src: "video-1.mp4",
        title: "Emerald Collection",
    },
    {
        id: 4,
        type: "video",
        src: "video-1.mp4",
        title: "Diamond Collection",
    },
    {
        id: 5,
        type: "video",
        src: "video-1.mp4",
        title: "Amethyst Collection",
    },
]

function ReelsSection() {
    // State management
    const [reelItems] = useState(initialReelItems)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [hoveredId, setHoveredId] = useState(null)
    const [playingVideos, setPlayingVideos] = useState({})
    const [loadedVideos, setLoadedVideos] = useState({})
    const [errorVideos, setErrorVideos] = useState({})
    const [isMobile, setIsMobile] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [slideDirection, setSlideDirection] = useState('')

    // Refs
    const videoRefs = useRef({})
    const containerRef = useRef(null)

    // Mobile detection effect
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)
        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    // Video loading handlers
    const handleVideoCanPlay = useCallback((id) => {
        console.log(`Video ${id} can play`)
        setLoadedVideos(prev => ({ ...prev, [id]: true }))
        setErrorVideos(prev => ({ ...prev, [id]: false }))
    }, [])

    const handleVideoLoadedData = useCallback((id) => {
        console.log(`Video ${id} loaded data`)
        setLoadedVideos(prev => ({ ...prev, [id]: true }))
        setErrorVideos(prev => ({ ...prev, [id]: false }))
    }, [])

    const handleVideoError = useCallback((id, error) => {
        console.error(`Video ${id} failed to load:`, error)
        setErrorVideos(prev => ({ ...prev, [id]: true }))
        setPlayingVideos(prev => ({ ...prev, [id]: false }))
        setLoadedVideos(prev => ({ ...prev, [id]: false }))
    }, [])

    // Navigation functions with animation
    const navigateToSlide = useCallback((direction) => {
        if (isTransitioning) return

        setIsTransitioning(true)
        setSlideDirection(direction)

        // Pause all videos during transition
        Object.keys(playingVideos).forEach(id => {
            if (playingVideos[id]) {
                pauseVideo(parseInt(id))
            }
        })

        // Update index after a short delay for smooth animation
        setTimeout(() => {
            if (direction === 'next') {
                setCurrentIndex(prev => prev === reelItems.length - 1 ? 0 : prev + 1)
            } else {
                setCurrentIndex(prev => prev === 0 ? reelItems.length - 1 : prev - 1)
            }
        }, 150)

        // Reset transition state
        setTimeout(() => {
            setIsTransitioning(false)
            setSlideDirection('')
        }, 500)
    }, [isTransitioning, playingVideos, reelItems.length])

    const goToSlide = useCallback((index) => {
        if (isTransitioning || index === currentIndex) return

        setIsTransitioning(true)
        const direction = index > currentIndex ? 'next' : 'prev'
        setSlideDirection(direction)

        // Pause all videos during transition
        Object.keys(playingVideos).forEach(id => {
            if (playingVideos[id]) {
                pauseVideo(parseInt(id))
            }
        })

        setTimeout(() => {
            setCurrentIndex(index)
        }, 150)

        setTimeout(() => {
            setIsTransitioning(false)
            setSlideDirection('')
        }, 500)
    }, [isTransitioning, currentIndex, playingVideos])

    // Video control functions
    const playVideo = useCallback(async (id) => {
        const video = videoRefs.current[id]
        if (!video || errorVideos[id]) return

        try {
            await video.play()
            setPlayingVideos(prev => ({ ...prev, [id]: true }))
        } catch (error) {
            console.error('Video play error:', error)
            handleVideoError(id, error)
        }
    }, [errorVideos, handleVideoError])

    const pauseVideo = useCallback((id) => {
        const video = videoRefs.current[id]
        if (!video) return

        try {
            video.pause()
            setPlayingVideos(prev => ({ ...prev, [id]: false }))
        } catch (error) {
            console.error('Video pause error:', error)
        }
    }, [])

    const toggleVideoPlayback = useCallback((id) => {
        if (errorVideos[id] || isTransitioning) return

        const isPlaying = playingVideos[id]
        if (isPlaying) {
            pauseVideo(id)
        } else {
            playVideo(id)
        }
    }, [errorVideos, isTransitioning, playingVideos, pauseVideo, playVideo])

    // Mouse event handlers
    const handleMouseEnter = useCallback((id) => {
        if (isTransitioning || errorVideos[id]) return
        setHoveredId(id)
        const item = reelItems.find(item => item.id === id)
        if (item?.type === "video" && loadedVideos[id]) {
            playVideo(id)
        }
    }, [isTransitioning, errorVideos, reelItems, playVideo, loadedVideos])

    const handleMouseLeave = useCallback((id) => {
        setHoveredId(null)
        const item = reelItems.find(item => item.id === id)
        if (item?.type === "video") {
            pauseVideo(id)
        }
    }, [reelItems, pauseVideo])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isTransitioning) return

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault()
                    navigateToSlide('prev')
                    break
                case 'ArrowRight':
                    event.preventDefault()
                    navigateToSlide('next')
                    break
                case ' ':
                    event.preventDefault()
                    const centerItem = getVisibleItems().find(item => item.position === 'center')
                    if (centerItem) {
                        toggleVideoPlayback(centerItem.id)
                    }
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isTransitioning, navigateToSlide, toggleVideoPlayback])

    // Get visible items based on screen size
    const getVisibleItems = useCallback(() => {
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
    }, [isMobile, currentIndex, reelItems])

    // Get item size classes
    const getItemSizeClasses = (position) => {
        if (isMobile) {
            return 'h-80 w-72'
        }
        return position === 'center' ? 'h-96 w-80' : 'h-72 w-64'
    }

    // Get item styling classes with transition animations
    const getItemStyleClasses = (position) => {
        let baseClasses = 'transition-all duration-500 ease-in-out transform-gpu bg-black'

        if (isTransitioning) {
            if (slideDirection === 'next') {
                if (position === 'center') {
                    baseClasses += ' translate-x-[-100px] opacity-70 scale-95'
                } else if (position === 'right') {
                    baseClasses += ' translate-x-[-50px] scale-110 opacity-85'
                } else {
                    baseClasses += ' translate-x-[-50px] opacity-60'
                }
            } else if (slideDirection === 'prev') {
                if (position === 'center') {
                    baseClasses += ' translate-x-[100px] opacity-70 scale-95'
                } else if (position === 'left') {
                    baseClasses += ' translate-x-[50px] scale-110 opacity-85'
                } else {
                    baseClasses += ' translate-x-[50px] opacity-60'
                }
            }
        }

        if (isMobile) {
            return `${baseClasses} shadow-2xl`
        }

        return position === 'center'
            ? `${baseClasses} shadow-2xl scale-105 z-10`
            : `${baseClasses} shadow-lg opacity-75`
    }

    const visibleItems = getVisibleItems()

    // Render media content
    const renderMediaContent = (item) => {
        const hasError = errorVideos[item.id]
        const isLoaded = loadedVideos[item.id]

        if (item.type === "image") {
            return (
                <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={() => handleVideoError(item.id, 'Image failed to load')}
                />
            )
        }

        return (
            <div className="relative w-full h-full bg-black">
                {/* Video Element */}
                <video
                    ref={(el) => {
                        if (el) {
                            videoRefs.current[item.id] = el
                        }
                    }}
                    src={item.src}
                    className={`w-full h-full object-cover cursor-pointer transition-all duration-300 bg-black ${hasError ? 'opacity-0' : 'opacity-100'
                        }`}
                    loop
                    playsInline
                    muted
                    preload="auto"
                    crossOrigin="anonymous"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (!isTransitioning && isLoaded) {
                            toggleVideoPlayback(item.id)
                        }
                    }}
                    onCanPlay={() => handleVideoCanPlay(item.id)}
                    onLoadedData={() => handleVideoLoadedData(item.id)}
                    onError={(e) => {
                        console.error('Video error event:', e.target.error)
                        handleVideoError(item.id, e.target.error)
                    }}
                    onLoadStart={() => {
                        console.log(`Video ${item.id} started loading`)
                        setErrorVideos(prev => ({ ...prev, [item.id]: false }))
                    }}
                    style={{ backgroundColor: '#000000' }}
                />

                {/* Error State */}
                {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <div className="text-center text-white p-4">
                            <div className="text-4xl mb-2">⚠️</div>
                            <p className="text-sm">Failed to load video</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setErrorVideos(prev => ({ ...prev, [item.id]: false }))
                                    setLoadedVideos(prev => ({ ...prev, [item.id]: false }))
                                    const video = videoRefs.current[item.id]
                                    if (video) {
                                        video.load()
                                    }
                                }}
                                className="mt-2 px-3 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State - Simple dark background */}
                {!isLoaded && !hasError && (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                        <div className="text-white text-sm">Loading...</div>
                    </div>
                )}
            </div>
        )
    }

    // Render play button overlay
    const renderPlayOverlay = (item) => {
        const isVideoPlaying = playingVideos[item.id]
        const hasError = errorVideos[item.id]
        const isLoaded = loadedVideos[item.id]
        const IconComponent = isVideoPlaying ? Pause : Play

        if (hasError || !isLoaded) return null

        return (
            <div className={`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 ${isTransitioning ? 'pointer-events-none' : ''
                }`}>
                <button
                    className="bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 rounded-full p-4 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`${isVideoPlaying ? 'Pause' : 'Play'} ${item.title}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (!isTransitioning && isLoaded) {
                            toggleVideoPlayback(item.id)
                        }
                    }}
                    disabled={isTransitioning || !isLoaded || hasError}
                >
                    <IconComponent
                        className="h-8 w-8 text-white transition-transform duration-200"
                        fill={!isVideoPlaying ? "white" : undefined}
                    />
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto overflow-hidden" ref={containerRef}>
            {/* Header Section */}
            <div className="text-center mb-8 md:mb-10 mt-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 mt-16 transform transition-all duration-300 hover:scale-105">
                    Discover the Sparkle: Gemstone Stories
                </h2>
                <p className="text-[16px] md:text-[20px] font-helvetica text-center text-[#4F4F4F] mb-10 px-4 md:px-0 transition-opacity duration-300">
                    Explore the fascinating journey of each gemstone — from deep within the earth to stunning works of art.
                    Dive into captivating videos that reveal the beauty, craftsmanship, and unique stories behind every sparkling gem.
                </p>
            </div>

            {/* Carousel Section */}
            <div className="relative max-w-6xl mx-auto">
                {/* Navigation Buttons */}
                <button
                    onClick={() => navigateToSlide('prev')}
                    disabled={isTransitioning}
                    className={`absolute ${isMobile ? 'left-2' : 'left-4'} top-1/2 -translate-y-1/2 z-20 
                               bg-white/80 rounded-full ${isMobile ? 'p-2' : 'p-3'} shadow-lg 
                               hover:bg-white hover:shadow-xl transition-all duration-300 
                               transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                               ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-x-1'}`}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} transition-transform duration-200`} />
                </button>

                <button
                    onClick={() => navigateToSlide('next')}
                    disabled={isTransitioning}
                    className={`absolute ${isMobile ? 'right-2' : 'right-4'} top-1/2 -translate-y-1/2 z-20 
                               bg-white/80 rounded-full ${isMobile ? 'p-2' : 'p-3'} shadow-lg 
                               hover:bg-white hover:shadow-xl transition-all duration-300 
                               transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                               ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-1'}`}
                    aria-label="Next slide"
                >
                    <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} transition-transform duration-200`} />
                </button>

                {/* Carousel Items */}
                <div className={`flex items-center justify-center ${isMobile ? 'gap-0 px-12' : 'gap-4 px-16'} 
                                min-h-[400px] ${isMobile ? 'min-h-[320px]' : ''} bg-transparent`}>
                    {visibleItems.map((item) => {
                        const isCenter = item.position === 'center'

                        return (
                            <div
                                key={`${item.id}-${item.position}`}
                                className={`${getItemSizeClasses(item.position)} relative rounded-2xl overflow-hidden 
                                           ${getItemStyleClasses(item.position)}`}
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={() => handleMouseLeave(item.id)}
                                style={{
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                    backgroundColor: '#000000',
                                }}
                            >
                                {/* Media Content */}
                                <div className="w-full h-full bg-black">
                                    {renderMediaContent(item)}
                                </div>

                                {/* Play Button Overlay */}
                                {renderPlayOverlay(item)}

                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300">
                                    <h3 className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-lg'} 
                                                    transform transition-transform duration-300 ${hoveredId === item.id ? 'translate-y-[-2px]' : ''
                                        }`}>
                                        {item.title}
                                    </h3>
                                </div>

                                {/* Loading indicator during transition */}
                                {isTransitioning && isCenter && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
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
                        disabled={isTransitioning}
                        className={`${isMobile ? 'h-2' : 'h-3'} rounded-full transition-all duration-300 
                                   transform hover:scale-125 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                   ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
                                   ${currentIndex === index
                                ? `${isMobile ? 'w-6' : 'w-8'} bg-amber-500 shadow-lg`
                                : `${isMobile ? 'w-2' : 'w-3'} bg-gray-300 hover:bg-gray-400 hover:shadow-md`
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes slideInFromRight {
                    from {
                        transform: translateX(100px);
                        opacity: 0;
                        background-color: #000000;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                        background-color: #000000;
                    }
                }

                @keyframes slideInFromLeft {
                    from {
                        transform: translateX(-100px);
                        opacity: 0;
                        background-color: #000000;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                        background-color: #000000;
                    }
                }

                @keyframes fadeInScale {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                        background-color: #000000;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                        background-color: #000000;
                    }
                }

                /* Prevent white flash during video loading */
                video {
                    background-color: #000000 !important;
                }

                /* Ensure container backgrounds are black */
                .video-container {
                    background-color: #000000 !important;
                }
            `}</style>
        </div>
    )
}

export default ReelsSection