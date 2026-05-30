import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Image from "next/image";

const branches = [
  {
    name: "Nairobi HQ",
    city: "Nairobi",
    address: "Westlands Commercial Centre, Waiyaki Way",
    phone: "+254 700 000 001",
    email: "hq@voohfurnitures.co.ke",
    hours: "Mon–Sat 8AM–7PM, Sun 10AM–5PM",
    isHq: true,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80&fit=crop"
  },
  {
    name: "Kisumu Showroom",
    city: "Kisumu",
    address: "Mega City Mall, Oginga Odinga Street",
    phone: "+254 700 000 002",
    email: "kisumu@voohfurnitures.co.ke",
    hours: "Mon–Sat 9AM–6PM",
    isHq: false,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop"
  },
  {
    name: "Mombasa Showroom",
    city: "Mombasa",
    address: "City Mall, Nyali",
    phone: "+254 700 000 003",
    email: "mombasa@voohfurnitures.co.ke",
    hours: "Mon–Sat 9AM–6PM",
    isHq: false,
    image: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=800&q=80&fit=crop"
  },
  {
    name: "Kericho Showroom",
    city: "Kericho",
    address: "Tea Estate Road",
    phone: "+254 700 000 004",
    email: "kericho@voohfurnitures.co.ke",
    hours: "Mon–Sat 9AM–6PM",
    isHq: false,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80&fit=crop"
  },
  {
    name: "Eldoret Showroom",
    city: "Eldoret",
    address: "Zion Mall, Uganda Road",
    phone: "+254 700 000 005",
    email: "eldoret@voohfurnitures.co.ke",
    hours: "Mon–Sat 9AM–6PM",
    isHq: false,
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80&fit=crop"
  },
];

export const metadata = {
  title: "Our Showrooms | Vooh Furnitures",
  description: "Find a Vooh Furnitures showroom near you. We have locations in Nairobi, Kisumu, Mombasa, Kericho, and Eldoret.",
};

export default function BranchesPage() {
  return (
    <div className="pt-24 min-h-screen bg-[var(--color-cream)]">
      
      {/* Hero */}
      <div className="bg-[var(--color-walnut)] py-20 text-center text-[var(--color-cream)]">
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">Find Us Near You</h1>
        <p className="font-sans text-lg max-w-2xl mx-auto text-white/80">
          Experience our craftsmanship in person at one of our 5 showrooms across Kenya.
        </p>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16">
        {/* Branch Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {branches.map((branch, idx) => (
            <div key={idx} className="bg-white border border-[var(--color-border-accent)] rounded-sm overflow-hidden flex flex-col md:flex-row group">
              <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                <Image src={branch.image} alt={branch.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                {branch.isHq && (
                  <div className="absolute top-4 left-4 bg-[var(--color-gold)] text-white text-[0.65rem] font-bold tracking-wider uppercase px-3 py-1 rounded-sm shadow-md">
                    Headquarters
                  </div>
                )}
              </div>
              <div className="p-8 w-full md:w-3/5 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-6">{branch.name}</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 flex-shrink-0 text-[var(--color-walnut)] mt-0.5" />
                      <p className="font-sans text-sm">{branch.address}, {branch.city}</p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5 flex-shrink-0 text-[var(--color-walnut)]" />
                      <a href={`tel:${branch.phone}`} className="font-mono text-sm hover:text-[var(--color-gold)] transition-colors">{branch.phone}</a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-5 h-5 flex-shrink-0 text-[var(--color-walnut)]" />
                      <a href={`mailto:${branch.email}`} className="font-sans text-sm hover:text-[var(--color-gold)] transition-colors">{branch.email}</a>
                    </div>
                    <div className="flex items-start gap-3 text-gray-600">
                      <Clock className="w-5 h-5 flex-shrink-0 text-[var(--color-walnut)] mt-0.5" />
                      <p className="font-sans text-sm">{branch.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(branch.address + ', ' + branch.city + ', Kenya')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[var(--color-walnut)] text-[var(--color-cream)] text-center py-3 font-sans font-bold text-sm rounded-sm hover:bg-[var(--color-charcoal)] transition-colors"
                  >
                    Get Directions
                  </a>
                  <a 
                    href={`tel:${branch.phone}`}
                    className="flex-1 border border-[var(--color-walnut)] text-[var(--color-walnut)] text-center py-3 font-sans font-bold text-sm rounded-sm hover:bg-black/5 transition-colors"
                  >
                    Call Branch
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Embed */}
        <div className="bg-white p-2 rounded-sm border border-[var(--color-border-accent)] mb-16 shadow-sm">
          <iframe 
            width="100%" 
            height="500" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=33.92578125000001%2C-4.707883584852643%2C41.83593750000001%2C4.521666427389104&amp;layer=mapnik" 
            style={{ border: "1px solid #ccc", borderRadius: "2px" }}
          ></iframe>
        </div>
        
        {/* CTA Strip */}
        <div className="bg-[var(--color-warm-white)] border border-[var(--color-border-accent)] rounded-sm p-12 text-center flex flex-col items-center">
          <h3 className="font-display text-3xl font-bold text-[var(--color-charcoal)] mb-4">Not sure which branch to visit?</h3>
          <p className="font-sans text-gray-600 mb-8">Drop us a message on WhatsApp and our team will guide you.</p>
          <a 
            href="https://wa.me/254700000001" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-sm font-sans font-bold hover:bg-[#20bd5a] transition-colors shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Us
          </a>
        </div>

      </div>
    </div>
  );
}
