"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    
    // In a real implementation, you would call a Supabase API route here
    // to insert the email into the newsletter_subscribers table
    setTimeout(() => {
      setStatus("success");
      toast.success("Thanks for subscribing!");
      setEmail("");
    }, 1000);
  };

  return (
    <section className="bg-[var(--color-walnut)] py-24 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full border border-white/10 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-cream)] font-bold mb-6">
            Be the First to Know.
          </h2>
          <p className="font-sans text-lg text-white/80 mb-10 leading-relaxed">
            New arrivals, exclusive offers, and interior inspiration — straight to your inbox. Join the Vooh Furnitures community.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white/10 border border-white/20 text-white placeholder:text-white/50 px-6 py-4 rounded-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors font-sans"
            />
            <button 
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="bg-[var(--color-gold)] text-white px-8 py-4 rounded-sm font-sans font-bold hover:bg-[#a38023] transition-colors disabled:opacity-70 whitespace-nowrap"
            >
              {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
