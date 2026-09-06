import {
  Car,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  User,
    Star,

  FileText,
} from "lucide-react";

import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";



import { useUserContext } from "../../context/UserContext";

export default function ClientDashboardLayout() {
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
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-white md:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-bold"
          >
            <Car className="text-blue-600" />
            CarCheck
          </Link>
        </div>

        <nav className="space-y-2 p-4">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

           <NavLink
    to="/dashboard"
    end
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`
    }
  >
    <LayoutDashboard size={19} />

    Dashboard
  </NavLink>

             <NavLink
    to="/dashboard/appointments"
    end
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`
    }
  >
    <LayoutDashboard size={19} />

    Appointments
  </NavLink>



  <NavLink
    to="/dashboard/vehicles"
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`
    }
  >
    <Car size={19} />

    My Vehicles
  </NavLink>

  <NavLink
    to="/dashboard/inspection-requests"
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`
    }
  >
    <ClipboardCheck size={19} />

    Inspections
  </NavLink>

   <NavLink
  to="/dashboard/inspection-reports"
  end
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`
  }
>
  <FileText size={19} />
  <span>Inspection Reports</span>
</NavLink>
         

           
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <h1 className="font-semibold text-slate-900">
              Client Dashboard
            </h1>

            <p className="text-xs text-slate-500">
              Welcome, {user?.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
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