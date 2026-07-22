"use client";

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react"
import { useApi } from "@/hooks/useApi"
import useAccessToken from "@/hooks/userSession"

// Fallback data - only used when API fails
const fallbackReelItems = [
  {
    _id: "fallback_1",
    type: "video",
    src: "video-1.mp4",
    title: "Ruby Collection",
  },
  {
    _id: "fallback_2",
    type: "video",
    src: "video-1.mp4",
    title: "Sapphire Collection",
  },
  {
    _id: "fallback_3",
    type: "video",
    src: "video-1.mp4",
    title: "Emerald Collection",
  },
  {
    _id: "fallback_4",
    type: "video",
    src: "video-1.mp4",
    title: "Diamond Collection",
  },
  {
    _id: "fallback_5",
    type: "video",
    src: "video-1.mp4",
    title: "Amethyst Collection",
  },
]

function ReelsSection() {
  // State management
  const [reelItems, setReelItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const [playingVideos, setPlayingVideos] = useState({})
  const [loadedVideos, setLoadedVideos] = useState({})
  const [errorVideos, setErrorVideos] = useState({})
  const [mutedVideos, setMutedVideos] = useState({}) // Track muted state
  const [userHasInteracted, setUserHasInteracted] = useState(false) // Track user interaction
  const [autoplayBlocked, setAutoplayBlocked] = useState({}) // Track autoplay blocks
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const { get } = useApi()
  const { accessToken } = useAccessToken()

  // Refs
  const videoRefs = useRef({})
  const containerRef = useRef(null)
  const sectionRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Track user interaction globally
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserHasInteracted(true)

      // After user interaction, try to unmute and play videos that are currently playing
      Object.keys(playingVideos).forEach((id) => {
        if (playingVideos[id]) {
          const video = videoRefs.current[id]
          if (video && mutedVideos[id]) {
            video.muted = false
            setMutedVideos((prev) => ({ ...prev, [id]: false }))
          }
        }
      })

      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [playingVideos, mutedVideos])

  // Transform API data to match component format
  const transformApiDataToReelItems = (apiData) => {
    return apiData.map((item, index) => ({
      _id: item._id,
      id: item._id,
      type: "video",
      src: item.video,
      title: item.title || `Gemstone Collection ${index + 1}`,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      isFromApi: true,
    }))
  }

  // Enhanced fetchVideoData with clear priority logic
  const fetchVideoData = async () => {
    console.log("🔄 Fetching video data from API...")
    try {
      setIsLoading(true)
      setError(null)
      setIsUsingFallback(false)

      const result = await get(`/video`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (result.success && result.data) {
        const apiVideoData = result.data.data || result.data
        console.log("✅ API Response received:", apiVideoData)

        if (apiVideoData && Array.isArray(apiVideoData) && apiVideoData.length > 0) {
          const transformedData = transformApiDataToReelItems(apiVideoData)
          console.log("✅ Using API data:", transformedData)
          setReelItems(transformedData)
          setIsUsingFallback(false)

          // Initialize muted state for all videos - START UNMUTED for audio autoplay
          const mutedState = {}
          transformedData.forEach((item) => {
            mutedState[item._id] = !userHasInteracted // Only mute if user hasn't interacted yet
          })
          setMutedVideos(mutedState)
        } else {
          console.warn("⚠️ API returned empty/invalid data, using fallback")
          setReelItems(fallbackReelItems)
          setIsUsingFallback(true)
          setError("No video content available from server")

          // Initialize muted state for fallback videos
          const mutedState = {}
          fallbackReelItems.forEach((item) => {
            mutedState[item._id] = !userHasInteracted
          })
          setMutedVideos(mutedState)
        }
      } else {
        console.error("❌ API request failed:", result.message || "Unknown error")
        console.log("🔄 Falling back to default data")
        setReelItems(fallbackReelItems)
        setIsUsingFallback(true)
        setError(result.message || "Failed to fetch video data from server")

        // Initialize muted state for fallback videos
        const mutedState = {}
        fallbackReelItems.forEach((item) => {
          mutedState[item._id] = !userHasInteracted
        })
        setMutedVideos(mutedState)
      }
    } catch (err) {
      console.error("❌ Error fetching video data:", err)
      console.log("🔄 Using fallback data due to error")

      let errorMessage = "Unable to load videos from server. Showing sample content."
      if (err.message?.includes("network") || err.message?.includes("fetch")) {
        errorMessage = "Network error. Please check your connection. Showing sample content."
      } else if (err.status === 401 || err.message?.includes("401")) {
        errorMessage = "Session expired. Please sign in again. Showing sample content."
      }

      setError(errorMessage)
      setReelItems(fallbackReelItems)
      setIsUsingFallback(true)

      // Initialize muted state for fallback videos
      const mutedState = {}
      fallbackReelItems.forEach((item) => {
        mutedState[item._id] = !userHasInteracted
      })
      setMutedVideos(mutedState)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data when section enters viewport
  useEffect(() => {
    if (isInView) {
      fetchVideoData()
    }
  }, [isInView, accessToken])

  // Mobile detection effect
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Reset currentIndex when reelItems change
  useEffect(() => {
    if (reelItems.length > 0 && currentIndex >= reelItems.length) {
      setCurrentIndex(0)
    }
  }, [reelItems.length, currentIndex])

  // Video loading handlers
  const handleVideoCanPlay = useCallback((id) => {
    console.log(`Video ${id} can play`)
    setLoadedVideos((prev) => ({ ...prev, [id]: true }))
    setErrorVideos((prev) => ({ ...prev, [id]: false }))
  }, [])

  const handleVideoLoadedData = useCallback((id) => {
    console.log(`Video ${id} loaded data`)
    setLoadedVideos((prev) => ({ ...prev, [id]: true }))
    setErrorVideos((prev) => ({ ...prev, [id]: false }))
  }, [])

  const handleVideoError = useCallback((id, error) => {
    console.error(`Video ${id} failed to load:`, error)
    setErrorVideos((prev) => ({ ...prev, [id]: true }))
    setPlayingVideos((prev) => ({ ...prev, [id]: false }))
    setLoadedVideos((prev) => ({ ...prev, [id]: false }))
  }, [])

  // Enhanced video control functions with autoplay policy handling
  const playVideo = useCallback(
    async (id, forcePlay = false) => {
      const video = videoRefs.current[id]
      if (!video || errorVideos[id]) return false

      try {
        // If user has interacted, try to play with audio
        if (userHasInteracted && !forcePlay) {
          video.muted = false
          setMutedVideos((prev) => ({ ...prev, [id]: false }))
        }

        // For hover play without user interaction, keep muted for autoplay compliance
        if (!userHasInteracted && !forcePlay) {
          video.muted = true
          setMutedVideos((prev) => ({ ...prev, [id]: true }))
        }

        // For direct user clicks, always try unmuted
        if (forcePlay && userHasInteracted) {
          video.muted = false
          setMutedVideos((prev) => ({ ...prev, [id]: false }))
        }

        await video.play()
        setPlayingVideos((prev) => ({ ...prev, [id]: true }))
        setAutoplayBlocked((prev) => ({ ...prev, [id]: false }))
        return true
      } catch (error) {
        console.error("Video play error:", error)

        // Handle different types of play errors
        if (error.name === "NotAllowedError") {
          console.log(`Autoplay blocked for video ${id}`)
          setAutoplayBlocked((prev) => ({ ...prev, [id]: true }))

          // Try again with muted if it was unmuted
          if (!video.muted) {
            try {
              video.muted = true
              setMutedVideos((prev) => ({ ...prev, [id]: true }))
              await video.play()
              setPlayingVideos((prev) => ({ ...prev, [id]: true }))
              return true
            } catch (mutedError) {
              console.error("Even muted playback failed:", mutedError)
            }
          }
        } else {
          handleVideoError(id, error)
        }
        return false
      }
    },
    [errorVideos, userHasInteracted, handleVideoError],
  )

  const pauseVideo = useCallback((id) => {
    const video = videoRefs.current[id]
    if (!video) return

    try {
      video.pause()
      setPlayingVideos((prev) => ({ ...prev, [id]: false }))
    } catch (error) {
      console.error("Video pause error:", error)
    }
  }, [])

  const toggleVideoPlayback = useCallback(
    async (id) => {
      if (errorVideos[id] || isTransitioning) return

      const isPlaying = playingVideos[id]
      if (isPlaying) {
        pauseVideo(id)
      } else {
        // Force play on direct user interaction (click)
        await playVideo(id, true)
      }
    },
    [errorVideos, isTransitioning, playingVideos, pauseVideo, playVideo],
  )

  const toggleMute = useCallback(
    (id) => {
      const video = videoRefs.current[id]
      if (!video) return

      const newMutedState = !mutedVideos[id]
      video.muted = newMutedState
      setMutedVideos((prev) => ({ ...prev, [id]: newMutedState }))

      // Clear autoplay blocked state when unmuting after user interaction
      if (!newMutedState && userHasInteracted) {
        setAutoplayBlocked((prev) => ({ ...prev, [id]: false }))
      }
    },
    [mutedVideos, userHasInteracted],
  )

  // Navigation functions with animation
  const navigateToSlide = useCallback(
    (direction) => {
      if (isTransitioning || reelItems.length === 0) return

      setIsTransitioning(true)
      setSlideDirection(direction)

      // Pause all videos during transition
      Object.keys(playingVideos).forEach((id) => {
        if (playingVideos[id]) {
          pauseVideo(id)
        }
      })

      setTimeout(() => {
        if (direction === "next") {
          setCurrentIndex((prev) => (prev === reelItems.length - 1 ? 0 : prev + 1))
        } else {
          setCurrentIndex((prev) => (prev === 0 ? reelItems.length - 1 : prev - 1))
        }
      }, 150)

      setTimeout(() => {
        setIsTransitioning(false)
        setSlideDirection("")
      }, 500)
    },
    [isTransitioning, playingVideos, reelItems.length, pauseVideo],
  )

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning || index === currentIndex || reelItems.length === 0) return

      setIsTransitioning(true)
      const direction = index > currentIndex ? "next" : "prev"
      setSlideDirection(direction)

      Object.keys(playingVideos).forEach((id) => {
        if (playingVideos[id]) {
          pauseVideo(id)
        }
      })

      setTimeout(() => {
        setCurrentIndex(index)
      }, 150)

      setTimeout(() => {
        setIsTransitioning(false)
        setSlideDirection("")
      }, 500)
    },
    [isTransitioning, currentIndex, playingVideos, reelItems.length, pauseVideo],
  )

  // Mouse event handlers with improved autoplay handling
  const handleMouseEnter = useCallback(
    async (id) => {
      if (isTransitioning || errorVideos[id]) return

      setHoveredId(id)
      const item = reelItems.find((item) => item._id === id || item.id === id)
      if (item?.type === "video" && loadedVideos[id]) {
        // Attempt autoplay (will be muted if no user interaction)
        await playVideo(id, false)
      }
    },
    [isTransitioning, errorVideos, reelItems, playVideo, loadedVideos],
  )

  const handleMouseLeave = useCallback(
    (id) => {
      setHoveredId(null)
      const item = reelItems.find((item) => item._id === id || item.id === id)
      if (item?.type === "video") {
        pauseVideo(id)
      }
    },
    [reelItems, pauseVideo],
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTransitioning || reelItems.length === 0) return

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          navigateToSlide("prev")
          break
        case "ArrowRight":
          event.preventDefault()
          navigateToSlide("next")
          break
        case " ":
          event.preventDefault()
          const centerItem = getVisibleItems().find((item) => item.position === "center")
          if (centerItem) {
            toggleVideoPlayback(centerItem._id || centerItem.id)
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isTransitioning, navigateToSlide, toggleVideoPlayback, reelItems.length])

  // Get visible items based on screen size
  const getVisibleItems = useCallback(() => {
    if (reelItems.length === 0) return []

    if (isMobile) {
      return [{ ...reelItems[currentIndex], position: "center" }]
    }

    const prevIndex = currentIndex === 0 ? reelItems.length - 1 : currentIndex - 1
    const nextIndex = currentIndex === reelItems.length - 1 ? 0 : currentIndex + 1

    return [
      { ...reelItems[prevIndex], position: "left" },
      { ...reelItems[currentIndex], position: "center" },
      { ...reelItems[nextIndex], position: "right" },
    ]
  }, [isMobile, currentIndex, reelItems])

  // Get item size classes
  const getItemSizeClasses = (position) => {
    if (isMobile) {
      return "h-80 w-72"
    }
    return position === "center" ? "h-96 w-80" : "h-72 w-64"
  }

  // Get item styling classes with transition animations
  const getItemStyleClasses = (position) => {
    let baseClasses = "transition-all duration-500 ease-in-out transform-gpu bg-black"

    if (isTransitioning) {
      if (slideDirection === "next") {
        if (position === "center") {
          baseClasses += " translate-x-[-100px] opacity-70 scale-95"
        } else if (position === "right") {
          baseClasses += " translate-x-[-50px] scale-110 opacity-85"
        } else {
          baseClasses += " translate-x-[-50px] opacity-60"
        }
      } else if (slideDirection === "prev") {
        if (position === "center") {
          baseClasses += " translate-x-[100px] opacity-70 scale-95"
        } else if (position === "left") {
          baseClasses += " translate-x-[50px] scale-110 opacity-85"
        } else {
          baseClasses += " translate-x-[50px] opacity-60"
        }
      }
    }

    if (isMobile) {
      return `${baseClasses} shadow-2xl`
    }

    return position === "center" ? `${baseClasses} shadow-2xl scale-105 z-10` : `${baseClasses} shadow-lg opacity-75`
  }

  const visibleItems = getVisibleItems()

  // Render media content with proper video setup
  const renderMediaContent = (item) => {
    const itemId = item._id || item.id
    const hasError = errorVideos[itemId]
    const isLoaded = loadedVideos[itemId]
    const isMuted = mutedVideos[itemId]
    const isBlocked = autoplayBlocked[itemId]

    if (item.type === "image") {
      return (
        <img
          src={item.src || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          onError={() => handleVideoError(itemId, "Image failed to load")}
        />
      )
    }

    return (
      <div className="relative w-full h-full bg-black">
        {/* Video Element */}
        <video
          ref={(el) => {
            if (el) {
              videoRefs.current[itemId] = el
              // Set initial muted state based on user interaction
              el.muted = !userHasInteracted
            }
          }}
          src={item.src}
          className={`w-full h-full object-cover cursor-pointer transition-all duration-300 bg-black ${
            hasError ? "opacity-0" : "opacity-100"
          }`}
          loop
          playsInline
          muted={!userHasInteracted} // Start unmuted if user has interacted
          preload={item.position === "center" ? "metadata" : "none"}
          crossOrigin="anonymous"
          onClick={(e) => {
            e.stopPropagation()
            if (!isTransitioning && isLoaded) {
              toggleVideoPlayback(itemId)
            }
          }}
          onCanPlay={() => handleVideoCanPlay(itemId)}
          onLoadedData={() => handleVideoLoadedData(itemId)}
          onError={(e) => {
            console.error("Video error event:", e.target.error)
            handleVideoError(itemId, e.target.error)
          }}
          onLoadStart={() => {
            console.log(`Video ${itemId} started loading`)
            setErrorVideos((prev) => ({ ...prev, [itemId]: false }))
          }}
          style={{ backgroundColor: "#000000" }}
        />

        {/* Autoplay Blocked Indicator */}
        {isBlocked && !playingVideos[itemId] && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">Click to play</div>
        )}

        {/* Mute/Unmute Button */}
        {isLoaded && !hasError && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMute(itemId)
            }}
            className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white p-4">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-sm">Failed to load video</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setErrorVideos((prev) => ({ ...prev, [itemId]: false }))
                  setLoadedVideos((prev) => ({ ...prev, [itemId]: false }))
                  const video = videoRefs.current[itemId]
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

        {/* Loading State */}
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
    const itemId = item._id || item.id
    const isVideoPlaying = playingVideos[itemId]
    const hasError = errorVideos[itemId]
    const isLoaded = loadedVideos[itemId]

    const IconComponent = isVideoPlaying ? Pause : Play

    if (hasError || !isLoaded) return null

    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
          isTransitioning ? "pointer-events-none" : ""
        }`}
      >
        {/* <button
          className="bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 rounded-full p-4 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`${isVideoPlaying ? "Pause" : "Play"} ${item.title}`}
          onClick={(e) => {
            e.stopPropagation()
            if (!isTransitioning && isLoaded) {
              toggleVideoPlayback(itemId)
            }
          }}
          disabled={isTransitioning || !isLoaded || hasError}
        >
          <IconComponent
            className="h-8 w-8 text-white transition-transform duration-200"
            fill={!isVideoPlaying ? "white" : undefined}
          />
        </button> */}
      </div>
    )
  }

  // Show placeholder until section is near viewport
  if (!isInView) {
    return <div ref={sectionRef} className="container mx-auto min-h-[400px]" aria-hidden="true" />
  }

  // Show loading state only when initially loading
  if (isLoading && reelItems.length === 0) {
    return (
      <div className="container mx-auto overflow-hidden" ref={sectionRef}>
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Video Gallery</h3>
          <p className="text-gray-500">Fetching the latest gemstone videos...</p>
        </div>
      </div>
    )
  }

  // Show message if no content available
  if (!isLoading && reelItems.length === 0) {
    return (
      <div className="container mx-auto overflow-hidden" ref={sectionRef}>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Videos Available</h3>
          <p className="text-gray-500 mb-4">Unable to load video content at this time.</p>
          <button
            onClick={fetchVideoData}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto overflow-hidden" ref={sectionRef}>
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-10 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 mt-16 transform transition-all duration-300 hover:scale-105">
          Discover the Sparkle: Gemstone Stories
        </h2>
        <p className="text-[16px] md:text-[20px] font-helvetica text-center text-[#4F4F4F] mb-10 px-4 md:px-0 transition-opacity duration-300">
          Explore the fascinating journey of each gemstone — from deep within the earth to stunning works of art. Dive
          into captivating videos that reveal the beauty, craftsmanship, and unique stories behind every sparkling gem.
        </p>

        {/* User Interaction Notice */}
        {!userHasInteracted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 mx-4">
            <p className="text-blue-700 text-sm">🔊 Click anywhere to enable video audio autoplay</p>
          </div>
        )}

        {/* Status Messages */}
        {isUsingFallback && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 mx-4">
            <p className="text-amber-700 text-sm">
              📡 Showing sample content. {error ? "Server connection issue." : "Live content loading..."}
            </p>
          </div>
        )}

        {/* Error State with Retry */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 mx-4">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button
              onClick={fetchVideoData}
              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Retry"}
            </button>
          </div>
        )}
      </div>

      {/* Carousel Section */}
      <div className="relative max-w-6xl mx-auto" ref={containerRef}>
        {/* Navigation Buttons */}
        <button
          onClick={() => navigateToSlide("prev")}
          disabled={isTransitioning}
          className={`absolute ${isMobile ? "left-2" : "left-4"} top-1/2 -translate-y-1/2 z-20
                                bg-white/80 rounded-full ${isMobile ? "p-2" : "p-3"} shadow-lg
                                hover:bg-white hover:shadow-xl transition-all duration-300
                                transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                               ${isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:-translate-x-1"}`}
          aria-label="Previous slide"
        >
          <ChevronLeft className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} transition-transform duration-200`} />
        </button>

        <button
          onClick={() => navigateToSlide("next")}
          disabled={isTransitioning}
          className={`absolute ${isMobile ? "right-2" : "right-4"} top-1/2 -translate-y-1/2 z-20
                                bg-white/80 rounded-full ${isMobile ? "p-2" : "p-3"} shadow-lg
                                hover:bg-white hover:shadow-xl transition-all duration-300
                                transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                               ${isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:translate-x-1"}`}
          aria-label="Next slide"
        >
          <ChevronRight className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} transition-transform duration-200`} />
        </button>

        {/* Carousel Items */}
        <div
          className={`flex items-center justify-center ${isMobile ? "gap-0 px-12" : "gap-4 px-16"}
                                 min-h-[400px] ${isMobile ? "min-h-[320px]" : ""} bg-transparent`}
        >
          {visibleItems.map((item) => {
            const isCenter = item.position === "center"
            const itemId = item._id || item.id

            return (
              <div
                key={`${itemId}-${item.position}`}
                className={`${getItemSizeClasses(item.position)} relative rounded-2xl overflow-hidden
                                            ${getItemStyleClasses(item.position)}`}
                onMouseEnter={() => handleMouseEnter(itemId)}
                onMouseLeave={() => handleMouseLeave(itemId)}
                style={{
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                  backgroundColor: "#000000",
                }}
              >
                {/* Media Content */}
                <div className="w-full h-full bg-black">{renderMediaContent(item)}</div>

                {/* Play Button Overlay */}
                {renderPlayOverlay(item)}

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300">
                  <h3
                    className={`text-white font-semibold ${isMobile ? "text-base" : "text-lg"}
                                                     transform transition-transform duration-300 ${
                                                       hoveredId === itemId ? "translate-y-[-2px]" : ""
                                                     }`}
                  >
                    {item.title}
                  </h3>
                  {/* API indicator */}
                  {item.isFromApi && <span className="text-xs text-green-400 opacity-75">● Live</span>}
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
            className={`${isMobile ? "h-2" : "h-3"} rounded-full transition-all duration-300
                                    transform hover:scale-125 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                   ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}
                                   ${
                                     currentIndex === index
                                       ? `${isMobile ? "w-6" : "w-8"} bg-amber-500 shadow-lg`
                                       : `${isMobile ? "w-2" : "w-3"} bg-gray-300 hover:bg-gray-400 hover:shadow-md`
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
