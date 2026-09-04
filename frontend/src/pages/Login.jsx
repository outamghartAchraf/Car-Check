import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Lock, Mail } from "lucide-react";

import { useUserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useUserContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const authenticatedUser = await login(
        form.email,
        form.password
      );

      if (authenticatedUser.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (
        authenticatedUser.role === "mechanic"
      ) {
        navigate("/mechanic/dashboard", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setError(
          "The email or password is incorrect."
        );
      } else {
        setError(
          "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Car size={28} />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-slate-400">
            Sign in to your CarCheck account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
        >
          {error && (
            <div className="mb-5 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-500 hover:text-blue-400"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}