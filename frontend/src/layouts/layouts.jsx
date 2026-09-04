import { Link, Outlet } from "react-router-dom";
import { Car } from "lucide-react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Car size={20} />
            </div>

            <span className="text-xl font-bold text-slate-900">
              CarCheck
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}