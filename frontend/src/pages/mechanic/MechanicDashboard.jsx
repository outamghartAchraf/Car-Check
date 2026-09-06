import {
  ClipboardCheck,
  CalendarDays,
  UserCog,
  Clock,
} from "lucide-react";

export default function MechanicDashboard() {
  const stats = [
    {
      title: "Pending Requests",
      value: "0",
      icon: ClipboardCheck,
    },
    {
      title: "Upcoming Inspections",
      value: "0",
      icon: CalendarDays,
    },
    {
      title: "Completed Inspections",
      value: "0",
      icon: Clock,
    },
    {
      title: "Profile Status",
      value: "Pending",
      icon: UserCog,
    },
  ];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Mechanic Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your inspections and professional profile.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Welcome to CarCheck
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Complete your mechanic profile first. Your profile
          will remain pending until an administrator verifies
          your certification.
        </p>
      </div>
    </div>
  );
}