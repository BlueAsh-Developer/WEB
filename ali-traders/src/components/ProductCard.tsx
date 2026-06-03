"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Zap, Star } from "lucide-react";
import { Product } from "@/lib/data";
import { useStore } from "@/context/StoreContext";

const badgeColors: Record<string, string> = {
  Sale: "bg-red-500",
  Hot: "bg-orange-500",
  New: "bg-blue-500",
  "Best Seller": "bg-green-500",
};

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch, state } = useStore();
  const isWished = state.wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300">
      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 text-white text-xs font-bold px-2 py-0.5 rounded-full ${badgeColors[product.badge] ?? "bg-gray-500"}`}>
          {product.badge}
        </span>
      )}
      {discount > 0 && (
        <span className="absolute top-3 right-10 z-10 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
          -{discount}%
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={() => dispatch({ type: "TOGGLE_WISHLIST", id: product.id })}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
      >
        <Heart size={16} className={isWished ? "fill-red-500 text-red-500" : "text-gray-400"} />
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-gray-50 dark:bg-gray-700 overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-orange-500 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-black text-gray-900 dark:text-white">Rs. {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: "ADD_TO_CART", product })}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
          <Link href={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 text-xs font-semibold py-2 rounded-lg transition-colors">
            <Zap size={14} /> Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
