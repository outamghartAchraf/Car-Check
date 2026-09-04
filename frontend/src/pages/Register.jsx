import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car } from "lucide-react";

import { useUserContext } from "../context/UserContext";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useUserContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({});
    setLoading(true);

    try {
      const user = await register(
        form.name,
        form.email,
        form.password,
        form.password_confirmation
      );

      if (user?.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (user?.role === "mechanic") {
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
        setErrors(
          error.response.data.errors || {}
        );
      } else {
        setErrors({
          general: "Registration failed.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Car size={28} />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-slate-400">
            Join CarCheck today
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-8"
        >
          {errors.general && (
            <div className="mb-4 rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">
              {errors.general}
            </div>
          )}

          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            error={errors.password_confirmation}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
}) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
      />

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error[0]}
        </p>
      )}
    </div>
  );
}