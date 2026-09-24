import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Eye,
  X,
  UserRound,
  Car,
  Wrench,
  ClipboardList,
  FileCheck,
  MapPin,
  Clock,
  Loader2,
  Mail,
  Calendar,
} from "lucide-react";

import adminAppointmentService from "../../services/adminAppointmentService";

const STATUS_STYLES = {
  pending: "bg-[#F4A94A]/10 text-[#F4A94A] border-[#F4A94A]/20",
  confirmed: "bg-[#6EA8FE]/10 text-[#6EA8FE] border-[#6EA8FE]/20",
  accepted: "bg-[#6EA8FE]/10 text-[#6EA8FE] border-[#6EA8FE]/20",
  scheduled: "bg-[#9B8CF2]/10 text-[#9B8CF2] border-[#9B8CF2]/20",
  completed: "bg-[#4ADE9A]/10 text-[#4ADE9A] border-[#4ADE9A]/20",
  cancelled: "bg-[#F2637A]/10 text-[#F2637A] border-[#F2637A]/20",
  rejected: "bg-[#F2637A]/10 text-[#F2637A] border-[#F2637A]/20",
};

const STATUS_FILTERS = [
  ["all", "All"],
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminAppointmentService.getAll();

      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error("Failed to load appointments:", err);

      setError(
        err.response?.data?.message || "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (appointment) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await adminAppointmentService.getById(appointment.id);

      setSelectedAppointment(response.data.appointment);
    } catch (err) {
      console.error("Failed to load appointment:", err);

      setError(
        err.response?.data?.message || "Failed to load appointment details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    const value = search.toLowerCase().trim();

    return appointments.filter((appointment) => {
      const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;

      if (!matchesStatus) return false;
      if (!value) return true;

      const clientName = appointment.client?.name?.toLowerCase() || "";
      const clientEmail = appointment.client?.email?.toLowerCase() || "";
      const mechanicName = appointment.mechanic?.name?.toLowerCase() || "";
      const mechanicEmail = appointment.mechanic?.email?.toLowerCase() || "";
      const vehicleBrand =
        appointment.inspection_request?.vehicle?.brand?.toLowerCase() || "";
      const vehicleModel =
        appointment.inspection_request?.vehicle?.model?.toLowerCase() || "";
      const location = appointment.inspection_request?.location?.toLowerCase() || "";

      return (
        clientName.includes(value) ||
        clientEmail.includes(value) ||
        mechanicName.includes(value) ||
        mechanicEmail.includes(value) ||
        vehicleBrand.includes(value) ||
        vehicleModel.includes(value) ||
        location.includes(value)
      );
    });
  }, [appointments, search, statusFilter]);

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const getStatusClasses = (status) =>
    STATUS_STYLES[status] || "bg-white/[0.05] text-[#8993A8] border-white/[0.08]";

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "—";
    return time.substring(0, 5);
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-7">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl text-white">
            Appointments Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#8993A8] mt-1">
            Monitor all vehicle inspection bookings and mechanic time slots.
          </p>
        </div>

        <div className="inline-flex self-start sm:self-auto items-center gap-2 rounded-xl border border-white/[0.06] bg-[#10151F] px-4 py-2.5 shadow-sm">
          <CalendarDays size={15} className="text-[#37D6C4]" />
          <div className="leading-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] block">Total</span>
            <span className="font-mono text-base font-semibold text-white">{appointments.length}</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-[#F2637A]/20 bg-[#F2637A]/10 p-4 text-xs font-medium text-[#F2637A]">
          {error}
        </div>
      )}

      {/* Status Filter Cards */}
      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {STATUS_FILTERS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatusFilter(value)}
            className={`rounded-xl border p-3 text-left transition-all ${
              statusFilter === value
                ? "border-[#37D6C4]/40 bg-[#37D6C4]/10 shadow-sm"
                : "border-white/[0.06] bg-[#10151F] hover:border-white/[0.12]"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">{label}</p>
            <p
              className={`mt-1 font-mono text-lg sm:text-xl font-semibold ${
                statusFilter === value ? "text-[#37D6C4]" : "text-white"
              }`}
            >
              {statusCounts[value]}
            </p>
          </button>
        ))}
      </div>

      {/* Search Bar Panel */}
      <div className="bg-[#10151F] border border-white/[0.06] rounded-xl p-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            strokeWidth={1.75}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6478]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by client, mechanic, vehicle or location..."
            className="w-full rounded-lg border border-white/[0.08] bg-[#0B0F18] py-2 pl-10 pr-4 text-xs text-[#E7ECF5] placeholder:text-[#5B6478] outline-none transition focus:border-[#37D6C4]/40 focus:ring-2 focus:ring-[#37D6C4]/10"
          />
        </div>
      </div>

      {/* Appointments Table Panel */}
      <div className="bg-[#10151F] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-white/[0.06] bg-white/[0.01] px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Scheduled Time Slots</h3>
            <p className="text-xs text-[#5B6478] mt-0.5">List of all scheduled and finalized inspection appointments.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex items-center gap-2.5 text-xs text-[#8993A8]">
              <Loader2 size={18} className="animate-spin text-[#37D6C4]" />
              Loading appointments...
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#5B6478]">
              <CalendarDays size={20} strokeWidth={1.75} />
            </div>
            <h3 className="text-xs font-semibold text-[#DCE1EB]">No appointments found</h3>
            <p className="mt-1 text-[11px] text-[#5B6478]">
              Try adjusting your search terms or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.01] border-b border-white/[0.06]">
                <tr className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] text-left">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Mechanic</th>
                  <th className="px-5 py-3">Date &amp; Time Window</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Client */}
                    <td className="px-5 py-3.5 font-medium text-[#E7ECF5]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#37D6C4]/10 border border-[#37D6C4]/20 font-mono text-xs font-bold text-[#37D6C4]">
                          {appointment.client?.name?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                        <div className="min-w-0">
                          <span className="truncate block">{appointment.client?.name || "Unknown"}</span>
                          <div className="flex items-center gap-1 font-mono text-xs text-[#8993A8] mt-0.5">
                            <Mail size={11} className="shrink-0 text-[#5B6478]" />
                            <span className="truncate">{appointment.client?.email || "—"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Car size={14} strokeWidth={1.75} className="text-[#5B6478] shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-[#E7ECF5] truncate">
                            {appointment.inspection_request?.vehicle?.brand}{" "}
                            {appointment.inspection_request?.vehicle?.model}
                          </p>
                          <p className="font-mono text-xs text-[#5B6478]">
                            Year: {appointment.inspection_request?.vehicle?.year || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Mechanic */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Wrench size={14} strokeWidth={1.75} className="text-[#9B8CF2] shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-[#E7ECF5] truncate">
                            {appointment.mechanic?.name || "Unknown"}
                          </p>
                          <p className="font-mono text-xs text-[#8993A8] truncate">
                            {appointment.mechanic?.email || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-3.5 font-mono text-xs text-[#8993A8]">
                      <div className="flex items-center gap-1.5 text-[#E7ECF5]">
                        <Clock size={13} className="text-[#37D6C4] shrink-0" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="text-[10px] text-[#5B6478] mt-0.5">
                        {formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusClasses(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleView(appointment)}
                        className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs font-medium text-[#C7CEDB] transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <Eye size={12} strokeWidth={1.75} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B12]/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/[0.08] bg-[#10151F] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#10151F]/95 px-5 py-4 backdrop-blur-md">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#37D6C4]">
                  Appointment #{selectedAppointment.id}
                </p>
                <h2 className="text-base font-semibold text-white tracking-tight mt-0.5">Appointment Details</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg p-1 text-[#5B6478] transition-colors hover:bg-white/[0.06] hover:text-[#E7ECF5]"
              >
                <X size={18} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex min-h-[280px] items-center justify-center">
                <div className="flex items-center gap-2.5 text-xs text-[#8993A8]">
                  <Loader2 size={18} className="animate-spin text-[#37D6C4]" />
                  Loading details...
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-5 text-xs">
                {/* Status & Date Bar */}
                <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Appointment Status</p>
                    <span
                      className={`mt-1.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusClasses(
                        selectedAppointment.status
                      )}`}
                    >
                      {selectedAppointment.status}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Scheduled Date</p>
                    <p className="mt-1 font-mono text-xs font-bold text-[#E7ECF5]">
                      {formatDate(selectedAppointment.appointment_date)}
                    </p>
                  </div>
                </div>

                {/* Client / Mechanic */}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                    <div className="mb-2.5 flex items-center gap-2">
                      <UserRound size={15} strokeWidth={1.75} className="text-[#6EA8FE]" />
                      <h3 className="text-xs font-semibold text-white">Client Details</h3>
                    </div>
                    <p className="font-medium text-[#E7ECF5]">
                      {selectedAppointment.client?.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-[#8993A8]">
                      <Mail size={12} className="text-[#5B6478]" />
                      <span>{selectedAppointment.client?.email}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                    <div className="mb-2.5 flex items-center gap-2">
                      <Wrench size={15} strokeWidth={1.75} className="text-[#9B8CF2]" />
                      <h3 className="text-xs font-semibold text-white">Assigned Mechanic</h3>
                    </div>
                    <p className="font-medium text-[#E7ECF5]">
                      {selectedAppointment.mechanic?.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-[#8993A8]">
                      <Mail size={12} className="text-[#5B6478]" />
                      <span>{selectedAppointment.mechanic?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Section */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Car size={15} strokeWidth={1.75} className="text-[#6EA8FE]" />
                    <h3 className="text-xs font-semibold text-white">Vehicle Specifications</h3>
                  </div>

                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Brand</p>
                      <p className="mt-0.5 font-medium text-[#E7ECF5]">
                        {selectedAppointment.inspection_request?.vehicle?.brand || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Model</p>
                      <p className="mt-0.5 font-medium text-[#E7ECF5]">
                        {selectedAppointment.inspection_request?.vehicle?.model || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Year</p>
                      <p className="mt-0.5 font-mono font-medium text-[#E7ECF5]">
                        {selectedAppointment.inspection_request?.vehicle?.year || "—"}
                      </p>
                    </div>
                  </div>

                  {selectedAppointment.inspection_request?.vehicle?.license_plate && (
                    <div className="mt-3 border-t border-white/[0.06] pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        License Plate
                      </p>
                      <div className="mt-1 inline-block rounded-md border border-white/[0.06] bg-[#10151F] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#8993A8]">
                        {selectedAppointment.inspection_request.vehicle.license_plate}
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule Window */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarDays size={15} strokeWidth={1.75} className="text-[#37D6C4]" />
                    <h3 className="text-xs font-semibold text-white">Schedule Window</h3>
                  </div>

                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Date</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[#E7ECF5]">
                        <Calendar size={13} strokeWidth={1.75} className="text-[#5B6478]" />
                        <p className="font-mono text-xs">
                          {formatDate(selectedAppointment.appointment_date)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Start Time
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[#E7ECF5]">
                        <Clock size={13} strokeWidth={1.75} className="text-[#5B6478]" />
                        <p className="font-mono text-xs">
                          {formatTime(selectedAppointment.start_time)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        End Time
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[#E7ECF5]">
                        <Clock size={13} strokeWidth={1.75} className="text-[#5B6478]" />
                        <p className="font-mono text-xs">
                          {formatTime(selectedAppointment.end_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inspection Request Info */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <ClipboardList size={15} strokeWidth={1.75} className="text-[#F4A94A]" />
                    <h3 className="text-xs font-semibold text-white">Related Inspection Request</h3>
                  </div>

                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Request Reference
                      </p>
                      <p className="mt-0.5 font-mono text-xs font-semibold text-[#E7ECF5]">
                        #{selectedAppointment.inspection_request_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Package
                      </p>
                      <p className="mt-0.5 font-mono text-xs capitalize text-[#37D6C4]">
                        {selectedAppointment.inspection_request?.package || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Location
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[#E7ECF5]">
                        <MapPin size={13} strokeWidth={1.75} className="text-[#5B6478]" />
                        <p className="text-xs">
                          {selectedAppointment.inspection_request?.location || "—"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Request Status
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusClasses(
                          selectedAppointment.inspection_request?.status
                        )}`}
                      >
                        {selectedAppointment.inspection_request?.status || "N/A"}
                      </span>
                    </div>
                  </div>

                  {selectedAppointment.inspection_request?.description && (
                    <div className="mt-3 border-t border-white/[0.06] pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Description / Notes
                      </p>
                      <p className="mt-1.5 whitespace-pre-line leading-relaxed text-[#8993A8]">
                        {selectedAppointment.inspection_request.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Appointment Notes */}
                {selectedAppointment.notes && (
                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Appointment Notes</p>
                    <p className="mt-1.5 whitespace-pre-line leading-relaxed text-[#8993A8]">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}

                {/* Inspection Report */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileCheck size={15} strokeWidth={1.75} className="text-[#4ADE9A]" />
                    <h3 className="text-xs font-semibold text-white">Inspection Report</h3>
                  </div>

                  {selectedAppointment.inspection_report ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#E7ECF5]">
                            Report #{selectedAppointment.inspection_report.id}
                          </p>
                          <p className="mt-0.5 text-xs text-[#8993A8]">
                            Inspection report has been completed and logged.
                          </p>
                        </div>

                        <span className="rounded-full border border-[#4ADE9A]/20 bg-[#4ADE9A]/10 px-2.5 py-0.5 font-mono text-xs font-medium text-[#4ADE9A]">
                          Completed
                        </span>
                      </div>

                      <div className="mt-3 grid gap-3 border-t border-white/[0.06] pt-3 grid-cols-1 sm:grid-cols-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                            Overall Condition
                          </p>
                          <p className="mt-0.5 font-medium capitalize text-[#E7ECF5]">
                            {selectedAppointment.inspection_report.overall_condition}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                            Created Date
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-[#E7ECF5]">
                            {formatDate(selectedAppointment.inspection_report.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5B6478]">
                      No inspection report uploaded for this appointment yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end border-t border-white/[0.06] bg-white/[0.01] px-5 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg bg-white/[0.06] px-4 py-2 text-xs font-medium text-[#E7ECF5] transition-colors hover:bg-white/[0.1]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}