"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Sofas & Sectionals",
  "Beds & Mattresses",
  "Tables & Desks",
  "Chairs & Seating",
  "Storage & Cabinets",
  "Decor & Lighting"
];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSuccess: () => void;
}

export default function ProductFormModal({ isOpen, onClose, product, onSuccess }: ProductFormModalProps) {
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setCategory(product.category);
      setDescription(product.description || "");
      setIsFeatured(product.is_featured);
      setImages(product.images || []);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory(CATEGORIES[0]);
    setDescription("");
    setIsFeatured(false);
    setImages([]);
    setFile(null);
  };

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!file) return null;
    setUploadingImage(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast.error(`Image upload failed: ${error.message}`);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let finalImages = [...images];

      // Upload new image if selected
      if (file) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          finalImages = [uploadedUrl]; // Replace existing images for now to keep it simple
        } else {
          setLoading(false);
          return; // Stop if upload failed
        }
      }

      const productData = {
        name,
        slug: generateSlug(name),
        price: parseFloat(price),
        category,
        description,
        is_featured: isFeatured,
        images: finalImages
      };

      if (product) {
        // Update
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
        
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        // Insert
        const { error } = await supabase
          .from("products")
          .insert([productData]);
        
        if (error) throw error;
        toast.success("Product added successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-display font-bold">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-walnut)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-walnut)] focus:border-transparent"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-walnut)] focus:border-transparent"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[var(--color-walnut)] rounded border-gray-300 focus:ring-[var(--color-walnut)]"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Feature this product on homepage</label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  {(file || (images && images.length > 0)) ? (
                    <div className="relative w-full h-32 mb-2">
                      <img 
                        src={file ? URL.createObjectURL(file) : images[0]} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  )}
                  <p className="text-sm text-gray-500 mb-2">Drag and drop or click to replace</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-walnut)] focus:border-transparent h-24 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading || uploadingImage}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-[var(--color-walnut)] rounded-md font-medium text-white hover:bg-[var(--color-charcoal)] transition-colors flex items-center gap-2"
              disabled={loading || uploadingImage}
            >
              {(loading || uploadingImage) && <Loader2 className="w-4 h-4 animate-spin" />}
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
