"use client";

import { motion } from "motion/react";

/** Global motion signature */
const EASE = [0.22, 1, 0.36, 1];

/**
 * Reveal — fade + slide into view, once only.
 */
export function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealText — splits on spaces, staggers each word in with opacity + y + blur.
 */
export function RevealText({ text, delay = 0, className = "" }) {
  const words = text.split(" ");

  return (
    <span className={`inline ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "0.4em", filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.055,
            ease: EASE,
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * SectionHeading — gold eyebrow flanked by hairlines, display h2, muted copy.
 * tone: "light" (for ink backgrounds) | "dark" (default, for light backgrounds)
 */
export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "center",
  tone = "dark",
  delay = 0,
}) {
  const isLight = tone === "light";
  const textAlign =
    align === "center"
      ? "text-center items-center"
      : align === "left"
      ? "text-left items-start"
      : "text-right items-end";

  return (
    <div className={`flex flex-col gap-4 ${textAlign}`}>
      {/* Eyebrow with flanking hairlines */}
      <Reveal delay={delay}>
        <div className="flex items-center gap-4 w-full">
          <span className="gold-rule" />
          <span
            className="eyebrow whitespace-nowrap"
            style={{ color: "var(--gold)" }}
          >
            {eyebrow}
          </span>
          <span className="gold-rule" />
        </div>
      </Reveal>

      {/* Title */}
      <h2
        className="text-4xl sm:text-5xl md:text-[3.4rem] leading-tight"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          color: isLight ? "var(--ink-foreground)" : "var(--ink)",
        }}
      >
        <RevealText text={title} delay={delay + 0.1} />
      </h2>

      {/* Optional copy */}
      {copy && (
        <Reveal delay={delay + 0.25}>
          <p
            className="text-base md:text-lg max-w-xl leading-relaxed"
            style={{
              color: isLight
                ? "oklch(0.75 0.02 265)"
                : "var(--muted-foreground)",
            }}
          >
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}
