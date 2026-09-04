import {
  Calendar,
  Car,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  User,
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

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-slate-950 text-white md:block">
        <div className="flex h-16 items-center px-6 text-xl font-bold">
          🚗 CarCheck
        </div>

        <nav className="space-y-2 p-4">
          <NavLink
            to="/mechanic/dashboard"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/mechanic/requests"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <ClipboardCheck size={18} />
            Requests
          </NavLink>

          <NavLink
            to="/mechanic/calendar"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <Calendar size={18} />
            Calendar
          </NavLink>

          <NavLink
            to="/mechanic/profile"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            <User size={18} />
            Profile
          </NavLink>
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <h1 className="font-semibold">
              Mechanic Dashboard
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