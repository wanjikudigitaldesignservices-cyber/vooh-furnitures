"use client";
import { useState } from "react";
import { Check, X as XIcon, Truck, Store, MessageCircle, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

const BRANCHES = ["Nairobi HQ", "Kisumu", "Mombasa", "Kericho", "Eldoret"];

export default function ProductActions({ product }: { product: any }) {
  const [qty, setQty] = useState(1);
  const [checkBranch, setCheckBranch] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"home" | "pickup">("home");
  
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      qty,
      image: product.images[0],
    });
    toast.success(`${product.name} added to cart!`);
    openDrawer();
  };

  const getStockStatus = () => {
    if (!checkBranch || !product.branch_stock) return null;
    const stock = product.branch_stock[checkBranch] || 0;
    if (stock > 0) {
      return (
        <div className="flex items-center gap-2 mt-2 text-[var(--color-sage)] font-sans text-sm">
          <Check className="w-4 h-4" /> In Stock ({stock} units available)
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 mt-2 text-red-500 font-sans text-sm">
        <XIcon className="w-4 h-4" /> Out of Stock at {checkBranch}
      </div>
    );
  };

  const whatsappMsg = `Hi Vooh Furnitures! I'm interested in the ${product.name} (KES ${product.price}). Is it available?`;

  return (
    <div className="space-y-8">
      {/* Branch Checker */}
      <div className="bg-white p-4 border border-[var(--color-border-accent)] rounded-sm">
        <label className="block font-sans text-sm font-bold text-[var(--color-charcoal)] mb-2">
          Check branch availability:
        </label>
        <select 
          className="w-full font-sans text-sm border-gray-300 rounded-sm focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]"
          value={checkBranch}
          onChange={(e) => setCheckBranch(e.target.value)}
        >
          <option value="">Select a branch...</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {getStockStatus()}
      </div>

      {/* Delivery Toggle */}
      <div className="flex gap-4">
        <button 
          onClick={() => setDeliveryMethod("home")}
          className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 border rounded-sm transition-colors ${deliveryMethod === "home" ? 'border-[var(--color-walnut)] bg-[var(--color-cream)]' : 'border-gray-200'}`}
        >
          <Truck className={`w-6 h-6 ${deliveryMethod === "home" ? 'text-[var(--color-walnut)]' : 'text-gray-400'}`} />
          <span className="font-sans text-sm font-bold text-center">Home Delivery</span>
        </button>
        <button 
          onClick={() => setDeliveryMethod("pickup")}
          className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 border rounded-sm transition-colors ${deliveryMethod === "pickup" ? 'border-[var(--color-walnut)] bg-[var(--color-cream)]' : 'border-gray-200'}`}
        >
          <Store className={`w-6 h-6 ${deliveryMethod === "pickup" ? 'text-[var(--color-walnut)]' : 'text-gray-400'}`} />
          <span className="font-sans text-sm font-bold text-center">Pick Up In-Store</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-sm h-14">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
          <span className="w-12 text-center font-mono">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="flex-grow h-14 bg-[var(--color-walnut)] text-[var(--color-cream)] font-sans font-bold rounded-sm hover:bg-[var(--color-charcoal)] transition-colors shadow-lg"
        >
          Add to Cart
        </button>
      </div>

      <a 
        href={`https://wa.me/254700000001?text=${encodeURIComponent(whatsappMsg)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 h-14 border-2 border-[#25D366] text-[#25D366] font-sans font-bold rounded-sm hover:bg-[#25D366] hover:text-white transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        WhatsApp Enquiry
      </a>
    </div>
  );
}
