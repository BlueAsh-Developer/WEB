"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { useProducts } from "@/hooks/useProducts";

export default function WishlistPage() {
  const { state } = useStore();
  const { products } = useProducts();
  const wishlistProducts = products.filter((p) => state.wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">My Wishlist ({wishlistProducts.length})</h1>
      {wishlistProducts.length === 0 ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">🤍</div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist.</p>
          <Link href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlistProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
