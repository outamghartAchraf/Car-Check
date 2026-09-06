import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Car,
  CheckCircle2,
  XCircle,
  Loader2,
  CalendarCheck,
  FileText,
} from "lucide-react";

import mechanicAppointmentService from "../../services/mechanicAppointmentService";
import { useNavigate } from "react-router-dom";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await mechanicAppointmentService.getAll();

      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    return time.substring(0, 5);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CalendarCheck size={15} />;

      case "completed":
        return <CheckCircle2 size={15} />;

      case "cancelled":
        return <XCircle size={15} />;

      default:
        return <Clock size={15} />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading appointments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <CalendarDays size={18} />
            <span>Schedule</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Appointments
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your upcoming vehicle inspection appointments.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarCheck size={22} />
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              {appointments.length}
            </p>

            <p className="text-xs text-slate-500">
              Total appointments
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <XCircle size={20} />

          <p className="text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!error && appointments.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <CalendarDays size={30} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            No appointments yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            When a client books an inspection with you,
            the appointment will appear here.
          </p>
        </div>
      )}

      {/* Appointments */}
      {!error && appointments.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-2">
          {appointments.map((appointment) => {
            const request = appointment.inspection_request;
            const vehicle = request?.vehicle;
            const client = appointment.client;

            return (
              <div
                key={appointment.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Card Header */}
                <div className="border-b border-slate-100 p-6">
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-blue-600">
                        <Car size={20} />

                        <span className="text-sm font-semibold">
                          Vehicle Inspection
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-900">
                        {vehicle?.brand || "Vehicle"}{" "}
                        {vehicle?.model || ""}
                      </h2>

                      {vehicle?.year && (
                        <p className="mt-1 text-sm text-slate-500">
                          {vehicle.year}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                        appointment.status
                      )}`}
                    >
                      {getStatusIcon(appointment.status)}

                      {appointment.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-5 p-6">

                  {/* Client */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <User size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Client
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {client?.name || "Unknown client"}
                      </p>

                      {client?.email && (
                        <p className="mt-1 text-sm text-slate-500">
                          {client.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CalendarDays size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Date
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatDate(
                          appointment.appointment_date
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Clock size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Time
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatTime(appointment.start_time)}
                        {" - "}
                        {formatTime(appointment.end_time)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {request?.location && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <MapPin size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {request.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Package */}
                  {request?.package && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <FileText size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Inspection Package
                        </p>

                        <p className="mt-1 font-semibold capitalize text-slate-900">
                          {request.package}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Notes
                      </p>

                      <p className="text-sm leading-6 text-slate-600">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                {appointment.status === "confirmed" && (
  <button
    type="button"
    onClick={() =>
      navigate(
        `/mechanic/appointments/${appointment.id}/complete`
      )
    }
    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
  >
    <CheckCircle2 size={17} />
    Complete Inspection
  </button>
)}

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-slate-400">
                      Appointment #{appointment.id}
                    </span>

                    {appointment.status === "confirmed" && (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                        <CheckCircle2 size={17} />
                        Ready for inspection
                      </span>
                    )}

                    {appointment.status === "completed" && (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <CheckCircle2 size={17} />
                        Completed
                      </span>
                    )}

                    {appointment.status === "cancelled" && (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                        <XCircle size={17} />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}