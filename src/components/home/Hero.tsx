"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, MapPin, RefreshCw } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] md:h-screen flex flex-col md:flex-row pt-[104px] md:pt-0 overflow-hidden">
      
      {/* Left Content */}
      <div className="w-full md:w-[55%] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 md:py-0 bg-[var(--color-cream)] z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="font-sans text-[0.7rem] md:text-xs font-bold tracking-[0.2em] text-[var(--color-sage)] uppercase mb-6 block">
            5 Showrooms Across Kenya
          </span>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5rem] leading-[1.1] text-[var(--color-walnut)] font-bold mb-6">
            Furniture That <br /> Tells Your Story.
          </h1>
          
          <p className="font-sans text-base md:text-lg text-[var(--color-charcoal)] opacity-80 mb-10 leading-relaxed">
            From our Nairobi HQ to Kisumu, Mombasa, Kericho, and Eldoret — Vooh Furnitures brings craftsmanship and comfort to every home and office.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link 
              href="/shop" 
              className="bg-[var(--color-walnut)] text-[var(--color-cream)] font-sans text-base px-8 py-4 text-center rounded-sm hover:bg-[var(--color-charcoal)] transition-colors shadow-lg"
            >
              Shop Now
            </Link>
            <Link 
              href="/branches" 
              className="border border-[var(--color-walnut)] text-[var(--color-walnut)] font-sans text-base px-8 py-4 text-center rounded-sm hover:bg-black/5 transition-colors"
            >
              Explore Showrooms
            </Link>
          </div>

          {/* Trust Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 border-t border-[var(--color-border-accent)]">
            <div className="flex items-center gap-3 text-[var(--color-charcoal)]">
              <Truck className="w-5 h-5 text-[var(--color-gold)]" />
              <span className="font-sans text-xs font-medium uppercase tracking-wider">Free Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--color-charcoal)]">
              <ShieldCheck className="w-5 h-5 text-[var(--color-gold)]" />
              <span className="font-sans text-xs font-medium uppercase tracking-wider">3-Year Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--color-charcoal)]">
              <MapPin className="w-5 h-5 text-[var(--color-gold)]" />
              <span className="font-sans text-xs font-medium uppercase tracking-wider">5 Showrooms</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--color-charcoal)]">
              <RefreshCw className="w-5 h-5 text-[var(--color-gold)]" />
              <span className="font-sans text-xs font-medium uppercase tracking-wider">Easy Returns</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Image (Ken Burns Effect) */}
      <div className="w-full md:w-[45%] h-[50vh] md:h-full relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.05] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=90&fit=crop"
            alt="Luxury modern living room with grey sectional sofa"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </motion.div>

        {/* Floating Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-10 left-[-40px] md:left-[-50px] z-20"
        >
          <Link href="/shop?new=true" className="bg-[var(--color-gold)] text-white px-6 py-3 rounded-full font-sans text-sm font-bold shadow-2xl flex items-center gap-2 hover:pr-4 hover:pl-8 transition-all group">
            New Arrivals <span className="group-hover:translate-x-1 transition-transform">↗</span>
          </Link>
        </motion.div>
      </div>
      
    </section>
  );
}
