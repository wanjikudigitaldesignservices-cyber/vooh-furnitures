"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Truck, Store, MapPin } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

const BRANCHES = [
  { name: "Nairobi HQ", address: "Westlands Commercial Centre, Waiyaki Way" },
  { name: "Kisumu Showroom", address: "Mega City Mall, Oginga Odinga Street" },
  { name: "Mombasa Showroom", address: "City Mall, Nyali" },
  { name: "Kericho Showroom", address: "Tea Estate Road" },
  { name: "Eldoret Showroom", address: "Zion Mall, Uganda Road" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const { items, clearCart } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"home" | "pickup">("home");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Nairobi");
  const [pickupBranch, setPickupBranch] = useState(BRANCHES[0].name);
  const [notes, setNotes] = useState("");

  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push("/shop");
    }
  }, [items, router]);

  useEffect(() => {
    if (!activeOrderId) return;

    // Listen for changes on the specific order in Supabase
    const channel = supabase
      .channel(`order-${activeOrderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${activeOrderId}`,
        },
        (payload) => {
          if (payload.new.status === "paid") {
            toast.success("Payment successful!");
            clearCart();
            router.push(`/order-confirmation/${activeOrderId}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOrderId, supabase, router, clearCart]);

  if (!mounted || items.length === 0) return null;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Calculate delivery fee
  let deliveryFee = 0;
  if (deliveryMethod === "home") {
    if (subtotal > 50000 && city === "Nairobi") {
      deliveryFee = 0;
    } else if (city === "Nairobi") {
      deliveryFee = 500;
    } else {
      deliveryFee = 1200;
    }
  }
  
  const total = subtotal + deliveryFee;

  const handleMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Please fill in all contact details");
      return;
    }

    if (deliveryMethod === "home" && !address) {
      toast.error("Please provide a delivery address");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in Supabase as 'pending'
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          delivery_address: deliveryMethod === "home" ? address : null,
          delivery_city: deliveryMethod === "home" ? city : null,
          branch_pickup: deliveryMethod === "pickup" ? pickupBranch : null,
          items: items,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          status: "pending",
          notes
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      setActiveOrderId(orderData.id);

      // 2. Trigger STK Push
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          amount: total,
          orderId: orderData.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to trigger payment");
      }

      // Success, STK push sent
      setWaitingForPayment(true);
      setLoading(false);
      toast.success("Check your phone for the M-PESA PIN prompt!");
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to initialize checkout. Please try again.");
      setLoading(false);
      setActiveOrderId(null);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-[var(--color-cream)] pb-24">
      <div className="container mx-auto px-6 md:px-12 py-8">
        <h1 className="font-display text-4xl text-[var(--color-walnut)] font-bold mb-8">
          Checkout
        </h1>

        <form onSubmit={handleMpesaPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact Info */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-[var(--color-border-accent)]">
              <h2 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--color-cream)] text-[var(--color-walnut)] flex items-center justify-center font-sans text-sm">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-sans text-sm font-bold mb-2">Full Name *</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" />
                </div>
                <div>
                  <label className="block font-sans text-sm font-bold mb-2">Email Address *</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" />
                </div>
                <div>
                  <label className="block font-sans text-sm font-bold mb-2">M-PESA Phone Number *</label>
                  <input type="tel" placeholder="e.g. 0712345678 or 254712345678" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" />
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-[var(--color-border-accent)]">
              <h2 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--color-cream)] text-[var(--color-walnut)] flex items-center justify-center font-sans text-sm">2</span>
                Delivery Method
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  type="button"
                  onClick={() => setDeliveryMethod("home")}
                  className={`flex-1 flex items-center gap-4 p-4 border rounded-sm transition-colors text-left ${deliveryMethod === "home" ? 'border-[var(--color-walnut)] bg-[var(--color-cream)]' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${deliveryMethod === "home" ? 'border-[var(--color-walnut)]' : 'border-gray-300'}`}>
                    {deliveryMethod === "home" && <div className="w-3 h-3 bg-[var(--color-walnut)] rounded-full"></div>}
                  </div>
                  <div>
                    <div className="font-sans font-bold flex items-center gap-2"><Truck className="w-4 h-4"/> Home Delivery</div>
                    <div className="font-sans text-xs text-gray-500 mt-1">Delivered to your door</div>
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`flex-1 flex items-center gap-4 p-4 border rounded-sm transition-colors text-left ${deliveryMethod === "pickup" ? 'border-[var(--color-walnut)] bg-[var(--color-cream)]' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${deliveryMethod === "pickup" ? 'border-[var(--color-walnut)]' : 'border-gray-300'}`}>
                    {deliveryMethod === "pickup" && <div className="w-3 h-3 bg-[var(--color-walnut)] rounded-full"></div>}
                  </div>
                  <div>
                    <div className="font-sans font-bold flex items-center gap-2"><Store className="w-4 h-4"/> Pick Up In-Store</div>
                    <div className="font-sans text-xs text-gray-500 mt-1">Free collection</div>
                  </div>
                </button>
              </div>

              {deliveryMethod === "home" ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="block font-sans text-sm font-bold mb-2">Street Address *</label>
                    <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-bold mb-2">City *</label>
                    <select value={city} onChange={e => setCity(e.target.value)} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]">
                      <option value="Nairobi">Nairobi (KES 500 / Free over 50k)</option>
                      <option value="Kisumu">Kisumu (KES 1,200)</option>
                      <option value="Mombasa">Mombasa (KES 1,200)</option>
                      <option value="Kericho">Kericho (KES 1,200)</option>
                      <option value="Eldoret">Eldoret (KES 1,200)</option>
                      <option value="Other">Other City (KES 1,200)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="block font-sans text-sm font-bold mb-2">Select Branch for Pickup *</label>
                    <select value={pickupBranch} onChange={e => setPickupBranch(e.target.value)} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]">
                      {BRANCHES.map(b => (
                        <option key={b.name} value={b.name}>{b.name} - {b.address}</option>
                      ))}
                    </select>
                  </div>
                  <div className="p-4 bg-[var(--color-cream)] border border-[var(--color-border-accent)] rounded-sm flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[var(--color-gold)] mt-0.5 flex-shrink-0" />
                    <p className="font-sans text-sm text-gray-700">You will be notified via SMS/Email when your order is ready for collection at the selected branch.</p>
                  </div>
                </div>
              )}
            </section>

            {/* Notes */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-[var(--color-border-accent)]">
              <h2 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--color-cream)] text-[var(--color-walnut)] flex items-center justify-center font-sans text-sm">3</span>
                Order Notes (Optional)
              </h2>
              <textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                rows={3}
                placeholder="Any special instructions for delivery?"
                className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" 
              />
            </section>

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-[var(--color-border-accent)] sticky top-32">
              <h2 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-6 border-b border-[var(--color-border-accent)] pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 hide-scrollbar">
                {items.map(item => (
                  <div key={item.product_id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-1 -right-1 bg-[var(--color-charcoal)] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.qty}
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h4 className="font-sans font-bold text-sm line-clamp-1">{item.name}</h4>
                      <div className="font-mono text-sm text-[var(--color-walnut)] mt-1">KES {(item.price * item.qty).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--color-border-accent)] pt-4 space-y-3 font-sans">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-mono">{deliveryFee === 0 ? "FREE" : `KES ${deliveryFee.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border-accent)]">
                  <span className="font-display font-bold text-xl">Total</span>
                  <span className="font-mono font-bold text-2xl text-[var(--color-walnut)]">KES {total.toLocaleString()}</span>
                </div>
              </div>

              {waitingForPayment ? (
                <div className="mt-8 p-6 bg-[var(--color-cream)] border border-[var(--color-walnut)] rounded-sm text-center animate-pulse">
                  <h3 className="font-display font-bold text-lg text-[var(--color-walnut)] mb-2">Waiting for Payment...</h3>
                  <p className="font-sans text-sm text-gray-600">Please check your phone for the M-PESA PIN prompt. Once you enter your PIN, this page will update automatically.</p>
                </div>
              ) : (
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 bg-[var(--color-walnut)] text-[var(--color-cream)] font-sans font-bold py-4 rounded-sm hover:bg-[var(--color-charcoal)] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                  {loading ? "Processing..." : (
                    <>
                      <ShieldCheck className="w-5 h-5" /> Pay KES {total.toLocaleString()} with M-PESA
                    </>
                  )}
                </button>
              )}
              
              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="font-sans text-xs text-gray-400">Secured by Safaricom Daraja API</p>
                <div className="flex gap-2 opacity-80">
                  <div className="w-16 h-6 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-bold text-white tracking-widest">M-PESA</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
