import { useEffect, useState } from "react";
import {
  CalendarDays,
  Car,
  MapPin,
  Plus,
  Eye,
  Image as ImageIcon,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import inspectionRequestService from "../../services/inspectionRequestService";
import inspectionPhotoService from "../../services/inspectionPhotoService";

export default function InspectionRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Photos by inspection request ID
  const [photos, setPhotos] = useState({});

  // Selected photo for fullscreen preview
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // --------------------------------------------------
  // Load photos for one inspection request
  // --------------------------------------------------
  const loadPhotos = async (inspectionRequestId) => {
    try {
      const response = await inspectionPhotoService.getAll(
        inspectionRequestId
      );

      setPhotos((prev) => ({
        ...prev,
        [inspectionRequestId]: response.data.photos ?? [],
      }));
    } catch (error) {
      console.error("Failed to load inspection photos:", error);

      setPhotos((prev) => ({
        ...prev,
        [inspectionRequestId]: [],
      }));
    }
  };

  // --------------------------------------------------
  // Load inspection requests
  // --------------------------------------------------
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await inspectionRequestService.getAll();

      const inspectionRequests = response.data.inspection_requests ?? [];

      // Correct state setter
      setRequests(inspectionRequests);

      // Load photos for every request
      for (const request of inspectionRequests) {
        await loadPhotos(request.id);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ?? "Unable to load inspection requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // --------------------------------------------------
  // Cancel request
  // --------------------------------------------------
  const handleCancel = async (id) => {
    const confirmed = window.confirm("Cancel this inspection request?");

    if (!confirmed) return;

    try {
      await inspectionRequestService.cancel(id);
      await loadRequests();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message ?? "Unable to cancel request.");
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm text-[#9A948B]">Loading inspection requests…</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#201F1D]">
              Inspection requests
            </h1>
            <p className="mt-1 text-sm text-[#8A8478]">
              Track all your vehicle inspection requests.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/inspection-requests/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8632E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A6572A]"
          >
            <Plus size={17} strokeWidth={1.75} />
            New request
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-[#C0483F]/20 bg-[#C0483F]/10 p-4 text-sm text-[#C0483F]">
            {error}
          </div>
        )}

        {/* Empty state */}
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8D2C8] bg-white py-16 text-center">
            <Car size={40} strokeWidth={1.5} className="mx-auto text-[#C9C3B8]" />
            <h2 className="mt-4 font-medium text-[#3A3733]">No inspection requests</h2>
            <p className="mt-1 text-sm text-[#9A948B]">
              Create your first request to inspect a vehicle.
            </p>

            <button
              onClick={() => navigate("/dashboard/inspection-requests/create")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B8632E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A6572A]"
            >
              <Plus size={16} strokeWidth={1.75} />
              Create request
            </button>
          </div>
        ) : (
          /* Requests */
          <div className="space-y-5">
            {requests.map((request) => {
              const requestPhotos = photos[request.id] ?? [];

              const stripe =
                {
                  pending: "bg-[#A8631F]",
                  accepted: "bg-[#3D6FB4]",
                  rejected: "bg-[#C0483F]",
                  scheduled: "bg-[#7A5FC7]",
                  completed: "bg-[#3D8B5F]",
                  cancelled: "bg-[#D8D2C8]",
                }[request.status] || "bg-[#D8D2C8]";

              return (
                <div
                  key={request.id}
                  className="group flex overflow-hidden rounded-2xl border border-[#E8E3DC] bg-white transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(32,31,29,0.15)]"
                >
                  <div className={`w-1 shrink-0 ${stripe}`} />

                  <div className="flex-1">
                    {/* Request information */}
                    <div className="p-5">
                      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                        <div className="min-w-0">
                          {/* Vehicle + Status */}
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-base font-semibold text-[#201F1D]">
                              {request.vehicle?.brand ?? "Vehicle"}{" "}
                              {request.vehicle?.model ?? ""}
                            </h2>

                            <StatusBadge status={request.status} />
                          </div>

                          {/* Details */}
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#8A8478]">
                            <span className="flex items-center gap-1.5">
                              <MapPin size={14} strokeWidth={1.75} className="text-[#B5AFA5]" />
                              {request.location}
                            </span>

                            {request.preferred_date && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-[#D8D2C8]" />
                                <span className="flex items-center gap-1.5 font-mono">
                                  <CalendarDays size={14} strokeWidth={1.75} className="text-[#B5AFA5]" />
                                  {new Date(request.preferred_date).toLocaleDateString()}
                                </span>
                              </>
                            )}

                            <span className="h-1 w-1 rounded-full bg-[#D8D2C8]" />
                            <span className="capitalize">
                              <strong className="font-medium text-[#3A3733]">{request.package}</strong>{" "}
                              package
                            </span>
                          </div>

                          {/* Mechanic */}
                          {request.mechanic && (
                            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F1EDE7] py-1 pl-1 pr-3 text-xs text-[#6B655C]">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white font-mono text-[10px] font-semibold text-[#B8632E]">
                                {request.mechanic.name?.charAt(0)?.toUpperCase()}
                              </span>
                              {request.mechanic.name}
                            </div>
                          )}
                        </div>

                        {/* Cancel */}
                        {request.status === "pending" && (
                          <button
                            onClick={() => handleCancel(request.id)}
                            className="shrink-0 rounded-lg border border-[#C0483F]/20 px-3 py-1.5 text-xs font-medium text-[#C0483F] transition-colors hover:bg-[#C0483F]/10"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Photos */}
                    {requestPhotos.length > 0 && (
                      <div className="border-t border-[#F1EDE7] bg-[#FAF8F5] p-5">
                        {/* Gallery header */}
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8632E]/10">
                              <ImageIcon size={16} strokeWidth={1.75} className="text-[#B8632E]" />
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-[#3A3733]">Vehicle photos</h3>
                              <p className="text-xs text-[#9A948B]">Click a photo to view it</p>
                            </div>
                          </div>

                          <span className="rounded-full border border-[#E8E3DC] bg-white px-3 py-1 text-xs font-medium text-[#8A8478]">
                            {requestPhotos.length}{" "}
                            {requestPhotos.length === 1 ? "photo" : "photos"}
                          </span>
                        </div>

                        {/* Gallery */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {requestPhotos.map((photo) => (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() => setSelectedPhoto(photo)}
                              className="group relative aspect-square overflow-hidden rounded-xl border border-[#E8E3DC] bg-[#F1EDE7] transition-shadow hover:shadow-md"
                            >
                              {/* Image */}
                              <img
                                src={`http://localhost:8000/storage/${photo.photo_path}`}
                                alt={photo.description || "Vehicle photo"}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />

                              {/* Dark overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/35">
                                <div className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-white opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                                  <Eye size={17} strokeWidth={1.75} className="text-[#3A3733]" />
                                </div>
                              </div>

                              {/* Description */}
                              {photo.description && (
                                <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-left transition duration-300 group-hover:translate-y-0">
                                  <p className="truncate text-xs font-medium text-white">
                                    {photo.description}
                                  </p>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULLSCREEN PHOTO MODAL */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Image container */}
          <div
            className="relative flex max-h-[90vh] max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={`http://localhost:8000/storage/${selectedPhoto.photo_path}`}
              alt={selectedPhoto.description || "Vehicle photo"}
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {/* Description */}
            {selectedPhoto.description && (
              <div className="mt-4 rounded-xl bg-white px-5 py-3 text-center shadow-lg">
                <p className="text-sm font-medium text-[#201F1D]">
                  {selectedPhoto.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ======================================================
// Status Badge
// ======================================================

function StatusBadge({ status }) {
  const classes = {
    pending: "bg-[#A8631F]/10 text-[#A8631F]",
    accepted: "bg-[#3D6FB4]/10 text-[#3D6FB4]",
    rejected: "bg-[#C0483F]/10 text-[#C0483F]",
    scheduled: "bg-[#7A5FC7]/10 text-[#7A5FC7]",
    completed: "bg-[#3D8B5F]/10 text-[#3D8B5F]",
    cancelled: "bg-[#F1EDE7] text-[#6B655C]",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        classes[status] ?? "bg-[#F1EDE7] text-[#6B655C]"
      }`}
    >
      {status}
    </span>
  );
}