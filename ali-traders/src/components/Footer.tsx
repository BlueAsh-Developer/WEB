import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { categories } from "@/lib/data";

const socialLinks = [
  { href: "#", label: "Facebook", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { href: "#", label: "Instagram", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { href: "#", label: "YouTube", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg> },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="Ali Traders" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <div className="font-black text-white text-lg leading-none">Ali Traders</div>
                <div className="text-xs text-orange-400 leading-none">Your Trusted Tech Store</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">Your trusted source for genuine technology accessories and electronics in Rahim Yar Khan.</p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, svg }) => (
                <a key={label} href={href} className="w-8 h-8 bg-gray-700 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors" aria-label={label}>{svg}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[["Home", "/"], ["Shop", "/shop"], ["About Us", "/about"], ["Contact", "/contact"], ["Cart", "/cart"], ["Wishlist", "/wishlist"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 8).map((c) => (
                <li key={c.id}><Link href={`/shop?category=${c.id}`} className="hover:text-orange-400 transition-colors">{c.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <MapPin size={16} className="text-orange-400 mt-0.5 shrink-0" />
                <span>Abu Dhabi Road, Rahim Yar Khan, Punjab, Pakistan</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone size={16} className="text-orange-400 shrink-0" />
                <div>
                  <a href="tel:03218671396" className="hover:text-orange-400 block">0321-8671396</a>
                  <a href="tel:03009673864" className="hover:text-orange-400 block">0300-9673864</a>
                </div>
              </li>
            </ul>
            <a href="https://wa.me/923218671396" target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © 2026 Ali Traders. All Rights Reserved. | Abu Dhabi Road, Rahim Yar Khan
      </div>
    </footer>
  );
}
