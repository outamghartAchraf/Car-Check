import {
  CalendarCheck,
  ClipboardList,
  FileCheck,
  Star,
} from "lucide-react";

export default function MechanicDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold">
        Mechanic Dashboard
      </h2>

      <p className="mt-1 text-slate-500">
        Manage your inspections and appointments.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<ClipboardList />}
          title="Requests"
          value="0"
        />

        <Stat
          icon={<CalendarCheck />}
          title="Appointments"
          value="0"
        />

        <Stat
          icon={<FileCheck />}
          title="Reports"
          value="0"
        />

        <Stat
          icon={<Star />}
          title="Rating"
          value="0.0"
        />
      </div>
    </div>
  );
}

function Stat({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="mb-4 text-blue-600">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}