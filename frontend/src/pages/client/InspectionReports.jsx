import { useEffect, useState } from "react";
import {
  AlertCircle,
  Car,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  User,
  Star
} from "lucide-react";

import inspectionReportService from "../../services/inspectionReportService";
import ReviewModal from "../../components/reviews/ReviewModal";

const statusLabel = {
  good: "Good",
  average: "Average",
  bad: "Bad",
};

export default function InspectionReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] =
  useState(null);
  const [selectedReviewReport, setSelectedReviewReport] =
  useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await inspectionReportService.getAll();

      setReports(response.data.reports || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load inspection reports."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (report) => {
  try {
    setDownloadingId(report.id);

    const response =
      await inspectionReportService.downloadPdf(
        report.id
      );

    const blob = new Blob(
      [response.data],
      {
        type: "application/pdf",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `carcheck-inspection-report-${report.id}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(
      "Failed to download PDF:",
      err
    );

    setError(
      err.response?.data?.message ||
        "Failed to download PDF report."
    );
  } finally {
    setDownloadingId(null);
  }
};

const handleReviewSuccess = (review) => {
  setReports((currentReports) =>
    currentReports.map((report) =>
      report.id === review.inspection_report_id
        ? {
            ...report,
            review,
          }
        : report
    )
  );

  setSelectedReviewReport(null);
};


  const getConditionClass = (condition) => {
    switch (condition) {
      case "excellent":
      case "good":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "average":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "poor":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
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
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
          <FileText size={18} />
          Vehicle Reports
        </div>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Inspection Reports
        </h1>

        <p className="mt-2 text-slate-500">
          Review the inspection results of your vehicles.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && reports.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FileText size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No inspection reports yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Your inspection reports will appear here after
            a mechanic completes an inspection.
          </p>
        </div>
      )}

      {/* Reports */}
      <div className="grid gap-6 xl:grid-cols-2">

        {reports.map((report) => {
          const vehicle =
            report.inspection_request?.vehicle;

          return (
            <div
              key={report.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >

              {/* Header */}
              <div className="border-b border-slate-100 p-6">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Car size={24} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {vehicle?.brand || "Vehicle"}{" "}
                        {vehicle?.model || ""}
                      </h2>

                      {vehicle?.year && (
                        <p className="mt-1 text-sm text-slate-500">
                          {vehicle.year}
                        </p>
                      )}
                    </div>

                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getConditionClass(
                      report.overall_condition
                    )}`}
                  >
                    {report.overall_condition}
                  </span>

                </div>
              </div>

              {/* Body */}
              <div className="p-6">

                {/* Mechanic */}
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Inspected by
                    </p>

                    <p className="font-semibold text-slate-900">
                      {report.mechanic?.name ||
                        "Mechanic"}
                    </p>
                  </div>
                </div>

                {/* Components */}
                <div className="grid grid-cols-2 gap-3">

                  {[
                    ["Engine", report.engine_status],
                    [
                      "Transmission",
                      report.transmission_status,
                    ],
                    ["Brakes", report.brakes_status],
                    [
                      "Suspension",
                      report.suspension_status,
                    ],
                    ["Tires", report.tires_status],
                    ["Body", report.body_status],
                    [
                      "Electrical",
                      report.electrical_status,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                    >
                      <span className="text-sm text-slate-600">
                        {label}
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          value === "good"
                            ? "text-emerald-600"
                            : value === "average"
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {statusLabel[value] || value}
                      </span>
                    </div>
                  ))}

                </div>

                {/* Recommendations */}
                {report.recommendations && (
                  <div className="mt-6">
                    <h3 className="mb-2 font-bold text-slate-900">
                      Recommendations
                    </h3>

                    <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {report.recommendations}
                    </p>
                  </div>
                )}

                {/* Mechanic Comment */}
                {report.mechanic_comment && (
                  <div className="mt-5">
                    <h3 className="mb-2 font-bold text-slate-900">
                      Mechanic Comment
                    </h3>

                    <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {report.mechanic_comment}
                    </p>
                  </div>
                )}

              </div>

              <div className="border-t border-slate-100 px-6 py-4">
  <button
    type="button"
    onClick={() =>
      handleDownloadPdf(report)
    }
    disabled={downloadingId === report.id}
    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {downloadingId === report.id ? (
      <>
        <Loader2
          size={17}
          className="animate-spin"
        />

        Downloading...
      </>
    ) : (
      <>
        <Download size={17} />

        Download PDF
      </>
    )}
  </button>
</div>

{!report.review ? (
  <button
    type="button"
    onClick={() =>
      setSelectedReviewReport(report)
    }
    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
  >
    <Star size={17} />

    Rate Mechanic
  </button>
) : (
  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700">
    <Star
      size={17}
      className="fill-amber-400 text-amber-400"
    />

    {report.review.rating}/5
  </div>
)}

              {/* Footer */}
              <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm font-semibold text-emerald-600">
                <CheckCircle2 size={18} />
                Inspection completed
              </div>

            </div>
          );
        })}

      </div>

      {selectedReviewReport && (
  <ReviewModal
    report={selectedReviewReport}
    onClose={() =>
      setSelectedReviewReport(null)
    }
    onSuccess={handleReviewSuccess}
  />
)}

    </div>
  );
}