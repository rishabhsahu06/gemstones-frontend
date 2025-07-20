'use client'

import React, { useState, useEffect } from 'react'

import Authenticity from './Home/Authenticity'
import PerfectSTones from './Home/perfect-stone'
import LuxuryGemstones from './Home/gemstone-luxury'
import PurposefullGemstone from './Home/puprose-gemstone'
import AstrologyPopup from './components/popup'
import JwelleryBanner from './Home/jwellery-banner'
import Hero from './Home/Hero'
import Blogs from './Home/blog'
import BookService from './Home/book-service'
import ReelsSection from './Home/reels-section'
import WelcomePopup from './components/welcomeModal/welcome'

// Import the separate WelcomePopup component


function page() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if user has visited before (using session storage)
    const visited = sessionStorage.getItem('hasVisitedBefore');
    
    if (!visited) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    // Mark as visited
    sessionStorage.setItem('hasVisitedBefore', 'true');
  };

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

export default page