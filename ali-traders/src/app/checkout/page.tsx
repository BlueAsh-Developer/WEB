"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useOrders, generateDeliveryId } from "@/hooks/useOrders";
import { CheckCircle, Copy, Check } from "lucide-react";

type Form = {
  fullName: string; phone: string; phone2: string; email: string;
  address: string; city: string; province: string; postalCode: string;
  country: string; landmark: string; deliveryType: string;
  paymentMethod: string; notes: string;
};

const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "AJK", "Islamabad"];

export default function CheckoutPage() {
  const { state, dispatch, cartTotal } = useStore();
  const { saveOrder } = useOrders();
  const [deliveryId, setDeliveryId] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<Form>({
    fullName: "", phone: "", phone2: "", email: "",
    address: "", city: "", province: "Punjab", postalCode: "",
    country: "Pakistan", landmark: "", deliveryType: "Standard Delivery",
    paymentMethod: "Cash on Delivery", notes: "",
  });

  const deliveryFee = cartTotal >= 2000 ? 0 : 150;
  const total = cartTotal + deliveryFee;

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = generateDeliveryId();
    saveOrder({
      deliveryId: id,
      createdAt: new Date().toISOString(),
      ...form,
      items: state.cart.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal: cartTotal,
      deliveryFee,
      total,
      status: "pending",
    });
    setDeliveryId(id);
    dispatch({ type: "CLEAR_CART" });
  };

  const copyId = () => {
    navigator.clipboard.writeText(deliveryId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (state.cart.length === 0 && !deliveryId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-black mb-4">Your cart is empty</h2>
        <Link href="/shop" className="bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors">Shop Now</Link>
      </div>
    );
  }

  if (deliveryId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Order Placed! 🎉</h2>
        <p className="text-gray-500 mb-1">Thank you, <strong>{form.fullName}</strong>!</p>
        <p className="text-gray-500 mb-6">We'll call you on <strong>{form.phone}</strong> to confirm.</p>

        <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-2xl px-8 py-5 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Delivery ID</p>
          <p className="text-2xl font-black font-mono text-orange-500 mb-3">{deliveryId}</p>
          <button onClick={copyId} className="flex items-center gap-2 mx-auto text-sm text-orange-600 dark:text-orange-400 hover:underline">
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy ID</>}
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-8 max-w-sm">Save this Delivery ID — you can use it to track your order status.</p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">Continue Shopping</Link>
          <a href={`https://wa.me/923218671396?text=Hi!%20My%20Delivery%20ID%20is%20${deliveryId}`} target="_blank" rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">💬 WhatsApp Us</a>
        </div>
      </div>
    );
  }

  const Field = ({ id, label, required, type = "text", placeholder, className = "" }: { id: keyof Form; label: string; required?: boolean; type?: string; placeholder?: string; className?: string }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input type={type} required={required} placeholder={placeholder} value={form[id]} onChange={set(id)}
        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          {/* Contact Info */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">📋 Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="fullName" label="Full Name" required placeholder="Your full name" className="sm:col-span-2" />
              <Field id="phone" label="Phone Number" required type="tel" placeholder="03XX-XXXXXXX" />
              <Field id="phone2" label="Alternate Phone" type="tel" placeholder="Optional" />
              <Field id="email" label="Email Address" type="email" placeholder="Optional" className="sm:col-span-2" />
            </div>
          </section>

          {/* Delivery Address */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">📦 Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="address" label="Street Address" required placeholder="House/Street/Area" className="sm:col-span-2" />
              <Field id="landmark" label="Nearby Landmark" placeholder="e.g. Near mosque, school..." className="sm:col-span-2" />
              <Field id="city" label="City" required placeholder="Your city" />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Province <span className="text-red-500">*</span></label>
                <select required value={form.province} onChange={set("province")}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm">
                  {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <Field id="postalCode" label="Postal Code" placeholder="Optional" />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Country</label>
                <select value={form.country} onChange={set("country")}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm">
                  {["Pakistan", "UAE", "Saudi Arabia", "UK", "Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Delivery & Payment */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">🚚 Delivery & Payment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Delivery Type</label>
                <select value={form.deliveryType} onChange={set("deliveryType")}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm">
                  <option>Standard Delivery</option>
                  <option>Express Delivery</option>
                  <option>Same Day (Rahim Yar Khan only)</option>
                  <option>Store Pickup</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Payment Method</label>
                <select value={form.paymentMethod} onChange={set("paymentMethod")}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm">
                  <option>Cash on Delivery</option>
                  <option>Bank Transfer</option>
                  <option>JazzCash</option>
                  <option>EasyPaisa</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Additional Notes</label>
                <textarea rows={3} placeholder="Special instructions, preferred time, anything else..."
                  value={form.notes} onChange={set("notes")}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none" />
              </div>
            </div>
          </section>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl text-base transition-colors">
            ✅ Place Order – Rs. {total.toLocaleString()}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order ({state.cart.length} items)</h2>
            <div className="space-y-3 mb-5">
              {state.cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1 text-gray-800 dark:text-gray-200">{item.name}</p>
                    <p className="text-xs text-gray-400">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span>{deliveryFee === 0 ? <span className="text-green-500">Free</span> : `Rs. ${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-black text-base border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total</span><span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
