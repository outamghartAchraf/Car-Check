// AdminDashboardLayout.jsx
import { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
  Wrench,
  Menu,
  X,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useUserContext } from "../../context/UserContext";
import NotificationBell from "../../components/notifications/NotificationBell";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/mechanics", label: "Mechanics", icon: Wrench },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/inspection-requests", label: "Inspection Requests", icon: ClipboardList },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
];

export default function AdminDashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = (user?.name || "A")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#080B12] text-[#E7ECF5]">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#080B12]/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Fixed Desktop w-[220px] + Responsive Mobile Drawer) */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col border-r border-white/[0.06] bg-[#0B0F18]/95 p-4 backdrop-blur-md transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="relative flex items-center justify-between px-2 mb-6">
          <div
            className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
            style={{ background: "#37D6C4" }}
          />
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#37D6C4]/30 bg-[#37D6C4]/10">
              <span className="font-mono text-sm font-semibold text-[#37D6C4]">CC</span>
            </div>
            <div className="relative leading-tight">
              <p className="text-sm font-semibold tracking-tight text-white">CarCheck</p>
              <p className="text-[11px] text-[#5B6478]">Admin console</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-[#5B6478] hover:bg-white/[0.06] hover:text-[#C7CEDB] md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-white/[0.04] text-white"
                    : "text-[#8993A8] hover:bg-white/[0.03] hover:text-[#C7CEDB]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full transition-colors ${
                      isActive ? "bg-[#37D6C4]" : "bg-transparent"
                    }`}
                  />
                  <Icon
                    size={17}
                    strokeWidth={1.75}
                    className={
                      isActive
                        ? "text-[#37D6C4]"
                        : "text-[#5B6478] group-hover:text-[#8993A8]"
                    }
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="border-t border-white/[0.06] pt-2 mt-auto">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#0B0F18] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] font-mono text-xs text-[#C7CEDB]">
              {initials}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm text-[#DCE1EB]">{user?.name}</p>
              <p className="text-[11px] text-[#5B6478]">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5B6478] transition-colors hover:bg-white/[0.06] hover:text-[#F2637A]"
            >
              <LogOut size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="md:ml-[220px]">
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#080B12]/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#8993A8] hover:bg-white/[0.06] hover:text-white md:hidden"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5B6478]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#37D6C4]" />
              <span>Systems normal</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationBell />
            <div className="h-6 w-px bg-white/[0.08]" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] font-mono text-xs text-[#C7CEDB]">
              {initials}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Main Content */}
        <main className="p-8 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}