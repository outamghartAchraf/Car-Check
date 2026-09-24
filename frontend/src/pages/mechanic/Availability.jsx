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
  Info,
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
    DAYS.find((item) => item.value === Number(day))?.label || "Unknown"
  );
}

function formatTime(time) {
  return time ? time.substring(0, 5) : "-";
}

export default function Availability() {
  const [availabilities, setAvailabilities] = useState([]);

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

  const loadAvailability = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await mechanicAvailabilityService.getAll();

      setAvailabilities(response.data?.availabilities || []);
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
    const { name, value, type, checked } = event.target;

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
      setError("End time must be after start time.");
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

      setSuccess("Availability added successfully.");

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
        err.response?.data?.message || "Unable to create availability."
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

      setSuccess("Availability deleted successfully.");

      setAvailabilities((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Unable to delete availability."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-[#065F46]" />
          <p className="mt-4 text-xs font-medium text-[#5A6E63]">
            Loading working schedule...
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
          <h1 className="text-xl font-bold tracking-tight text-[#111915]">
            My Availability
          </h1>
          <p className="mt-1 text-xs text-[#5A6E63]">
            Define the days and hours when clients can book inspections with you.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadAvailability(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2ECE6] bg-white px-3.5 py-2 text-xs font-semibold text-[#111915] shadow-sm transition hover:bg-[#F0F7F2] disabled:opacity-60"
        >
          <RefreshCw
            size={14}
            className={`text-[#5A6E63] ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-[#065F46]/20 bg-[#E6F4EA] p-3.5 text-xs font-semibold text-[#065F46]">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#065F46]" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add Availability Form */}
        <div className="h-fit rounded-2xl border border-[#E2ECE6] bg-white shadow-sm shadow-[#065F46]/5 overflow-hidden">
          <div className="border-b border-[#E2ECE6] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#065F46]">
                <Plus size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#111915]">
                  Add Availability
                </h2>
                <p className="text-[11px] text-[#5A6E63]">
                  Add a new working time slot
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            {/* Day Select */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                Day of Week
              </label>
              <select
                name="day_of_week"
                value={form.day_of_week}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E2ECE6] bg-white px-3.5 py-2.5 text-xs text-[#111915] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
              >
                <option value="">Select a day</option>
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                Start Time
              </label>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8BA094]"
                />
                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E2ECE6] bg-white py-2.5 pl-10 pr-4 text-xs text-[#111915] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                End Time
              </label>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8BA094]"
                />
                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E2ECE6] bg-white py-2.5 pl-10 pr-4 text-xs text-[#111915] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
                />
              </div>
            </div>

            {/* Available Toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E2ECE6] p-3.5 transition hover:bg-[#F0F7F2]/40">
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[#E2ECE6] text-[#065F46] focus:ring-[#065F46]"
              />
              <div>
                <p className="text-xs font-semibold text-[#111915]">
                  Available for booking
                </p>
                <p className="text-[10px] text-[#5A6E63]">
                  Clients can book slots during this window.
                </p>
              </div>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#065F46] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#065F46]/20 transition hover:bg-[#044734] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {saving ? "Adding..." : "Add Availability"}
            </button>
          </form>
        </div>

        {/* Weekly Schedule List */}
        <div className="rounded-2xl border border-[#E2ECE6] bg-white shadow-sm shadow-[#065F46]/5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E2ECE6] p-5">
            <div>
              <h2 className="text-sm font-bold text-[#111915]">
                Weekly Schedule
              </h2>
              <p className="mt-0.5 text-xs text-[#5A6E63]">
                Your current working hours
              </p>
            </div>

            <div className="rounded-full bg-[#E6F4EA] px-3 py-1 text-[11px] font-mono font-semibold text-[#065F46]">
              {availabilities.length}{" "}
              {availabilities.length === 1 ? "slot" : "slots"}
            </div>
          </div>

          {availabilities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F4EA] text-[#065F46]">
                <Calendar size={24} />
              </div>

              <h3 className="text-sm font-bold text-[#111915]">
                No Availability Defined
              </h3>

              <p className="mx-auto mt-1 max-w-xs text-xs text-[#5A6E63]">
                Add your working days and hours so clients can request inspections with you.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2ECE6]">
              {availabilities.map((availability) => (
                <div
                  key={availability.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-[#F0F7F2]/30"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#065F46]">
                      <CalendarDays size={18} />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[#111915]">
                        {getDayName(availability.day_of_week)}
                      </h3>

                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-mono text-[#5A6E63]">
                        <Clock size={13} className="text-[#8BA094]" />
                        {formatTime(availability.start_time)} -{" "}
                        {formatTime(availability.end_time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-md border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                        availability.is_available
                          ? "border-[#065F46]/20 bg-[#E6F4EA] text-[#065F46]"
                          : "border-[#E2ECE6] bg-[#F0F7F2]/50 text-[#5A6E63]"
                      }`}
                    >
                      {availability.is_available ? "Available" : "Unavailable"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(availability.id)}
                      disabled={deletingId === availability.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      title="Delete availability"
                    >
                      {deletingId === availability.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Information Helper Box */}
      <div className="rounded-2xl border border-[#E2ECE6] bg-[#E6F4EA]/30 p-5">
        <div className="flex items-start gap-3">
          <Info size={18} className="mt-0.5 shrink-0 text-[#065F46]" />

          <div>
            <h3 className="text-xs font-bold text-[#065F46]">
              How availability works
            </h3>

            <ul className="mt-1.5 space-y-1 text-xs text-[#5A6E63]">
              <li>• Add your normal working hours for each day.</li>
              <li>• Clients will only see available slots within these hours.</li>
              <li>• Already booked times will automatically become unavailable.</li>
              <li>• You can add multiple time slots for the same day.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}