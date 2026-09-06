"use client";

const CLAIMS = [
  "100% Natural & Untreated",
  "Lab Certified — IGI / GIA / GGL",
  "Energised with Vedic Mantras",
  "30+ Years in Johari Bazaar, Jaipur",
  "Insured Shipping Across India",
  "7-Day No-Questions Return",
  "Free Astrologer Consultation",
  "2,500+ Chart Readings",
  "Custom Ratti Sizing",
  "Ethically Sourced Gemstones",
];

// Duplicate list so the marquee loops seamlessly
const DOUBLE = [...CLAIMS, ...CLAIMS];

export default function TrustMarquee() {
  return (
    <section
      className="relative py-4 overflow-hidden"
      aria-label="Trust claims"
      style={{
        background: "var(--paper)",
        borderTop: "1px solid var(--gold)",
        borderBottom: "1px solid var(--gold)",
      }}
    >
      {/* Left edge fade */}
      <div
        className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--paper), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Right edge fade */}
      <div
        className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, var(--paper), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Scrolling track */}
      <div
        className="animate-marquee flex items-center gap-0 whitespace-nowrap"
        aria-hidden="true"
        style={{ width: "max-content" }}
      >
        {DOUBLE.map((claim, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <span
              className="eyebrow text-[0.65rem]"
              style={{ color: "var(--ink-soft)" }}
            >
              {claim}
            </span>
            {/* Rotated gold diamond separator */}
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "5px",
                height: "5px",
                background: "var(--gold)",
                transform: "rotate(45deg)",
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
