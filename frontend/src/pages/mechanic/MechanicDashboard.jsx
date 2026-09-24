import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ClipboardCheck,
  Clock,
  CheckCircle,
  Star,
  Car,
} from "lucide-react";
import mechanicDashboardService from "../../services/mechanicDashboardService";

export default function MechanicDashboard() {
  const [statistics, setStatistics] = useState({
    pending_requests: 0,
    accepted_requests: 0,
    appointments: 0,
    completed_inspections: 0,
    average_rating: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await mechanicDashboardService.getDashboard();

      setStatistics({
        pending_requests: response.data.statistics?.pending_requests ?? 0,
        accepted_requests: response.data.statistics?.accepted_requests ?? 0,
        appointments: response.data.statistics?.appointments ?? 0,
        completed_inspections: response.data.statistics?.completed_inspections ?? 0,
        average_rating: response.data.statistics?.average_rating ?? 0,
      });

      setRecentRequests(response.data.recent_requests ?? []);
      setUpcomingAppointments(response.data.upcoming_appointments ?? []);
    } catch (error) {
      console.error("Failed to load mechanic dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#111915]">Dashboard</h1>
        <p className="mt-1 text-xs text-[#5A6E63]">
          Overview of your pending inspection requests, appointments, and overall performance.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat
          icon={<Clock size={18} strokeWidth={2} />}
          title="Pending Requests"
          value={loading ? "..." : statistics.pending_requests}
        />
        <Stat
          icon={<ClipboardCheck size={18} strokeWidth={2} />}
          title="Accepted"
          value={loading ? "..." : statistics.accepted_requests}
        />
        <Stat
          icon={<CalendarCheck size={18} strokeWidth={2} />}
          title="Appointments"
          value={loading ? "..." : statistics.appointments}
        />
        <Stat
          icon={<CheckCircle size={18} strokeWidth={2} />}
          title="Completed"
          value={loading ? "..." : statistics.completed_inspections}
        />
        <Stat
          icon={<Star size={18} strokeWidth={2} />}
          title="Rating"
          value={loading ? "..." : `${statistics.average_rating} / 5`}
        />
      </div>

      {/* Recent Inspection Requests */}
      <div className="rounded-2xl border border-[#E2ECE6] bg-white shadow-sm shadow-[#065F46]/5">
        <div className="border-b border-[#E2ECE6] px-6 py-4">
          <h2 className="text-sm font-bold text-[#111915]">Recent Inspection Requests</h2>
          <p className="mt-0.5 text-xs text-[#5A6E63]">
            Requests available for inspection and assignment.
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-8 text-center text-xs text-[#5A6E63]">
              Loading requests...
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="px-6 py-8 text-center text-xs text-[#5A6E63]">
              No inspection requests available.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2ECE6] bg-[#F0F7F2]/50 text-[11px] font-semibold text-[#5A6E63]">
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Package</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECE6] text-xs">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="transition-colors hover:bg-[#F0F7F2]/40">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-[#111915]">
                        {request.vehicle?.brand} {request.vehicle?.model}
                      </p>
                      <p className="text-[11px] text-[#5A6E63]">{request.vehicle?.year}</p>
                    </td>
                    <td className="px-6 py-3.5 text-[#5A6E63]">
                      {request.client?.name ?? "Unknown"}
                    </td>
                    <td className="px-6 py-3.5 capitalize text-[#5A6E63]">
                      {request.package}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="rounded-2xl border border-[#E2ECE6] bg-white shadow-sm shadow-[#065F46]/5">
        <div className="border-b border-[#E2ECE6] px-6 py-4">
          <h2 className="text-sm font-bold text-[#111915]">Upcoming Appointments</h2>
          <p className="mt-0.5 text-xs text-[#5A6E63]">
            Your confirmed inspection appointments.
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-8 text-center text-xs text-[#5A6E63]">
              Loading appointments...
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="px-6 py-8 text-center text-xs text-[#5A6E63]">
              No upcoming appointments.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2ECE6] bg-[#F0F7F2]/50 text-[11px] font-semibold text-[#5A6E63]">
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECE6] text-xs">
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id} className="transition-colors hover:bg-[#F0F7F2]/40">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-[#111915]">
                        {appointment.inspectionRequest?.vehicle?.brand}{" "}
                        {appointment.inspectionRequest?.vehicle?.model}
                      </p>
                      <p className="text-[11px] text-[#5A6E63]">
                        {appointment.inspectionRequest?.vehicle?.year}
                      </p>
                    </td>
                    <td className="px-6 py-3.5 text-[#5A6E63]">
                      {appointment.client?.name ?? "Unknown"}
                    </td>
                    <td className="px-6 py-3.5 text-[#5A6E63]">
                      {appointment.appointment_date}
                    </td>
                    <td className="px-6 py-3.5 text-[#5A6E63]">
                      {appointment.start_time} - {appointment.end_time}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={appointment.status} />
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

function Stat({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-[#E2ECE6] bg-white p-4 shadow-sm shadow-[#065F46]/5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#065F46]">
          {icon}
        </div>
        <p className="text-xs font-medium text-[#5A6E63]">{title}</p>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-[#111915]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200/60",
    accepted: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
    scheduled: "bg-teal-50 text-teal-700 border-teal-200/60",
    completed: "bg-emerald-100/70 text-[#065F46] border-emerald-300/60",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200/60",
    rejected: "bg-rose-50 text-rose-700 border-rose-200/60",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2 py-0.5 font-mono text-[10px] font-semibold capitalize ${
        styles[status] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}