"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c08] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#1f431e]/15 flex items-center justify-center">
          <RefreshCw className="w-9 h-9 text-[#a3c4a0]" strokeWidth={1.8} />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-white">
            Something went wrong
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed">
            An unexpected error occurred. Your cart is safe — try refreshing, or
            head back home to continue shopping.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/15 text-stone-300 rounded-xl text-sm font-bold hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
        {error.digest && (
          <p className="text-[10px] text-stone-600 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
