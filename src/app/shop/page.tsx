import { Suspense } from "react";
import ShopContent from "@/components/shop/ShopContent";

export const metadata = {
  title: "Shop All Furniture | Vooh Furnitures",
  description: "Browse our complete collection of premium living room, bedroom, dining, and home office furniture.",
};

export default function ShopPage() {
  return (
    <div className="pt-24 min-h-screen bg-[var(--color-cream)]">
      <div className="container mx-auto px-6 md:px-12 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-walnut)] font-bold mb-4">
            Shop All Furniture
          </h1>
          <p className="font-sans text-gray-600 max-w-2xl">
            Explore our curated collection of premium furniture designed for Kenyan homes and offices.
          </p>
        </div>

        {/* Suspense is required when using useSearchParams in client components */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading collection...</div>}>
          <ShopContent />
        </Suspense>
      </div>
    </div>
  );
}
