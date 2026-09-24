import { Loader2, Car, Gauge, Cpu } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#080B12] text-[#E7ECF5] overflow-hidden selection:bg-[#37D6C4]/30 selection:text-[#37D6C4]">
      {/* Background Tech Grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" aria-hidden="true">
        <defs>
          <pattern id="loading-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#37D6C4" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#loading-grid)" />
      </svg>

      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#37D6C4]/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9B8CF2]/10 blur-[110px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Diagnostic Radar Badge */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
          {/* Outer Pulsing Radar Ring */}
          <div className="absolute inset-0 rounded-full border border-[#37D6C4]/20 animate-ping opacity-20 [animation-duration:3s]" />
          
          {/* Spinning Outer Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-t-[#37D6C4] border-r-transparent border-b-[#9B8CF2] border-l-transparent animate-spin [animation-duration:2.5s]" />
          
          {/* Reverse Spinning Dashed Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#37D6C4]/40 animate-spin [animation-duration:6s] [animation-direction:reverse]" />

          {/* Core Brand Square */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#37D6C4]/40 bg-[#10151F] shadow-2xl shadow-[#37D6C4]/20 backdrop-blur-xl">
            <Car size={22} className="text-[#37D6C4] animate-pulse" />
          </div>

          {/* Orbiting Tech Points */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-[#37D6C4] p-1 shadow-sm shadow-[#37D6C4]">
            <Gauge size={10} className="text-[#080B12]" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#9B8CF2] p-1 shadow-sm shadow-[#9B8CF2]">
            <Cpu size={10} className="text-[#080B12]" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-sm font-bold tracking-widest text-white">
            CAR<span className="text-[#37D6C4]">CHECK</span>
          </span>
          <span className="rounded-full bg-[#37D6C4]/10 border border-[#37D6C4]/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#37D6C4]">
            v2.4
          </span>
        </div>

        {/* Animated Loading Text */}
        <div className="flex items-center gap-2">
          <Loader2 size={14} className="animate-spin text-[#37D6C4]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#8993A8]">
            Initializing Diagnostics System
          </p>
        </div>

        {/* Infinite Sliding Progress Bar */}
        <div className="mt-5 h-1.5 w-44 overflow-hidden rounded-full border border-white/[0.08] bg-[#10151F] p-0.5 shadow-inner">
          <div className="h-full w-full rounded-full bg-[#080B12] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#37D6C4] to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Footer Subtext */}
        <p className="mt-4 font-mono text-[10px] text-[#5B6478]">
          Connecting to vehicle telemetry...
        </p>
      </div>

      {/* Tailwind Custom Keyframes Extension Notice */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite linear;
        }
      `}</style>
    </div>
  );
}