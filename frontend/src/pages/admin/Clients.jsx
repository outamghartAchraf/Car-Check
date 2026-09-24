import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Car,
  ClipboardList,
  CalendarDays,
  FileCheck,
  Eye,
  X,
  Mail,
  Loader2,
  Calendar,
} from "lucide-react";

import adminClientService from "../../services/adminClientService";

const COUNT_STYLES = {
  vehicles: { text: "text-[#B7BECC]", bg: "bg-white/[0.05] border-white/[0.08]" },
  requests: { text: "text-[#F4A94A]", bg: "bg-[#F4A94A]/10 border-[#F4A94A]/20" },
  appointments: { text: "text-[#37D6C4]", bg: "bg-[#37D6C4]/10 border-[#37D6C4]/20" },
  completed: { text: "text-[#4ADE9A]", bg: "bg-[#4ADE9A]/10 border-[#4ADE9A]/20" },
};

const REQUEST_STATUS_STYLES = {
  completed: "bg-[#4ADE9A]/10 text-[#4ADE9A] border-[#4ADE9A]/20",
  cancelled: "bg-[#F2637A]/10 text-[#F2637A] border-[#F2637A]/20",
  rejected: "bg-[#F2637A]/10 text-[#F2637A] border-[#F2637A]/20",
  scheduled: "bg-[#6EA8FE]/10 text-[#6EA8FE] border-[#6EA8FE]/20",
  pending: "bg-[#F4A94A]/10 text-[#F4A94A] border-[#F4A94A]/20",
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminClientService.getAll();

      setClients(response.data.clients || []);
    } catch (err) {
      console.error("Failed to load clients:", err);

      setError(
        err.response?.data?.message || "Failed to load clients."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewClient = async (client) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await adminClientService.getById(client.id);

      setSelectedClient(response.data.client);
    } catch (err) {
      console.error("Failed to load client:", err);

      setError(
        err.response?.data?.message || "Failed to load client details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return clients;
    }

    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(value) ||
        client.email?.toLowerCase().includes(value)
    );
  }, [clients, search]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-7">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl text-white">
            Client Management
          </h1>
          <p className="text-xs sm:text-sm text-[#8993A8] mt-1">
            Monitor platform clients, vehicle registrations, and inspection activity.
          </p>
        </div>

        <div className="inline-flex self-start sm:self-auto items-center gap-2 rounded-xl border border-white/[0.06] bg-[#10151F] px-4 py-2.5 shadow-sm">
          <Users size={15} className="text-[#37D6C4]" />
          <div className="leading-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] block">Total</span>
            <span className="font-mono text-base font-semibold text-white">{clients.length}</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-[#F2637A]/20 bg-[#F2637A]/10 p-4 text-xs font-medium text-[#F2637A]">
          {error}
        </div>
      )}

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
            placeholder="Search by client name or email address..."
            className="w-full rounded-lg border border-white/[0.08] bg-[#0B0F18] py-2 pl-10 pr-4 text-xs text-[#E7ECF5] placeholder:text-[#5B6478] outline-none transition focus:border-[#37D6C4]/40 focus:ring-2 focus:ring-[#37D6C4]/10"
          />
        </div>
      </div>

      {/* Clients Table Panel */}
      <div className="bg-[#10151F] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-white/[0.06] bg-white/[0.01] px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Registered Clients</h3>
            <p className="text-xs text-[#5B6478] mt-0.5">Overview of active user accounts and request metrics.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex items-center gap-2.5 text-xs text-[#8993A8]">
              <Loader2 size={18} className="animate-spin text-[#37D6C4]" />
              Loading clients...
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center text-center p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#5B6478]">
              <Users size={20} strokeWidth={1.75} />
            </div>
            <h3 className="text-xs font-semibold text-[#DCE1EB]">No clients found</h3>
            <p className="mt-1 text-[11px] text-[#5B6478]">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[750px] lg:min-w-[900px]">
              <thead className="bg-white/[0.01] border-b border-white/[0.06]">
                <tr className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] text-left">
                  <th className="px-5 py-3">Client Profile</th>
                  <th className="px-5 py-3 text-center">Vehicles</th>
                  <th className="px-5 py-3 text-center">Requests</th>
                  <th className="px-5 py-3 text-center">Appointments</th>
                  <th className="px-5 py-3 text-center">Completed</th>
                  <th className="px-5 py-3">Joined Date</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Client Name & Email */}
                    <td className="px-5 py-3.5 font-medium text-[#E7ECF5]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#37D6C4]/10 border border-[#37D6C4]/20 font-mono text-xs font-bold text-[#37D6C4]">
                          {client.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="truncate block">{client.name}</span>
                          <div className="flex items-center gap-1 font-mono text-xs text-[#8993A8] mt-0.5">
                            <Mail size={11} className="shrink-0 text-[#5B6478]" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <Count icon={Car} value={client.vehicles_count} style={COUNT_STYLES.vehicles} />
                    <Count icon={ClipboardList} value={client.inspection_requests_count} style={COUNT_STYLES.requests} />
                    <Count icon={CalendarDays} value={client.client_appointments_count} style={COUNT_STYLES.appointments} />
                    <Count icon={FileCheck} value={client.completed_inspections_count} style={COUNT_STYLES.completed} />

                    <td className="px-5 py-3.5 font-mono text-xs text-[#8993A8]">
                      {formatDate(client.created_at)}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleViewClient(client)}
                        className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs font-medium text-[#C7CEDB] transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <Eye size={12} strokeWidth={1.75} />
                        <span>View Details</span>
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
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B12]/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/[0.08] bg-[#10151F] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#10151F]/95 px-5 py-4 backdrop-blur-md">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#37D6C4]">Client Overview</p>
                <h2 className="text-base font-semibold text-white tracking-tight mt-0.5">Full Account Record</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="rounded-lg p-1 text-[#5B6478] transition-colors hover:bg-white/[0.06] hover:text-[#E7ECF5]"
              >
                <X size={18} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex min-h-[280px] items-center justify-center">
                <div className="flex items-center gap-2.5 text-xs text-[#8993A8]">
                  <Loader2 size={18} className="animate-spin text-[#37D6C4]" />
                  Fetching details...
                </div>
              </div>
            ) : (
              <div className="space-y-5 p-5 text-xs">
                {/* Profile Card */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#37D6C4]/25 bg-[#37D6C4]/10 font-mono text-lg font-bold text-[#37D6C4]">
                      {selectedClient.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {selectedClient.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-[#8993A8]">
                        <Mail size={12} className="text-[#5B6478]" />
                        <span>{selectedClient.email}</span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[#5B6478]">
                        <Calendar size={11} />
                        Joined {formatDate(selectedClient.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                  <DetailStat
                    icon={Car}
                    label="Registered Vehicles"
                    value={selectedClient.vehicles_count ?? selectedClient.vehicles?.length ?? 0}
                    accent="#6EA8FE"
                  />
                  <DetailStat
                    icon={ClipboardList}
                    label="Inspection Requests"
                    value={
                      selectedClient.inspection_requests_count ??
                      selectedClient.inspection_requests?.length ??
                      0
                    }
                    accent="#F4A94A"
                  />
                  <DetailStat
                    icon={CalendarDays}
                    label="Scheduled Appointments"
                    value={
                      selectedClient.client_appointments_count ??
                      selectedClient.client_appointments?.length ??
                      0
                    }
                    accent="#37D6C4"
                  />
                </div>

                {/* Vehicles Section */}
                <div>
                  <div className="mb-2.5 flex items-center gap-2">
                    <Car size={15} strokeWidth={1.75} className="text-[#6EA8FE]" />
                    <h3 className="text-xs font-semibold text-white">Vehicles List</h3>
                  </div>

                  {selectedClient.vehicles?.length ? (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      {selectedClient.vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-3.5"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-[#E7ECF5]">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              <p className="mt-0.5 font-mono text-[10px] text-[#5B6478]">
                                Model Year: {vehicle.year || "N/A"}
                              </p>
                            </div>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-[#5B6478]">
                              <Car size={14} />
                            </div>
                          </div>

                          {vehicle.license_plate && (
                            <div className="mt-2.5 inline-block rounded-md border border-white/[0.06] bg-[#10151F] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#8993A8]">
                              Plate: {vehicle.license_plate}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4 text-center text-xs text-[#5B6478]">
                      No registered vehicles for this client.
                    </div>
                  )}
                </div>

                {/* Inspection Requests Section */}
                <div>
                  <div className="mb-2.5 flex items-center gap-2">
                    <ClipboardList size={15} strokeWidth={1.75} className="text-[#F4A94A]" />
                    <h3 className="text-xs font-semibold text-white">Inspection Request History</h3>
                  </div>

                  {selectedClient.inspection_requests?.length ? (
                    <div className="space-y-2.5">
                      {selectedClient.inspection_requests.map((request) => (
                        <div
                          key={request.id}
                          className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-3.5"
                        >
                          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-medium text-[#E7ECF5]">
                                {request.vehicle?.brand} {request.vehicle?.model}
                              </p>
                              <p className="mt-0.5 text-xs capitalize text-[#8993A8]">
                                Package: <span className="font-mono text-[#37D6C4]">{request.package}</span>
                              </p>
                              {request.mechanic && (
                                <p className="mt-0.5 text-[10px] text-[#5B6478]">
                                  Assigned Mechanic: {request.mechanic.name}
                                </p>
                              )}
                            </div>

                            <span
                              className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold capitalize ${
                                REQUEST_STATUS_STYLES[request.status] ||
                                "bg-white/[0.05] text-[#8993A8] border-white/[0.08]"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4 text-center text-xs text-[#5B6478]">
                      No inspection requests recorded.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end border-t border-white/[0.06] bg-white/[0.01] px-5 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
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

function Count({ icon: Icon, value, style }) {
  return (
    <td className="px-5 py-3.5 text-center">
      <div
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${style.bg} ${style.text}`}
      >
        <Icon size={12} strokeWidth={1.75} />
        {value ?? 0}
      </div>
    </td>
  );
}

function DetailStat({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">{label}</span>
        <Icon size={15} strokeWidth={1.75} style={{ color: accent }} />
      </div>
      <p className="mt-2 font-mono text-xl font-semibold text-white">{value}</p>
    </div>
  );
}