import {
  BarChart3,
  CalendarCheck,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useUserContext } from "../../context/UserContext";

export default function AdminDashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-slate-950 text-white md:block">
        <div className="flex h-16 items-center px-6 text-xl font-bold">
          🚗 CarCheck Admin
        </div>

        <nav className="space-y-2 p-4">
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <Users size={18} />
            Users
          </NavLink>

          <NavLink
            to="/admin/inspections"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <ClipboardCheck size={18} />
            Inspections
          </NavLink>

          <NavLink
            to="/admin/appointments"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <CalendarCheck size={18} />
            Appointments
          </NavLink>

          <NavLink
            to="/admin/statistics"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <BarChart3 size={18} />
            Statistics
          </NavLink>
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <h1 className="font-semibold">
              Administration
            </h1>

            <p className="text-xs text-slate-500">
              {user?.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}