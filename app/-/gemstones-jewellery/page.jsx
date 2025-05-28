"use client";
import { useState, useEffect, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

// Skeleton Components
const HeroSkeleton = () => (
  <div className="w-full h-[300px] sm:h-[400px] lg:h-[600px] bg-gray-200 animate-pulse">
    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
  </div>
);

const FilterSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-4xl mx-auto">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex-1">
        <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded-md"></div>
        </div>
      </div>
    ))}
  </div>
);

const ProductCardSkeleton = () => (
  <div className="group cursor-pointer">
    <div className="aspect-square overflow-hidden rounded-lg bg-gray-200 mb-2 sm:mb-3 animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
    </div>
    <div className="w-3/4 h-4 bg-gray-200 rounded mx-auto animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded"></div>
    </div>
  </div>
);

const TitleSkeleton = () => (
  <div className="flex flex-col items-center justify-center mt-8 sm:mt-12 mb-6 sm:mb-8">
    <div className="w-80 h-8 sm:h-10 lg:h-12 bg-gray-200 rounded mb-2 sm:mb-4 animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded"></div>
    </div>
    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded"></div>
    </div>
  </div>
);

function Jewelry() {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [errorImages, setErrorImages] = useState(new Set());
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Sample data
  const data = [
    { id: 1, title: "Ruby Ring", image: "/ring.png", metal: "gold", type: "rings", category: "popular" },
    { id: 2, title: "Diamond Pendant", image: "/pendant-img.png", metal: "platinum", type: "necklaces", category: "new" },
    { id: 3, title: "Silver Bracelet", image: "/ankles.png", metal: "silver", type: "bracelets", category: "sale" },
    { id: 4, title: "Emerald Earrings", image: "/green-ring.png", metal: "gold", type: "earrings", category: "popular" },
    { id: 5, title: "Gold Anklets", image: "/ring.png", metal: "gold", type: "anklets", category: "new" },
    { id: 6, title: "Platinum Pins", image: "/pendant-img.png", metal: "platinum", type: "bracelets", category: "all" },
    { id: 7, title: "Rose Gold Chokers", image: "/ankles.png", metal: "rose-gold", type: "chokers", category: "sale" },
    { id: 8, title: "Diamond Ring", image: "/green-ring.png", metal: "platinum", type: "rings", category: "popular" },
    { id: 9, title: "Classic Ring", image: "/ring.png", metal: "silver", type: "rings", category: "all" },
    { id: 10, title: "Pearl Pendant", image: "/pendant-img.png", metal: "gold", type: "necklaces", category: "new" },
    { id: 11, title: "Tennis Bracelet", image: "/ankles.png", metal: "silver", type: "bracelets", category: "popular" },
    { id: 12, title: "Stud Earrings", image: "/green-ring.png", metal: "gold", type: "earrings", category: "sale" },
    { id: 13, title: "Chain Anklets", image: "/ring.png", metal: "silver", type: "anklets", category: "new" },
    { id: 14, title: "Charm Pins", image: "/pendant-img.png", metal: "rose-gold", type: "bracelets", category: "all" },
    { id: 15, title: "Velvet Chokers", image: "/ankles.png", metal: "gold", type: "chokers", category: "popular" },
    { id: 16, title: "Vintage Ring", image: "/green-ring.png", metal: "rose-gold", type: "rings", category: "sale" },
  ];

  // Initialize component
  useEffect(() => {
    // Simulate initial loading
    const initTimer = setTimeout(() => {
      setFilteredData(data);
      setIsLoading(false);
    }, 1500); // 1.5 second loading simulation

    return () => clearTimeout(initTimer);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...data];

    if (selectedFilter && selectedFilter !== "all") {
      filtered = filtered.filter(item => item.category === selectedFilter);
    }

    if (selectedMetal) {
      filtered = filtered.filter(item => item.metal === selectedMetal);
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    setFilteredData(filtered);
  }, [selectedFilter, selectedMetal, selectedType]);

  // Image loading handlers
  const handleImageLoad = useCallback((id) => {
    setLoadedImages(prev => new Set([...prev, id]));
  }, []);

  const handleImageError = useCallback((id) => {
    setErrorImages(prev => new Set([...prev, id]));
    console.error(`Failed to load image for item ${id}`);
  }, []);

  const handleHeroImageLoad = useCallback(() => {
    setHeroImageLoaded(true);
  }, []);

  const handleHeroImageError = useCallback(() => {
    console.error('Failed to load hero image');
    setHeroImageLoaded(true); // Still show content even if hero fails
  }, []);

  // Filter handlers
  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  const handleMetalChange = (value) => {
    setSelectedMetal(value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedFilter("");
    setSelectedMetal("");
    setSelectedType("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Skeleton */}
        <HeroSkeleton />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Skeleton */}
          <TitleSkeleton />

          {/* Filter Skeleton */}
          <FilterSkeleton />

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-12 sm:pb-16">
            {Array(16).fill(0).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -400% 0; }
            100% { background-position: 400% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        {!heroImageLoaded && <HeroSkeleton />}
        <Image
          src="/jwellery-banner.png"
          alt="Jewelry Hero - Discover exquisite jewelry collections"
          width={1920}
          height={600}
          className={`w-full h-auto object-cover transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
          onLoad={handleHeroImageLoad}
          onError={handleHeroImageError}
          priority
          loading="eager"
        />

        {/* Hero overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center mt-8 sm:mt-12 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-center transition-all duration-300 hover:text-gray-700">
            Find Your Unique Aesthetic
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 transition-colors duration-300">
            Select Metal & Style
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-4xl mx-auto">
          <div className="flex-1">
            <Select value={selectedFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full h-12 text-base hover:border-gray-400 transition-colors focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="new">New Arrivals</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="sale">On Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select value={selectedMetal} onValueChange={handleMetalChange}>
              <SelectTrigger className="w-full h-12 text-base hover:border-gray-400 transition-colors focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select Metal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="rose-gold">Rose Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full h-12 text-base hover:border-gray-400 transition-colors focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Jewelry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rings">Rings</SelectItem>
                <SelectItem value="necklaces">Necklaces</SelectItem>
                <SelectItem value="bracelets">Bracelets</SelectItem>
                <SelectItem value="earrings">Earrings</SelectItem>
                <SelectItem value="anklets">Anklets</SelectItem>
                <SelectItem value="chokers">Chokers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters & Results */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(selectedFilter || selectedMetal || selectedType) && (
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                Clear All Filters
              </button>
            )}
            {selectedFilter && (
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                Category: {selectedFilter}
              </span>
            )}
            {selectedMetal && (
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                Metal: {selectedMetal}
              </span>
            )}
            {selectedType && (
              <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                Type: {selectedType}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {filteredData.length} {filteredData.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {/* Product Grid */}
        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2">No jewelry found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-12 sm:pb-16">
            {filteredData.map((item, index) => {
              const isLoaded = loadedImages.has(item.id);
              const hasError = errorImages.has(item.id);

              return (
                <div
                  key={item.id}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 mb-2 sm:mb-3 relative">
                    {/* Image Skeleton */}
                    {!isLoaded && !hasError && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse">
                        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
                      </div>
                    )}

                    {/* Actual Image */}
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={`${item.title} - Premium jewelry piece`}
                      width={300}
                      height={300}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      onLoad={() => handleImageLoad(item.id)}
                      onError={() => handleImageError(item.id)}
                      loading="lazy"
                    />

                    {/* Error State */}
                    {hasError && (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <div className="text-2xl mb-2">📷</div>
                          <p className="text-xs">Image not available</p>
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg">
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                          <p className="text-xs text-gray-700 capitalize">
                            {item.metal} • {item.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-sm sm:text-base font-medium text-gray-800 group-hover:text-gray-600 transition-all duration-300">
                    {item.title}
                  </p>

                  {/* Category Badge */}
                  {item.category !== 'all' && (
                    <div className="text-center mt-1">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${item.category === 'new' ? 'bg-green-100 text-green-800' :
                        item.category === 'popular' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'sale' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -400% 0; }
          100% { background-position: 400% 0; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Jewelry;