import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/lib/supabase";

// Fallback mock data in case DB is not seeded yet
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Grey Sectional Sofa",
    slug: "grey-sectional-sofa",
    price: 145000,
    original_price: 165000,
    category: "Living Room",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85&fit=crop"],
    is_new: true,
  },
  {
    id: "2",
    name: "Upholstered King Bed",
    slug: "upholstered-king-bed",
    price: 185000,
    original_price: 210000,
    category: "Bedroom",
    images: ["https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=85&fit=crop"],
    is_new: false,
  },
  {
    id: "3",
    name: "6-Seater Dining Table",
    slug: "6-seater-dining-table",
    price: 95000,
    original_price: 110000,
    category: "Dining",
    images: ["https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=85&fit=crop"],
    is_new: false,
  },
  {
    id: "4",
    name: "Executive Desk",
    slug: "executive-desk",
    price: 85000,
    original_price: 95000,
    category: "Home Office",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=85&fit=crop"],
    is_new: true,
  }
];

export default async function FeaturedProducts() {
  const supabase = createClient();
  let products = MOCK_PRODUCTS;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, price, original_price, category, images, is_new")
      .eq("is_featured", true)
      .limit(4);
      
    if (!error && data && data.length > 0) {
      products = data;
    }
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
  }

  return (
    <section className="py-24 bg-[var(--color-warm-white)]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="font-sans text-[0.7rem] font-bold tracking-[0.2em] text-[var(--color-sage)] uppercase mb-4 block">
              Editor's Picks
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-[var(--color-walnut)] font-bold">
              Handpicked for Kenyan Homes.
            </h2>
          </div>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 pb-8 md:pb-0 hide-scrollbar snap-x snap-mandatory">
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
