import { useEffect, useState } from "react";
import {
  Car,
  MapPin,
  CalendarDays,
  Clock,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
} from "lucide-react";

import mechanicInspectionRequestService from "../../services/mechanicInspectionRequestService";

export default function InspectionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await mechanicInspectionRequestService.getAll();

      setRequests(response.data.inspection_requests ?? []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load inspection requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this inspection request?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");

      await mechanicInspectionRequestService.accept(id);

      setRequests((previous) =>
        previous.filter((request) => request.id !== id)
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Unable to accept this request."
      );

      await loadRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this inspection request?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");

      await mechanicInspectionRequestService.reject(id);

      setRequests((previous) =>
        previous.filter((request) => request.id !== id)
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Unable to reject this request."
      );

      await loadRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Not specified";

    return time.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#E2ECE6] border-t-[#065F46]" />
          <p className="mt-4 text-xs font-medium text-[#5A6E63]">
            Loading inspection requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111915]">
            Inspection Requests
          </h1>
          <p className="mt-1 text-xs text-[#5A6E63]">
            Review, accept, or decline pending vehicle inspection requests.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2ECE6] bg-white px-3.5 py-2 text-xs font-semibold text-[#111915] shadow-sm transition hover:bg-[#F0F7F2]"
        >
          <RefreshCw size={14} className="text-[#5A6E63]" />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="rounded-2xl border border-[#E2ECE6] bg-white px-6 py-16 text-center shadow-sm shadow-[#065F46]/5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F4EA] text-[#065F46]">
            <ClipboardCheck size={24} />
          </div>

          <h2 className="mt-4 text-sm font-bold text-[#111915]">
            No Inspection Requests
          </h2>

          <p className="mx-auto mt-1 max-w-md text-xs text-[#5A6E63]">
            There are currently no pending inspection requests available in your region.
          </p>

          <button
            onClick={loadRequests}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#065F46]/20 transition hover:bg-[#044734]"
          >
            <RefreshCw size={14} />
            Check Again
          </button>
        </div>
      )}

      {/* Inspection Requests Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {requests.map((request) => {
          const isProcessing = processingId === request.id;

          return (
            <div
              key={request.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white shadow-sm shadow-[#065F46]/5 transition-all hover:border-[#065F46]/30"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-[#E2ECE6] px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#065F46]">
                      <Car size={18} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-[#111915]">
                        {request.vehicle?.brand} {request.vehicle?.model}
                      </h2>
                      <p className="text-[11px] font-mono text-[#5A6E63]">
                        Request #{request.id}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-700 uppercase">
                    Pending
                  </span>
                </div>

                {/* Details Grid */}
                <div className="space-y-4 p-5">
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {/* Package */}
                    <div className="rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/30 p-2.5">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                        Package
                      </p>
                      <p className="mt-0.5 text-xs font-semibold capitalize text-[#111915]">
                        {request.package}
                      </p>
                    </div>

                    {/* Year */}
                    <div className="rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/30 p-2.5">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                        Vehicle Year
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-[#111915]">
                        {request.vehicle?.year || "Not specified"}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/30 p-2.5">
                      <MapPin size={15} className="mt-0.5 text-[#8BA094]" />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                          Location
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#111915]">
                          {request.location}
                        </p>
                      </div>
                    </div>

                    {/* Preferred Date */}
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/30 p-2.5">
                      <CalendarDays size={15} className="mt-0.5 text-[#8BA094]" />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                          Preferred Date
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#111915]">
                          {formatDate(request.preferred_date)}
                        </p>
                      </div>
                    </div>

                    {/* Preferred Time */}
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/30 p-2.5">
                      <Clock size={15} className="mt-0.5 text-[#8BA094]" />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                          Preferred Time
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#111915]">
                          {formatTime(request.preferred_time)}
                        </p>
                      </div>
                    </div>

                    {/* Client */}
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/30 p-2.5">
                      <User size={15} className="mt-0.5 text-[#8BA094]" />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6E63]">
                          Client
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#111915]">
                          {request.client?.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Optional Description */}
                  {request.description && (
                    <div>
                      <p className="mb-1 text-[11px] font-medium text-[#5A6E63]">
                        Description / Notes
                      </p>
                      <p className="rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/20 p-3 text-xs leading-relaxed text-[#5A6E63]">
                        {request.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="grid grid-cols-2 gap-3 border-t border-[#E2ECE6] bg-[#F0F7F2]/30 p-4">
                <button
                  onClick={() => handleReject(request.id)}
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white py-2 px-3 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle size={15} />
                  Reject
                </button>

                <button
                  onClick={() => handleAccept(request.id)}
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#065F46] py-2 px-3 text-xs font-semibold text-white shadow-sm shadow-[#065F46]/20 transition hover:bg-[#044734] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle size={15} />
                  {isProcessing ? "Processing..." : "Accept Request"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}