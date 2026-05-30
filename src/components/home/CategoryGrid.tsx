import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85&fit=crop",
    className: "col-span-1 md:col-span-2 row-span-1 h-[300px] md:h-[400px]",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=85&fit=crop",
    className: "col-span-1 md:col-span-2 row-span-1 h-[300px] md:h-[400px]",
  },
  {
    name: "Dining",
    slug: "dining",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=85&fit=crop",
    className: "col-span-1 h-[250px] md:h-[300px]",
  },
  {
    name: "Home Office",
    slug: "home-office",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=85&fit=crop",
    className: "col-span-1 h-[250px] md:h-[300px]",
  },
  {
    name: "Outdoor",
    slug: "outdoor",
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&q=85&fit=crop",
    className: "col-span-1 h-[250px] md:h-[300px]",
  },
  {
    name: "Décor",
    slug: "decor",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=85&fit=crop",
    className: "col-span-1 h-[250px] md:h-[300px]",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12">
          <span className="font-sans text-[0.7rem] font-bold tracking-[0.2em] text-[var(--color-sage)] uppercase mb-4 block">
            Shop By Room
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-walnut)] font-bold">
            Find Your Perfect Fit.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className={`group relative overflow-hidden rounded-sm ${category.className}`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <h3 className="font-display text-2xl md:text-3xl text-white font-bold">
                  {category.name}
                </h3>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
