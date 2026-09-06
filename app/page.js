'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Hero from './Home/Hero'

const TrustMarquee = dynamic(() => import('./Home/trust-marquee'))
const Authenticity = dynamic(() => import('./Home/Authenticity'))
const PerfectSTones = dynamic(() => import('./Home/perfect-stone'))
const LuxuryGemstones = dynamic(() => import('./Home/gemstone-luxury'))
const PurposefullGemstone = dynamic(() => import('./Home/puprose-gemstone'))
const JwelleryBanner = dynamic(() => import('./Home/jwellery-banner'))
const Testimonials = dynamic(() => import('./Home/testimonials'))
const FAQ = dynamic(() => import('./Home/faq'))
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
    <main className="w-full overflow-hidden">
      <WelcomePopup isOpen={showPopup} onClose={handleClosePopup} />

      <Hero />
      <TrustMarquee />
      <Authenticity />

      <section id="stones">
        <PerfectSTones />
      </section>

      <section id="jewellery">
        <LuxuryGemstones />
      </section>

      <JwelleryBanner />

      <section id="purpose">
        <PurposefullGemstone />
      </section>

      <Testimonials />

      <section id="faq">
        <FAQ />
      </section>

      <Blogs />
      <ReelsSection />

      <section id="consult">
        <BookService />
      </section>
    </main>
  )
}

export default HomePage

