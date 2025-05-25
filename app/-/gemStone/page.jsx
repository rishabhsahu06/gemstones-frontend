import Image from "next/image"
import Link from "next/link"

const gemstones = [
  // Row 1
  {
    id: "yellow-sapphire",
    name: "Yellow Sapphire",
    src: "/yellow-stone.png",
    alt: "Yellow gemstone on gold background",
    slug: "yellow-sapphire",
  },
  {
    id: "blue-sapphire",
    name: "Blue Sapphire",
    src: "/blue-stone.png",
    alt: "Blue gemstone on blue background",
    slug: "blue-sapphire",
  },
  {
    id: "emerald",
    name: "Emerald",
    src: "/green-stone.png",
    alt: "Green gemstone on green background",
    slug: "emerald",
  },
  {
    id: "ruby",
    name: "Ruby",
    src: "/red-stone.png",
    alt: "Red gemstone on red background",
    slug: "ruby",
  },
  // Row 2
  {
    id: "opal",
    name: "Opal",
    src: "/opal-stone.png",
    alt: "Opal gemstone on light background",
    slug: "opal",
  },
  {
    id: "orange-sapphire",
    name: "Orange Sapphire",
    src: "/blue-stone.png",
    alt: "Orange gemstone on orange background",
    slug: "orange-sapphire",
  },
  {
    id: "pearl",
    name: "Pearl",
    src: "/pearl-stone.png",
    alt: "Pearl on light gray background",
    slug: "pearl",
  },
  {
    id: "pink-sapphire",
    name: "Pink Sapphire",
    src: "/red-stone.png",
    alt: "Pink gemstone on orange background",
    slug: "pink-sapphire",
  },
  // Row 3 (repeating the first row)
  {
    id: "yellow-sapphire-2",
    name: "Yellow Sapphire",
    src: "/yellow-stone.png",
    alt: "Yellow gemstone on gold background",
    slug: "yellow-sapphire",
  },
  {
    id: "blue-sapphire-2",
    name: "Blue Sapphire",
    src: "/blue-stone.png",
    alt: "Blue gemstone on blue background",
    slug: "blue-sapphire",
  },
  {
    id: "emerald-2",
    name: "Emerald",
    src: "/green-stone.png",
    alt: "Green gemstone on green background",
    slug: "emerald",
  },
  {
    id: "ruby-2",
    name: "Ruby",
    src: "/red-stone.png",
    alt: "Red gemstone on red background",
    slug: "ruby",
  },
  // Row 4 (repeating the second row)
  {
    id: "yellow-sapphire-3",
    name: "Yellow Sapphire",
    src: "/yellow-stone.png",
    alt: "Yellow gemstone on gold background",
    slug: "yellow-sapphire",
  },
  {
    id: "orange-sapphire-2",
    name: "Orange Sapphire",
    src: "/blue-stone.png",
    alt: "Orange gemstone on orange background",
    slug: "orange-sapphire",
  },
  {
    id: "emerald-3",
    name: "Emerald",
    src: "/green-stone.png",
    alt: "Green gemstone on green background",
    slug: "emerald",
  },
  {
    id: "pink-sapphire-2",
    name: "Pink Sapphire",
    src: "/red-stone.png",
    alt: "Pink gemstone on orange background",
    slug: "pink-sapphire",
  },
]

function Page() {

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-start mb-8 mt-12 px-4">Gemstones</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {gemstones.map((stone, index) => (
          <Link
            key={stone.id}
            href={`/gemStone/${stone.slug}`}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer block"
          >
            <Image
              src={stone.src || "/placeholder.svg"}
              alt={stone.alt}
              width={500}
              height={500}
              className="w-full h-full object-contain transition-all duration-300 hover:shadow-xl"
              priority={index < 4} // Load first row with priority
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Page
