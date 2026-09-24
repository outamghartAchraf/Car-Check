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
        err.response?.data?.message || "Failed to load appointments."
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
        return "bg-emerald-50 text-[#065F46] border-[#065F46]/20";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";

      case "completed":
        return "bg-teal-50 text-teal-800 border-teal-200/60";

      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";

      default:
        return "bg-[#F0F7F2]/50 text-[#5A6E63] border-[#E2ECE6]";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CalendarCheck size={14} />;

      case "completed":
        return <CheckCircle2 size={14} />;

      case "cancelled":
        return <XCircle size={14} />;

      default:
        return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-[#065F46]" />
          <p className="mt-4 text-xs font-medium text-[#5A6E63]">
            Loading appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111915]">
            My Appointments
          </h1>
          <p className="mt-1 text-xs text-[#5A6E63]">
            Manage your scheduled and completed vehicle inspection appointments.
          </p>
        </div>

        {/* Counter Widget */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#E2ECE6] bg-white px-4 py-3 shadow-sm shadow-[#065F46]/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#065F46]">
            <CalendarCheck size={18} />
          </div>

          <div>
            <p className="text-lg font-bold text-[#111915]">
              {appointments.length}
            </p>
            <p className="text-[10px] font-medium text-[#5A6E63]">
              Total Appointments
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          <XCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!error && appointments.length === 0 && (
        <div className="rounded-2xl border border-[#E2ECE6] bg-white px-6 py-16 text-center shadow-sm shadow-[#065F46]/5">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F4EA] text-[#065F46]">
            <CalendarDays size={24} />
          </div>

          <h2 className="text-sm font-bold text-[#111915]">
            No Appointments Yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-xs text-[#5A6E63]">
            When a client books an inspection request with you, the appointment will appear here.
          </p>
        </div>
      )}

      {/* Appointments Grid */}
      {!error && appointments.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-2">
          {appointments.map((appointment) => {
            const request = appointment.inspection_request;
            const vehicle = request?.vehicle;
            const client = appointment.client;

            return (
              <div
                key={appointment.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white shadow-sm shadow-[#065F46]/5 transition-all hover:border-[#065F46]/30"
              >
                <div>
                  {/* Card Header */}
                  <div className="border-b border-[#E2ECE6] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#065F46]">
                          <Car size={18} />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-[#111915]">
                            {vehicle?.brand || "Vehicle"} {vehicle?.model || ""}
                          </h2>
                          {vehicle?.year && (
                            <p className="text-[11px] text-[#5A6E63]">
                              {vehicle.year}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-0.5 font-mono text-[10px] font-semibold capitalize ${getStatusStyle(
                          appointment.status
                        )}`}
                      >
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="space-y-3.5 p-5 text-xs">
                    {/* Client */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F2] text-[#8BA094]">
                        <User size={15} />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                          Client
                        </p>
                        <p className="mt-0.5 font-semibold text-[#111915]">
                          {client?.name || "Unknown client"}
                        </p>
                        {client?.email && (
                          <p className="text-[11px] text-[#5A6E63]">
                            {client.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F2] text-[#8BA094]">
                        <CalendarDays size={15} />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                          Date
                        </p>
                        <p className="mt-0.5 font-semibold text-[#111915]">
                          {formatDate(appointment.appointment_date)}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F2] text-[#8BA094]">
                        <Clock size={15} />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                          Time Slot
                        </p>
                        <p className="mt-0.5 font-mono font-semibold text-[#111915]">
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    {request?.location && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F2] text-[#8BA094]">
                          <MapPin size={15} />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                            Location
                          </p>
                          <p className="mt-0.5 font-semibold text-[#111915]">
                            {request.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Package */}
                    {request?.package && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F2] text-[#8BA094]">
                          <FileText size={15} />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                            Inspection Package
                          </p>
                          <p className="mt-0.5 font-semibold capitalize text-[#111915]">
                            {request.package}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {appointment.notes && (
                      <div className="rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/30 p-3">
                        <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                          Notes
                        </p>
                        <p className="text-xs leading-relaxed text-[#5A6E63]">
                          {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between border-t border-[#E2ECE6] bg-[#F0F7F2]/40 px-5 py-3">
                  <span className="font-mono text-[11px] text-[#5A6E63]">
                    Appointment #{appointment.id}
                  </span>

                  <div className="flex items-center gap-3">
                    {appointment.status === "confirmed" && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/mechanic/appointments/${appointment.id}/complete`
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#065F46] px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-[#065F46]/20 transition hover:bg-[#044734]"
                      >
                        <CheckCircle2 size={15} />
                        Complete Inspection
                      </button>
                    )}

                    {appointment.status === "completed" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#065F46]">
                        <CheckCircle2 size={15} />
                        Completed
                      </span>
                    )}

                    {appointment.status === "cancelled" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                        <XCircle size={15} />
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