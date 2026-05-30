import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amina K.",
    city: "Nairobi",
    product: "Grey Sectional Sofa",
    review: "The grey sectional sofa transformed my living room completely. Delivery was prompt and professional, and the fabric quality is exceptional.",
    initials: "AK"
  },
  {
    name: "Brian O.",
    city: "Kisumu",
    product: "Executive Desk",
    review: "Exceptional quality. The executive desk is sturdy and looks incredibly premium in my home office. It was exactly what I was looking for.",
    initials: "BO"
  },
  {
    name: "Sarah M.",
    city: "Mombasa",
    product: "6-Seater Dining Table",
    review: "Very happy with the dining set. It fits perfectly in our space and the chairs are very comfortable. The wood finish is gorgeous.",
    initials: "SM"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[var(--color-cream)]">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <div className="mb-16">
          <span className="font-sans text-[0.7rem] font-bold tracking-[0.2em] text-[var(--color-sage)] uppercase mb-4 block">
            What Our Customers Say
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-walnut)] font-bold">
            Real Homes. Real Stories.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="flex-1 bg-white p-8 rounded-sm shadow-sm border border-[var(--color-border-accent)] text-left flex flex-col">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                ))}
              </div>
              
              <p className="font-display text-xl text-[var(--color-charcoal)] leading-relaxed italic mb-8 flex-grow">
                "{t.review}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-walnut)] text-[var(--color-cream)] flex items-center justify-center font-sans font-bold text-lg">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[var(--color-charcoal)]">{t.name}</h4>
                  <p className="font-sans text-xs text-gray-500">{t.city} • Purchased {t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
