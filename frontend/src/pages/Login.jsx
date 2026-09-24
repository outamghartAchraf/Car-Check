import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Wrench, FileCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";

import { useUserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useUserContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const authenticatedUser = await login(form.email, form.password);

      if (authenticatedUser.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (authenticatedUser.role === "mechanic") {
        navigate("/mechanic/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setError("The email or password is incorrect.");
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#080B12] text-[#E7ECF5] selection:bg-[#37D6C4]/30 selection:text-[#37D6C4] lg:grid-cols-2">
      {/* Left: Brand panel with Vehicle Inspection Image */}
      <div className="relative hidden overflow-hidden border-r border-white/[0.06] bg-[#0B0F18] lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Project Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop"
            alt="Vehicle Inspection & Diagnostics"
            className="h-full w-full object-cover object-center opacity-40"
          />
          {/* Gradient Overlay for Text Clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/60 to-[#080B12]/80" />
        </div>

        {/* Ambient Glows */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 z-0 h-96 w-96 rounded-full opacity-30 blur-[130px]"
          style={{ background: "#37D6C4" }}
        />

        {/* Brand Header */}
        <Link to="/" className="relative z-10 flex items-center gap-3 group w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#37D6C4]/30 bg-[#37D6C4]/10 shadow-lg shadow-[#37D6C4]/5 transition group-hover:border-[#37D6C4]/50">
            <span className="font-mono text-base font-bold text-[#37D6C4]">CC</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-white group-hover:text-[#37D6C4] transition-colors">CarCheck</p>
            <p className="text-[11px] text-[#8993A8]">Inspection Platform</p>
          </div>
        </Link>

        {/* Main Pitch */}
        <div className="relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#37D6C4]/30 bg-[#37D6C4]/15 px-3 py-1 text-xs font-medium text-[#37D6C4] mb-6 backdrop-blur-md">
            <Sparkles size={13} />
            <span>Secure Access Console</span>
          </div>

          <h2 className="max-w-md font-serif text-3xl xl:text-4xl leading-tight text-white tracking-tight drop-shadow-md">
            Welcome back to certainty, <span className="text-[#37D6C4]">one inspection</span> at a time.
          </h2>
          <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-[#C7CEDB] drop-shadow-sm">
            Sign in to manage your vehicles, track requests, and review your comprehensive inspection reports in real-time.
          </p>

          <div className="mt-8 space-y-3.5 max-w-md">
            <TrustItem icon={ShieldCheck} text="Certified mechanics, verified before every job" />
            <TrustItem icon={Wrench} text="120-point diagnostics on every inspection" />
            <TrustItem icon={FileCheck} text="Full digital report delivered within 24h" />
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between font-mono text-xs text-[#8993A8]">
          <p>&copy; {new Date().getFullYear()} CarCheck Systems</p>
          <div className="flex items-center gap-1.5 text-[#37D6C4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#37D6C4]" />
            <span>Encrypted Connection</span>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="relative flex items-center justify-center px-6 py-12 sm:px-8">
        {/* Background Ambient Glow for Mobile */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#37D6C4]/10 blur-[120px]" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#37D6C4]/30 bg-[#37D6C4]/10 shadow-lg shadow-[#37D6C4]/10">
                <span className="font-mono text-lg font-bold text-[#37D6C4]">CC</span>
              </div>
              <div className="text-left leading-tight">
                <p className="text-base font-semibold tracking-tight text-white">CarCheck</p>
                <p className="text-xs text-[#5B6478]">Inspection Platform</p>
              </div>
            </Link>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Welcome back</h1>
            <p className="mt-2 text-xs sm:text-sm text-[#8993A8]">
              Sign in to access your CarCheck dashboard
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/[0.08] bg-[#10151F] p-6 shadow-xl shadow-black/40 sm:p-8"
          >
            {error && (
              <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-[#F2637A]/20 bg-[#F2637A]/10 px-4 py-3 text-xs font-medium text-[#F2637A]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F2637A]" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#B7BECC]">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6478]"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B0F18] py-3 pl-10 pr-4 text-xs sm:text-sm text-white outline-none transition placeholder:text-[#5B6478] focus:border-[#37D6C4]/40 focus:ring-2 focus:ring-[#37D6C4]/10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#B7BECC]">
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock
                  size={17}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6478]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B0F18] py-3 pl-10 pr-10 text-xs sm:text-sm text-white outline-none transition placeholder:text-[#5B6478] focus:border-[#37D6C4]/40 focus:ring-2 focus:ring-[#37D6C4]/10"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B6478] transition-colors hover:text-[#C7CEDB]"
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.75} />
                  ) : (
                    <Eye size={16} strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#37D6C4] py-3 text-xs sm:text-sm font-semibold text-[#080B12] shadow-lg shadow-[#37D6C4]/10 transition-all hover:bg-[#2fc4b3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Register Footer Link */}
            <p className="mt-6 text-center text-xs text-[#5B6478]">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-[#37D6C4] transition-colors hover:text-[#2fc4b3]">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function TrustItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.1] bg-[#0B0F18]/80 p-3 backdrop-blur-md transition hover:bg-white/[0.04]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#37D6C4]/30 bg-[#37D6C4]/10 text-[#37D6C4]">
        <Icon size={15} strokeWidth={1.75} />
      </div>
      <p className="text-xs text-[#E7ECF5] font-medium">{text}</p>
    </div>
  );
}