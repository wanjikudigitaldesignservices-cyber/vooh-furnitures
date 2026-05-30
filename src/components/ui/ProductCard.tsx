"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price: number | null;
    category: string;
    images: string[];
    is_new: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const addItem = useCartStore.getState().addItem;
    
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.images[0],
    });
    
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group block relative">
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4 rounded-sm">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-[var(--color-sage)] text-white text-[0.65rem] font-bold tracking-wider uppercase px-2 py-1 rounded-sm">
              New
            </span>
          )}
          {product.original_price && (
            <span className="bg-[var(--color-gold)] text-white text-[0.65rem] font-bold tracking-wider uppercase px-2 py-1 rounded-sm">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Icon */}
        <button className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4" />
        </button>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[var(--color-walnut)] text-[var(--color-cream)] font-sans font-medium text-sm py-3 rounded-sm shadow-lg hover:bg-[var(--color-charcoal)] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-xs font-sans text-gray-500 uppercase tracking-widest">{product.category}</div>
        <h3 className="font-display text-lg text-[var(--color-charcoal)] font-bold">{product.name}</h3>
        <div className="flex items-center gap-3 font-mono">
          <span className="text-[var(--color-walnut)] font-bold">KES {product.price.toLocaleString()}</span>
          {product.original_price && (
            <span className="text-gray-400 line-through text-sm">KES {product.original_price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
