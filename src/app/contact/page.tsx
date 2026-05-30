"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase";

export default function ContactPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    subject: "Product Enquiry",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([form]);

      if (error) throw error;
      
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", branch: "", subject: "Product Enquiry", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again or use WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[104px] min-h-screen bg-[var(--color-cream)] pb-24">
      <div className="container mx-auto px-6 md:px-12 py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Contact Info */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-[var(--color-walnut)] font-bold mb-6">
              We'd Love to Hear From You.
            </h1>
            <p className="font-sans text-lg text-gray-600 mb-12">
              Visit any of our 5 showrooms, or reach out online. Our team is ready to help you craft your perfect space.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center flex-shrink-0 border border-[var(--color-border-accent)]">
                  <Phone className="w-5 h-5 text-[var(--color-walnut)]" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[var(--color-charcoal)] mb-1">Call Us (HQ)</h4>
                  <a href="tel:+254700000001" className="font-mono text-[var(--color-walnut)] hover:text-[var(--color-gold)]">+254 700 000 001</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center flex-shrink-0 border border-[var(--color-border-accent)]">
                  <Mail className="w-5 h-5 text-[var(--color-walnut)]" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[var(--color-charcoal)] mb-1">Email Us</h4>
                  <a href="mailto:hello@voohfurnitures.co.ke" className="font-sans text-gray-600 hover:text-[var(--color-gold)]">hello@voohfurnitures.co.ke</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center flex-shrink-0 border border-[var(--color-border-accent)]">
                  <MapPin className="w-5 h-5 text-[var(--color-walnut)]" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[var(--color-charcoal)] mb-1">Headquarters</h4>
                  <p className="font-sans text-gray-600">Westlands Commercial Centre,<br/>Waiyaki Way, Nairobi</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border border-[var(--color-border-accent)] rounded-sm mb-8">
              <h4 className="font-sans font-bold text-[var(--color-charcoal)] mb-4 uppercase tracking-widest text-xs text-[var(--color-sage)]">Working Hours</h4>
              <div className="space-y-2 font-sans text-sm text-gray-600">
                <div className="flex justify-between"><span>Monday – Saturday:</span> <span>8:00 AM – 7:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday & Holidays:</span> <span>10:00 AM – 5:00 PM</span></div>
              </div>
            </div>

            <a 
              href="https://wa.me/254700000001" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-sm font-sans font-bold hover:bg-[#20bd5a] transition-colors shadow-lg w-full justify-center md:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-[var(--color-border-accent)]">
            <h3 className="font-display text-2xl font-bold text-[var(--color-charcoal)] mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-sans text-sm font-bold mb-2">Full Name *</label>
                <input required type="text" name="name" value={form.name} onChange={handleChange} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm font-bold mb-2">Email Address *</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" />
                </div>
                <div>
                  <label className="block font-sans text-sm font-bold mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm font-bold mb-2">Nearest Branch</label>
                  <select name="branch" value={form.branch} onChange={handleChange} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]">
                    <option value="">Select branch...</option>
                    <option value="Nairobi">Nairobi HQ</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kericho">Kericho</option>
                    <option value="Eldoret">Eldoret</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-sm font-bold mb-2">Subject *</label>
                  <select required name="subject" value={form.subject} onChange={handleChange} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]">
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Returns">Returns</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm font-bold mb-2">Your Message *</label>
                <textarea required name="message" value={form.message} onChange={handleChange} rows={5} className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[var(--color-walnut)] text-[var(--color-cream)] font-sans font-bold py-4 rounded-sm hover:bg-[var(--color-charcoal)] transition-colors disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
