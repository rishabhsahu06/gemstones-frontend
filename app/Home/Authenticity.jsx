"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Reveal, SectionHeading } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1];

const PILLARS = [
  {
    icon: "🔬",
    title: "Lab-Certified",
    desc: "Every stone comes with an IGI / GIA / GGL report confirming it is natural and untreated.",
  },
  {
    icon: "🌿",
    title: "Natural & Untreated",
    desc: "We never stock heated, oiled, or glass-filled stones. What you see is what the earth made.",
  },
  {
    icon: "🕉",
    title: "Energised Before Dispatch",
    desc: "Planetary mantras are chanted over each stone before it leaves our Jaipur atelier.",
  },
  {
    icon: "📦",
    title: "Insured Shipping · 7-Day Returns",
    desc: "Full insurance against loss or damage, plus a no-questions-asked 7-day return window.",
  },
];

function PillarRow({ pillar, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: idx * 0.1, ease: EASE }}
      className="group flex gap-5 py-5 cursor-default"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Icon */}
      <span
        className="flex-shrink-0 text-2xl transition-transform duration-350 group-hover:scale-125 group-hover:rotate-[-6deg]"
        style={{ lineHeight: 1.2 }}
      >
        {pillar.icon}
      </span>

      {/* Text + hairline reveal */}
      <div className="flex-1 relative">
        {/* Gold hairline draws in from left on hover */}
        <span
          className="absolute left-0 top-0 h-full w-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 origin-top rounded-full"
          style={{ background: "var(--gold)", transform: "scaleY(0)", transformOrigin: "top" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scaleY(1)"}
        />
        <p
          className="font-medium mb-1 transition-colors duration-300 group-hover:text-[color:var(--gold)]"
          style={{ color: "var(--ink)", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9rem" }}
        >
          {pillar.title}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {pillar.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Authenticity() {
  return (
    <section className="container mx-auto px-4 py-16 xl:py-24">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

        {/* ── Left: image + floating card ─────────────────────── */}
        <div className="w-full lg:w-1/2 relative">
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/left-ring.png"
                alt="Gemstone jewellery crafted in Johari Bazaar, Jaipur"
                width={700}
                height={500}
                className="w-full h-[280px] md:h-[420px] object-cover transition-transform duration-[900ms] hover:scale-[1.04]"
              />
              {/* Ink overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, oklch(0.19 0.045 265 / 0.4) 0%, transparent 60%)",
                }}
                aria-hidden="true"
              />
            </div>
          </Reveal>

          {/* Floating gold card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
            className="absolute -bottom-6 -right-4 sm:right-4 rounded-xl px-6 py-4 shadow-2xl max-w-[220px]"
            style={{ background: "var(--gold)", color: "var(--gold-foreground)" }}
          >
            <p
              className="text-2xl leading-tight mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              30+ Years
            </p>
            <p className="eyebrow text-[0.6rem]" style={{ opacity: 0.8 }}>
              In Johari Bazaar, Jaipur
            </p>
          </motion.div>
        </div>

        {/* ── Right: heading + pillars ─────────────────────────── */}
        <div className="w-full lg:w-1/2">
          <div className="mb-8">
            <SectionHeading
              eyebrow="Our Promise"
              title="Authenticity You Can Touch"
              copy="We believe you should never have to wonder if your gemstone is real. Every stone we sell is natural, lab-certified, and energised — with paperwork to prove it."
              align="left"
              delay={0.05}
            />
          </div>

          {/* Trust pillars */}
          <div>
            {PILLARS.map((pillar, idx) => (
              <PillarRow key={pillar.title} pillar={pillar} idx={idx} />
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={0.45}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="shimmer-btn"
                style={{
                  background: "var(--ink)",
                  color: "var(--ink-foreground)",
                  borderRadius: "var(--radius)",
                  padding: "0.75rem 2rem",
                }}
              >
                <Link href="#consult">Book Consultation</Link>
              </Button>
              <div className="w-full lg:w-1/3 relative overflow-hidden rounded-2xl">
                <Image
                  src="/right-ring.png"
                  alt="Gemstone pendant"
                  width={400}
                  height={300}
                  className="w-full h-[180px] object-cover rounded-2xl opacity-90"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Bottom three-column strip (kept from original) ──── */}
      <div className="mt-16 flex flex-col lg:flex-row gap-6">
        {/* Left Card */}
        <Reveal delay={0.1} className="w-full lg:w-1/3">
          <div
            className="rounded-2xl p-7 flex flex-col items-center text-center"
            style={{ background: "var(--ink)", color: "var(--ink-foreground)" }}
          >
            <h2
              className="text-xl md:text-2xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              Book Your Gemstone & Consultation
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.75 0.02 265)" }}>
              Connect with expert astrologers to find the perfect gemstone based on your birth chart.
              Accurate, personalised, and 100% certified guidance.
            </p>
            <Button
              asChild
              className="w-full shimmer-btn"
              style={{
                background: "var(--gold)",
                color: "var(--gold-foreground)",
                borderRadius: "var(--radius)",
              }}
            >
              <Link href="#consult">BOOK NOW</Link>
            </Button>
          </div>
        </Reveal>

        {/* Middle: icons */}
        <Reveal delay={0.2} className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl p-6 shadow-sm border h-full">
            <h2 className="text-lg font-semibold text-center mb-4" style={{ fontFamily: "var(--font-sans)" }}>
              Natural, Certified & Ethically Sourced
            </h2>
            <div className="grid grid-cols-3 border-t">
              {[
                { src: "/purity.png", label: "Guarantee of Purity" },
                { src: "/certified.png", label: "100% Certified" },
                { src: "/ethically.png", label: "Ethically Sourced" },
              ].map((item) => (
                <div key={item.label} className="p-4 flex flex-col items-center gap-3 border-r last:border-r-0">
                  <Image src={item.src} alt={item.label} width={48} height={48} />
                  <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right Card */}
        <Reveal delay={0.3} className="w-full lg:w-1/3">
          <div
            className="rounded-2xl p-7 flex flex-col items-center text-center"
            style={{ background: "#A88B7D", color: "white" }}
          >
            <h2
              className="text-xl md:text-2xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              Secure Your Astrological Gem — 100% Natural & Verified
            </h2>
            <p className="text-sm leading-relaxed">
              Handpicked by expert astrologers, each gemstone is lab-certified, ethically sourced,
              and aligned to your unique birth chart.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}