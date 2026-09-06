"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/site-data";
import { SectionHeading, Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1];

/** Each FAQ item is its own component — fixes the invalid hook-in-loop bug */
function FAQItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div
      className="overflow-hidden transition-colors duration-300"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <button
        onClick={() => onToggle(item.id)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors duration-300"
        aria-expanded={isOpen}
      >
        <h3
          className="text-base md:text-lg pr-4 transition-colors duration-300"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            color: isOpen ? "var(--gold)" : "var(--ink)",
          }}
        >
          {item.question}
        </h3>

        <ChevronDown
          className="flex-shrink-0 w-5 h-5 transition-all duration-350"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: isOpen ? "var(--gold)" : "var(--muted-foreground)",
            transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </button>

      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p
          className="pb-5 text-sm md:text-base leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState([1]);

  const toggle = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="container mx-auto px-4 py-16 xl:py-24">
      {/* Header */}
      <div className="text-center mb-14">
        <SectionHeading
          eyebrow="Have Questions?"
          title="Frequently Asked Questions"
          copy="From certification to shipping — everything you need to know before you buy."
          align="center"
          delay={0}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* FAQ image */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative rounded-sm overflow-hidden shadow-xl">
            <img
              src="/faq-img.png"
              alt="Dr. Sunita Dubey — Gemstone Expert"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>

        {/* Accordion */}
        <div className="order-1 lg:order-2">
          <Reveal delay={0.1}>
            <div>
              {faqs.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={openItems.includes(item.id)}
                  onToggle={toggle}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
