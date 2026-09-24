import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Wrench,
  CalendarCheck,
  ClipboardCheck,
  ArrowRight,
  Activity,
  FileCheck,
  Menu,
  X,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Submit Inspection Request",
    desc: "Choose your vehicle package, set your location and preferred date slot in seconds.",
  },
  {
    number: "02",
    title: "Certified Mechanic Assigned",
    desc: "An expert mechanic accepts the request and prepares for the physical inspection.",
  },
  {
    number: "03",
    title: "Comprehensive Vehicle Audit",
    desc: "Detailed multi-point diagnostics performed on-site with full structural and electronic checks.",
  },
  {
    number: "04",
    title: "Get Full Digital Report",
    desc: "Receive an official verification report detailing overall condition and recommended fixes.",
  },
];

const SCAN_ROWS = [
  { label: "Engine", value: "Good", pct: 96, color: "#37D6C4" },
  { label: "Brakes", value: "Good", pct: 91, color: "#37D6C4" },
  { label: "Suspension", value: "Average", pct: 68, color: "#F4A94A" },
  { label: "Electrical", value: "Good", pct: 88, color: "#37D6C4" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080B12] text-[#E7ECF5] selection:bg-[#37D6C4]/30 selection:text-[#37D6C4]">
      {/* Background: blueprint grid + glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <svg className="absolute inset-0 h-full w-full opacity-[0.035]" aria-hidden="true">
          <defs>
            <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#37D6C4" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#37D6C4]/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-[#9B8CF2]/10 blur-[140px]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080B12]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#37D6C4]/30 bg-[#37D6C4]/10">
              <span className="font-mono text-sm font-semibold text-[#37D6C4]">CC</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-white">CarCheck</p>
              <p className="text-[11px] text-[#5B6478]">Inspection Platform</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="group relative text-xs text-[#8993A8] transition hover:text-white">
              Features
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#37D6C4] transition-all group-hover:w-full" />
            </a>
            <a href="#how-it-works" className="group relative text-xs text-[#8993A8] transition hover:text-white">
              How it Works
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#37D6C4] transition-all group-hover:w-full" />
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-medium text-[#C7CEDB] transition hover:border-white/[0.15] hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-[#37D6C4]/30 bg-[#37D6C4]/10 px-4 py-2 text-xs font-medium text-[#37D6C4] transition hover:bg-[#37D6C4]/20"
            >
              Book Inspection
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#C7CEDB] md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="border-t border-white/[0.06] bg-[#080B12] px-6 py-5 md:hidden">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[#C7CEDB] transition hover:text-white"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[#C7CEDB] transition hover:text-white"
              >
                How it Works
              </a>
            </nav>

            <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-5">
              <Link
                to="/login"
                className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-center text-sm font-medium text-[#C7CEDB] transition hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-[#37D6C4]/30 bg-[#37D6C4]/10 px-4 py-2.5 text-center text-sm font-medium text-[#37D6C4] transition hover:bg-[#37D6C4]/20"
              >
                Book Inspection
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#37D6C4]/20 bg-[#37D6C4]/10 px-3.5 py-1 text-xs text-[#37D6C4]">
              <ShieldCheck size={14} />
              <span>Trusted Vehicle Inspection Platform</span>
            </div>

            <h1 className="mx-auto max-w-2xl font-serif text-3xl leading-tight tracking-tight text-white sm:text-5xl md:text-[3.4rem] lg:mx-0">
              Buy used cars with absolute <span className="text-[#37D6C4]">confidence.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#8993A8] lg:mx-0">
              Connect with certified mechanics for on-demand, multi-point pre-purchase vehicle
              inspections. Get real-time diagnostics before spending a single dollar.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/request-inspection"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#37D6C4] px-6 py-3.5 text-xs font-semibold text-[#080B12] transition hover:bg-[#2fc4b3] sm:w-auto"
              >
                <span>Schedule Inspection Now</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#10151F] px-6 py-3.5 text-xs font-medium text-[#E7ECF5] transition hover:bg-white/[0.06] sm:w-auto"
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Platform Metrics */}
            <div className="mx-auto mt-14 grid max-w-lg grid-cols-2 gap-4 lg:mx-0 lg:max-w-none lg:grid-cols-4">
              <StatCard label="Inspections" value="4,800+" />
              <StatCard label="Mechanics" value="180+" />
              <StatCard label="Satisfaction" value="99.4%" />
              <StatCard label="Turnaround" value="< 24h" />
            </div>
          </div>

          {/* Right: diagnostic readout visual */}
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div
              className="pointer-events-none absolute -inset-6 rounded-3xl opacity-30 blur-2xl"
              style={{ background: "linear-gradient(135deg, #37D6C4, #9B8CF2)" }}
            />

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10151F] shadow-2xl">
              {/* Readout header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Activity size={15} strokeWidth={1.75} className="text-[#37D6C4]" />
                  <span className="text-xs font-medium text-[#C7CEDB]">Live diagnostic scan</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-[#5B6478]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#37D6C4]" />
                  Running
                </span>
              </div>

              {/* Vehicle row */}
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
                <img
                  src="https://picsum.photos/seed/carcheck-golf/80/80"
                  alt="2021 Volkswagen Golf"
                  loading="lazy"
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-white">2021 Volkswagen Golf</p>
                  <p className="font-mono text-xs text-[#5B6478]">120-Point Comprehensive Scan</p>
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-4 px-5 py-5">
                {SCAN_ROWS.map((row) => (
                  <div key={row.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-[#C7CEDB]">{row.label}</span>
                      <span className="font-mono" style={{ color: row.color }}>
                        {row.value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${row.pct}%`, backgroundColor: row.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
                <span className="flex items-center gap-1.5 text-xs text-[#8993A8]">
                  <FileCheck size={14} strokeWidth={1.75} className="text-[#37D6C4]" />
                  Report ready in &lt; 24h
                </span>
                <span className="font-mono text-[11px] text-[#5B6478]">#INS-4821</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-t border-white/[0.06] bg-[#0B0F18]/50 py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#37D6C4]">Why CarCheck</p>
            <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl">Built for Complete Transparency</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Wrench}
              title="Certified Mechanics Only"
              desc="Every mechanic undergoes strict verification and credential checks before accepting assignments."
            />
            <FeatureCard
              icon={ClipboardCheck}
              title="Rigorous Multi-Point Audit"
              desc="From OBD2 error codes to chassis integrity, we test every critical vehicle component."
            />
            <FeatureCard
              icon={CalendarCheck}
              title="Real-Time Scheduling"
              desc="Pick your preferred date slot and location. Mechanics work around your schedule."
            />
          </div>
        </div>
      </section>

      {/* Photo band */}
      <section className="border-t border-white/[0.06]">
        <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
          <img
            src="https://picsum.photos/seed/carcheck-garage/1600/700"
            alt="Certified mechanic inspecting a vehicle in a garage"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/60 to-[#080B12]/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-8 sm:pb-10">
              <p className="font-mono text-xs uppercase tracking-widest text-[#37D6C4]">
                On-site, every time
              </p>
              <h3 className="mt-1 max-w-md font-serif text-xl text-white sm:text-2xl">
                Real mechanics, real garages, real diagnostics.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#37D6C4]">Simple Process</p>
            <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl">How CarCheck Works</h2>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line (desktop only) */}
            <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent lg:block" />

            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-4 hidden h-2.5 w-2.5 rounded-full border-2 border-[#37D6C4] bg-[#080B12] lg:block" />
                <div className="rounded-xl border border-white/[0.06] bg-[#10151F] p-5">
                  <span className="mb-2 block font-mono text-2xl font-bold text-[#37D6C4]/30">
                    {step.number}
                  </span>
                  <h3 className="mb-1.5 text-sm font-semibold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#8993A8]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#080B12] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:px-8">
          <p className="text-xs text-[#5B6478]">
            &copy; {new Date().getFullYear()} CarCheck Systems. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#8993A8]">
            <a href="#" className="transition hover:text-white">Privacy Policy</a>
            <a href="#" className="transition hover:text-white">Terms of Service</a>
            <a href="#" className="transition hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#10151F] p-4 text-center">
      <p className="font-mono text-xl font-bold text-white sm:text-2xl">{value}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[#5B6478]">{label}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#10151F] p-5">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#37D6C4]/20 bg-[#37D6C4]/10 text-[#37D6C4]">
        <Icon size={18} />
      </div>
      <h3 className="mb-1 text-sm font-semibold tracking-tight text-white">{title}</h3>
      <p className="text-xs leading-relaxed text-[#8993A8]">{desc}</p>
    </div>
  );
}