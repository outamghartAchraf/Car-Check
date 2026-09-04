import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import vehicleService from "../../services/vehicleService";
import inspectionRequestService from "../../services/inspectionRequestService";

export default function CreateInspectionRequest() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    vehicle_id: "",
    package: "standard",
    location: "",
    description: "",
    preferred_date: "",
    preferred_time: "",
  });

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response =
          await vehicleService.getAll();

        setVehicles(
          response.data.vehicles ?? []
        );
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load your vehicles."
        );
      }
    };

    loadVehicles();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,

      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await inspectionRequestService.create({
        ...form,

        vehicle_id: Number(
          form.vehicle_id
        ),

        preferred_date:
          form.preferred_date || null,

        preferred_time:
          form.preferred_time || null,

        description:
          form.description || null,
      });

      navigate(
        "/dashboard/inspection-requests"
      );
    } catch (error) {
      console.error(error);

      if (error.response?.status === 422) {
        const errors =
          error.response.data.errors;

        const firstError =
          Object.values(errors ?? {})[0];

        setError(
          firstError?.[0] ??
            error.response.data.message ??
            "Please check your information."
        );
      } else {
        setError(
          error.response?.data?.message ??
            "Unable to create inspection request."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Request Inspection
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Tell us which vehicle you
          want inspected.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-semibold text-amber-900">
            You don't have a vehicle
            yet.
          </h2>

          <p className="mt-1 text-sm text-amber-700">
            Add a vehicle before
            requesting an inspection.
          </p>

          <button
            onClick={() =>
              navigate(
                "/dashboard/vehicles"
              )
            }
            className="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white"
          >
            Add Vehicle
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Vehicle
            </label>

            <select
              name="vehicle_id"
              value={form.vehicle_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select vehicle
              </option>

              {vehicles.map(
                (vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.brand}{" "}
                    {vehicle.model} -{" "}
                    {vehicle.year}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Inspection Package
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <PackageCard
                title="Standard"
                value="standard"
                selected={
                  form.package ===
                  "standard"
                }
                onClick={() =>
                  setForm({
                    ...form,
                    package:
                      "standard",
                  })
                }
              >
                Essential vehicle
                inspection for the main
                safety components.
              </PackageCard>

              <PackageCard
                title="Complete"
                value="complete"
                selected={
                  form.package ===
                  "complete"
                }
                onClick={() =>
                  setForm({
                    ...form,
                    package:
                      "complete",
                  })
                }
              >
                Full inspection of
                mechanical, safety and
                body components.
              </PackageCard>
            </div>
          </div>

          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Beni Mellal"
            required
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Preferred Date"
              name="preferred_date"
              type="date"
              value={
                form.preferred_date
              }
              onChange={handleChange}
            />

            <Input
              label="Preferred Time"
              name="preferred_time"
              type="time"
              value={
                form.preferred_time
              }
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Additional Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe any problem or information about the vehicle..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Request Inspection"}
            </button>
          </div>
        </form>
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
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function PackageCard({
  title,
  selected,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
          : "border-slate-200 hover:border-blue-300"
      }`}
    >
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {children}
      </p>
    </button>
  );
}