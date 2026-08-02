export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080c08] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4a373] animate-spin" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
          Loading harvest…
        </p>
      </div>
    </div>
  );
}
