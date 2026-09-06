import Image from "next/image";
import Link from "next/link";
import { purposes } from "@/lib/site-data";
import { SectionHeading, Reveal } from "./Reveal";

function PurposeTile({ purpose, idx }) {
  return (
    <div
      className="group relative flex flex-col items-center gap-4 p-6 rounded-sm cursor-default transition-all duration-350"
      style={{
        border: "1px solid var(--border)",
        transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "oklch(0.74 0.13 84 / 0.12)";
        e.currentTarget.style.borderColor = "var(--gold)";
        e.currentTarget.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Planetary glyph */}
      <span
        className="text-3xl transition-transform duration-350 group-hover:scale-125"
        style={{ color: "var(--gold)", transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        aria-hidden="true"
      >
        {purpose.glyph}
      </span>

      {/* Image */}
      <div className="relative w-16 h-16 overflow-hidden rounded-full" style={{ background: "var(--paper)" }}>
        <Image
          src={purpose.image}
          alt={purpose.title}
          fill
          loading="lazy"
          className="object-contain p-2"
        />
      </div>

      {/* Title */}
      <h3
        className="text-lg transition-colors duration-300 group-hover:text-[color:var(--gold)]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--ink-foreground)" }}
      >
        {purpose.title}
      </h3>

      {/* Stone */}
      <p
        className="eyebrow text-[0.55rem] text-center"
        style={{ color: "var(--gold-soft)" }}
      >
        {purpose.stone}
      </p>
    </div>
  );
}

export default function PurposefulGemstone() {
  return (
    <section
      id="purpose"
      className="py-16 xl:py-24"
      style={{ background: "var(--ink)", position: "relative", overflow: "hidden" }}
    >
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, oklch(0.74 0.13 84 / 0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <SectionHeading
            eyebrow="Purposeful Gemstones"
            title="Let Every Stone Reflect Your Strength"
            copy="Choose a gemstone aligned with your life goal — our astrologers will confirm the right stone for your chart."
            align="center"
            tone="light"
            delay={0}
          />
        </div>

        {/* 6-tile grid */}
        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {purposes.map((purpose, idx) => (
              <PurposeTile key={purpose.id} purpose={purpose} idx={idx} />
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="#consult"
              className="inline-flex px-8 py-3.5 rounded-sm eyebrow text-[0.65rem] transition-all duration-300 hover:-translate-y-0.5 shimmer-btn"
              style={{
                background: "var(--gold)",
                color: "var(--gold-foreground)",
              }}
            >
              Get My Stone Recommendation
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}