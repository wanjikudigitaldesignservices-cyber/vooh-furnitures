"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ProductAccordion() {
  const [open, setOpen] = useState<string | null>("dimensions");

  const toggle = (id: string) => {
    setOpen(open === id ? null : id);
  };

  const items = [
    { id: "dimensions", title: "Dimensions & Specifications", content: "Detailed dimensions will be listed here based on the specific product. Standard variations apply." },
    { id: "materials", title: "Materials & Finish", content: "Crafted from premium kiln-dried hardwoods and finished with non-toxic, sustainable varnishes." },
    { id: "care", title: "Care Instructions", content: "Wipe clean with a damp cloth. Avoid harsh chemicals. Use coasters and placemats to protect surfaces." },
    { id: "warranty", title: "Warranty Information", content: "Comes with a 3-year structural warranty covering any manufacturing defects." },
    { id: "delivery", title: "Delivery & Returns", content: "Free delivery within Nairobi for orders above KES 50,000. 30-day return policy for unused items in original packaging." },
  ];

  return (
    <div className="border-t border-[var(--color-border-accent)]">
      {items.map((item) => (
        <div key={item.id} className="border-b border-[var(--color-border-accent)]">
          <button 
            onClick={() => toggle(item.id)}
            className="w-full py-4 flex items-center justify-between focus:outline-none"
          >
            <span className="font-sans font-bold text-[var(--color-charcoal)]">{item.title}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open === item.id ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${open === item.id ? 'max-h-40 pb-4' : 'max-h-0'}`}>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              {item.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
