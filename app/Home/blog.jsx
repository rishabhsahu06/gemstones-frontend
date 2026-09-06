import Image from "next/image";
import { Clock } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const blogs = [
  {
    id: 1,
    title: "How to Style Gemstone Jewelry for Every Occasion",
    description:
      "Your gemstone jewelry is more than just an accessory — it's a blend of natural beauty and personal meaning...",
    image: "/blog-img1.png",
    date: "Apr 10, 2025",
    readTime: "2 min read",
  },
  {
    id: 2,
    title: "How to Choose the Right Gemstone for You",
    description:
      "Your gemstone jewelry is more than just an accessory — it's a blend of natural beauty and personal meaning...",
    image: "/blog-img2.png",
    date: "Apr 10, 2025",
    readTime: "2 min read",
  },
  {
    id: 3,
    title: "The Ultimate Guide to Caring for Your Gemstone",
    description:
      "Your gemstone jewelry is more than just an accessory — it's a blend of natural beauty and personal meaning...",
    image: "/blog-img3.png",
    date: "Apr 10, 2025",
    readTime: "2 min read",
  },
];

export default function Blogs() {
  return (
    <section className="container mx-auto px-4 py-16 xl:py-24">
      <div className="text-center mb-14">
        <SectionHeading
          eyebrow="From Our Journal"
          title="Latest Blogs"
          copy="Your guide to all things style, wellness & gemstones."
          align="center"
          delay={0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, idx) => (
          <Reveal key={blog.id} delay={idx * 0.1}>
            <article
              className="group cursor-pointer overflow-hidden rounded-sm shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                border: "1px solid var(--border)",
                background: "var(--card)",
              }}
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={blog.image || "/placeholder.svg"}
                  alt={blog.title}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.07]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Ink overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "oklch(0.19 0.045 265 / 0.25)" }}
                  aria-hidden="true"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
                  <span>{blog.date}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
                <h2
                  className="text-xl mb-3 line-clamp-2 leading-snug transition-colors duration-300 group-hover:text-[color:var(--gold)]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--ink)" }}
                >
                  {blog.title}
                </h2>
                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--muted-foreground)" }}>
                  {blog.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
