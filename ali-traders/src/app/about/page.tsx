import { Shield, Users, Award, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us – Ali Traders",
  description: "Learn about Ali Traders, your trusted tech accessories store in Rahim Yar Khan.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-black">AT</div>
          <h1 className="text-4xl font-black mb-4">About Ali Traders</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Your Trusted Tech Accessories Store in Rahim Yar Khan</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Ali Traders was established with a simple mission: to bring quality, genuine technology accessories to the people of Rahim Yar Khan and surrounding areas at affordable prices.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Located on Abu Dhabi Road, Rahim Yar Khan, we have become the go-to destination for mobile phone accessories, headphones, chargers, cables, and everything in between.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We take pride in selling only 100% genuine products from trusted brands including Samsung, Anker, JBL, Baseus, Xiaomi, Logitech, and more.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Award size={24} />, label: "5+ Years Experience" },
              { icon: <Users size={24} />, label: "5000+ Happy Customers" },
              { icon: <Shield size={24} />, label: "100% Genuine Products" },
              { icon: <Award size={24} />, label: "500+ Products" },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:border-orange-400 transition-colors">
                <div className="text-orange-500 flex justify-center mb-2">{icon}</div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: "✅", title: "Authenticity", desc: "Every product we sell is 100% genuine. No replicas, no counterfeits – ever." },
              { emoji: "💰", title: "Affordability", desc: "We believe quality tech shouldn't break the bank. Best prices guaranteed." },
              { emoji: "❤️", title: "Customer First", desc: "Your satisfaction is our top priority. We're available on WhatsApp 7 days a week." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Visit Us</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-start gap-3 text-left mb-4">
              <MapPin className="text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Ali Traders</p>
                <p className="text-gray-500">Abu Dhabi Road, Rahim Yar Khan, Punjab, Pakistan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <Phone className="text-orange-500 shrink-0" />
              <div>
                <a href="tel:03218671396" className="block text-gray-700 dark:text-gray-300 hover:text-orange-500">0321-8671396</a>
                <a href="tel:03009673864" className="block text-gray-700 dark:text-gray-300 hover:text-orange-500">0300-9673864</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
