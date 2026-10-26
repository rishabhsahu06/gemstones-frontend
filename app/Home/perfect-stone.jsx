"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeading, Reveal } from "./Reveal";
import { inr } from "@/lib/site-data";
import api from "@/lib/axios";

const EASE = [0.22, 1, 0.36, 1];

const FILTERS = [
  { id: "all", label: "All stones" },
  { id: "under-15k", label: "Under ₹15,000" },
  { id: "premium", label: "Premium" },
];

const NAVRATNA = new Set([
  "ruby",
  "pearl",
  "red-coral",
  "emerald",
  "yellow-sapphire",
  "diamond",
  "blue-sapphire",
  "hessonite",
  "opal",
  "cats-eye",
  "chrysoberyl",
]);

const formatLabel = (value) =>
  value
    ? String(value)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "";

function mapStone(product) {
  const original = Number(product.originalPrice || 0);
  const discounted = Number(product.discountedPrice || 0);
  const price = discounted > 0 ? discounted : original;
  const compare = discounted > 0 && original > discounted ? original : 0;
  const carat = product.weightRatti
    ? `${product.weightRatti} ratti`
    : product.weightCarat
      ? `${product.weightCarat} ct`
      : "";
  const description = String(product.description || "").replace(/\s+/g, " ").trim();

  return {
    id: product._id,
    name: product.name,
    image: product.images?.[0]?.url || "",
    category: formatLabel(product.primaryCategory),
    categoryId: product.primaryCategory || "",
    intent: description.length > 90 ? `${description.slice(0, 87)}…` : description,
    price,
    compare,
    carat,
    rating: Number(product.ratings?.average || 0),
    reviews: Number(product.ratings?.count || 0),
  };
}

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: "0.6rem",
            color: i < Math.round(rating) ? "var(--gold)" : "var(--border)",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function StoneCard({ stone }) {
  const discount =
    stone.compare > stone.price
      ? Math.round(((stone.compare - stone.price) / stone.compare) * 100)
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <Link
        href={`/products/${stone.id}`}
        className="group relative block overflow-hidden rounded-sm"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="relative aspect-square overflow-hidden bg-[#f7f5f0]">
          {stone.image ? (
            <Image
              src={stone.image}
              alt={stone.name}
              fill
              loading="lazy"
              className="object-contain p-4 transition-transform duration-[900ms] group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-[#8a8176]">
              Photo coming soon
            </div>
          )}

          {stone.category && (
            <span
              className="absolute top-2 left-2 eyebrow text-[0.55rem] px-2 py-1 rounded-sm max-w-[70%] truncate"
              style={{ background: "var(--ink)", color: "var(--gold)" }}
            >
              {stone.category}
            </span>
          )}

          {discount > 0 && (
            <span
              className="absolute top-2 right-2 text-[0.6rem] font-medium px-2 py-0.5 rounded-sm"
              style={{ background: "var(--gold)", color: "var(--gold-foreground)" }}
            >
              -{discount}%
            </span>
          )}
        </div>

        <div className="p-3 sm:p-4">
          {stone.reviews > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <StarRating rating={stone.rating} />
              <span className="text-[0.65rem]" style={{ color: "var(--muted-foreground)" }}>
                ({stone.reviews})
              </span>
            </div>
          )}

          <h3
            className="text-base sm:text-lg leading-snug mb-0.5 line-clamp-2"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--ink)",
            }}
          >
            {stone.name}
          </h3>

          {stone.carat && (
            <p className="text-xs italic mb-2" style={{ color: "var(--muted-foreground)" }}>
              {stone.carat}
            </p>
          )}

          {stone.intent && (
            <p
              className="hidden sm:block text-xs leading-relaxed mb-3 line-clamp-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {stone.intent}
            </p>
          )}

          <div
            className="pt-3 flex items-baseline gap-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span className="text-base sm:text-lg font-medium" style={{ color: "var(--ink)" }}>
              {stone.price > 0 ? inr(stone.price) : "Price on request"}
            </span>
            {stone.compare > stone.price && (
              <span className="text-xs line-through" style={{ color: "var(--muted-foreground)" }}>
                {inr(stone.compare)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StoneSkeleton() {
  return <div className="aspect-[3/4] rounded-sm bg-[#f3efe6] animate-pulse" />;
}

export default function PerfectStones() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStones() {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/products", {
          params: {
            productType: "gemstone",
            isAvailable: true,
            limit: 100,
          },
        });
        if (cancelled) return;
        const products = response.data?.data || [];
        setStones(products.map(mapStone));
      } catch (err) {
        console.error("Failed to load stones", err);
        if (!cancelled) {
          setError("Stones could not be loaded. Please try again.");
          setStones([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStones();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = stones.filter((stone) => {
    if (activeFilter === "under-15k") return stone.price > 0 && stone.price < 15000;
    if (activeFilter === "premium") {
      return stone.price >= 15000 || NAVRATNA.has(stone.categoryId);
    }
    return true;
  });

  return (
    <section id="stones" className="container mx-auto px-4 py-16 xl:py-24">
      <div className="text-center mb-12">
        <SectionHeading
          eyebrow="Vedic Navratna"
          title="Find Your Perfect Stone"
          copy="Each gemstone is recommended by planet, purpose, and your birth chart."
          align="center"
          delay={0}
        />
      </div>

      <Reveal delay={0.1}>
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist">
          {FILTERS.map((filter) => (
            <div key={filter.id} className="relative">
              {activeFilter === filter.id && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--ink)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <button
                role="tab"
                aria-selected={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className="relative z-10 px-4 sm:px-5 py-2 rounded-full eyebrow text-[0.6rem] transition-colors duration-300 border"
                style={{
                  color: activeFilter === filter.id ? "var(--gold)" : "var(--ink)",
                  borderColor: activeFilter === filter.id ? "transparent" : "var(--border)",
                }}
              >
                {filter.label}
              </button>
            </div>
          ))}
        </div>
      </Reveal>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <StoneSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
          {stones.length === 0
            ? "Stones added from the admin Stones section will appear here."
            : "No stones match this filter."}
        </p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((stone) => (
              <StoneCard key={stone.id} stone={stone} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/products"
            className="shimmer-btn inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-sm eyebrow text-[0.65rem] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "var(--gold)",
              color: "var(--gold-foreground)",
            }}
          >
            View All Stones
          </Link>
          <Link
            href="#consult"
            className="text-sm link-underline"
            style={{ color: "var(--muted-foreground)" }}
          >
            Not sure which one? Ask an astrologer
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
