import {
  CalendarCheck,
  Car,
  ClipboardCheck,
  Star,
} from "lucide-react";

export default function ClientDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h2>

        <p className="mt-1 text-slate-500">
          Manage your vehicles and inspections.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<Car />}
          title="Vehicles"
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
          icon={<Star />}
          title="Reviews"
          value="0"
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
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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