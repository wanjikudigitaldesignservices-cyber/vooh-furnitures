import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductActions from "@/components/shop/ProductActions";
import ProductAccordion from "@/components/shop/ProductAccordion";
import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/lib/supabase";

// Mock data fallback for when DB is not seeded
const MOCK_DB: Record<string, any> = {
  "grey-sectional-sofa": {
    id: "1", name: "Grey Sectional Sofa", slug: "grey-sectional-sofa", description: "Premium L-shaped grey sectional sofa perfect for modern living rooms.", price: 145000, original_price: 165000, category: "Living Room", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85&fit=crop", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85&fit=crop"], branch_stock: {"Nairobi HQ": 5, "Mombasa": 2}, rating: 4.8, review_count: 24, is_new: true
  },
  "executive-desk": {
    id: "4", name: "Executive Desk", slug: "executive-desk", description: "Premium executive desk perfect for home offices.", price: 85000, original_price: 95000, category: "Home Office", images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=85&fit=crop"], branch_stock: {"Nairobi HQ": 6}, rating: 4.9, review_count: 12, is_new: true
  }
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const supabase = createClient();
  let product = MOCK_DB[slug];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
      
    if (!error && data) {
      product = data;
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }

  if (!product) {
    notFound();
  }

  // Fetch related products
  let relatedProducts: any[] = [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, price, original_price, category, images, is_new")
      .eq("category", product.category)
      .neq("slug", slug)
      .limit(4);
    if (!error && data) relatedProducts = data;
  } catch (e) {}

  return (
    <div className="pt-[104px] min-h-screen bg-[var(--color-cream)] pb-24">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-xs text-gray-500 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-[var(--color-walnut)]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[var(--color-walnut)]">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category.toLowerCase().replace(" ", "-")}`} className="hover:text-[var(--color-walnut)]">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--color-charcoal)] font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          
          {/* Left: Gallery */}
          <div>
            <ProductGallery images={product.images} />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl md:text-5xl text-[var(--color-charcoal)] font-bold mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.rating || 5) ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="font-sans text-sm text-gray-500">{product.review_count || 0} reviews</span>
            </div>

            <div className="flex items-center gap-4 font-mono mb-8 border-b border-[var(--color-border-accent)] pb-8">
              <span className="text-3xl font-bold text-[var(--color-walnut)]">KES {product.price.toLocaleString()}</span>
              {product.original_price && (
                <span className="text-xl text-gray-400 line-through">KES {product.original_price.toLocaleString()}</span>
              )}
            </div>

            <p className="font-sans text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <ProductActions product={product} />
            
            <div className="mt-8">
              <ProductAccordion />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="mb-12">
              <span className="font-sans text-[0.7rem] font-bold tracking-[0.2em] text-[var(--color-sage)] uppercase mb-4 block">
                Complete the Look
              </span>
              <h2 className="font-display text-3xl text-[var(--color-walnut)] font-bold">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
