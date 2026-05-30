"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Check, X as XIcon } from "lucide-react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const toggleFeatured = async (id: string, currentVal: boolean) => {
    const { error } = await supabase.from("products").update({ is_featured: !currentVal }).eq("id", id);
    if (!error) {
      toast.success("Featured status updated");
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) {
        toast.success("Product deleted");
        fetchProducts();
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="font-display text-3xl font-bold text-gray-900">Products Inventory</h1>
        <button className="bg-[var(--color-walnut)] text-white px-4 py-2 rounded-md font-sans font-medium flex items-center gap-2 hover:bg-[var(--color-charcoal)] transition-colors">
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Price (KES)</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-right text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-sans">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-sans">No products found. Add your first product.</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                        {product.images && product.images[0] && (
                          <Image src={product.images[0]} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-sans">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                    {product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => toggleFeatured(product.id, product.is_featured)}
                      className={`p-1 rounded-full ${product.is_featured ? 'text-green-600 bg-green-100 hover:bg-green-200' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {product.is_featured ? <Check className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-blue-600 hover:text-blue-900"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
