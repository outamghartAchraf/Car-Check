import { useEffect, useState } from "react";
import {
  Car,
  Plus,
  Pencil,
  Trash2,
  Gauge,
} from "lucide-react";

import vehicleService from "../../services/vehicleService";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] =
    useState(null);

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

      const response =
        await vehicleService.getAll();

      setVehicles(
        response.data.vehicles ?? []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load vehicles."
      );
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
      [event.target.name]:
        event.target.value,
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

        mileage:
          form.mileage === ""
            ? null
            : Number(form.mileage),
      };

      if (editingVehicle) {
        await vehicleService.update(
          editingVehicle.id,
          payload
        );
      } else {
        await vehicleService.create(
          payload
        );
      }

      resetForm();
      await loadVehicles();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 422) {
        const errors =
          error.response.data.errors;

        const firstError =
          Object.values(errors ?? {})[0];

        setError(
          firstError?.[0] ??
            "Please check your information."
        );
      } else {
        setError(
          "Unable to save vehicle."
        );
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
      registration_number:
        vehicle.registration_number ?? "",
      fuel_type:
        vehicle.fuel_type ?? "",
      transmission:
        vehicle.transmission ?? "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await vehicleService.remove(id);

      setVehicles((current) =>
        current.filter(
          (vehicle) =>
            vehicle.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to delete vehicle."
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading vehicles...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Vehicles
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the vehicles you want
            to inspect.
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />

          Add Vehicle
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingVehicle
                ? "Edit Vehicle"
                : "Add New Vehicle"}
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
              label="Registration Number"
              name="registration_number"
              value={
                form.registration_number
              }
              onChange={handleChange}
              placeholder="12345-A-1"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Fuel Type
              </label>

              <select
                name="fuel_type"
                value={form.fuel_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select fuel
                </option>

                <option value="diesel">
                  Diesel
                </option>

                <option value="petrol">
                  Petrol
                </option>

                <option value="hybrid">
                  Hybrid
                </option>

                <option value="electric">
                  Electric
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Transmission
              </label>

              <select
                name="transmission"
                value={
                  form.transmission
                }
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select transmission
                </option>

                <option value="manual">
                  Manual
                </option>

                <option value="automatic">
                  Automatic
                </option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              {editingVehicle
                ? "Update Vehicle"
                : "Save Vehicle"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Car
            size={44}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 font-semibold text-slate-800">
            No vehicles yet
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add your first vehicle to
            request an inspection.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Car size={22} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleEdit(vehicle)
                    }
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        vehicle.id
                      )
                    }
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {vehicle.brand}{" "}
                {vehicle.model}
              </h2>

              <p className="text-sm text-slate-500">
                {vehicle.year}
              </p>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Gauge size={16} />

                  {vehicle.mileage
                    ? `${Number(
                        vehicle.mileage
                      ).toLocaleString()} km`
                    : "Mileage not specified"}
                </div>

                <p>
                  Registration:{" "}
                  <span className="font-medium text-slate-800">
                    {vehicle.registration_number ??
                      "N/A"}
                  </span>
                </p>

                <p className="capitalize">
                  {vehicle.fuel_type ??
                    "N/A"}{" "}
                  •{" "}
                  {vehicle.transmission ??
                    "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}