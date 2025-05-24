import Image from "next/image"
import { Clock } from "lucide-react"

function Blogs() {
    const blogs = [
        {
            id: 1,
            title: "How to Style Gemstone Jewelry for Every Occasion",
            description:
                "Your gemstone jewelry is more than just an accessory—it's a blend of natural beauty and personal meaning...",
            image: "/blog-img1.png",
            date: "Apr 10, 2025",
            readTime: "2 min read",
        },
        {
            id: 2,
            title: "How to Choose the Right Gemstone for You",
            description:
                "Your gemstone jewelry is more than just an accessory—it's a blend of natural beauty and personal meaning...",
            image: "/blog-img2.png",
            date: "Apr 10, 2025",
            readTime: "2 min read",
        },
        {
            id: 3,
            title: "The Ultimate Guide to Caring for Your Gemstone...",
            description:
                "Your gemstone jewelry is more than just an accessory—it's a blend of natural beauty and personal meaning...",
            image: "/blog-img3.png",
            date: "Apr 10, 2025",
            readTime: "2 min read",
        },
    ]

    return (
        <section className="container mx-auto">
            <div className="text-center mb-12 mt-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 ">Latest Blogs</h1>
                <p className="text-gray-600 text-lg">Your Guide to All Things Style, Wellness & Gemstones</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <article
                        key={blog.id}
                        className="group cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="relative h-64 w-full overflow-hidden">
                            <Image
                                src={blog.image || "/placeholder.svg"}
                                alt={blog.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <span>{blog.date}</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{blog.readTime}</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h2>
                            <p className="text-gray-600 line-clamp-3">{blog.description}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Blogs
