import { CheckCircle2, ChevronRight, Package, Truck, Smile } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = createClient();
  
  let order = null;
  
  // Try to fetch order, but allow a fallback view so page doesn't crash if DB fails
  try {
    const { data } = await supabase.from("orders").select("*").eq("id", id).single();
    if (data) order = data;
  } catch(e) {}

  return (
    <div className="pt-[104px] min-h-screen bg-[var(--color-cream)] flex items-center justify-center py-24 px-6">
      <div className="max-w-3xl w-full bg-white rounded-sm shadow-xl border border-[var(--color-border-accent)] p-8 md:p-12">
        
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-[var(--color-sage)]/20 rounded-full flex items-center justify-center mb-6 text-[var(--color-sage)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-charcoal)] font-bold mb-4">
            Order Confirmed! 🎉
          </h1>
          <p className="font-sans text-gray-500 text-lg">
            Thank you for shopping with Vooh Furnitures. 
          </p>
          <div className="mt-4 font-mono font-bold text-[var(--color-walnut)] bg-[var(--color-cream)] px-4 py-2 rounded-sm border border-[var(--color-border-accent)]">
            Order #{order ? order.id.split('-')[0].toUpperCase() : id.split('-')[0].toUpperCase()}
          </div>
        </div>

        <div className="border-t border-b border-[var(--color-border-accent)] py-8 mb-8">
          <h3 className="font-display text-2xl font-bold mb-6 text-[var(--color-charcoal)]">What happens next?</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-sage)] text-white flex items-center justify-center font-bold font-sans flex-shrink-0 mt-0.5">1</div>
              <div>
                <h4 className="font-sans font-bold text-lg">Payment Confirmed</h4>
                <p className="font-sans text-sm text-gray-500">We've received your payment securely.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-gold)] text-white flex items-center justify-center font-bold font-sans flex-shrink-0 mt-0.5"><Package className="w-4 h-4"/></div>
              <div>
                <h4 className="font-sans font-bold text-lg">Order Processing</h4>
                <p className="font-sans text-sm text-gray-500">Our team is preparing your furniture (1-2 business days).</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-walnut)] text-[var(--color-cream)] flex items-center justify-center font-bold font-sans flex-shrink-0 mt-0.5"><Truck className="w-4 h-4"/></div>
              <div>
                <h4 className="font-sans font-bold text-lg">{order?.delivery_address ? "Out for Delivery" : "Ready for Pickup"}</h4>
                <p className="font-sans text-sm text-gray-500">You will receive an SMS/Email notification once your order is on the way or ready for collection.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-charcoal)] text-[var(--color-cream)] flex items-center justify-center font-bold font-sans flex-shrink-0 mt-0.5"><Smile className="w-4 h-4"/></div>
              <div>
                <h4 className="font-sans font-bold text-lg">Enjoy Your Furniture!</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/shop" 
            className="bg-[var(--color-walnut)] text-[var(--color-cream)] font-sans font-bold px-8 py-4 rounded-sm text-center hover:bg-[var(--color-charcoal)] transition-colors"
          >
            Continue Shopping
          </Link>
          <a 
            href="https://wa.me/254700000001" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-[var(--color-walnut)] text-[var(--color-walnut)] font-sans font-bold px-8 py-4 rounded-sm text-center hover:bg-black/5 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
