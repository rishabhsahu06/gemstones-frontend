/**
 * Sunita Gemstones — Site Data
 * All content arrays used by homepage sections.
 */

/** INR currency formatter */
export function inr(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Navratna stones */
export const stones = [
  {
    slug: "yellow-sapphire",
    name: "Yellow Sapphire",
    sanskrit: "Pukhraj",
    planet: "Jupiter",
    planetGlyph: "♃",
    image: "/yellow-stone.png",
    intent: "Wisdom, prosperity & marital harmony",
    price: 18400,
    compare: 24500,
    carat: "5.25 ratti",
    rating: 4.9,
    reviews: 412,
    badge: "Most recommended",
    tags: ["bestseller", "certified", "premium"],
  },
  {
    slug: "blue-sapphire",
    name: "Blue Sapphire",
    sanskrit: "Neelam",
    planet: "Saturn",
    planetGlyph: "♄",
    image: "/blue-stone.png",
    intent: "Discipline, clarity & career acceleration",
    price: 26900,
    compare: 34000,
    carat: "4.75 ratti",
    rating: 4.8,
    reviews: 287,
    badge: "Astrologer's pick",
    tags: ["bestseller", "certified", "premium"],
  },
  {
    slug: "emerald",
    name: "Emerald",
    sanskrit: "Panna",
    planet: "Mercury",
    planetGlyph: "☿",
    image: "/green-stone.png",
    intent: "Intellect, communication & business growth",
    price: 21500,
    compare: 27800,
    carat: "5.00 ratti",
    rating: 4.9,
    reviews: 356,
    badge: null,
    tags: ["bestseller", "certified", "premium"],
  },
  {
    slug: "ruby",
    name: "Ruby",
    sanskrit: "Manik",
    planet: "Sun",
    planetGlyph: "☉",
    image: "/ruby-stone.png",
    intent: "Authority, vitality & recognition",
    price: 23200,
    compare: 29900,
    carat: "4.50 ratti",
    rating: 4.7,
    reviews: 221,
    badge: null,
    tags: ["bestseller", "certified", "premium"],
  },
  {
    slug: "pearl",
    name: "Pearl",
    sanskrit: "Moti",
    planet: "Moon",
    planetGlyph: "☾",
    image: "/pearl-stone.png",
    intent: "Calm mind, emotional balance & sleep",
    price: 8900,
    compare: 12400,
    carat: "6.25 ratti",
    rating: 4.8,
    reviews: 508,
    badge: "Gentle starter stone",
    tags: ["certified", "under-15k"],
  },
  {
    slug: "red-coral",
    name: "Red Coral",
    sanskrit: "Moonga",
    planet: "Mars",
    planetGlyph: "♂",
    image: "/red-stone.png",
    intent: "Courage, stamina & protection",
    price: 7600,
    compare: 10900,
    carat: "7.00 ratti",
    rating: 4.7,
    reviews: 297,
    badge: null,
    tags: ["certified", "under-15k"],
  },
  {
    slug: "fire-opal",
    name: "Fire Opal",
    sanskrit: "Opal",
    planet: "Venus",
    planetGlyph: "♀",
    image: "/opal-stone.png",
    intent: "Love, artistry & magnetic charm",
    price: 12400,
    compare: 16800,
    carat: "5.50 ratti",
    rating: 4.6,
    reviews: 164,
    badge: null,
    tags: ["certified", "under-15k"],
  },
  {
    slug: "hessonite",
    name: "Hessonite",
    sanskrit: "Gomed",
    planet: "Rahu",
    planetGlyph: "☊",
    image: "/hesotine-stone.png",
    intent: "Removes confusion & hidden obstacles",
    price: 9800,
    compare: 13600,
    carat: "6.00 ratti",
    rating: 4.7,
    reviews: 189,
    badge: null,
    tags: ["certified", "under-15k"],
  },
  {
    slug: "cats-eye",
    name: "Cat's Eye",
    sanskrit: "Lehsunia",
    planet: "Ketu",
    planetGlyph: "☋",
    image: "/hesotine-stone.png",
    intent: "Intuition, detachment & sudden gains",
    price: 14200,
    compare: 18900,
    carat: "5.75 ratti",
    rating: 4.6,
    reviews: 132,
    badge: null,
    tags: ["certified", "under-15k"],
  },
];

/** Jewellery collections */
export const jewellery = [
  {
    id: "pendants",
    title: "Gemstone Pendants",
    subtitle: "Set close to the heart chakra in 18k & 22k gold.",
    count: 34,
    image: "/pendant.png",
    href: "/gemstones-jewellery?cat=pendants",
  },
  {
    id: "bracelets",
    title: "Gemstone Bracelets",
    subtitle: "Navratna and single-stone bracelets, sized to your wrist.",
    count: 27,
    image: "/bracelet.png",
    href: "/gemstones-jewellery?cat=bracelets",
  },
  {
    id: "earrings",
    title: "Gemstone Earrings",
    subtitle: "Everyday studs to occasion drops, hand-finished.",
    count: 41,
    image: "/earring.png",
    href: "/gemstones-jewellery?cat=earrings",
  },
  {
    id: "rings",
    title: "Statement Rings",
    subtitle: "Open-back settings so the stone touches the skin.",
    count: 52,
    image: "/ring.png",
    href: "/gemstones-jewellery?cat=rings",
  },
];

/** Purpose tiles */
export const purposes = [
  {
    id: "health",
    title: "Health",
    glyph: "☾",
    stone: "Pearl · Red Coral",
    image: "/health.png",
  },
  {
    id: "career",
    title: "Career",
    glyph: "♄",
    stone: "Blue Sapphire",
    image: "/career.png",
  },
  {
    id: "education",
    title: "Education",
    glyph: "☿",
    stone: "Emerald",
    image: "/education.png",
  },
  {
    id: "business",
    title: "Business",
    glyph: "♃",
    stone: "Yellow Sapphire",
    image: "/business.png",
  },
  {
    id: "relationships",
    title: "Relationships",
    glyph: "♀",
    stone: "Fire Opal",
    image: "/relationship.png",
  },
  {
    id: "protection",
    title: "Protection",
    glyph: "☊",
    stone: "Hessonite",
    image: "/health.png",
  },
];

/** Customer testimonials */
export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Delhi",
    stone: "Yellow Sapphire",
    rating: 5,
    quote:
      "Within three months of wearing Pukhraj, my business expanded beyond what I expected. The stone was beautifully set and the consultation was incredibly accurate.",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    city: "Mumbai",
    stone: "Blue Sapphire",
    rating: 5,
    quote:
      "I was sceptical at first, but after wearing Neelam my career trajectory changed dramatically. The certification gave me full confidence in its authenticity.",
  },
  {
    id: 3,
    name: "Ananya Iyer",
    city: "Bengaluru",
    stone: "Emerald",
    rating: 5,
    quote:
      "The Panna stone helped me sail through my board exams. Sunita ji's team was patient, explained everything, and the stone arrived energised and beautifully packed.",
  },
  {
    id: 4,
    name: "Kiran Patel",
    city: "Ahmedabad",
    stone: "Pearl",
    rating: 5,
    quote:
      "My anxiety levels have reduced considerably since I started wearing Moti. The astrologer recommended the exact ratti weight after studying my chart.",
  },
  {
    id: 5,
    name: "Suresh Nair",
    city: "Kochi",
    stone: "Red Coral",
    rating: 5,
    quote:
      "Outstanding quality and superb customer service. The Moonga stone is exactly as described — natural, vibrant, and lab-certified. Highly recommend.",
  },
];

/** FAQ entries */
export const faqs = [
  {
    id: 1,
    question: "How do I know the gemstone is certified and genuine?",
    answer:
      "Every stone comes with a laboratory certification from a recognised gemmological institute (IGI / GIA / GGL). The report confirms the stone is natural, untreated, and accurately weighed in ratti.",
  },
  {
    id: 2,
    question: "What is ratti sizing and how do I choose the right weight?",
    answer:
      "Ratti is the traditional Indian unit for gemstone weight (1 ratti ≈ 0.91 carats). The correct ratti for you depends on your body weight and planetary position in your birth chart. Our astrologers calculate this during the free consultation.",
  },
  {
    id: 3,
    question: "Are the stones energised before dispatch?",
    answer:
      "Yes. Each stone is cleansed using sacred river water, incense, and chanted mantras specific to its ruling planet before it leaves our Jaipur atelier. You receive a ready-to-wear gemstone.",
  },
  {
    id: 4,
    question: "What is your return and exchange policy?",
    answer:
      "We offer a 7-day return policy for any reason, provided the stone is returned in its original condition with the lab certificate. Exchanges for a different stone of equal value are free.",
  },
  {
    id: 5,
    question: "How does the free astrologer consultation work?",
    answer:
      "Fill in the consultation form with your name, date, time, and place of birth. One of our panel astrologers will call you within 24 hours, map your birth chart, and recommend the ideal stone, metal, and auspicious day to begin wearing it.",
  },
  {
    id: 6,
    question: "Do you ship across India and internationally?",
    answer:
      "We ship pan-India via insured courier with real-time tracking. International shipping is available to the US, UK, Canada, Australia, UAE, and Singapore. All shipments are fully insured against loss or damage.",
  },
];

/** Consultation steps */
export const consultSteps = [
  {
    step: 1,
    title: "Share your birth details",
    description:
      "Provide your date, time, and place of birth in the form below. Your details are kept strictly confidential.",
  },
  {
    step: 2,
    title: "Astrologer maps your chart",
    description:
      "Our panel Vedic astrologer analyses your birth chart, planetary positions, and current Dasha period.",
  },
  {
    step: 3,
    title: "Receive your stone, energised",
    description:
      "We source your recommended gemstone, have it certified, energise it with planetary mantras, and ship it to your door.",
  },
];
