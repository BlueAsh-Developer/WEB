import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-3">404</h1>
      <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <div className="flex gap-4">
        <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">Go Home</Link>
        <Link href="/shop" className="border border-orange-500 text-orange-500 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors">Shop Now</Link>
      </div>
    </div>
  );
}
