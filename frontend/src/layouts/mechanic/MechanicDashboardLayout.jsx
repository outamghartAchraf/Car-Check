import {
  LayoutDashboard,
  UserCog,
  ClipboardCheck,
  CalendarDays,
  LogOut,
  Wrench,
    Star,

} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useUserContext } from "../../context/UserContext";

export default function MechanicDashboardLayout() {
  const navigate = useNavigate();

  const { user, logout } = useUserContext();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const links = [
    {
      label: "Dashboard",
      path: "/mechanic/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Profile",
      path: "/mechanic/profile",
      icon: UserCog,
    },
    {
      label: "Inspection Requests",
      path: "/mechanic/inspection-requests",
      icon: ClipboardCheck,
    },
 
    {
      label: "Availability",
      path: "/mechanic/availability",
      icon: CalendarDays,
    },
    {
      label: "Appointments",
      path: "/mechanic/appointments",
      icon: CalendarDays,
    },
    {
      label: "Reviews",
      path: "/mechanic/reviews",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-200 bg-white md:block">

          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Wrench size={20} />
            </div>

            <span className="font-bold text-slate-900">
              CarCheck
            </span>
          </div>

          <div className="p-4">

            <div className="mb-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Mechanic
              </p>

              <p className="mt-1 truncate font-semibold text-slate-900">
                {user?.name}
              </p>
            </div>

            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon size={19} />

                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 w-64 border-t border-slate-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={19} />

              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">

          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div>
              <p className="text-sm text-slate-500">
                Welcome back
              </p>

              <p className="font-semibold text-slate-900">
                {user?.name}
              </p>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}