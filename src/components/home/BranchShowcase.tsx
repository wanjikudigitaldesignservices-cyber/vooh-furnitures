import { MapPin, Phone, Clock } from "lucide-react";

const branches = [
  {
    name: "Nairobi HQ",
    city: "Nairobi",
    address: "Westlands Commercial Centre, Waiyaki Way",
    phone: "+254 700 000 001",
    hours: "Mon–Sat 8AM–7PM, Sun 10AM–5PM",
    isHq: true,
  },
  {
    name: "Kisumu Showroom",
    city: "Kisumu",
    address: "Mega City Mall, Oginga Odinga Street",
    phone: "+254 700 000 002",
    hours: "Mon–Sat 9AM–6PM",
    isHq: false,
  },
  {
    name: "Mombasa Showroom",
    city: "Mombasa",
    address: "City Mall, Nyali",
    phone: "+254 700 000 003",
    hours: "Mon–Sat 9AM–6PM",
    isHq: false,
  },
  {
    name: "Kericho Showroom",
    city: "Kericho",
    address: "Tea Estate Road, Kericho Town",
    phone: "+254 700 000 004",
    hours: "Mon–Sat 9AM–6PM",
    isHq: false,
  },
  {
    name: "Eldoret Showroom",
    city: "Eldoret",
    address: "Zion Mall, Uganda Road",
    phone: "+254 700 000 005",
    hours: "Mon–Sat 9AM–6PM",
    isHq: false,
  },
];

export default function BranchShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12">
          <span className="font-sans text-[0.7rem] font-bold tracking-[0.2em] text-[var(--color-sage)] uppercase mb-4 block">
            Our Showrooms
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-walnut)] font-bold">
            5 Locations. One Standard of Excellence.
          </h2>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
          {branches.map((branch, index) => (
            <div 
              key={index} 
              className="min-w-[320px] md:min-w-[380px] bg-[var(--color-warm-white)] border border-[var(--color-border-accent)] p-8 rounded-sm snap-start group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl font-bold text-[var(--color-charcoal)]">{branch.city}</h3>
                {branch.isHq && (
                  <span className="bg-[var(--color-gold)] text-white text-[0.65rem] font-bold tracking-wider uppercase px-3 py-1 rounded-sm">
                    HQ
                  </span>
                )}
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 flex-shrink-0 text-[var(--color-walnut)] mt-0.5" />
                  <p className="font-sans text-sm">{branch.address}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 flex-shrink-0 text-[var(--color-walnut)]" />
                  <p className="font-mono text-sm">{branch.phone}</p>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <Clock className="w-5 h-5 flex-shrink-0 text-[var(--color-walnut)] mt-0.5" />
                  <p className="font-sans text-sm">{branch.hours}</p>
                </div>
              </div>

              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(branch.address + ', ' + branch.city + ', Kenya')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex font-sans text-sm font-bold text-[var(--color-walnut)] group-hover:text-[var(--color-gold)] transition-colors"
              >
                Get Directions →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
