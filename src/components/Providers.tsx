"use client";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          className: 'font-sans text-sm',
          style: {
            background: 'var(--color-charcoal)',
            color: 'var(--color-cream)',
            borderRadius: '4px',
          }
        }} 
      />
    </>
  );
}
