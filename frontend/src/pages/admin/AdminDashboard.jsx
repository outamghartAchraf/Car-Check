import {
  CalendarCheck,
  CheckCircle,
  ClipboardCheck,
  Users,
  Wrench,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import adminDashboardService from "../../services/adminDashboardService";

const STATUS_STYLES = {
  pending: { dot: "bg-[#F4A94A]", text: "text-[#F4A94A]", bg: "bg-[#F4A94A]/10 border-[#F4A94A]/20" },
  accepted: { dot: "bg-[#6EA8FE]", text: "text-[#6EA8FE]", bg: "bg-[#6EA8FE]/10 border-[#6EA8FE]/20" },
  scheduled: { dot: "bg-[#9B8CF2]", text: "text-[#9B8CF2]", bg: "bg-[#9B8CF2]/10 border-[#9B8CF2]/20" },
  completed: { dot: "bg-[#37D6C4]", text: "text-[#37D6C4]", bg: "bg-[#37D6C4]/10 border-[#37D6C4]/20" },
  cancelled: { dot: "bg-[#F2637A]", text: "text-[#F2637A]", bg: "bg-[#F2637A]/10 border-[#F2637A]/20" },
  rejected: { dot: "bg-[#F2637A]", text: "text-[#F2637A]", bg: "bg-[#F2637A]/10 border-[#F2637A]/20" },
};

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    clients: 0,
    mechanics: 0,
    inspection_requests: 0,
    appointments: 0,
    completed_inspections: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);
  const [pendingMechanics, setPendingMechanics] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminDashboardService.getDashboard();

      setStatistics({
        clients: response.data.statistics?.clients ?? 0,
        mechanics: response.data.statistics?.mechanics ?? 0,
        inspection_requests: response.data.statistics?.inspection_requests ?? 0,
        appointments: response.data.statistics?.appointments ?? 0,
        completed_inspections: response.data.statistics?.completed_inspections ?? 0,
      });

      setRecentRequests(response.data.recent_requests ?? []);
      setPendingMechanics(response.data.pending_mechanics ?? []);
      setUpcomingAppointments(response.data.upcoming_appointments ?? []);
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-7">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl text-white">
            System Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#8993A8] mt-1">
            Real-time platform activity, mechanic certification queue, and operations metrics.
          </p>
        </div>

        <div className="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-lg border border-[#37D6C4]/20 bg-[#37D6C4]/10 px-3 py-1.5 text-xs font-medium text-[#37D6C4]">
          <Sparkles size={14} />
          <span>Live Metrics Sync</span>
        </div>
      </div>

      {/* KPI Stats Cards Responsive Breakpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <Stat icon={Users} label="Total Clients" value={statistics.clients} loading={loading} accent="#6EA8FE" />
        <Stat icon={Wrench} label="Mechanics" value={statistics.mechanics} loading={loading} accent="#9B8CF2" />
        <Stat icon={ClipboardCheck} label="Requests" value={statistics.inspection_requests} loading={loading} accent="#F4A94A" />
        <Stat icon={CalendarCheck} label="Appointments" value={statistics.appointments} loading={loading} accent="#37D6C4" />
      </div>

      {/* Mechanics Certification Approval Queue */}
      <Panel
        title="Mechanics Awaiting Certification"
        subtitle="Review credential submissions and approve new mechanic accounts."
        badge={pendingMechanics.length}
        loading={loading}
        empty={pendingMechanics.length === 0}
        emptyLabel="No mechanics awaiting certification right now."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[550px]">
            <thead className="bg-white/[0.01] border-b border-white/[0.06]">
              <tr className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] text-left">
                <th className="px-5 py-3">Mechanic</th>
                <th className="px-5 py-3">Email Contact</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {pendingMechanics.map((mechanic) => (
                <tr key={mechanic.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[#E7ECF5]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] font-mono text-xs text-[#37D6C4]">
                        <ShieldCheck size={14} />
                      </div>
                      <span className="truncate">{mechanic.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#8993A8]">
                    {mechanic.email}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status="pending" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border border-[#37D6C4]/30 bg-[#37D6C4]/10 px-2.5 py-1 text-xs font-medium text-[#37D6C4] transition hover:bg-[#37D6C4]/20"
                    >
                      <span>Review Profile</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Grid Split for Requests & Appointments */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {/* Recent Inspection Requests */}
        <Panel
          title="Recent Inspection Requests"
          subtitle="Latest inspection bookings submitted across the platform."
          loading={loading}
          empty={recentRequests.length === 0}
          emptyLabel="No inspection requests found."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[500px]">
              <thead className="bg-white/[0.01] border-b border-white/[0.06]">
                <tr className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] text-left">
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Package</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#E7ECF5]">
                        {request.vehicle?.brand} {request.vehicle?.model}
                      </div>
                      <div className="text-xs text-[#5B6478] font-mono mt-0.5">
                        Year: {request.vehicle?.year || "N/A"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#8993A8]">
                      {request.client?.name ?? "Unknown"}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs capitalize text-[#37D6C4]">
                      {request.package}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Upcoming Appointments */}
        <Panel
          title="Upcoming Appointments"
          subtitle="Scheduled vehicle inspection time slots."
          loading={loading}
          empty={upcomingAppointments.length === 0}
          emptyLabel="No upcoming appointments scheduled."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[500px]">
              <thead className="bg-white/[0.01] border-b border-white/[0.06]">
                <tr className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] text-left">
                  <th className="px-5 py-3">Vehicle / Parties</th>
                  <th className="px-5 py-3">Date & Time</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#E7ECF5]">
                        {appointment.inspectionRequest?.vehicle?.brand}{" "}
                        {appointment.inspectionRequest?.vehicle?.model}
                      </div>
                      <div className="text-xs text-[#8993A8] mt-0.5">
                        Cli: {appointment.client?.name ?? "N/A"} • Mech: {appointment.mechanic?.name ?? "N/A"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-[#8993A8]">
                      <div className="flex items-center gap-1.5 text-[#E7ECF5]">
                        <Clock size={13} className="text-[#37D6C4] shrink-0" />
                        <span>{appointment.appointment_date}</span>
                      </div>
                      <div className="text-[10px] text-[#5B6478] mt-0.5">
                        {appointment.start_time} – {appointment.end_time}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={appointment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

{/* KPI Component */}
function Stat({ icon: Icon, label, value, loading, accent }) {
  return (
    <div className="bg-[#10151F] border border-white/[0.06] rounded-xl p-4 shadow-sm relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#5B6478] mb-1">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} /> {label}
      </div>
      <div className="text-2xl sm:text-3xl font-semibold text-white font-mono">
        {loading ? (
          <span className="inline-block h-8 w-12 animate-pulse rounded bg-white/[0.06]" />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

{/* Card Container Layout */}
function Panel({ title, subtitle, badge, loading, empty, emptyLabel, children }) {
  return (
    <div className="bg-[#10151F] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.01] px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">{title}</h3>
            {badge > 0 && (
              <span className="rounded-md bg-[#37D6C4]/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#37D6C4]">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-[#5B6478] mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="px-5 py-12 text-center text-xs text-[#5B6478]">
            Loading system data...
          </div>
        ) : empty ? (
          <div className="px-5 py-12 text-center text-xs text-[#5B6478]">
            {emptyLabel}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

{/* Status Badge Component */}
function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || {
    dot: "bg-[#5B6478]",
    text: "text-[#8993A8]",
    bg: "bg-white/[0.04] border-white/[0.08]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}