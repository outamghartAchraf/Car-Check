import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Calendar,
} from "lucide-react";

import mechanicAvailabilityService from "../../services/mechanicAvailabilityService";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

function getDayName(day) {
  return (
    DAYS.find((item) => item.value === Number(day))
      ?.label || "Unknown"
  );
}

function formatTime(time) {
  return time ? time.substring(0, 5) : "-";
}

export default function Availability() {
  const [availabilities, setAvailabilities] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    day_of_week: "",
    start_time: "09:00",
    end_time: "17:00",
    is_available: true,
  });

  /*
  |--------------------------------------------------------------------------
  | Load availability
  |--------------------------------------------------------------------------
  */

  const loadAvailability = async (
    showRefresh = false
  ) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response =
        await mechanicAvailabilityService.getAll();

      setAvailabilities(
        response.data?.availabilities || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load your availability."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Form change
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Create availability
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.day_of_week) {
      setError("Please select a day.");
      return;
    }

    if (form.end_time <= form.start_time) {
      setError(
        "End time must be after start time."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await mechanicAvailabilityService.create({
        day_of_week: Number(form.day_of_week),
        start_time: form.start_time,
        end_time: form.end_time,
        is_available: form.is_available,
      });

      setSuccess(
        "Availability added successfully."
      );

      setForm({
        day_of_week: "",
        start_time: "09:00",
        end_time: "17:00",
        is_available: true,
      });

      await loadAvailability(true);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to create availability."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete availability
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this availability?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await mechanicAvailabilityService.remove(id);

      setSuccess(
        "Availability deleted successfully."
      );

      setAvailabilities((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete availability."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={34}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-gray-500">
            Loading availability...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <CalendarDays size={18} />

            Working Schedule
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            My Availability
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Define the days and hours when clients can
            book inspections with you.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadAvailability(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Messages */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add Availability */}

        <div className="h-fit rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5">
                <Plus
                  size={19}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Add Availability
                </h2>

                <p className="text-xs text-gray-500">
                  Add a working time slot
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-5"
          >
            {/* Day */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Day
              </label>

              <select
                name="day_of_week"
                value={form.day_of_week}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select a day
                </option>

                {DAYS.map((day) => (
                  <option
                    key={day.value}
                    value={day.value}
                  >
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Start Time
              </label>

              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-10 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* End */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                End Time
              </label>

              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-10 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Active */}

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Available for booking
                </p>

                <p className="text-xs text-gray-500">
                  Clients can book during this period.
                </p>
              </div>
            </label>

            {/* Submit */}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Plus size={18} />
              )}

              {saving
                ? "Adding..."
                : "Add Availability"}
            </button>
          </form>
        </div>

        {/* Availability List */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="font-bold text-gray-900">
                Weekly Schedule
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your current working hours
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {availabilities.length}{" "}
              {availabilities.length === 1
                ? "slot"
                : "slots"}
            </div>
          </div>

          {availabilities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
                <Calendar
                  size={28}
                  className="text-gray-400"
                />
              </div>

              <h3 className="font-bold text-gray-900">
                No availability defined
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                Add your working days and hours so
                clients can book inspections with you.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {availabilities.map((availability) => (
                <div
                  key={availability.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                      <CalendarDays
                        size={19}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getDayName(
                          availability.day_of_week
                        )}
                      </h3>

                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={15} />

                        {formatTime(
                          availability.start_time
                        )}{" "}
                        -{" "}
                        {formatTime(
                          availability.end_time
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        availability.is_available
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-gray-50 text-gray-500"
                      }`}
                    >
                      {availability.is_available
                        ? "Available"
                        : "Unavailable"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          availability.id
                        )
                      }
                      disabled={
                        deletingId ===
                        availability.id
                      }
                      className="rounded-xl border border-red-200 p-2.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      title="Delete availability"
                    >
                      {deletingId ===
                      availability.id ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Information */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <CalendarDays
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <h3 className="font-bold text-blue-950">
              How availability works
            </h3>

            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>
                • Add your normal working hours for
                each day.
              </li>

              <li>
                • Clients will only see available slots
                within these hours.
              </li>

              <li>
                • Already booked times will automatically
                become unavailable.
              </li>

              <li>
                • You can add multiple periods on the
                same day.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}