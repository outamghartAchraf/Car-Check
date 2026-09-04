import {
  CalendarCheck,
  ClipboardCheck,
  DollarSign,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold">
        Admin Dashboard
      </h2>

      <p className="mt-1 text-slate-500">
        Monitor the CarCheck platform.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<Users />}
          title="Users"
          value="0"
        />

        <Stat
          icon={<ClipboardCheck />}
          title="Inspections"
          value="0"
        />

        <Stat
          icon={<CalendarCheck />}
          title="Appointments"
          value="0"
        />

        <Stat
          icon={<DollarSign />}
          title="Revenue"
          value="$0"
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