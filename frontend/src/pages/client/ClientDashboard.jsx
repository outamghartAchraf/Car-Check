import { CalendarCheck, Car, ClipboardCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import clientDashboardService from "../../services/clientDashboardService";

const STATUS_STYLES = {
  pending: { text: "text-[#A8631F]", bg: "bg-[#A8631F]/10" },
  accepted: { text: "text-[#3D6FB4]", bg: "bg-[#3D6FB4]/10" },
  scheduled: { text: "text-[#7A5FC7]", bg: "bg-[#7A5FC7]/10" },
  completed: { text: "text-[#3D8B5F]", bg: "bg-[#3D8B5F]/10" },
  cancelled: { text: "text-[#C0483F]", bg: "bg-[#C0483F]/10" },
  rejected: { text: "text-[#C0483F]", bg: "bg-[#C0483F]/10" },
};

export default function ClientDashboard() {
  const [statistics, setStatistics] = useState({
    vehicles: 0,
    inspection_requests: 0,
    appointments: 0,
    reports: 0,
    average_rating: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await clientDashboardService.getDashboard();

      setStatistics({
        vehicles: response.data.statistics?.vehicles ?? 0,
        inspection_requests: response.data.statistics?.inspection_requests ?? 0,
        appointments: response.data.statistics?.appointments ?? 0,
        reviews: response.data.statistics?.reviews ?? 0,
        average_rating: response.data.statistics?.average_rating ?? 0,
      });

      setRecentRequests(response.data.recent_requests ?? []);
    } catch (error) {
      console.error("Failed to load client dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#201F1D]">Dashboard</h2>
        <p className="mt-1 text-sm text-[#8A8478]">Manage your vehicles and inspections.</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Car} label="Vehicles" value={statistics.vehicles} loading={loading} accent="#B8632E" />
        <Stat icon={ClipboardCheck} label="Inspections" value={statistics.inspection_requests} loading={loading} accent="#7A5FC7" />
        <Stat icon={CalendarCheck} label="Appointments" value={statistics.appointments} loading={loading} accent="#3D6FB4" />
        <Stat
          icon={Star}
          label="Average rating"
          value={`${statistics.average_rating} / 5`}
          loading={loading}
          accent="#3D8B5F"
        />
      </div>

      {/* Recent Inspection Requests */}
      <div className="rounded-xl border border-[#E8E3DC] bg-white">
        <div className="border-b border-[#E8E3DC] px-5 py-4">
          <h3 className="text-sm font-semibold text-[#201F1D]">Recent inspection requests</h3>
          <p className="mt-1 text-xs text-[#9A948B]">Your latest vehicle inspection requests.</p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-[#9A948B]">Loading…</div>
          ) : recentRequests.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-[#9A948B]">
              No inspection requests yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8E3DC] text-[11px] uppercase tracking-wide text-[#9A948B]">
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Package</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Mechanic</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id} className="border-b border-[#F1EDE7] last:border-0 hover:bg-[#FAF8F5]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#201F1D]">
                        {request.vehicle?.brand} {request.vehicle?.model}
                      </p>
                      <p className="font-mono text-xs text-[#9A948B]">{request.vehicle?.year}</p>
                    </td>

                    <td className="px-5 py-4 capitalize text-[#6B655C]">{request.package}</td>

                    <td className="px-5 py-4">
                      <StatusBadge status={request.status} />
                    </td>

                    <td className="px-5 py-4 text-[#6B655C]">
                      {request.mechanic?.name ?? "Not assigned"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, loading, accent }) {
  return (
    <div className="rounded-xl border border-[#E8E3DC] bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs text-[#8A8478]">{label}</p>
        <Icon size={16} strokeWidth={1.75} style={{ color: accent }} />
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold text-[#201F1D]">
        {loading ? "—" : value}
      </p>
      <div className="mt-4 h-[2px] w-10 rounded-full" style={{ backgroundColor: accent }} />
    </div>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { text: "text-[#8A8478]", bg: "bg-[#F1EDE7]" };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
      {status}
    </span>
  );
}