'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
const WelcomePopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0  bg-opacity-30 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-xl mx-4 overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 transition-colors"
          aria-label="Close popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div>
          <Image
            src="/pop-uppp.webp"
            alt="Gem Recommendation Service"
            width={500}
            height={300}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Gem Recommendation Service | Online Astrology & Stone Picker
          </h3>
          
          <p className="text-gray-600 mb-6 text-sm">
            {/* Get personalized gemstone recommendations based on your astrological profile */}
          </p>

          <Button 
            // onClick={onClose}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors"
          >
              <Link
                                href="https://wa.me/919993409376"
                                // className="flex items-center justify-start sm:justify-start text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 sm:p-0 hover:bg-gray-50 sm:hover:bg-transparent rounded"
                                target="_blank"
                                rel="noopener noreferrer"
                            >  
                             CALL US
                            
                            </Link>
        
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;