import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  User,
} from "lucide-react";

import appointmentService from "../../services/appointmentService";
import mechanicInspectionReportService from "../../services/mechanicInspectionReportService";

const inspectionSections = [
  {
    key: "engine",
    label: "Engine",
  },
  {
    key: "transmission",
    label: "Transmission",
  },
  {
    key: "brakes",
    label: "Brakes",
  },
  {
    key: "suspension",
    label: "Suspension",
  },
  {
    key: "tires",
    label: "Tires",
  },
  {
    key: "body",
    label: "Body",
  },
  {
    key: "electrical",
    label: "Electrical",
  },
];

const statusOptions = [
  {
    value: "good",
    label: "Good",
  },
  {
    value: "average",
    label: "Average",
  },
  {
    value: "bad",
    label: "Bad",
  },
];

export default function CompleteInspection() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    engine_status: "good",
    transmission_status: "good",
    brakes_status: "good",
    suspension_status: "good",
    tires_status: "good",
    body_status: "good",
    electrical_status: "good",

    overall_condition: "good",

    engine_notes: "",
    transmission_notes: "",
    brakes_notes: "",
    suspension_notes: "",
    tires_notes: "",
    body_notes: "",
    electrical_notes: "",

    recommendations: "",
    mechanic_comment: "",
  });

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await appointmentService.getById(
        appointmentId
      );

      setAppointment(response.data.appointment);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await mechanicInspectionReportService.create(
        appointmentId,
        form
      );

      setSuccess(
        "Inspection completed successfully."
      );

      setTimeout(() => {
        navigate("/mechanic/appointments");
      }, 1200);
    } catch (err) {
      console.error(err);

      const validationErrors =
        err.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(
          validationErrors
        )[0]?.[0];

        setError(
          firstError ||
            "Please check the inspection form."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to complete inspection."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={24}
            className="animate-spin"
          />
          <span>Loading appointment...</span>
        </div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  const request = appointment.inspection_request;
  const vehicle = request?.vehicle;
  const client = appointment.client;

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() =>
            navigate("/mechanic/appointments")
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <FileText size={18} />
            Inspection Report
          </div>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Complete Inspection
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Enter the inspection results for this vehicle.
          </p>
        </div>
      </div>

      {/* Appointment Information */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-900">
          Appointment Information
        </h2>

        <div className="grid gap-5 md:grid-cols-3">

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Car size={19} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Vehicle
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {vehicle?.brand || "Vehicle"}{" "}
                {vehicle?.model || ""}
              </p>

              {vehicle?.year && (
                <p className="text-sm text-slate-500">
                  {vehicle.year}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <User size={19} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Client
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {client?.name || "Unknown"}
              </p>

              <p className="text-sm text-slate-500">
                {client?.email || ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <MapPin size={19} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Location
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {request?.location || "-"}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Mechanical Sections */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Vehicle Inspection
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Evaluate each component of the vehicle.
            </p>
          </div>

          <div className="space-y-6">

            {inspectionSections.map((section) => (
              <div
                key={section.key}
                className="rounded-2xl border border-slate-200 p-5"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {section.label}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {statusOptions.map((option) => {
                      const field =
                        `${section.key}_status`;

                      const selected =
                        form[field] === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            handleChange(
                              field,
                              option.value
                            )
                          }
                          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}

                  </div>
                </div>

                <textarea
                  value={
                    form[
                      `${section.key}_notes`
                    ]
                  }
                  onChange={(event) =>
                    handleChange(
                      `${section.key}_notes`,
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder={`Add notes about the ${section.label.toLowerCase()}...`}
                  className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}

          </div>
        </div>

        {/* Overall Condition */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Overall Condition
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Give the vehicle an overall condition rating.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">

            {[
              "excellent",
              "good",
              "average",
              "poor",
            ].map((condition) => {
              const selected =
                form.overall_condition ===
                condition;

              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() =>
                    handleChange(
                      "overall_condition",
                      condition
                    )
                  }
                  className={`rounded-2xl border px-4 py-4 text-sm font-bold capitalize transition ${
                    selected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {condition}
                </button>
              );
            })}

          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Recommendations
          </h2>

          <textarea
            value={form.recommendations}
            onChange={(event) =>
              handleChange(
                "recommendations",
                event.target.value
              )
            }
            rows={5}
            placeholder="Write recommendations for the client..."
            className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Mechanic Comment */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Mechanic Comment
          </h2>

          <textarea
            value={form.mechanic_comment}
            onChange={(event) =>
              handleChange(
                "mechanic_comment",
                event.target.value
              )
            }
            rows={5}
            placeholder="Add your final professional comment..."
            className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/mechanic/appointments")
            }
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Complete Inspection
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
}