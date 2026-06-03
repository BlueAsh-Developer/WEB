"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ShoppingCart, Heart, Sun, Moon, Menu, X, Search, LogOut, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { cartCount, state } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="bg-orange-500 text-white text-xs text-center py-1.5 px-4">
        📦 Free delivery on orders above Rs. 2000 | 📞 0321-8671396
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Ali Traders" width={44} height={44} className="rounded-lg object-cover" />
            <div className="hidden sm:block">
              <div className="font-black text-gray-900 dark:text-white text-lg leading-none">Ali Traders</div>
              <div className="text-xs text-orange-500 leading-none">Your Trusted Tech Store</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Search size={20} className="text-gray-700 dark:text-gray-300" />
            </button>

            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
            </button>

            <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Heart size={20} className="text-gray-700 dark:text-gray-300" />
              {state.wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{state.wishlist.length}</span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </Link>

            {/* User avatar / login */}
            {session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {session.user.image ? (
                    <Image src={session.user.image} alt={session.user.name ?? "User"} width={32} height={32} className="rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {session.user.name?.[0] ?? "U"}
                    </div>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors">
                <User size={15} /> Login
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </form>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                {l.label}
              </Link>
            ))}
            {!session?.user && (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-orange-500">
                Login / Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
