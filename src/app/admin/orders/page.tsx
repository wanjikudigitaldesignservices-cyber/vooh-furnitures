"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (!error) {
      toast.success("Order status updated");
      fetchOrders();
    } else {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="font-display text-3xl font-bold text-gray-900">Orders Management</h1>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Total (KES)</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-sans">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-sans">No orders found.</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[var(--color-walnut)]">
                    #{order.id.split('-')[0].toUpperCase()}
                    <div className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                    {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-sans text-sm text-gray-500">
                    {order.delivery_address ? `Delivery: ${order.delivery_city}` : `Pickup: ${order.branch_pickup}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold rounded-full px-3 py-1 uppercase border-0 focus:ring-2 cursor-pointer
                        ${order.status === 'paid' ? 'bg-green-100 text-green-800 focus:ring-green-500' : 
                          order.status === 'pending' ? 'bg-amber-100 text-amber-800 focus:ring-amber-500' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' :
                          'bg-gray-100 text-gray-800 focus:ring-gray-500'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
