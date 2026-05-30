"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden">
        <Image
          src={mainImage}
          alt="Product image"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative aspect-square bg-gray-100 rounded-sm overflow-hidden border-2 transition-colors ${mainImage === img ? 'border-[var(--color-walnut)]' : 'border-transparent'}`}
            >
              <Image src={img} alt={`Thumbnail ${idx+1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
