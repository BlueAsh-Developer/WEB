"use client";
import Link from "next/link";
import Image from "next/image";
import { Star, Shield, DollarSign, Truck, Lock, Headphones, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { categories, reviews } from "@/lib/data";
import { useProducts } from "@/hooks/useProducts";

export default function HomePage() {
  const { products } = useProducts();
  const featured = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              🔥 New Arrivals Available
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Latest Tech<br /><span className="text-orange-500">Accessories</span><br />at Affordable Prices
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              Shop quality mobile phones, headphones, chargers, cables and more from Ali Traders – your trusted local tech store.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25">
                Shop Now →
              </Link>
              <Link href="/contact" className="border border-white/30 hover:border-orange-500 text-white font-bold px-8 py-3 rounded-xl transition-all">
                Contact Us
              </Link>
            </div>
            <div className="flex gap-8 mt-10 justify-center lg:justify-start text-center">
              {[["500+", "Products"], ["5000+", "Customers"], ["4.9★", "Rating"]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-black text-orange-400">{val}</div>
                  <div className="text-gray-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 max-w-sm w-full">
            {featured.length > 0 ? featured.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                {p.image ? (
                  <Image src={p.image} alt={p.name} width={150} height={150} className="w-full rounded-xl aspect-square object-cover" unoptimized />
                ) : (
                  <div className="w-full rounded-xl aspect-square bg-white/10 flex items-center justify-center text-4xl">📦</div>
                )}
                <p className="text-white text-xs font-medium mt-2 line-clamp-1">{p.name}</p>
                <p className="text-orange-400 text-sm font-bold">Rs. {p.price.toLocaleString()}</p>
              </div>
            )) : (
              <div className="col-span-2 flex items-center justify-center text-gray-400 text-sm">
                Products will appear here once added from admin.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="bg-orange-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 text-white text-sm font-medium">
          <span>🚚 Free Delivery on Orders Above Rs. 2000</span>
          <span>✅ 100% Genuine Products</span>
          <span>🔄 7-Day Easy Returns</span>
          <span>🔒 Secure Payments</span>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Browse our wide range of tech accessories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.id}`}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-center hover:border-orange-400 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 transition-colors leading-tight">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Featured Products</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Hand-picked popular items</p>
              </div>
              <Link href="/shop" className="flex items-center gap-1 text-orange-500 font-semibold hover:gap-2 transition-all text-sm">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Special Offers */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl p-8 overflow-hidden text-white">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full" />
              <span className="bg-white text-orange-600 text-xs font-black px-3 py-1 rounded-full">UP TO 30% OFF</span>
              <h3 className="text-2xl font-black mt-3 mb-1">Chargers & Cables</h3>
              <p className="text-orange-100 text-sm mb-4">Grab fast chargers and quality cables at unbeatable prices.</p>
              <Link href="/shop?category=fast-chargers" className="bg-white text-orange-600 font-bold px-5 py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors inline-block">Shop Now</Link>
            </div>
            <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 overflow-hidden text-white">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-orange-500/10 rounded-full" />
              <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full">NEW ARRIVALS</span>
              <h3 className="text-2xl font-black mt-3 mb-1">Wireless Earbuds</h3>
              <p className="text-gray-400 text-sm mb-4">Latest TWS earbuds with ANC and premium sound quality.</p>
              <Link href="/shop?category=wireless-earbuds" className="bg-orange-500 text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors inline-block">Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-12">Why Choose Ali Traders?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: <Shield size={32} />, title: "Genuine Products", desc: "100% original & authentic items only" },
              { icon: <DollarSign size={32} />, title: "Affordable Prices", desc: "Best prices in Rahim Yar Khan" },
              { icon: <Truck size={32} />, title: "Fast Delivery", desc: "Quick local & nationwide delivery" },
              { icon: <Lock size={32} />, title: "Secure Payments", desc: "Safe and trusted payment methods" },
              { icon: <Headphones size={32} />, title: "24/7 Support", desc: "Always here to help via WhatsApp" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">{icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-12">What Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < r.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"} />)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">"{r.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">{r.name[0]}</div>
                  <div><p className="font-semibold text-sm text-gray-900 dark:text-white">{r.name}</p><p className="text-xs text-gray-400">{r.date}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-4">Ready to Shop?</h2>
          <p className="text-orange-100 mb-8">Visit our store or order online. Fast delivery in Rahim Yar Khan and all over Pakistan.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">Browse Products</Link>
            <a href="https://wa.me/923218671396" target="_blank" rel="noopener noreferrer"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">💬 WhatsApp Order</a>
          </div>
        </div>
      </section>
    </>
  );
}
