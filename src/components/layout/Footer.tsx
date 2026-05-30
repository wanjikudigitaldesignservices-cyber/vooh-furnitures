"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  
  return (
    <footer className="bg-[var(--color-charcoal)] text-[var(--color-cream)] pt-20 pb-10 border-t-4 border-[var(--color-gold)]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex flex-col">
              <span className="font-display text-3xl font-bold text-[var(--color-gold)] leading-none">
                VOOH
              </span>
              <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-white/70 mt-1">
                Furnitures
              </span>
            </Link>
            <p className="font-sans text-sm text-white/70 leading-relaxed max-w-xs">
              Crafted for How You Live. Premium furniture inspired by Kenyan aesthetics, built to last a lifetime.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors font-sans text-xs">IG</a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors font-sans text-xs">FB</a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors font-sans text-xs">YT</a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 font-sans text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-[var(--color-gold)] transition-colors">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-[var(--color-gold)] transition-colors">About Us</Link></li>
              <li><Link href="/branches" className="hover:text-[var(--color-gold)] transition-colors">Our Branches</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--color-gold)] transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-gold)] transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Showrooms */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Our Showrooms</h4>
            <ul className="space-y-4 font-sans text-sm text-white/70">
              <li className="flex justify-between items-center group">
                <span className="group-hover:text-[var(--color-gold)] transition-colors">Nairobi (HQ)</span>
                <span className="font-mono text-xs">+254 700 000 001</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="group-hover:text-[var(--color-gold)] transition-colors">Kisumu</span>
                <span className="font-mono text-xs">+254 700 000 002</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="group-hover:text-[var(--color-gold)] transition-colors">Mombasa</span>
                <span className="font-mono text-xs">+254 700 000 003</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="group-hover:text-[var(--color-gold)] transition-colors">Kericho</span>
                <span className="font-mono text-xs">+254 700 000 004</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="group-hover:text-[var(--color-gold)] transition-colors">Eldoret</span>
                <span className="font-mono text-xs">+254 700 000 005</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Contact Us</h4>
            <div className="space-y-4 font-sans text-sm text-white/70">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 text-[var(--color-gold)]" />
                <p>Westlands Commercial Centre,<br />Waiyaki Way, Nairobi</p>
              </div>
              <p>
                <a href="mailto:hello@voohfurnitures.co.ke" className="hover:text-[var(--color-gold)] transition-colors">
                  hello@voohfurnitures.co.ke
                </a>
              </p>
              <a 
                href="https://wa.me/254700000001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-sm font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-white/50 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Vooh Furnitures. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
