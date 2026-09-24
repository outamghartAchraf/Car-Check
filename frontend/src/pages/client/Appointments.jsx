import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Car,
  User,
  MapPin,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CalendarDays,
} from "lucide-react";

import appointmentService from "../../services/appointmentService";
import inspectionRequestService from "../../services/inspectionRequestService";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-[#A8631F]/10 text-[#A8631F] border-[#A8631F]/20",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-[#3D6FB4]/10 text-[#3D6FB4] border-[#3D6FB4]/20",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    className: "bg-[#3D8B5F]/10 text-[#3D8B5F] border-[#3D8B5F]/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-[#C0483F]/10 text-[#C0483F] border-[#C0483F]/20",
    icon: X,
  },
};

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "-";
  return time.substring(0, 5);
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-[#F1EDE7] text-[#6B655C] border-[#E8E3DC]",
    icon: AlertCircle,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cancellingId, setCancellingId] = useState(null);

  // Booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [inspectionRequests, setInspectionRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [notes, setNotes] = useState("");

  const [booking, setBooking] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load appointments
  |--------------------------------------------------------------------------
  */

  const loadAppointments = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await appointmentService.getAll();

      setAppointments(response.data?.appointments || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Unable to load appointments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load inspection requests available for booking
  |--------------------------------------------------------------------------
  */

  const loadInspectionRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      const response = await inspectionRequestService.getAll();

      const requests = response.data?.inspection_requests || [];

      // Only accepted requests without appointment
      const availableRequests = requests.filter(
        (request) => request.status === "accepted" && !request.appointment
      );

      setInspectionRequests(availableRequests);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Unable to load inspection requests."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Open booking modal
  |--------------------------------------------------------------------------
  */

  const openBookingModal = async () => {
    setError("");
    setSuccess("");

    setShowBookingModal(true);

    await loadInspectionRequests();
  };

  /*
  |--------------------------------------------------------------------------
  | Close booking modal
  |--------------------------------------------------------------------------
  */

  const closeBookingModal = () => {
    setShowBookingModal(false);

    setSelectedRequest(null);
    setSelectedDate("");
    setSlots([]);
    setSelectedSlot(null);
    setNotes("");
  };

  /*
  |--------------------------------------------------------------------------
  | Select inspection request
  |--------------------------------------------------------------------------
  */

  const handleRequestChange = (event) => {
    const id = event.target.value;

    const request = inspectionRequests.find(
      (item) => String(item.id) === String(id)
    );

    setSelectedRequest(request || null);

    setSelectedDate("");
    setSlots([]);
    setSelectedSlot(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Load available slots
  |--------------------------------------------------------------------------
  */

  const loadSlots = async (date) => {
    if (!selectedRequest || !date) {
      setSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      setError("");
      setSelectedSlot(null);

      const response = await appointmentService.getAvailableSlots(
        selectedRequest.id,
        date
      );

      setSlots(response.data?.slots || []);
    } catch (err) {
      console.error(err);

      setSlots([]);

      setError(
        err.response?.data?.message || "Unable to load available time slots."
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = async (event) => {
    const date = event.target.value;

    setSelectedDate(date);

    await loadSlots(date);
  };

  /*
  |--------------------------------------------------------------------------
  | Create appointment
  |--------------------------------------------------------------------------
  */

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!selectedRequest) {
      setError("Please select an inspection request.");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    if (!selectedSlot) {
      setError("Please select an available time slot.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      await appointmentService.create({
        inspection_request_id: selectedRequest.id,
        appointment_date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        notes: notes || null,
      });

      setSuccess("Appointment created successfully.");

      closeBookingModal();

      await loadAppointments(true);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Unable to create appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Cancel appointment
  |--------------------------------------------------------------------------
  */

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(id);
      setError("");
      setSuccess("");

      await appointmentService.cancel(id);

      setSuccess("Appointment cancelled successfully.");

      await loadAppointments(true);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Unable to cancel appointment."
      );
    } finally {
      setCancellingId(null);
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
          <Loader2 size={30} className="animate-spin text-[#B8632E]" />
          <p className="text-sm text-[#9A948B]">Loading appointments…</p>
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
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#B8632E]">
            <CalendarDays size={17} strokeWidth={1.75} />
            Appointment management
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[#201F1D]">
            My appointments
          </h1>

          <p className="mt-1 text-sm text-[#8A8478]">
            Manage your vehicle inspection appointments.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => loadAppointments(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E3DC] bg-white px-4 py-2.5 text-sm font-medium text-[#3A3733] transition-colors hover:bg-[#F1EDE7] disabled:opacity-60"
          >
            <RefreshCw size={16} strokeWidth={1.75} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={openBookingModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8632E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A6572A]"
          >
            <Calendar size={16} strokeWidth={1.75} />
            Book inspection
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-[#C0483F]/20 bg-[#C0483F]/10 p-4 text-sm text-[#C0483F]">
          <AlertCircle size={17} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-[#3D8B5F]/20 bg-[#3D8B5F]/10 p-4 text-sm text-[#3D8B5F]">
          <CheckCircle2 size={17} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Empty */}
      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E3DC] bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8632E]/10">
            <Calendar size={26} strokeWidth={1.75} className="text-[#B8632E]" />
          </div>

          <h2 className="text-lg font-semibold text-[#201F1D]">No appointments yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#8A8478]">
            Once a mechanic accepts your inspection request, you can schedule an appointment.
          </p>

          <button
            type="button"
            onClick={openBookingModal}
            className="mt-6 rounded-xl bg-[#B8632E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A6572A]"
          >
            Book an inspection
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {appointments.map((appointment) => {
            const stripe =
              {
                pending: "bg-[#A8631F]",
                confirmed: "bg-[#3D6FB4]",
                completed: "bg-[#3D8B5F]",
                cancelled: "bg-[#C0483F]",
              }[appointment.status] || "bg-[#D8D2C8]";

            return (
              <div
                key={appointment.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E3DC] bg-white transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(32,31,29,0.15)] sm:flex-row"
              >
                {/* Details stub */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-[#9A948B]">
                        Appointment #{appointment.id}
                      </p>
                      <h2 className="mt-1 text-base font-semibold text-[#201F1D]">
                        Vehicle inspection
                      </h2>
                    </div>

                    <StatusBadge status={appointment.status} />
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
                    <div className="flex items-center gap-2">
                      <Car size={15} strokeWidth={1.75} className="text-[#B8632E]" />
                      <div>
                        <p className="text-sm text-[#201F1D]">
                          {appointment.inspection_request?.vehicle?.brand || "-"}{" "}
                          {appointment.inspection_request?.vehicle?.model || ""}
                        </p>
                        <p className="font-mono text-xs text-[#9A948B]">
                          {appointment.inspection_request?.vehicle?.registration_number ||
                            "No registration"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User size={15} strokeWidth={1.75} className="text-[#7A5FC7]" />
                      <div>
                        <p className="text-sm text-[#201F1D]">
                          {appointment.mechanic?.name || "Assigned mechanic"}
                        </p>
                        <p className="text-xs text-[#9A948B]">
                          {appointment.mechanic?.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {appointment.inspection_request?.location && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#6B655C]">
                      <MapPin size={14} strokeWidth={1.75} className="shrink-0 text-[#9A948B]" />
                      <span>{appointment.inspection_request.location}</span>
                    </div>
                  )}

                  {["pending", "confirmed"].includes(appointment.status) && (
                    <button
                      type="button"
                      onClick={() => handleCancel(appointment.id)}
                      disabled={cancellingId === appointment.id}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#C0483F]/20 px-3 py-1.5 text-xs font-medium text-[#C0483F] transition-colors hover:bg-[#C0483F]/10 disabled:opacity-60"
                    >
                      {cancellingId === appointment.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <X size={13} strokeWidth={1.75} />
                      )}
                      Cancel appointment
                    </button>
                  )}
                </div>

                {/* Perforated divider */}
                <div className="relative hidden w-0 border-l-2 border-dashed border-[#E8E3DC] sm:block">
                  <span className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[#F7F5F2]" />
                  <span className="absolute -bottom-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[#F7F5F2]" />
                </div>
                <div className="border-t border-dashed border-[#E8E3DC] sm:hidden" />

                {/* Date / time stub */}
                <div className="relative flex shrink-0 flex-col justify-center gap-3 overflow-hidden bg-[#FAF8F5] p-5 sm:w-48">
                  <div className={`absolute inset-x-0 top-0 h-1 ${stripe}`} />

                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#9A948B]">
                      <Calendar size={12} strokeWidth={1.75} />
                      Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#201F1D]">
                      {formatDate(appointment.appointment_date)}
                    </p>
                  </div>

                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#9A948B]">
                      <Clock size={12} strokeWidth={1.75} />
                      Time
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-[#201F1D]">
                      {formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F1EDE7] bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#201F1D]">Book inspection</h2>
                <p className="mt-1 text-sm text-[#8A8478]">
                  Choose a date and an available time slot.
                </p>
              </div>

              <button
                type="button"
                onClick={closeBookingModal}
                className="rounded-lg p-2 text-[#9A948B] transition-colors hover:bg-[#F1EDE7] hover:text-[#3A3733]"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-6 p-6">
              {/* Request */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3A3733]">
                  Inspection request
                </label>

                {loadingRequests ? (
                  <div className="flex items-center gap-2 rounded-xl border border-[#E8E3DC] p-3 text-sm text-[#9A948B]">
                    <Loader2 size={16} className="animate-spin" />
                    Loading requests…
                  </div>
                ) : inspectionRequests.length === 0 ? (
                  <div className="rounded-xl border border-[#A8631F]/20 bg-[#A8631F]/10 p-4 text-sm text-[#A8631F]">
                    You don't have any accepted inspection requests available for booking.
                  </div>
                ) : (
                  <select
                    value={selectedRequest?.id || ""}
                    onChange={handleRequestChange}
                    className="w-full rounded-xl border border-[#E8E3DC] bg-white px-4 py-3 text-sm text-[#201F1D] outline-none transition focus:border-[#B8632E]/40 focus:ring-2 focus:ring-[#B8632E]/10"
                  >
                    <option value="">Select an inspection request</option>

                    {inspectionRequests.map((request) => (
                      <option key={request.id} value={request.id}>
                        #{request.id} - {request.vehicle?.brand} {request.vehicle?.model}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selected request info */}
              {selectedRequest && (
                <div className="rounded-xl border border-[#B8632E]/20 bg-[#B8632E]/[0.06] p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[#B8632E]">Vehicle</p>
                      <p className="mt-1 font-medium text-[#201F1D]">
                        {selectedRequest.vehicle?.brand} {selectedRequest.vehicle?.model}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#B8632E]">Mechanic</p>
                      <p className="mt-1 font-medium text-[#201F1D]">
                        {selectedRequest.mechanic?.name || "Assigned mechanic"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3A3733]">
                  Appointment date
                </label>

                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  disabled={!selectedRequest}
                  className="w-full rounded-xl border border-[#E8E3DC] bg-white px-4 py-3 text-sm text-[#201F1D] outline-none transition focus:border-[#B8632E]/40 focus:ring-2 focus:ring-[#B8632E]/10 disabled:bg-[#F1EDE7]"
                />
              </div>

              {/* Slots */}
              {selectedDate && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-medium text-[#3A3733]">
                      Available time slots
                    </label>

                    {loadingSlots && (
                      <Loader2 size={16} className="animate-spin text-[#B8632E]" />
                    )}
                  </div>

                  {!loadingSlots && slots.length === 0 && (
                    <div className="rounded-xl border border-[#E8E3DC] bg-[#FAF8F5] p-4 text-center text-sm text-[#9A948B]">
                      No available slots for this date.
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {slots.map((slot) => {
                      const isSelected =
                        selectedSlot?.start_time === slot.start_time &&
                        selectedSlot?.end_time === slot.end_time;

                      return (
                        <button
                          key={`${slot.start_time}-${slot.end_time}`}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                            !slot.available
                              ? "cursor-not-allowed border-[#F1EDE7] bg-[#F1EDE7] text-[#B5AFA5]"
                              : isSelected
                              ? "border-[#B8632E] bg-[#B8632E] text-white"
                              : "border-[#E8E3DC] bg-white text-[#3A3733] hover:border-[#B8632E]/40 hover:bg-[#B8632E]/[0.06]"
                          }`}
                        >
                          <Clock size={14} strokeWidth={1.75} className="mx-auto mb-1" />
                          {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3A3733]">
                  Notes
                  <span className="ml-1 font-normal text-[#9A948B]">(optional)</span>
                </label>

                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Add any additional information…"
                  className="w-full resize-none rounded-xl border border-[#E8E3DC] px-4 py-3 text-sm text-[#201F1D] outline-none transition placeholder:text-[#9A948B] focus:border-[#B8632E]/40 focus:ring-2 focus:ring-[#B8632E]/10"
                />
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#F1EDE7] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="rounded-xl border border-[#E8E3DC] px-5 py-3 text-sm font-medium text-[#3A3733] transition-colors hover:bg-[#F1EDE7]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={booking || !selectedRequest || !selectedDate || !selectedSlot}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8632E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A6572A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {booking && <Loader2 size={16} className="animate-spin" />}
                  Confirm appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}