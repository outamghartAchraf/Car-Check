import {
  Car,
  ShieldCheck,
  Search,
  CalendarCheck,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)]">
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              <ShieldCheck size={16} />
              Certified Vehicle Inspection
            </div>

            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Buy Your Next Used Car
              <span className="text-blue-500">
                {" "}With Confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              CarCheck connects buyers with certified mechanics
              to inspect used vehicles and provide detailed
              technical reports.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="/register"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
              >
                Get Started
              </a>

              <a
                href="/login"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-3">
        <Feature
          icon={<Car />}
          title="Vehicle Inspection"
          description="Request a professional inspection for any used vehicle."
        />

        <Feature
          icon={<Search />}
          title="Certified Mechanics"
          description="Choose a certified mechanic based on rating and availability."
        />

        <Feature
          icon={<CalendarCheck />}
          title="Easy Booking"
          description="Schedule your inspection and receive a detailed report."
        />
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}