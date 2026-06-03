"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/data";
import { useProducts } from "@/hooks/useProducts";
import { Suspense } from "react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialSearch = searchParams.get("search") ?? "";
  const { products } = useProducts();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const PER_PAGE = 8;

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = !category || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchPrice = p.price <= maxPrice;
      return matchCat && matchSearch && matchPrice;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, category, sort, maxPrice]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Shop</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{filtered.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white">Filters</h2>
              <button onClick={() => { setCategory(""); setMaxPrice(10000); setSearch(""); setPage(1); }}
                className="text-xs text-orange-500 hover:underline">Clear All</button>
            </div>

            {/* Category */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h3>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="cat" value="" checked={category === ""} onChange={() => { setCategory(""); setPage(1); }} className="accent-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">All Categories</span>
                </label>
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="cat" value={c.id} checked={category === c.id} onChange={() => { setCategory(c.id); setPage(1); }} className="accent-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Max Price: Rs. {maxPrice.toLocaleString()}</h3>
              <input type="range" min={100} max={10000} step={100} value={maxPrice}
                onChange={(e) => { setMaxPrice(+e.target.value); setPage(1); }}
                className="w-full accent-orange-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Rs. 100</span><span>Rs. 10,000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-gray-400" /></button>}
            </div>

            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {paginated.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === i + 1 ? "bg-orange-500 text-white" : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-orange-400"}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">No products found</p>
              <button onClick={() => { setSearch(""); setCategory(""); setMaxPrice(10000); }} className="mt-3 text-orange-500 hover:underline text-sm">Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
