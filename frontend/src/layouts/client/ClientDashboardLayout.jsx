// ClientDashboardLayout.jsx
import { useState } from "react";
import {
  Car,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  CalendarCheck,
  Menu,
  X,
} from "lucide-react";

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useUserContext } from "../../context/UserContext";
import NotificationBell from "../../components/notifications/NotificationBell";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/dashboard/vehicles", label: "My Vehicles", icon: Car },
  { to: "/dashboard/inspection-requests", label: "Inspections", icon: ClipboardCheck },
  { to: "/dashboard/inspection-reports", label: "Inspection Reports", icon: FileText },
];

export default function ClientDashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = (user?.name || "C")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#2B2A28]">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#201F1D]/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Fixed + Mobile Slide-over Drawer) */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#E8E3DC] bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#E8E3DC]/60">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B8632E]/10">
              <span className="font-mono text-sm font-semibold text-[#B8632E]">CC</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-[#201F1D]">CarCheck</p>
              <p className="text-[11px] text-[#9A948B]">My account</p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1 text-[#9A948B] hover:bg-[#F1EDE7] hover:text-[#3A3733] md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#B8632E]/[0.08] text-[#201F1D]"
                    : "text-[#6B655C] hover:bg-[#F1EDE7] hover:text-[#3A3733]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full transition-colors ${
                      isActive ? "bg-[#B8632E]" : "bg-transparent"
                    }`}
                  />
                  <Icon
                    size={17}
                    strokeWidth={1.75}
                    className={
                      isActive
                        ? "text-[#B8632E]"
                        : "text-[#9A948B] group-hover:text-[#6B655C]"
                    }
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="border-t border-[#E8E3DC] p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EDE7] font-mono text-xs text-[#3A3733]">
              {initials}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm text-[#3A3733]">{user?.name}</p>
              <p className="text-[11px] text-[#9A948B]">Client</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A948B] transition-colors hover:bg-[#F1EDE7] hover:text-[#C0483F]"
            >
              <LogOut size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="md:ml-64">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#E8E3DC] bg-[#F7F5F2]/90 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E3DC] bg-white text-[#6B655C] hover:bg-[#F1EDE7] hover:text-[#3A3733] md:hidden"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>

            <div className="leading-tight">
              <p className="text-sm font-medium text-[#201F1D]">
                Welcome, {user?.name}
              </p>
              <p className="text-xs text-[#9A948B]">Client dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationBell />
            <div className="h-6 w-px bg-[#E8E3DC]" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EDE7] font-mono text-xs text-[#3A3733]">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}