import { useEffect, useState } from "react";
import {
  CalendarDays,
  Car,
  MapPin,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import inspectionRequestService from "../../services/inspectionRequestService";

export default function InspectionRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response =
        await inspectionRequestService.getAll();

      setRequests(
        response.data
          .inspection_requests ?? []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load inspection requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Cancel this inspection request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await inspectionRequestService.cancel(
        id
      );

      await loadRequests();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ??
          "Unable to cancel request."
      );
    }
  };

  if (loading) {
    return (
      <div>
        Loading inspection requests...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inspection Requests
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track all your vehicle
            inspection requests.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/dashboard/inspection-requests/create"
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />

          New Request
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Car
            size={42}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 font-semibold text-slate-800">
            No inspection requests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create your first request
            to inspect a vehicle.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">
                      {
                        request.vehicle
                          ?.brand
                      }{" "}
                      {
                        request.vehicle
                          ?.model
                      }
                    </h2>

                    <StatusBadge
                      status={
                        request.status
                      }
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                    <span className="flex items-center gap-2">
                      <MapPin
                        size={16}
                      />

                      {request.location}
                    </span>

                    {request.preferred_date && (
                      <span className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                        />

                        {new Date(
                          request.preferred_date
                        ).toLocaleDateString()}
                      </span>
                    )}

                    <span className="capitalize">
                      Package:{" "}
                      <strong>
                        {request.package}
                      </strong>
                    </span>
                  </div>

                  {request.mechanic && (
                    <p className="mt-3 text-sm text-slate-500">
                      Mechanic:{" "}
                      <span className="font-medium text-slate-800">
                        {
                          request
                            .mechanic
                            .name
                        }
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {request.status ===
                    "pending" && (
                    <button
                      onClick={() =>
                        handleCancel(
                          request.id
                        )
                      }
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}) {
  const classes = {
    pending:
      "bg-amber-50 text-amber-700",
    accepted:
      "bg-blue-50 text-blue-700",
    rejected:
      "bg-red-50 text-red-700",
    scheduled:
      "bg-purple-50 text-purple-700",
    completed:
      "bg-emerald-50 text-emerald-700",
    cancelled:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        classes[status] ??
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}