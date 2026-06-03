"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";

const COUPONS: Record<string, number> = { "SAVE10": 0.10, "ALI20": 0.20, "TECH15": 0.15 };

export default function CartPage() {
  const { state, dispatch, cartTotal } = useStore();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const discount = COUPONS[appliedCoupon] ?? 0;
  const deliveryFee = cartTotal >= 2000 ? 0 : 150;
  const discountAmount = Math.round(cartTotal * discount);
  const total = cartTotal - discountAmount + deliveryFee;

  const applyCoupon = () => {
    if (COUPONS[coupon.toUpperCase()]) {
      setAppliedCoupon(coupon.toUpperCase());
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some awesome products to get started!</p>
        <Link href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Shopping Cart ({state.cart.length})</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {state.cart.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4">
              <div className="relative w-24 h-24 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-orange-500 line-clamp-2 text-sm">
                  {item.name}
                </Link>
                <p className="text-orange-500 font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button onClick={() => item.quantity > 1 ? dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.quantity - 1 }) : dispatch({ type: "REMOVE_FROM_CART", id: item.id })}
                      className="px-2.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"><Minus size={14} /></button>
                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.quantity + 1 })}
                      className="px-2.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: item.id })}
                    className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-gray-900 dark:text-white">Rs. {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h2 className="font-black text-gray-900 dark:text-white text-lg mb-5">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-2">
                <Tag size={14} /> Coupon Code
              </label>
              <div className="flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <button onClick={applyCoupon} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Apply</button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
              {appliedCoupon && <p className="text-green-500 text-xs mt-1">✓ Coupon "{appliedCoupon}" applied!</p>}
              <p className="text-xs text-gray-400 mt-1">Try: SAVE10, ALI20, TECH15</p>
            </div>

            <div className="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-500"><span>Discount ({discount * 100}%)</span><span>-Rs. {discountAmount.toLocaleString()}</span></div>}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span>{deliveryFee === 0 ? <span className="text-green-500">Free</span> : `Rs. ${deliveryFee}`}</span>
              </div>
              {cartTotal < 2000 && <p className="text-xs text-gray-400">Add Rs. {(2000 - cartTotal).toLocaleString()} more for free delivery</p>}
              <div className="flex justify-between font-black text-base border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total</span><span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
              <ShoppingBag size={18} /> Proceed to Checkout
            </Link>
            <Link href="/shop" className="mt-3 w-full flex items-center justify-center text-sm text-gray-500 hover:text-orange-500 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
