"use client";

import Image from "next/image";
import Link from "next/link";

export default function JewelleryBanner() {
  return (
    <div className="relative w-full md:h-[400px] h-[200px] overflow-hidden">
      {/* Background banner image */}
      <Image
        src="/banner.png"
        alt="Gemstone jewellery banner"
        fill
        className="object-cover"
        priority
      />

      {/* Ink overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.19 0.045 265 / 0.45)" }}
        aria-hidden="true"
      />

      {/* Centred editorial text */}
      <div className="absolute z-10 inset-0 flex flex-col items-center justify-center text-center px-6">
        <p
          className="eyebrow text-[0.6rem] mb-4"
          style={{ color: "var(--gold)" }}
        >
          Handcrafted in 18k &amp; 22k Gold
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl mb-8 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            color: "var(--ink-foreground)",
          }}
        >
          Gemstone Jewellery
        </h2>
        <Link
          href="/gemstones-jewellery"
          className="inline-flex px-8 py-3.5 rounded-sm eyebrow text-[0.65rem] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          style={{
            border: "1px solid rgba(255,255,255,0.55)",
            color: "var(--ink-foreground)",
          }}
        >
          EXPLORE
        </Link>
      </div>
    </div>
  );
}
