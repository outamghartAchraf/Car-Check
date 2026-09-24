import { Link, Outlet } from "react-router-dom";
import { Car } from "lucide-react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}