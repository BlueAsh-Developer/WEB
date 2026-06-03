"use client";
import { useState } from "react";
import { useOrders, Order } from "@/hooks/useOrders";
import { Search, Package, MapPin, Phone, Mail, Clock, ChevronDown } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, s: Order["status"]) => void }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Delivery ID</p>
          <p className="text-orange-400 font-mono font-bold text-lg">{order.deliveryId}</p>
          <p className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusColor[order.status]}`}>{order.status}</span>
          <div className="relative">
            <select value={order.status} onChange={(e) => onStatusChange(order.deliveryId, e.target.value as Order["status"])}
              className="appearance-none bg-gray-800 border border-gray-700 text-white text-xs px-3 py-1.5 rounded-lg pr-7 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer */}
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-sm border-b border-gray-800 pb-2">Customer Details</h3>
          <InfoRow icon={<Package size={14} />} label="Name" value={order.fullName} />
          <InfoRow icon={<Phone size={14} />} label="Phone" value={order.phone} />
          {order.phone2 && <InfoRow icon={<Phone size={14} />} label="Phone 2" value={order.phone2} />}
          {order.email && <InfoRow icon={<Mail size={14} />} label="Email" value={order.email} />}
          <InfoRow icon={<MapPin size={14} />} label="Address" value={order.address} />
          <InfoRow icon={<MapPin size={14} />} label="City" value={`${order.city}, ${order.province}`} />
          {order.postalCode && <InfoRow icon={<MapPin size={14} />} label="Postal Code" value={order.postalCode} />}
          <InfoRow icon={<MapPin size={14} />} label="Country" value={order.country} />
          {order.landmark && <InfoRow icon={<MapPin size={14} />} label="Landmark" value={order.landmark} />}
          <InfoRow icon={<Clock size={14} />} label="Delivery Type" value={order.deliveryType} />
          <InfoRow icon={<Clock size={14} />} label="Payment" value={order.paymentMethod} />
          {order.notes && <InfoRow icon={<Clock size={14} />} label="Notes" value={order.notes} />}
        </div>

        {/* Items */}
        <div>
          <h3 className="text-white font-semibold text-sm border-b border-gray-800 pb-2 mb-2">Order Items</h3>
          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-300 line-clamp-1 flex-1 mr-2">{item.name}</span>
                <span className="text-gray-400 text-xs mr-2">×{item.quantity}</span>
                <span className="text-white font-semibold shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-400">
              <span>Delivery</span><span>{order.deliveryFee === 0 ? <span className="text-green-400">Free</span> : `Rs. ${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-white font-black text-base pt-1 border-t border-gray-700">
              <span>Total</span><span>Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-orange-400 mt-0.5 shrink-0">{icon}</span>
      <span className="text-gray-400 text-xs w-20 shrink-0">{label}:</span>
      <span className="text-gray-200 text-xs">{value}</span>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { orders, updateStatus } = useOrders();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Order | null | undefined>(undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = orders.find((o) => o.deliveryId === query.trim().toUpperCase());
    setResult(found ?? null);
    setSearched(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-2">Order Lookup</h1>
      <p className="text-gray-400 text-sm mb-8">Enter a delivery ID to view full order details.</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-lg">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="e.g. AT-M3K7X2-AB4C"
            className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-600"
          />
        </div>
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl transition-colors">
          Search
        </button>
      </form>

      {/* Result */}
      {searched && (
        result
          ? <OrderCard order={result} onStatusChange={updateStatus} />
          : (
            <div className="text-center py-12 text-gray-500">
              <Search size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No order found for <span className="text-orange-400 font-mono">{query}</span></p>
              <p className="text-sm mt-1">Check the delivery ID and try again.</p>
            </div>
          )
      )}

      {/* All orders list */}
      {!searched && orders.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">All Orders ({orders.length})</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.deliveryId} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => { setQuery(o.deliveryId); setResult(o); setSearched(true); }}>
                <div>
                  <span className="text-orange-400 font-mono text-sm font-bold">{o.deliveryId}</span>
                  <span className="text-gray-400 text-sm ml-3">{o.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">Rs. {o.total.toLocaleString()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusColor[o.status]}`}>{o.status}</span>
                  <span className="text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searched && orders.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p>No orders yet. They will appear here once customers place orders.</p>
        </div>
      )}
    </div>
  );
}
