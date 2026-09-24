// MechanicDashboardLayout.jsx
import { useState } from "react";
import {
  LayoutDashboard,
  UserCog,
  ClipboardCheck,
  CalendarDays,
  LogOut,
  Wrench,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import NotificationBell from "../../components/notifications/NotificationBell";

const NAV_ITEMS = [
  { to: "/mechanic/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mechanic/profile", label: "My Profile", icon: UserCog },
  { to: "/mechanic/inspection-requests", label: "Inspection Requests", icon: ClipboardCheck },
  { to: "/mechanic/availability", label: "Availability", icon: CalendarDays },
  { to: "/mechanic/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/mechanic/reviews", label: "Reviews", icon: Star },
];

export default function MechanicDashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = (user?.name || "M")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#111915]">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#111915]/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Fixed + Mobile Slide-over Drawer) */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#E2ECE6] bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#E2ECE6]/60">
          <Link
            to="/mechanic/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#065F46] text-white shadow-sm shadow-[#065F46]/20">
              <Wrench size={18} strokeWidth={2} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-[#111915]">CarCheck</p>
              <p className="text-[11px] font-semibold text-[#065F46]">PRO SERVICE</p>
            </div>
          </Link>

          {/* Close drawer button on mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1 text-[#8BA094] hover:bg-[#F0F7F2] hover:text-[#111915] md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl py-2.5 pl-4 pr-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#E6F4EA] text-[#065F46]"
                    : "text-[#5A6E63] hover:bg-[#F0F7F2] hover:text-[#111915]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-all ${
                      isActive ? "bg-[#065F46]" : "bg-transparent"
                    }`}
                  />
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className={
                      isActive
                        ? "text-[#065F46]"
                        : "text-[#8BA094] group-hover:text-[#5A6E63]"
                    }
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="border-t border-[#E2ECE6] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#F0F7F2] p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#065F46]/10 font-mono text-xs font-semibold text-[#065F46]">
              {initials}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-semibold text-[#111915]">{user?.name}</p>
              <p className="text-[10px] text-[#5A6E63]">Mechanic</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8BA094] transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="md:ml-64">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#E2ECE6] bg-white/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2ECE6] text-[#5A6E63] hover:bg-[#F0F7F2] hover:text-[#111915] md:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="leading-tight">
              <p className="text-sm font-semibold text-[#111915]">
                Welcome back, {user?.name}
              </p>
              <p className="text-xs text-[#5A6E63]">Mechanic workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationBell />
            <div className="h-6 w-px bg-[#E2ECE6]" />
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#065F46]/10 font-mono text-xs font-semibold text-[#065F46]">
              {initials}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}