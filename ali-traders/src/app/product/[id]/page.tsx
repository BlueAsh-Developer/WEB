"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Zap, Heart, Shield, Truck } from "lucide-react";
import { reviews } from "@/lib/data";
import { useStore } from "@/context/StoreContext";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { products } = useProducts();
  const product = products.find((p) => p.id === +params.id);
  const { dispatch, state } = useStore();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Product Not Found</h2>
        <Link href="/shop" className="text-orange-500 hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const isWished = state.wishlist.includes(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-orange-500">Shop</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
            {product.images[activeImg] ? (
              <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">📦</div>
            )}
            {discount > 0 && <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}%</span>}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? "border-orange-500" : "border-gray-200 dark:border-gray-700"}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"} />)}
            </div>
            <span className="text-sm font-semibold">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-gray-900 dark:text-white">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-lg text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>

          {product.specs.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.specs.map((s) => (
                  <div key={s.label} className="text-sm">
                    <span className="text-gray-500">{s.label}: </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">−</button>
              <span className="px-4 py-2 font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">+</button>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={() => { for (let i = 0; i < qty; i++) dispatch({ type: "ADD_TO_CART", product }); }}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <Link href="/cart" onClick={() => dispatch({ type: "ADD_TO_CART", product })}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl transition-colors hover:opacity-90">
              <Zap size={18} /> Buy Now
            </Link>
            <button onClick={() => dispatch({ type: "TOGGLE_WISHLIST", id: product.id })}
              className="w-12 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-xl hover:border-red-400 transition-colors">
              <Heart size={20} className={isWished ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>

          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Shield size={16} className="text-green-500" /> Genuine Product</span>
            <span className="flex items-center gap-1"><Truck size={16} className="text-blue-500" /> Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-16">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.slice(0, 4).map((r) => (
            <div key={r.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < r.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"} />)}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">"{r.comment}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">{r.name[0]}</div>
                <div><p className="text-sm font-semibold">{r.name}</p><p className="text-xs text-gray-400">{r.date}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
