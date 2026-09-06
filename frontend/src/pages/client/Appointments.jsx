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
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
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
    className: "bg-gray-50 text-gray-700 border-gray-200",
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
        err.response?.data?.message ||
          "Unable to load appointments."
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
        (request) =>
          request.status === "accepted" &&
          !request.appointment
      );

      setInspectionRequests(availableRequests);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load inspection requests."
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

      const response =
        await appointmentService.getAvailableSlots(
          selectedRequest.id,
          date
        );

      setSlots(response.data?.slots || []);
    } catch (err) {
      console.error(err);

      setSlots([]);

      setError(
        err.response?.data?.message ||
          "Unable to load available time slots."
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

      setSuccess(
        "Appointment created successfully."
      );

      closeBookingModal();

      await loadAppointments(true);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to create appointment."
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

      setSuccess(
        "Appointment cancelled successfully."
      );

      await loadAppointments(true);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to cancel appointment."
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
          <Loader2
            size={34}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-gray-500">
            Loading appointments...
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
            Appointment Management
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            My Appointments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your vehicle inspection appointments.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => loadAppointments(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={openBookingModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Calendar size={17} />

            Book Inspection
          </button>
        </div>
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

      {/* Empty */}

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <Calendar
              size={30}
              className="text-blue-600"
            />
          </div>

          <h2 className="text-lg font-bold text-gray-900">
            No appointments yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Once a mechanic accepts your inspection
            request, you can schedule an appointment.
          </p>

          <button
            type="button"
            onClick={openBookingModal}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Book an Inspection
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Card header */}

              <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Appointment #{appointment.id}
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    Vehicle Inspection
                  </h2>
                </div>

                <StatusBadge
                  status={appointment.status}
                />
              </div>

              {/* Card body */}

              <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-4">
                {/* Vehicle */}

                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5">
                    <Car
                      size={19}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Vehicle
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {appointment.inspection_request
                        ?.vehicle?.brand || "-"}{" "}
                      {appointment.inspection_request
                        ?.vehicle?.model || ""}
                    </p>

                    <p className="text-xs text-gray-500">
                      {appointment.inspection_request
                        ?.vehicle?.registration_number ||
                        "No registration"}
                    </p>
                  </div>
                </div>

                {/* Mechanic */}

                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-purple-50 p-2.5">
                    <User
                      size={19}
                      className="text-purple-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Mechanic
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {appointment.mechanic?.name ||
                        "Assigned mechanic"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {appointment.mechanic?.email ||
                        ""}
                    </p>
                  </div>
                </div>

                {/* Date */}

                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5">
                    <Calendar
                      size={19}
                      className="text-emerald-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(
                        appointment.appointment_date
                      )}
                    </p>
                  </div>
                </div>

                {/* Time */}

                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-amber-50 p-2.5">
                    <Clock
                      size={19}
                      className="text-amber-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Time
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatTime(
                        appointment.start_time
                      )}{" "}
                      -{" "}
                      {formatTime(
                        appointment.end_time
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}

              {appointment.inspection_request
                ?.location && (
                <div className="mx-5 mb-5 flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                  <MapPin
                    size={17}
                    className="text-gray-400"
                  />

                  <span>
                    {appointment.inspection_request.location}
                  </span>
                </div>
              )}

              {/* Actions */}

              {["pending", "confirmed"].includes(
                appointment.status
              ) && (
                <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleCancel(appointment.id)
                    }
                    disabled={
                      cancellingId === appointment.id
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {cancellingId === appointment.id ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <X size={16} />
                    )}

                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Book Inspection
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose a date and an available time slot.
                </p>
              </div>

              <button
                type="button"
                onClick={closeBookingModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleBooking}
              className="space-y-6 p-6"
            >
              {/* Request */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Inspection Request
                </label>

                {loadingRequests ? (
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 p-3 text-sm text-gray-500">
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Loading requests...
                  </div>
                ) : inspectionRequests.length ===
                  0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    You don't have any accepted inspection
                    requests available for booking.
                  </div>
                ) : (
                  <select
                    value={selectedRequest?.id || ""}
                    onChange={handleRequestChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select an inspection request
                    </option>

                    {inspectionRequests.map(
                      (request) => (
                        <option
                          key={request.id}
                          value={request.id}
                        >
                          #{request.id} -{" "}
                          {request.vehicle?.brand}{" "}
                          {request.vehicle?.model}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>

              {/* Selected request info */}

              {selectedRequest && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-blue-500">
                        Vehicle
                      </p>

                      <p className="mt-1 font-semibold text-blue-950">
                        {selectedRequest.vehicle?.brand}{" "}
                        {selectedRequest.vehicle?.model}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-blue-500">
                        Mechanic
                      </p>

                      <p className="mt-1 font-semibold text-blue-950">
                        {selectedRequest.mechanic
                          ?.name || "Assigned mechanic"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Date */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Appointment Date
                </label>

                <input
                  type="date"
                  value={selectedDate}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={handleDateChange}
                  disabled={!selectedRequest}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </div>

              {/* Slots */}

              {selectedDate && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Available Time Slots
                    </label>

                    {loadingSlots && (
                      <Loader2
                        size={17}
                        className="animate-spin text-blue-600"
                      />
                    )}
                  </div>

                  {!loadingSlots &&
                    slots.length === 0 && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
                        No available slots for this date.
                      </div>
                    )}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {slots.map((slot) => {
                      const isSelected =
                        selectedSlot?.start_time ===
                          slot.start_time &&
                        selectedSlot?.end_time ===
                          slot.end_time;

                      return (
                        <button
                          key={`${slot.start_time}-${slot.end_time}`}
                          type="button"
                          disabled={!slot.available}
                          onClick={() =>
                            setSelectedSlot(slot)
                          }
                          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                            !slot.available
                              ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400"
                              : isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          <Clock
                            size={15}
                            className="mx-auto mb-1"
                          />

                          {formatTime(
                            slot.start_time
                          )}{" "}
                          -{" "}
                          {formatTime(
                            slot.end_time
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Notes
                  <span className="ml-1 font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={4}
                  maxLength={2000}
                  placeholder="Add any additional information..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Footer */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    booking ||
                    !selectedRequest ||
                    !selectedDate ||
                    !selectedSlot
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {booking && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}