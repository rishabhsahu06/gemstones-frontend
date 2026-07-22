'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Hero from './Home/Hero'

const Authenticity = dynamic(() => import('./Home/Authenticity'))
const PerfectSTones = dynamic(() => import('./Home/perfect-stone'))
const LuxuryGemstones = dynamic(() => import('./Home/gemstone-luxury'))
const PurposefullGemstone = dynamic(() => import('./Home/puprose-gemstone'))
const JwelleryBanner = dynamic(() => import('./Home/jwellery-banner'))
const Blogs = dynamic(() => import('./Home/blog'))
const ReelsSection = dynamic(() => import('./Home/reels-section'))
const BookService = dynamic(() => import('./Home/book-service'))
const WelcomePopup = dynamic(
  () => import('./components/welcomeModal/welcome'),
  { ssr: false }
)

function HomePage() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const visited = sessionStorage.getItem('hasVisitedBefore')

    if (!visited) {
      const timer = setTimeout(() => setShowPopup(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
    sessionStorage.setItem('hasVisitedBefore', 'true')
  }

  return (
    <div>
      <WelcomePopup isOpen={showPopup} onClose={handleClosePopup} />

      <Hero />
      <Authenticity />
      <PerfectSTones />
      <LuxuryGemstones />
      <JwelleryBanner />
      <PurposefullGemstone />
      <Blogs />
      <ReelsSection />
      <BookService />
    </div>
  )
}

export default HomePage
