"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const slides = [
  {
    src: "/heroweb.webp",
    alt: "Blue sapphire ring on midnight silk with constellation lines",
    eyebrow: "30+ years · Johari Bazaar, Jaipur",
    headline: "Where the Stars Meet the Stone",
    sub: "Certified navratna gemstones, chosen by Vedic astrologers and energised before they reach your door.",
  },
  {
    src: "/hero2web.webp",
    alt: "Astrology workspace with gemstones and birth chart",
    eyebrow: "Vedic Navratna · Lab Certified",
    headline: "Harness the Power of the Cosmos",
    sub: "Each stone is matched to your unique birth chart — precision astrology, authentic gemstones.",
  },
  {
    src: "/hero3web.webp",
    alt: "Gemstone jewellery crafted in 22k gold from Jaipur",
    eyebrow: "Handcrafted in 22k Gold",
    headline: "Jewellery With Intention",
    sub: "From rings to pendants, every piece is a bridge between ancient wisdom and enduring beauty.",
  },
];

const PROOF_STATS = [
  { value: "2,500+", label: "Chart readings" },
  { value: "4.9 ★", label: "Customer rating" },
  { value: "100%", label: "Lab certified" },
];

/** Tiny twinkling dot */
function Star({ x, y, delay, size }) {
  return (
    <span
      className="animate-twinkle absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: "var(--gold-soft)",
        animationDelay: `${delay}s`,
        opacity: 0.3,
      }}
      aria-hidden="true"
    />
  );
}

// Deterministic starfield (avoids hydration mismatch)
const STARS = Array.from({ length: 55 }, (_, i) => ({
  x: ((i * 61) % 97) + 1.5,
  y: ((i * 37 + 13) % 91) + 2,
  delay: ((i * 0.31) % 4).toFixed(2),
  size: i % 5 === 0 ? "3px" : i % 3 === 0 ? "2px" : "1.5px",
}));

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(new Set([0]));
  const [ready, setReady] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const timerRef = useRef(null);

  // Reduced-motion detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const startTimer = () => {
    if (prefersReduced) return;
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      7000
    );
  };

  const stopTimer = () => clearInterval(timerRef.current);

  useEffect(() => {
    if (!ready || prefersReduced) return;
    startTimer();
    return stopTimer;
  }, [ready, prefersReduced]);

  const goTo = (idx) => {
    stopTimer();
    setCurrent(idx);
    if (!prefersReduced) startTimer();
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "92vh" }}
    >
      {/* ── Background slides ──────────────────────────────────── */}
      {slides.map((slide, idx) => {
        const shouldRender = idx === 0 || idx === current || loaded.has(idx);
        return shouldRender ? (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: idx === current ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={idx === 0}
              loading={idx === 0 ? undefined : "lazy"}
              className="object-cover"
              style={
                !prefersReduced
                  ? {
                      transform: idx === current ? "scale(1.08)" : "scale(1)",
                      transition: "transform 7000ms cubic-bezier(0.22,1,0.36,1)",
                    }
                  : {}
              }
              onLoad={() => {
                setLoaded((prev) => new Set(prev).add(idx));
                if (idx === 0) setReady(true);
              }}
              sizes="100vw"
            />
          </div>
        ) : null;
      })}

      {/* ── Starfield ─────────────────────────────────────────── */}
      {!prefersReduced && STARS.map((s, i) => <Star key={i} {...s} />)}

      {/* ── Ink gradient scrim ────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, oklch(0.19 0.045 265 / 0.78) 0%, oklch(0.19 0.045 265 / 0.45) 55%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.19 0.045 265 / 0.55) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20" style={{ minHeight: "92vh" }}>
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`ey-${current}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: ready ? 1 : 0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="eyebrow mb-5"
              style={{ color: "var(--gold)" }}
            >
              {slides[current].eyebrow}
            </motion.p>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h-${current}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: ready ? 1 : 0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.08 }}
              className="mb-6 leading-[1.05]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                color: "var(--ink-foreground)",
              }}
            >
              {slides[current].headline}
            </motion.h1>
          </AnimatePresence>

          {/* Sub-copy */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`s-${current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: ready ? 1 : 0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.18 }}
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "oklch(0.88 0.012 85)" }}
            >
              {slides[current].sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: ready ? 1 : 0, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link
              href="/products"
              className="shimmer-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-sm font-medium text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "var(--gold)",
                color: "var(--gold-foreground)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Shop Gemstones
            </Link>
            <Link
              href="#consult"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm font-medium text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5"
              style={{
                border: "1px solid rgba(255,255,255,0.5)",
                color: "var(--ink-foreground)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Free Chart Consultation
            </Link>
          </motion.div>

          {/* Proof stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
            className="flex flex-wrap gap-8"
          >
            {PROOF_STATS.map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-2xl sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--gold-soft)", fontWeight: 300 }}
                >
                  {stat.value}
                </p>
                <p className="text-xs mt-0.5 eyebrow" style={{ color: "oklch(0.7 0.015 85)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Slide indicators (gold progress bars) ─────────────── */}
      <div
        className="absolute bottom-8 right-8 z-20 flex flex-col gap-2"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goTo(idx)}
            className="relative overflow-hidden rounded-full"
            style={{
              width: idx === current ? "4px" : "3px",
              height: "36px",
              background: "rgba(255,255,255,0.25)",
              transition: "width 0.3s",
            }}
          >
            {idx === current && (
              <motion.span
                key={`prog-${current}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: prefersReduced ? 0 : 7, ease: "linear" }}
                className="absolute inset-x-0 top-0 origin-top rounded-full"
                style={{ height: "100%", background: "var(--gold)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Prev / Next arrows ────────────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
      >
        <ChevronLeft className="h-5 w-5" style={{ color: "var(--ink-foreground)" }} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-16 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
      >
        <ChevronRight className="h-5 w-5" style={{ color: "var(--ink-foreground)" }} />
      </button>
    </section>
  );
}