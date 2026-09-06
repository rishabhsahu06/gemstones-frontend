"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/site-data";
import { SectionHeading, Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1];

function StarRow({ count = 5 }) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "var(--gold)", fontSize: "1rem" }}>★</span>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const go = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  return (
    <section
      className="py-16 xl:py-24 relative overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, oklch(0.74 0.13 84 / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <SectionHeading
            eyebrow="Customer Stories"
            title="What Our Clients Say"
            align="center"
            tone="light"
            delay={0}
          />
        </div>

        {/* Single-card slider */}
        <div className="relative max-w-3xl mx-auto">
          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full transition-all duration-300 hover:scale-110"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--ink-foreground)" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full transition-all duration-300 hover:scale-110"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--ink-foreground)" }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Card */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="text-center px-8 py-2"
              >
                {/* Stars */}
                <div className="flex justify-center mb-6">
                  <StarRow count={testimonials[current].rating} />
                </div>

                {/* Quote */}
                <blockquote
                  className="mb-8 leading-relaxed"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                    color: "var(--ink-foreground)",
                  }}
                >
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                {/* Reviewer */}
                <p className="eyebrow text-[0.65rem]" style={{ color: "var(--gold)" }}>
                  {testimonials[current].name}
                  <span style={{ color: "var(--gold-soft)", fontWeight: 300 }}>
                    {" "}· {testimonials[current].city}{" "}
                  </span>
                  <span style={{ color: "oklch(0.6 0.02 265)" }}>
                    · Purchased {testimonials[current].stone}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => go(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === current ? "20px" : "6px",
                  height: "6px",
                  background: idx === current ? "var(--gold)" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Aggregate strip */}
        <Reveal delay={0.2}>
          <div
            className="mt-14 pt-8 flex flex-wrap justify-center gap-10"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            {[
              { value: "4.9", label: "Average rating" },
              { value: "2,500+", label: "Chart readings completed" },
              { value: "98%", label: "Would recommend us" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-3xl sm:text-4xl mb-1"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--gold-soft)" }}
                >
                  {stat.value}
                </p>
                <p className="eyebrow text-[0.55rem]" style={{ color: "oklch(0.55 0.02 265)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
