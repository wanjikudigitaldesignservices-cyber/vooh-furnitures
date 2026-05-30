"use client";
import { useEffect, useState } from "react";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    pending: 0,
    products: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Products count
      const { count: productCount } = await supabase.from("products").select("*", { count: 'exact', head: true });
      
      // Orders data
      const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      
      if (orders) {
        const totalRev = orders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((acc, curr) => acc + curr.total, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending');
        
        setStats({
          orders: orders.length,
          revenue: totalRev,
          pending: pendingOrders.length,
          products: productCount || 0
        });

        setRecentOrders(orders.slice(0, 5));
      }
    };

    fetchDashboardData();
  }, [supabase]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-medium text-gray-500">Total Orders</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md"><ShoppingCart className="w-5 h-5" /></div>
          </div>
          <p className="font-display text-3xl font-bold text-gray-900">{stats.orders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-medium text-gray-500">Total Revenue</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-md"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="font-mono text-2xl font-bold text-gray-900">KES {stats.revenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-medium text-gray-500">Pending Orders</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-md"><ShoppingCart className="w-5 h-5" /></div>
          </div>
          <p className="font-display text-3xl font-bold text-gray-900">{stats.pending}</p>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-medium text-gray-500">Products Listed</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-md"><Package className="w-5 h-5" /></div>
          </div>
          <p className="font-display text-3xl font-bold text-gray-900">{stats.products}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="font-display text-lg font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-sans">No orders found.</td>
                </tr>
              ) : recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[var(--color-walnut)]">#{order.id.split('-')[0].toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-sans text-sm font-medium text-gray-900">{order.customer_name}</div>
                    <div className="font-sans text-sm text-gray-500">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-sans text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                    KES {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase
                      ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {order.status}
                    </span>
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
