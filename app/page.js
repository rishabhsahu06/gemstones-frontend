import { Button } from '@/components/ui/button'
import React from 'react'

import Authenticity from './Home/Authenticity'
import PerfectSTones from './Home/perfect-stone'
import LuxuryGemstones from './Home/gemstone-luxury'
import PurposefullGemstone from './Home/puprose-gemstone'

import ReelsSection from './Home/reels-section'
import BookService from './Home/book-service'
import AstrologyPopup from './components/popup'
import JwelleryBanner from './Home/jwellery-banner'
import Hero from './Home/Hero'
import Blogs from './Home/blog'

function page() {
  return (
    <div>
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

export default page