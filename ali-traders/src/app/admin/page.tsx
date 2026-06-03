"use client";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Total Products", value: products.length, icon: <Package size={22} />, color: "bg-blue-500", href: "/admin/products" },
    { label: "Total Orders", value: orders.length, icon: <ShoppingBag size={22} />, color: "bg-orange-500", href: "/admin/orders" },
    { label: "Pending Orders", value: pending, icon: <TrendingUp size={22} />, color: "bg-yellow-500", href: "/admin/orders" },
    { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: <DollarSign size={22} />, color: "bg-green-500", href: "/admin/orders" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-colors">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-white mb-3`}>{s.icon}</div>
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className="text-white text-2xl font-black mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-orange-400 text-sm hover:underline">View All →</Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-gray-500 border-b border-gray-800">
                <th className="pb-3 text-left font-medium">Delivery ID</th>
                <th className="pb-3 text-left font-medium">Customer</th>
                <th className="pb-3 text-left font-medium">Total</th>
                <th className="pb-3 text-left font-medium">Status</th>
                <th className="pb-3 text-left font-medium">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-800">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.deliveryId} className="text-gray-300">
                    <td className="py-3 font-mono text-orange-400 text-xs">{o.deliveryId}</td>
                    <td className="py-3">{o.fullName}</td>
                    <td className="py-3 font-semibold">Rs. {o.total.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        o.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        o.status === "confirmed" ? "bg-blue-500/20 text-blue-400" :
                        o.status === "shipped" ? "bg-purple-500/20 text-purple-400" :
                        o.status === "delivered" ? "bg-green-500/20 text-green-400" :
                        "bg-red-500/20 text-red-400"}`}>{o.status}</span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
