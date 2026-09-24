import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ClipboardList,
  Eye,
  X,
  UserRound,
  Car,
  Wrench,
  CalendarDays,
  MapPin,
  FileCheck,
  Loader2,
  Clock,
  Mail,
  Calendar,
} from "lucide-react";

import adminInspectionRequestService from "../../services/adminInspectionRequestService";

const STATUS_STYLES = {
  pending: "bg-[#F4A94A]/10 text-[#F4A94A] border-[#F4A94A]/20",
  accepted: "bg-[#6EA8FE]/10 text-[#6EA8FE] border-[#6EA8FE]/20",
  scheduled: "bg-[#9B8CF2]/10 text-[#9B8CF2] border-[#9B8CF2]/20",
  completed: "bg-[#4ADE9A]/10 text-[#4ADE9A] border-[#4ADE9A]/20",
  cancelled: "bg-[#F2637A]/10 text-[#F2637A] border-[#F2637A]/20",
  rejected: "bg-[#F2637A]/10 text-[#F2637A] border-[#F2637A]/20",
};

const STATUS_FILTERS = [
  ["all", "All"],
  ["pending", "Pending"],
  ["accepted", "Accepted"],
  ["scheduled", "Scheduled"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
  ["rejected", "Rejected"],
];

export default function InspectionRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminInspectionRequestService.getAll();

      setRequests(response.data.inspection_requests || []);
    } catch (err) {
      console.error("Failed to load inspection requests:", err);

      setError(
        err.response?.data?.message || "Failed to load inspection requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (request) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await adminInspectionRequestService.getById(request.id);

      setSelectedRequest(response.data.inspection_request);
    } catch (err) {
      console.error("Failed to load inspection request:", err);

      setError(
        err.response?.data?.message || "Failed to load inspection request details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const value = search.toLowerCase().trim();

    return requests.filter((request) => {
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;

      if (!value) {
        return matchesStatus;
      }

      const clientName = request.client?.name?.toLowerCase() || "";
      const clientEmail = request.client?.email?.toLowerCase() || "";
      const vehicleBrand = request.vehicle?.brand?.toLowerCase() || "";
      const vehicleModel = request.vehicle?.model?.toLowerCase() || "";
      const mechanicName = request.mechanic?.name?.toLowerCase() || "";
      const location = request.location?.toLowerCase() || "";

      return (
        matchesStatus &&
        (clientName.includes(value) ||
          clientEmail.includes(value) ||
          vehicleBrand.includes(value) ||
          vehicleModel.includes(value) ||
          mechanicName.includes(value) ||
          location.includes(value))
      );
    });
  }, [requests, search, statusFilter]);

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

  const statusCounts = {
    all: requests.length,
    pending: requests.filter((item) => item.status === "pending").length,
    accepted: requests.filter((item) => item.status === "accepted").length,
    scheduled: requests.filter((item) => item.status === "scheduled").length,
    completed: requests.filter((item) => item.status === "completed").length,
    cancelled: requests.filter((item) => item.status === "cancelled").length,
    rejected: requests.filter((item) => item.status === "rejected").length,
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-7">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl text-white">
            Inspection Requests Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#8993A8] mt-1">
            Monitor, track, and manage all client vehicle inspection bookings across the system.
          </p>
        </div>

        <div className="inline-flex self-start sm:self-auto items-center gap-2 rounded-xl border border-white/[0.06] bg-[#10151F] px-4 py-2.5 shadow-sm">
          <ClipboardList size={15} className="text-[#37D6C4]" />
          <div className="leading-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] block">Total</span>
            <span className="font-mono text-base font-semibold text-white">{requests.length}</span>
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
      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, vehicle, mechanic or location..."
            className="w-full rounded-lg border border-white/[0.08] bg-[#0B0F18] py-2 pl-10 pr-4 text-xs text-[#E7ECF5] placeholder:text-[#5B6478] outline-none transition focus:border-[#37D6C4]/40 focus:ring-2 focus:ring-[#37D6C4]/10"
          />
        </div>
      </div>

      {/* Inspection Requests Table Panel */}
      <div className="bg-[#10151F] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-white/[0.06] bg-white/[0.01] px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Booking Requests</h3>
            <p className="text-xs text-[#5B6478] mt-0.5">Live queue of vehicle evaluation and booking submissions.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex items-center gap-2.5 text-xs text-[#8993A8]">
              <Loader2 size={18} className="animate-spin text-[#37D6C4]" />
              Loading inspection requests...
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#5B6478]">
              <ClipboardList size={20} strokeWidth={1.75} />
            </div>
            <h3 className="text-xs font-semibold text-[#DCE1EB]">No inspection requests found</h3>
            <p className="mt-1 text-[11px] text-[#5B6478]">
              Try adjusting your search query or selecting a different status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.01] border-b border-white/[0.06]">
                <tr className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] text-left">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Assigned Mechanic</th>
                  <th className="px-5 py-3">Package</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Client Information */}
                    <td className="px-5 py-3.5 font-medium text-[#E7ECF5]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#37D6C4]/10 border border-[#37D6C4]/20 font-mono text-xs font-bold text-[#37D6C4]">
                          {request.client?.name?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                        <div className="min-w-0">
                          <span className="truncate block">{request.client?.name || "Unknown"}</span>
                          <div className="flex items-center gap-1 font-mono text-xs text-[#8993A8] mt-0.5">
                            <Mail size={11} className="shrink-0 text-[#5B6478]" />
                            <span className="truncate">{request.client?.email || "—"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle Details */}
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#E7ECF5]">
                        {request.vehicle?.brand} {request.vehicle?.model}
                      </div>
                      <div className="text-xs text-[#5B6478] font-mono mt-0.5">
                        Year: {request.vehicle?.year || "—"}
                      </div>
                    </td>

                    {/* Mechanic Details */}
                    <td className="px-5 py-3.5">
                      {request.mechanic ? (
                        <div className="flex items-center gap-2">
                          <Wrench size={13} strokeWidth={1.75} className="text-[#9B8CF2] shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-[#E7ECF5] truncate">{request.mechanic.name}</p>
                            <p className="font-mono text-xs text-[#8993A8] truncate">{request.mechanic.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-[#5B6478]">Unassigned</span>
                      )}
                    </td>

                    {/* Package */}
                    <td className="px-5 py-3.5 font-mono text-xs capitalize text-[#37D6C4]">
                      {request.package}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusClasses(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-3.5 text-xs text-[#8993A8]">
                      <div className="flex max-w-[180px] items-center gap-1.5">
                        <MapPin size={13} strokeWidth={1.75} className="shrink-0 text-[#5B6478]" />
                        <span className="truncate">{request.location}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleView(request)}
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
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B12]/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/[0.08] bg-[#10151F] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#10151F]/95 px-5 py-4 backdrop-blur-md">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#37D6C4]">
                  Request #{selectedRequest.id}
                </p>
                <h2 className="text-base font-semibold text-white tracking-tight mt-0.5">Inspection Request Overview</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
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
                {/* Status Bar */}
                <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Current Status</p>
                    <span
                      className={`mt-1.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusClasses(
                        selectedRequest.status
                      )}`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Inspection Package</p>
                    <p className="mt-1 font-mono font-bold capitalize text-[#37D6C4]">
                      {selectedRequest.package}
                    </p>
                  </div>
                </div>

                {/* Client + Vehicle Information */}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                    <div className="mb-2.5 flex items-center gap-2">
                      <UserRound size={15} strokeWidth={1.75} className="text-[#6EA8FE]" />
                      <h3 className="text-xs font-semibold text-white">Client Details</h3>
                    </div>
                    <p className="font-medium text-[#E7ECF5]">{selectedRequest.client?.name}</p>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-[#8993A8]">
                      <Mail size={12} className="text-[#5B6478]" />
                      <span>{selectedRequest.client?.email}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                    <div className="mb-2.5 flex items-center gap-2">
                      <Car size={15} strokeWidth={1.75} className="text-[#6EA8FE]" />
                      <h3 className="text-xs font-semibold text-white">Vehicle Details</h3>
                    </div>
                    <p className="font-medium text-[#E7ECF5]">
                      {selectedRequest.vehicle?.brand} {selectedRequest.vehicle?.model}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#8993A8]">
                      Model Year: {selectedRequest.vehicle?.year || "—"}
                    </p>
                    {selectedRequest.vehicle?.license_plate && (
                      <div className="mt-2 inline-block rounded-md border border-white/[0.06] bg-[#10151F] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#8993A8]">
                        Plate: {selectedRequest.vehicle.license_plate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mechanic Details */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="mb-2.5 flex items-center gap-2">
                    <Wrench size={15} strokeWidth={1.75} className="text-[#9B8CF2]" />
                    <h3 className="text-xs font-semibold text-white">Assigned Mechanic</h3>
                  </div>

                  {selectedRequest.mechanic ? (
                    <div>
                      <p className="font-medium text-[#E7ECF5]">
                        {selectedRequest.mechanic.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-[#8993A8]">
                        <Mail size={12} className="text-[#5B6478]" />
                        <span>{selectedRequest.mechanic.email}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5B6478]">
                      No mechanic has been assigned to or accepted this request yet.
                    </p>
                  )}
                </div>

                {/* Request Metadata Info */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <ClipboardList size={15} strokeWidth={1.75} className="text-[#F4A94A]" />
                    <h3 className="text-xs font-semibold text-white">Booking Information</h3>
                  </div>

                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Inspection Location
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[#E7ECF5]">
                        <MapPin size={13} strokeWidth={1.75} className="text-[#5B6478]" />
                        <p className="text-xs">{selectedRequest.location}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Preferred Date
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[#E7ECF5]">
                        <Calendar size={13} strokeWidth={1.75} className="text-[#5B6478]" />
                        <p className="font-mono text-xs">{formatDate(selectedRequest.preferred_date)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Preferred Time
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[#E7ECF5]">
                        <Clock size={13} strokeWidth={1.75} className="text-[#5B6478]" />
                        <p className="font-mono text-xs">{formatTime(selectedRequest.preferred_time)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Submitted Date
                      </p>
                      <p className="mt-1 font-mono text-xs text-[#E7ECF5]">
                        {formatDate(selectedRequest.created_at)}
                      </p>
                    </div>
                  </div>

                  {selectedRequest.description && (
                    <div className="mt-4 border-t border-white/[0.06] pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
                        Client Notes / Instructions
                      </p>
                      <p className="mt-1.5 whitespace-pre-line leading-relaxed text-[#8993A8]">
                        {selectedRequest.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Appointment Information */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarDays size={15} strokeWidth={1.75} className="text-[#37D6C4]" />
                    <h3 className="text-xs font-semibold text-white">Scheduled Appointment</h3>
                  </div>

                  {selectedRequest.appointment ? (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Date</p>
                        <p className="mt-1 font-mono text-xs text-[#E7ECF5]">
                          {formatDate(selectedRequest.appointment.appointment_date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Time Window</p>
                        <p className="mt-1 font-mono text-xs text-[#E7ECF5]">
                          {formatTime(selectedRequest.appointment.start_time)} –{" "}
                          {formatTime(selectedRequest.appointment.end_time)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Status</p>
                        <span
                          className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusClasses(
                            selectedRequest.appointment.status
                          )}`}
                        >
                          {selectedRequest.appointment.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5B6478]">
                      No appointment slot has been confirmed yet.
                    </p>
                  )}
                </div>

                {/* Inspection Report */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileCheck size={15} strokeWidth={1.75} className="text-[#4ADE9A]" />
                    <h3 className="text-xs font-semibold text-white">Inspection Report Document</h3>
                  </div>

                  {selectedRequest.inspection_report ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#E7ECF5]">
                          Report #{selectedRequest.inspection_report.id}
                        </p>
                        <p className="mt-0.5 text-xs text-[#8993A8]">Inspection has been finalized by mechanic.</p>
                      </div>

                      <span className="rounded-full border border-[#4ADE9A]/20 bg-[#4ADE9A]/10 px-2.5 py-0.5 font-mono text-xs font-medium text-[#4ADE9A]">
                        Completed
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5B6478]">
                      No inspection report uploaded for this request yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end border-t border-white/[0.06] bg-white/[0.01] px-5 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
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