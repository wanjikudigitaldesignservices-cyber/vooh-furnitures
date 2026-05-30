"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/lib/supabase";

// Mock data fallback
const MOCK_CATALOG = [
  { id: "1", name: "Grey Sectional Sofa", slug: "grey-sectional-sofa", price: 145000, original_price: 165000, category: "Living Room", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85&fit=crop"], is_new: true, rating: 4.8 },
  { id: "2", name: "Velvet Accent Chair", slug: "velvet-accent-chair", price: 45000, original_price: null, category: "Living Room", images: ["https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=85&fit=crop"], is_new: false, rating: 4.5 },
  { id: "3", name: "Oak Coffee Table", slug: "oak-coffee-table", price: 32000, original_price: 38000, category: "Living Room", images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85&fit=crop"], is_new: false, rating: 4.7 },
  { id: "5", name: "Upholstered King Bed", slug: "upholstered-king-bed", price: 185000, original_price: 210000, category: "Bedroom", images: ["https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=85&fit=crop"], is_new: false, rating: 4.9 },
  { id: "6", name: "4-Door Wardrobe", slug: "4-door-wardrobe", price: 120000, original_price: null, category: "Bedroom", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&fit=crop"], is_new: true, rating: 4.6 },
  { id: "9", name: "6-Seater Dining Table", slug: "6-seater-dining-table", price: 95000, original_price: 110000, category: "Dining", images: ["https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=85&fit=crop"], is_new: false, rating: 4.8 },
  { id: "12", name: "Executive Desk", slug: "executive-desk", price: 85000, original_price: 95000, category: "Home Office", images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=85&fit=crop"], is_new: true, rating: 4.7 },
];

const CATEGORIES = ["Living Room", "Bedroom", "Dining", "Home Office", "Outdoor", "Décor"];
const BRANCHES = ["Nairobi HQ", "Kisumu", "Mombasa", "Kericho", "Eldoret"];

export default function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [products, setProducts] = useState<any[]>(MOCK_CATALOG);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get("maxPrice")) || 200000);
  const [isNew, setIsNew] = useState<boolean>(searchParams.get("new") === "true");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "featured");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from("products").select("*");
        
        if (selectedCategory) query = query.eq("category", selectedCategory);
        if (isNew) query = query.eq("is_new", true);
        query = query.lte("price", maxPrice);

        // Sorting
        if (sortBy === "price_asc") query = query.order("price", { ascending: true });
        else if (sortBy === "price_desc") query = query.order("price", { ascending: false });
        else if (sortBy === "newest") query = query.order("created_at", { ascending: false });
        else query = query.order("is_featured", { ascending: false }); // Default featured

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          setProducts(data);
        } else {
          // Apply local filtering to mock data if DB fails/empty
          let filtered = [...MOCK_CATALOG];
          if (selectedCategory) filtered = filtered.filter(p => p.category.toLowerCase().replace(" ", "-") === selectedCategory.toLowerCase().replace(" ", "-"));
          if (isNew) filtered = filtered.filter(p => p.is_new);
          filtered = filtered.filter(p => p.price <= maxPrice);
          
          if (sortBy === "price_asc") filtered.sort((a, b) => a.price - b.price);
          else if (sortBy === "price_desc") filtered.sort((a, b) => b.price - a.price);
          
          setProducts(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, maxPrice, isNew, sortBy, supabase]);

  // Sync state to URL
  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (cat: string) => {
    const newCat = selectedCategory === cat ? "" : cat;
    setSelectedCategory(newCat);
    updateUrlParams("category", newCat);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setIsMobileFiltersOpen(true)}
        className="md:hidden flex items-center justify-center gap-2 bg-white border border-[var(--color-border-accent)] py-3 rounded-sm font-sans font-bold"
      >
        <Filter className="w-4 h-4" /> Filters & Sort
      </button>

      {/* Sidebar Filters */}
      <aside className={`
        fixed inset-0 z-50 bg-white p-6 overflow-y-auto transform transition-transform duration-300 md:relative md:transform-none md:z-0 md:bg-transparent md:p-0 md:w-64 flex-shrink-0
        ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="flex justify-between items-center md:hidden mb-8">
          <h2 className="font-display text-2xl font-bold text-[var(--color-walnut)]">Filters</h2>
          <button onClick={() => setIsMobileFiltersOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
        </div>

        <div className="space-y-8">
          {/* Categories */}
          <div>
            <h3 className="font-sans font-bold text-[var(--color-charcoal)] mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Category
            </h3>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const catSlug = cat.toLowerCase().replace(" ", "-");
                return (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${selectedCategory === catSlug ? 'bg-[var(--color-walnut)] border-[var(--color-walnut)]' : 'border-gray-300 group-hover:border-[var(--color-walnut)]'}`}>
                      {selectedCategory === catSlug && <div className="w-2 h-2 bg-white rounded-[1px]"></div>}
                    </div>
                    <span className="font-sans text-sm text-gray-700">{cat}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-sans font-bold text-[var(--color-charcoal)] mb-4">Max Price (KES)</h3>
            <input 
              type="range" 
              min="10000" 
              max="200000" 
              step="5000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                updateUrlParams("maxPrice", e.target.value);
              }}
              className="w-full accent-[var(--color-walnut)]"
            />
            <div className="flex justify-between font-mono text-xs text-gray-500 mt-2">
              <span>KES 0</span>
              <span>KES {maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Toggles */}
          <div>
            <h3 className="font-sans font-bold text-[var(--color-charcoal)] mb-4">Other</h3>
            <label className="flex items-center gap-3 cursor-pointer group mb-3">
              <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${isNew ? 'bg-[var(--color-walnut)] border-[var(--color-walnut)]' : 'border-gray-300 group-hover:border-[var(--color-walnut)]'}`}>
                {isNew && <div className="w-2 h-2 bg-white rounded-[1px]"></div>}
              </div>
              <span className="font-sans text-sm text-gray-700">New Arrivals Only</span>
              <input type="checkbox" className="hidden" checked={isNew} onChange={(e) => {
                setIsNew(e.target.checked);
                updateUrlParams("new", e.target.checked ? "true" : "");
              }}/>
            </label>
          </div>
          
          <button 
            className="w-full bg-[var(--color-walnut)] text-white py-3 rounded-sm font-bold md:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            Show Results
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-sm border border-[var(--color-border-accent)]">
          <p className="font-sans text-sm text-gray-500">
            Showing <strong className="text-[var(--color-charcoal)]">{products.length}</strong> products
          </p>
          <div className="flex items-center gap-3">
            <label className="font-sans text-sm text-gray-500">Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateUrlParams("sort", e.target.value);
              }}
              className="font-sans text-sm border-none bg-transparent focus:ring-0 font-bold text-[var(--color-charcoal)] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/5] mb-4 rounded-sm"></div>
                <div className="h-4 bg-gray-200 w-1/3 mb-2 rounded-sm"></div>
                <div className="h-6 bg-gray-200 w-3/4 mb-2 rounded-sm"></div>
                <div className="h-5 bg-gray-200 w-1/2 rounded-sm"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-sm border border-[var(--color-border-accent)]">
            <h3 className="font-display text-2xl font-bold text-[var(--color-walnut)] mb-2">No products found</h3>
            <p className="font-sans text-gray-500 mb-6">Try adjusting your filters or search criteria.</p>
            <button 
              onClick={() => router.push('/shop')}
              className="border border-[var(--color-walnut)] text-[var(--color-walnut)] px-6 py-2 rounded-sm hover:bg-black/5"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
