"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { jewellery } from "@/lib/site-data";
import { SectionHeading, Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1];

function JewelleryCard({ item, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: idx * 0.1, ease: EASE }}
      className="group relative overflow-hidden rounded-sm"
      style={{ aspectRatio: "4/5" }}
    >
      <Link href={item.href} aria-label={item.title}>
        {/* Image */}
        <Image
          src={item.image}
          alt={item.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, oklch(0.19 0.045 265 / 0.85) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />

        {/* Caption block — slides up on hover, always visible on mobile */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 group-hover:translate-y-0 transition-transform duration-500"
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        >
          <p className="eyebrow text-[0.55rem] mb-2" style={{ color: "var(--gold)" }}>
            {item.count} pieces
          </p>
          <h3
            className="text-xl leading-snug mb-1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--ink-foreground)",
            }}
          >
            {item.title}
          </h3>
          <p
            className="text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ color: "oklch(0.78 0.012 85)" }}
          >
            {item.subtitle}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function LuxuryGemstones() {
  return (
    <section id="jewellery" className="py-16 xl:py-24">
      {/* Header */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <SectionHeading
          eyebrow="Handcrafted Jewellery"
          title="The Art of Gemstone Luxury"
          copy="Elevate your style with the unmatched allure of fine gemstones set in 18k & 22k gold."
          align="center"
          delay={0}
        />
      </div>

      {/* 4-card editorial grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {jewellery.map((item, idx) => (
            <JewelleryCard key={item.id} item={item} idx={idx} />
          ))}
        </div>
      </div>

      {/* Full-width bespoke banner */}
      <Reveal delay={0.15}>
        <div className="relative mt-12 mx-4 sm:mx-0 overflow-hidden" style={{ minHeight: "260px" }}>
          <Image
            src="/banner.png"
            alt="Bespoke gemstone jewellery atelier banner"
            fill
            loading="lazy"
            className="object-cover"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "oklch(0.19 0.045 265 / 0.55)" }}
            aria-hidden="true"
          />

          {/* Centred copy */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 py-16">
            <p className="eyebrow text-[0.6rem] mb-4" style={{ color: "var(--gold)" }}>
              Bespoke Atelier
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl mb-6 max-w-2xl leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                color: "var(--ink-foreground)",
              }}
            >
              Have a stone? We'll set it in gold.
            </h2>
            <Link
              href="/gemstones-jewellery"
              className="inline-flex px-8 py-3.5 rounded-sm eyebrow text-[0.65rem] transition-all duration-300 hover:-translate-y-0.5"
              style={{
                border: "1px solid rgba(255,255,255,0.5)",
                color: "var(--ink-foreground)",
              }}
            >
              Explore Jewellery
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}