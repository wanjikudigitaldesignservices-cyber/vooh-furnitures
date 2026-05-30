"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Branches", href: "/branches" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Initial sync
    setCartCount(useCartStore.getState().items.reduce((acc, item) => acc + item.qty, 0));
    
    // Subscribe to changes
    const unsub = useCartStore.subscribe((state) => {
      setCartCount(state.items.reduce((acc, item) => acc + item.qty, 0));
    });
    
    return unsub;
  }, []);

  const openCart = () => useCartStore.getState().openDrawer();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[var(--color-warm-white)] shadow-sm py-4"
            : "bg-[var(--color-cream)] py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-[var(--color-walnut)] leading-none">
              VOOH
            </span>
            <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-charcoal)] mt-1">
              Furnitures
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-sans text-sm text-[var(--color-charcoal)] hover:text-[var(--color-walnut)] transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-walnut)] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <button className="text-[var(--color-charcoal)] hover:text-[var(--color-walnut)] transition-colors hidden md:block">
              <Search className="w-5 h-5" />
            </button>
            
            <button 
              onClick={openCart}
              className="text-[var(--color-charcoal)] hover:text-[var(--color-walnut)] transition-colors relative group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-white text-[0.65rem] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <Link
              href="/branches"
              className="hidden md:block bg-[var(--color-walnut)] text-[var(--color-cream)] font-sans text-sm px-6 py-2.5 rounded-sm hover:bg-[var(--color-charcoal)] transition-colors"
            >
              Visit a Showroom
            </Link>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-[var(--color-charcoal)]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[var(--color-warm-white)] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-accent)]">
              <span className="font-display text-2xl font-bold text-[var(--color-walnut)]">
                VOOH
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-8 h-8 text-[var(--color-charcoal)]" />
              </button>
            </div>
            
            <div className="flex flex-col p-8 space-y-6 flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-display text-4xl text-[var(--color-charcoal)] hover:text-[var(--color-walnut)]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="p-8 border-t border-[var(--color-border-accent)]">
              <Link
                href="/branches"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center bg-[var(--color-walnut)] text-[var(--color-cream)] font-sans text-lg px-6 py-4 rounded-sm"
              >
                Visit a Showroom
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
