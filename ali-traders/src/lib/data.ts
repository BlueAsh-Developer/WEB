export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  badge?: string;
  inStock: boolean;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
};

export const categories: Category[] = [
  { id: "mobile-phones", name: "Mobile Phones", icon: "📱", count: 0 },
  { id: "headphones", name: "Headphones", icon: "🎧", count: 0 },
  { id: "wireless-earbuds", name: "Wireless Earbuds", icon: "🎵", count: 0 },
  { id: "handfrees", name: "Handfrees", icon: "🎙️", count: 0 },
  { id: "charging-cables", name: "Charging Cables", icon: "🔌", count: 0 },
  { id: "fast-chargers", name: "Fast Chargers", icon: "⚡", count: 0 },
  { id: "power-adapters", name: "Power Adapters", icon: "🔋", count: 0 },
  { id: "power-banks", name: "Power Banks", icon: "🔌", count: 0 },
  { id: "bluetooth-speakers", name: "Bluetooth Speakers", icon: "🔊", count: 0 },
  { id: "smart-watches", name: "Smart Watches", icon: "⌚", count: 0 },
  { id: "computer-accessories", name: "Computer Accessories", icon: "💻", count: 0 },
  { id: "mobile-accessories", name: "Mobile Accessories", icon: "📲", count: 0 },
];

// Products will be added via the admin dashboard
export const products: Product[] = [];

export const reviews = [
  { id: 1, name: "Ahmed Ali", rating: 5, date: "2026-05-10", comment: "Excellent quality products and very fast delivery. Highly recommend Ali Traders!" },
  { id: 2, name: "Fatima Khan", rating: 5, date: "2026-04-28", comment: "Got my JBL headphones in perfect condition. The price was the best I found in Rahim Yar Khan." },
  { id: 3, name: "Muhammad Usman", rating: 4, date: "2026-04-15", comment: "Good service and genuine products. The charger is working great. Will buy again." },
  { id: 4, name: "Sara Malik", rating: 5, date: "2026-03-22", comment: "WhatsApp order was so easy! Quick response and original product. Very satisfied." },
];
