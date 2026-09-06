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
} from "lucide-react";

import mechanicInspectionRequestService from "../../services/mechanicInspectionRequestService";

export default function InspectionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await mechanicInspectionRequestService.getAll();

      setRequests(
        response.data.inspection_requests ?? []
      );
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
        previous.filter(
          (request) => request.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to accept this request."
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
        previous.filter(
          (request) => request.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to reject this request."
      );

      await loadRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "Not specified";

    return time.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
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
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ClipboardCheck size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Inspection Requests
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage available inspection requests.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadRequests}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {requests.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ClipboardCheck size={30} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            No inspection requests
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            There are currently no pending inspection
            requests available.
          </p>

          <button
            onClick={loadRequests}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCw size={17} />
            Check Again
          </button>
        </div>
      )}

      {/* Requests */}
      <div className="grid gap-5 lg:grid-cols-2">

        {requests.map((request) => {
          const isProcessing =
            processingId === request.id;

          return (
            <div
              key={request.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Car size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {request.vehicle?.brand}{" "}
                      {request.vehicle?.model}
                    </h2>

                    <p className="text-xs text-slate-500">
                      Request #{request.id}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Pending
                </span>
              </div>

              {/* Details */}
              <div className="space-y-4 p-5">

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* Package */}
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Package
                    </p>

                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {request.package}
                    </p>
                  </div>

                  {/* Year */}
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Vehicle Year
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {request.vehicle?.year ||
                        "Not specified"}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 text-slate-400"
                    />

                    <div>
                      <p className="text-xs text-slate-500">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {request.location}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <CalendarDays
                      size={18}
                      className="mt-0.5 text-slate-400"
                    />

                    <div>
                      <p className="text-xs text-slate-500">
                        Preferred Date
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {formatDate(
                          request.preferred_date
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <Clock
                      size={18}
                      className="mt-0.5 text-slate-400"
                    />

                    <div>
                      <p className="text-xs text-slate-500">
                        Preferred Time
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {formatTime(
                          request.preferred_time
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Client
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {request.client?.name ||
                        "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {request.description && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      Description
                    </p>

                    <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {request.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">

                  <button
                    onClick={() =>
                      handleReject(request.id)
                    }
                    disabled={isProcessing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle size={18} />

                    Reject
                  </button>

                  <button
                    onClick={() =>
                      handleAccept(request.id)
                    }
                    disabled={isProcessing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle size={18} />

                    {isProcessing
                      ? "Processing..."
                      : "Accept"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}