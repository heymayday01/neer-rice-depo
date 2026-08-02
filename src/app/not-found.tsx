import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <p className="font-serif text-7xl font-black text-[#d4a373]">404</p>
          <h2 className="font-serif text-2xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed">
            This page doesn&apos;t exist or has been moved. Let&apos;s get you
            back to the harvest.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white rounded-xl text-sm font-bold transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/#catalog"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/15 text-stone-300 rounded-xl text-sm font-bold hover:bg-white/5 transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Grains
          </Link>
        </div>
      </div>
    </div>
  );
}
