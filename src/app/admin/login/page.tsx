"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Welcome back!");
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--color-walnut)]">VOOH</h1>
          <p className="font-sans text-sm text-gray-500 uppercase tracking-widest mt-1">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-sans text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" 
            />
          </div>
          <div>
            <label className="block font-sans text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full border-gray-300 rounded-sm p-3 font-sans focus:ring-[var(--color-walnut)] focus:border-[var(--color-walnut)]" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--color-walnut)] text-white font-sans font-bold py-3 rounded-sm hover:bg-[var(--color-charcoal)] transition-colors disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
