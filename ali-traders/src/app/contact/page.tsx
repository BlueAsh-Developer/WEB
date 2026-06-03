"use client";
import { useState } from "react";
import { MapPin, Phone, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 text-center">
        <img src="/logo.jpg" alt="Ali Traders" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4" />
        <h1 className="text-4xl font-black mb-3">Contact Us</h1>
        <p className="text-gray-400 text-lg">We'd love to hear from you. Reach out anytime!</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Get in Touch</h2>
            <div className="space-y-5 mb-8">
              <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Visit Our Store</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Abu Dhabi Road, Rahim Yar Khan, Punjab, Pakistan</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Call / WhatsApp</p>
                  <a href="tel:03218671396" className="text-sm text-gray-500 hover:text-orange-500 block">0321-8671396</a>
                  <a href="tel:03009673864" className="text-sm text-gray-500 hover:text-orange-500 block">0300-9673864</a>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Store Hours</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mon–Sat: 9:00 AM – 9:00 PM</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sunday: 11:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/923218671396?text=Hello%20Ali%20Traders!" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>

            {/* Map */}
            <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3474.6!2d70.2960!3d28.4212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI1JzE2LjMiTiA3MMKwMTcnNDUuNiJF!5e0!3m2!1sen!2spk!4v1!5m2!1sen!2spk"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Ali Traders Location"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Send a Message</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you as soon as possible.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", phone: "", email: "", subject: "", message: "" }); }}
                  className="mt-4 text-orange-500 hover:underline text-sm">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                {[
                  { id: "name", label: "Your Name", placeholder: "Full name", type: "text", required: true },
                  { id: "phone", label: "Phone Number", placeholder: "03XX-XXXXXXX", type: "tel", required: true },
                  { id: "email", label: "Email Address", placeholder: "your@email.com", type: "email", required: false },
                  { id: "subject", label: "Subject", placeholder: "How can we help?", type: "text", required: true },
                ].map(({ id, label, placeholder, type, required }) => (
                  <div key={id}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
                    <input type={type} required={required} placeholder={placeholder}
                      value={form[id as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message <span className="text-red-500">*</span></label>
                  <textarea rows={5} required placeholder="Write your message here..."
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none" />
                </div>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
