"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return <CartDrawerContent />;
}

function CartDrawerContent() {
  const { isDrawerOpen, closeDrawer, items, removeItem, updateQuantity } = useCartStore();
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[450px] bg-[var(--color-warm-white)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-accent)]">
              <h2 className="font-display text-2xl font-bold text-[var(--color-walnut)]">
                Your Cart ({itemCount})
              </h2>
              <button 
                onClick={closeDrawer}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-charcoal)]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-[var(--color-cream)] rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-[var(--color-walnut)] opacity-50" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Your cart is empty</h3>
                    <p className="font-sans text-sm text-gray-500">Looks like you haven't added anything yet.</p>
                  </div>
                  <button 
                    onClick={closeDrawer}
                    className="bg-[var(--color-walnut)] text-[var(--color-cream)] px-8 py-3 rounded-sm font-sans font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex gap-4 bg-white p-3 rounded-md border border-[var(--color-border-accent)]">
                      <div className="relative w-24 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-bold text-sm line-clamp-2 pr-2">{item.name}</h4>
                          <button onClick={() => removeItem(item.product_id)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="font-mono text-sm text-[var(--color-walnut)] font-bold">
                          KES {item.price.toLocaleString()}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-[var(--color-border-accent)] rounded-sm">
                            <button 
                              onClick={() => updateQuantity(item.product_id, Math.max(1, item.qty - 1))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-mono text-xs">{item.qty}</span>
                            <button 
                              onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-border-accent)] p-6 bg-white space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-sans text-gray-500">Subtotal</span>
                  <span className="font-mono font-bold">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-sans text-gray-500">Delivery</span>
                  <span className="font-sans text-sm italic text-gray-400">Calculated at checkout</span>
                </div>
                <div className="pt-4 border-t border-[var(--color-border-accent)] flex justify-between items-center">
                  <span className="font-display font-bold text-lg">Total</span>
                  <span className="font-mono font-bold text-xl text-[var(--color-walnut)]">KES {subtotal.toLocaleString()}</span>
                </div>
                
                <Link 
                  href="/checkout"
                  onClick={closeDrawer}
                  className="block w-full bg-[var(--color-walnut)] text-[var(--color-cream)] text-center py-4 rounded-sm font-sans font-bold hover:bg-[var(--color-charcoal)] transition-colors mt-4"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
