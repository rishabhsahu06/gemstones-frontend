import Image from "next/image";
import { Users, Shield, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto">
      {/* About Us Section */}
      <div className=" md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Us</h1>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-sm md:text-base">
                We believe that the universe has a plan for everyone — and astrology is the ancient key to unlocking it.
                With over 5 years of experience in Vedic and modern astrology, we are committed to helping individuals
                navigate life's uncertainties, discover their true path, and find clarity in every stage of life.
              </p>

              <p className="text-sm md:text-base">
                Led by renowned astrologer Sunita, our mission is to provide deep insight and practical guidance through
                personalized horoscopes, birth chart analysis, gemstone recommendations, and spiritual consultations.
                Whether you're facing challenges in love, career, health, or finances, we're here to support your
                journey with compassion and accuracy.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/about.png"
                alt="Dr. Sunita Dubey in her consultation office"
                width={1000}
                height={1000}
                className="w-full h-auto object-cover"
                priority
              />

              {/* Size indicator */}
              <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                1512 x 550
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-amber-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">Why Choose Us?</h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="bg-gray-800 text-white p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-white mr-3" />
                <h3 className="text-lg font-semibold">Trusted by thousands of clients worldwide</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                With a passion for craftsmanship and a deep respect for the power of gemstones, we've built a loyal
                market by authenticity, elegance, and trust. From special occasions to daily luxuries, our global
                community of satisfied customers speaks to our commitment to quality and timeless design. Every piece we
                create is a promise of quality, tradition, and care.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-gray-700 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Confidential & Personalized Consultations</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choosing the right gemstone is more than a purchase — it's a personal journey. Our expert consultants
                provide thoughtful, customized guidance based on your individual needs, life goals, and spiritual path
                to fit a safe and confidential space.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-gray-700 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Remedies that align with your energy and lifestyle
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every individual carries a unique cosmic blueprint. Our remedies are carefully crafted and recommended
                based on your birth chart and energetic needs — helping you restore balance, attract positivity, and
                align with your true path. Discover solutions that are as personal and powerful as you are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
