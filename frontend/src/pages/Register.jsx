import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, Wrench, FileCheck, ArrowRight, Loader2, Sparkles, UserCheck } from "lucide-react";

import { useUserContext } from "../context/UserContext";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useUserContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "client", // Default role
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({});
    setLoading(true);

    try {
      // Pass form.role as well if your register context expects it
      // Depending on your context implementation, you might pass it as a 5th argument or inside an object.
      // e.g., await register(form.name, form.email, form.password, form.password_confirmation, form.role);
      const user = await register(
        form.name,
        form.email,
        form.password,
        form.password_confirmation,
        form.role
      );

      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user?.role === "mechanic") {
        navigate("/mechanic/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({ general: "Registration failed." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#080B12] text-[#E7ECF5] selection:bg-[#37D6C4]/30 selection:text-[#37D6C4] lg:grid-cols-2">
      {/* Left: brand panel with Clear Background Image */}
      <div className="relative hidden overflow-hidden border-r border-white/[0.06] bg-[#0B0F18] lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Project Background Image with Clearer Opacity */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop"
            alt="Vehicle Inspection & Diagnostics"
            className="h-full w-full object-cover object-center opacity-40"
          />
          {/* Gradient Overlay to Keep Text Readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/60 to-[#080B12]/80" />
        </div>

        {/* Background Grid Pattern */}
        <svg className="absolute inset-0 z-0 h-full w-full opacity-[0.03]" aria-hidden="true">
          <defs>
            <pattern id="reg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#37D6C4" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#reg-grid)" />
        </svg>

        {/* Ambient Glows */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 z-0 h-96 w-96 rounded-full opacity-30 blur-[130px]"
          style={{ background: "#37D6C4" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-20 z-0 h-80 w-80 rounded-full opacity-30 blur-[130px]"
          style={{ background: "#9B8CF2" }}
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
            <span>Registration Console</span>
          </div>

          <h2 className="max-w-md font-serif text-3xl xl:text-4xl leading-tight text-white tracking-tight drop-shadow-md">
            Join a network built on <span className="text-[#37D6C4]">trust and transparency.</span>
          </h2>
          <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-[#C7CEDB] drop-shadow-sm">
            Create an account to request inspections, track vehicles, and connect with certified mechanics near you.
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
            <span>Instant Activation</span>
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
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Create account</h1>
            <p className="mt-2 text-xs sm:text-sm text-[#8993A8]">Join CarCheck today</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#10151F] p-6 shadow-xl shadow-black/40 sm:p-8">
            {errors.general && (
              <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-[#F2637A]/20 bg-[#F2637A]/10 px-4 py-3 text-xs font-medium text-[#F2637A]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F2637A]" />
                <span>{errors.general}</span>
              </div>
            )}

            <Input
              label="Full Name"
              name="name"
              icon={User}
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              error={errors.name}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
            />

            {/* Role Select Dropdown */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#B7BECC]">
                I want to register as
              </label>
              <div className="relative">
                <UserCheck
                  size={17}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6478]"
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B0F18] py-3 pl-10 pr-4 text-xs sm:text-sm text-white outline-none transition focus:border-[#37D6C4]/40 focus:ring-2 focus:ring-[#37D6C4]/10"
                >
                  <option value="client" className="bg-[#0B0F18] text-white">Client (Vehicle Owner)</option>
                  <option value="mechanic" className="bg-[#0B0F18] text-white">Mechanic / Inspector</option>
                </select>
              </div>
              {errors.role && <p className="mt-1.5 text-[11px] text-[#F2637A] font-medium">{errors.role[0]}</p>}
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              revealable
            />

            <Input
              label="Confirm Password"
              type="password"
              name="password_confirmation"
              icon={Lock}
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password_confirmation}
              revealable
            />

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#37D6C4] py-3 text-xs sm:text-sm font-semibold text-[#080B12] shadow-lg shadow-[#37D6C4]/10 transition-all hover:bg-[#2fc4b3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <p className="mt-6 text-center text-xs text-[#5B6478]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#37D6C4] transition-colors hover:text-[#2fc4b3]">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", name, icon: Icon, value, onChange, placeholder, error, revealable }) {
  const [visible, setVisible] = useState(false);
  const resolvedType = revealable ? (visible ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#B7BECC]">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6478]"
          />
        )}

        <input
          type={resolvedType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className={`w-full rounded-xl border bg-[#0B0F18] py-3 text-xs sm:text-sm text-white outline-none transition placeholder:text-[#5B6478] focus:border-[#37D6C4]/40 focus:ring-2 focus:ring-[#37D6C4]/10 ${
            error ? "border-[#F2637A]/40" : "border-white/[0.08]"
          } ${Icon ? "pl-10" : "pl-4"} ${revealable ? "pr-10" : "pr-4"}`}
        />

        {revealable && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B6478] transition-colors hover:text-[#C7CEDB]"
          >
            {visible ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-[11px] text-[#F2637A] font-medium">{error[0]}</p>}
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