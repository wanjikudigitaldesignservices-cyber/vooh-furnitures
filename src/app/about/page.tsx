import Image from "next/image";
import { Hammer, Globe, Heart } from "lucide-react";

export const metadata = {
  title: "About Us | Vooh Furnitures",
  description: "Built in Kenya. Built to Last. Learn about Vooh Furnitures and our mission to provide premium furniture for every Kenyan home.",
};

export default function AboutPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-[var(--color-cream)]">
      
      {/* Hero */}
      <div className="relative h-[60vh] w-full">
        <Image 
          src="https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?w=1600&q=80&fit=crop"
          alt="Vooh Furnitures Showroom"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display text-5xl md:text-7xl text-white font-bold mb-4">About Vooh</h1>
          <p className="font-sans text-xl text-white/90 tracking-widest uppercase">Crafted for How You Live</p>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-6 md:px-12 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-sans text-[0.7rem] font-bold tracking-[0.2em] text-[var(--color-sage)] uppercase mb-4 block">
            Our Story
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-walnut)] font-bold mb-10">
            Built in Kenya. Built to Last.
          </h2>
          
          <div className="space-y-6 font-sans text-lg text-gray-700 leading-relaxed text-justify md:text-center">
            <p>
              Vooh Furnitures was born from a simple idea in a small Nairobi workshop: that Kenyan homes deserve premium, beautifully crafted furniture that doesn't compromise on durability or design. 
            </p>
            <p>
              Over the past decade, we have grown from a single storefront in Westlands to a nationwide brand with 5 major showrooms across Kenya. We source the finest materials and employ master craftsmen who understand the nuances of woodworking and upholstery.
            </p>
            <p>
              Our mission is to make luxury accessible. Whether you are furnishing your first apartment in Kisumu, upgrading a family home in Mombasa, or designing a corporate office in Eldoret, Vooh provides pieces that tell your story.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="bg-[var(--color-warm-white)] py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-white rounded-sm shadow-sm border border-[var(--color-border-accent)]">
              <div className="w-16 h-16 mx-auto bg-[var(--color-cream)] rounded-full flex items-center justify-center mb-6">
                <Hammer className="w-8 h-8 text-[var(--color-walnut)]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-4">Quality Craftsmanship</h3>
              <p className="font-sans text-gray-600 leading-relaxed">
                We use solid, kiln-dried hardwoods and premium fabrics. Every piece comes with a 3-year structural warranty, ensuring it stands the test of time.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-sm shadow-sm border border-[var(--color-border-accent)]">
              <div className="w-16 h-16 mx-auto bg-[var(--color-cream)] rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-[var(--color-walnut)]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-4">Kenyan Pride</h3>
              <p className="font-sans text-gray-600 leading-relaxed">
                Our designs are deeply inspired by East African aesthetics, blending traditional warmth with modern minimalism to suit the contemporary Kenyan lifestyle.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-sm shadow-sm border border-[var(--color-border-accent)]">
              <div className="w-16 h-16 mx-auto bg-[var(--color-cream)] rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-[var(--color-walnut)]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-4">Customer First</h3>
              <p className="font-sans text-gray-600 leading-relaxed">
                From our 30-day hassle-free returns to our dedicated delivery team, we prioritize your satisfaction above all else. Your home is our canvas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[var(--color-walnut)] text-[var(--color-cream)] py-16">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
          <div>
            <div className="font-mono text-4xl md:text-5xl font-bold mb-2">5</div>
            <div className="font-sans text-sm tracking-widest uppercase">Branches</div>
          </div>
          <div>
            <div className="font-mono text-4xl md:text-5xl font-bold mb-2">10+</div>
            <div className="font-sans text-sm tracking-widest uppercase">Years</div>
          </div>
          <div>
            <div className="font-mono text-4xl md:text-5xl font-bold mb-2">50k+</div>
            <div className="font-sans text-sm tracking-widest uppercase">Happy Customers</div>
          </div>
          <div>
            <div className="font-mono text-4xl md:text-5xl font-bold mb-2">500+</div>
            <div className="font-sans text-sm tracking-widest uppercase">Products</div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-[var(--color-cream)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-[var(--color-walnut)] font-bold">
              Meet The Team
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { role: "CEO & Founder", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&fit=crop" },
              { role: "Head of Design", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&fit=crop" },
              { role: "Regional Manager", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&fit=crop" },
              { role: "Customer Experience", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80&fit=crop" }
            ].map((member, i) => (
              <div key={i} className="group">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-sm">
                  <Image src={member.img} alt={`Team Member ${i+1}`} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <h4 className="font-display text-xl font-bold text-[var(--color-charcoal)]">Executive Name</h4>
                <p className="font-sans text-sm text-[var(--color-sage)] font-bold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
