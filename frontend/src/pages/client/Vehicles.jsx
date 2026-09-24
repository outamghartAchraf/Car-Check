import { useEffect, useState } from "react";
import { Car, Plus, Pencil, Trash2, Gauge } from "lucide-react";

import vehicleService from "../../services/vehicleService";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    registration_number: "",
    fuel_type: "",
    transmission: "",
  });

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const response = await vehicleService.getAll();

      setVehicles(response.data.vehicles ?? []);
    } catch (error) {
      console.error(error);
      setError("Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      brand: "",
      model: "",
      year: "",
      mileage: "",
      registration_number: "",
      fuel_type: "",
      transmission: "",
    });

    setEditingVehicle(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const payload = {
        ...form,
        year: Number(form.year),
        mileage: form.mileage === "" ? null : Number(form.mileage),
      };

      if (editingVehicle) {
        await vehicleService.update(editingVehicle.id, payload);
      } else {
        await vehicleService.create(payload);
      }

      resetForm();
      await loadVehicles();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors ?? {})[0];

        setError(firstError?.[0] ?? "Please check your information.");
      } else {
        setError("Unable to save vehicle.");
      }
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);

    setForm({
      brand: vehicle.brand ?? "",
      model: vehicle.model ?? "",
      year: vehicle.year ?? "",
      mileage: vehicle.mileage ?? "",
      registration_number: vehicle.registration_number ?? "",
      fuel_type: vehicle.fuel_type ?? "",
      transmission: vehicle.transmission ?? "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) return;

    try {
      await vehicleService.remove(id);

      setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error(error);
      setError("Unable to delete vehicle.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-[#9A948B]">Loading vehicles…</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#201F1D]">My vehicles</h1>
          <p className="mt-1 text-sm text-[#8A8478]">
            Manage the vehicles you want to inspect.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8632E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A6572A]"
        >
          <Plus size={17} strokeWidth={1.75} />
          Add vehicle
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-[#C0483F]/20 bg-[#C0483F]/10 p-4 text-sm text-[#C0483F]">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E8E3DC] bg-white p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#201F1D]">
              {editingVehicle ? "Edit vehicle" : "Add new vehicle"}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Volkswagen"
              required
            />

            <Input
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Golf 7"
              required
            />

            <Input
              label="Year"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              placeholder="2019"
              required
            />

            <Input
              label="Mileage"
              name="mileage"
              type="number"
              value={form.mileage}
              onChange={handleChange}
              placeholder="120000"
            />

            <Input
              label="Registration number"
              name="registration_number"
              value={form.registration_number}
              onChange={handleChange}
              placeholder="12345-A-1"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3A3733]">
                Fuel type
              </label>

              <select
                name="fuel_type"
                value={form.fuel_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E8E3DC] bg-white px-4 py-3 text-sm text-[#201F1D] outline-none transition focus:border-[#B8632E]/40 focus:ring-2 focus:ring-[#B8632E]/10"
              >
                <option value="">Select fuel</option>
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3A3733]">
                Transmission
              </label>

              <select
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E8E3DC] bg-white px-4 py-3 text-sm text-[#201F1D] outline-none transition focus:border-[#B8632E]/40 focus:ring-2 focus:ring-[#B8632E]/10"
              >
                <option value="">Select transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#B8632E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A6572A]"
            >
              {editingVehicle ? "Update vehicle" : "Save vehicle"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-[#E8E3DC] px-5 py-2.5 text-sm font-medium text-[#3A3733] transition-colors hover:bg-[#F1EDE7]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8D2C8] bg-white py-16 text-center">
          <Car size={40} strokeWidth={1.5} className="mx-auto text-[#C9C3B8]" />
          <h2 className="mt-4 font-medium text-[#3A3733]">No vehicles yet</h2>
          <p className="mt-1 text-sm text-[#9A948B]">
            Add your first vehicle to request an inspection.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group overflow-hidden rounded-2xl border border-[#E8E3DC] bg-white transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(32,31,29,0.15)]"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B8632E]/10 text-[#B8632E]">
                    <Car size={20} strokeWidth={1.75} />
                  </div>

                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="rounded-lg p-2 text-[#9A948B] transition-colors hover:bg-[#F1EDE7] hover:text-[#B8632E]"
                    >
                      <Pencil size={16} strokeWidth={1.75} />
                    </button>

                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="rounded-lg p-2 text-[#9A948B] transition-colors hover:bg-[#C0483F]/10 hover:text-[#C0483F]"
                    >
                      <Trash2 size={16} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                <h2 className="mt-4 text-lg font-semibold text-[#201F1D]">
                  {vehicle.brand} {vehicle.model}
                </h2>

                <p className="font-mono text-sm text-[#9A948B]">{vehicle.year}</p>
              </div>

              {/* License plate */}
              <div className="mx-5 flex overflow-hidden rounded-lg border border-[#D8D2C8]">
                <div className="flex w-7 shrink-0 items-center justify-center bg-[#B8632E]">
                  <Gauge size={13} strokeWidth={2} className="text-white" />
                </div>
                <div className="flex flex-1 items-center justify-center bg-[#FAF8F5] py-2">
                  <span className="font-mono text-sm font-semibold tracking-widest text-[#201F1D]">
                    {vehicle.registration_number ?? "NO PLATE"}
                  </span>
                </div>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-2 p-5 pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1EDE7] px-2.5 py-1 text-xs font-medium text-[#6B655C]">
                  <Gauge size={12} strokeWidth={1.75} />
                  {vehicle.mileage
                    ? `${Number(vehicle.mileage).toLocaleString()} km`
                    : "No mileage"}
                </span>

                {vehicle.fuel_type && (
                  <span className="inline-flex items-center rounded-full bg-[#F1EDE7] px-2.5 py-1 text-xs font-medium capitalize text-[#6B655C]">
                    {vehicle.fuel_type}
                  </span>
                )}

                {vehicle.transmission && (
                  <span className="inline-flex items-center rounded-full bg-[#F1EDE7] px-2.5 py-1 text-xs font-medium capitalize text-[#6B655C]">
                    {vehicle.transmission}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#3A3733]">{label}</label>

      <input
        {...props}
        className="w-full rounded-xl border border-[#E8E3DC] bg-white px-4 py-3 text-sm text-[#201F1D] outline-none transition placeholder:text-[#B5AFA5] focus:border-[#B8632E]/40 focus:ring-2 focus:ring-[#B8632E]/10"
      />
    </div>
  );
}