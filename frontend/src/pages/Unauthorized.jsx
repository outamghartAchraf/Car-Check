import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="text-center">
        <p className="text-7xl font-black text-red-500">
          403
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Unauthorized
        </h1>

        <p className="mt-3 text-slate-400">
          You don't have permission to access this page.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}