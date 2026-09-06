"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { stones, inr } from "@/lib/site-data";
import { SectionHeading, Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1];

const FILTERS = [
  { id: "all", label: "All stones" },
  { id: "bestseller", label: "Bestsellers" },
  { id: "premium", label: "Premium navratna" },
  { id: "under-15k", label: "Under ₹15,000" },
];

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
  const [added, setAdded] = useState(false);
  const discount = Math.round(((stone.compare - stone.price) / stone.compare) * 100);

  const handleAdd = (e) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="group relative rounded-sm overflow-hidden cursor-pointer"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        transition: "border-color 0.35s, box-shadow 0.35s, transform 0.35s",
      }}
      whileHover={{
        y: -6,
        boxShadow: "0 16px 48px oklch(0.19 0.045 265 / 0.18)",
        borderColor: "var(--gold)",
      }}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-paper">
        <Image
          src={stone.image}
          alt={stone.name}
          fill
          loading="lazy"
          className="object-contain p-4 transition-transform duration-[900ms] group-hover:scale-[1.09]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badge (top-left) */}
        {stone.badge && (
          <span
            className="absolute top-2 left-2 eyebrow text-[0.55rem] px-2 py-1 rounded-sm"
            style={{ background: "var(--ink)", color: "var(--gold)" }}
          >
            {stone.badge}
          </span>
        )}

        {/* Discount chip (top-right) */}
        {discount > 0 && (
          <span
            className="absolute top-2 right-2 text-[0.6rem] font-medium px-2 py-0.5 rounded-sm"
            style={{ background: "var(--gold)", color: "var(--gold-foreground)" }}
          >
            -{discount}%
          </span>
        )}

        {/* Quick-add bar (slides up on hover) */}
        <div
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350"
          style={{ background: added ? "var(--ink)" : "var(--gold)" }}
        >
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 py-3 eyebrow text-[0.6rem]"
            style={{ color: added ? "var(--gold)" : "var(--gold-foreground)" }}
            aria-label={added ? "Added to bag" : `Quick add ${stone.name}`}
          >
            {added ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Added to bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Quick add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Planet eyebrow */}
        <p
          className="eyebrow text-[0.55rem] mb-1.5"
          style={{ color: "var(--gold)" }}
        >
          {stone.planet} · {stone.planetGlyph}
        </p>

        {/* Stars + reviews */}
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={stone.rating} />
          <span className="text-[0.65rem]" style={{ color: "var(--muted-foreground)" }}>
            ({stone.reviews})
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-lg leading-snug mb-0.5"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            color: "var(--ink)",
          }}
        >
          {stone.name}
        </h3>

        {/* Sanskrit · Carat */}
        <p
          className="text-xs italic mb-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          {stone.sanskrit} · {stone.carat}
        </p>

        {/* Intent (hidden on small mobile) */}
        <p
          className="hidden sm:block text-xs leading-relaxed mb-3"
          style={{ color: "var(--muted-foreground)" }}
        >
          {stone.intent}
        </p>

        {/* Price row */}
        <div
          className="pt-3 flex items-baseline gap-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className="text-lg font-medium"
            style={{ fontFamily: "var(--font-sans)", color: "var(--ink)" }}
          >
            {inr(stone.price)}
          </span>
          <span
            className="text-xs line-through"
            style={{ color: "var(--muted-foreground)" }}
          >
            {inr(stone.compare)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PerfectStones() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? stones
      : stones.filter((s) => s.tags.includes(activeFilter));

  return (
    <section id="stones" className="container mx-auto px-4 py-16 xl:py-24">
      {/* Heading */}
      <div className="text-center mb-12">
        <SectionHeading
          eyebrow="Vedic Navratna"
          title="Find Your Perfect Stone"
          copy="Each gemstone is recommended by planet, purpose, and your birth chart."
          align="center"
          delay={0}
        />
      </div>

      {/* Filter pills */}
      <Reveal delay={0.1}>
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist">
          {FILTERS.map((f) => (
            <div key={f.id} className="relative">
              {activeFilter === f.id && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--ink)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <button
                role="tab"
                aria-selected={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
                className="relative z-10 px-5 py-2 rounded-full eyebrow text-[0.6rem] transition-colors duration-300 border"
                style={{
                  color: activeFilter === f.id ? "var(--gold)" : "var(--ink)",
                  borderColor: activeFilter === f.id ? "transparent" : "var(--border)",
                }}
              >
                {f.label}
              </button>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Stone grid */}
      <motion.div
        layout
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((stone) => (
            <StoneCard key={stone.slug} stone={stone} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer link */}
      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/products"
            className="shimmer-btn inline-flex items-center gap-2 px-10 py-4 rounded-sm eyebrow text-[0.65rem] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
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