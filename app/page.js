import { Button } from '@/components/ui/button'
import React from 'react'
import Hero from './Home/Hero'
import Authenticity from './Home/Authenticity'
import PerfectSTones from './Home/perfect-stone'
import LuxuryGemstones from './Home/gemstone-luxury'
import PurposefullGemstone from './Home/puprose-gemstone'
import Blogs from './Home/blog'
import ReelsSection from './Home/reels-section'
import BookService from './Home/book-service'

function page() {
  return (
    <div>
      <Hero />
      <Authenticity />
      <PerfectSTones />
      <LuxuryGemstones />
      <PurposefullGemstone />
      <Blogs />
      <ReelsSection />
      <BookService />
    </div>
  )
}

export default page