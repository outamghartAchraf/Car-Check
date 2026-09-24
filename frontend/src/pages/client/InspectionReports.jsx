import { useEffect, useState } from "react";
import {
  AlertCircle,
  Car,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  User,
  Star,
  Circle,
} from "lucide-react";

import inspectionReportService from "../../services/inspectionReportService";
import ReviewModal from "../../components/reviews/ReviewModal";

const statusLabel = {
  good: "Good",
  average: "Average",
  bad: "Bad",
};

const CONDITION_STYLES = {
  excellent: { text: "text-[#3D8B5F]", bg: "bg-[#3D8B5F]/10", stripe: "bg-[#3D8B5F]" },
  good: { text: "text-[#3D8B5F]", bg: "bg-[#3D8B5F]/10", stripe: "bg-[#3D8B5F]" },
  average: { text: "text-[#A8631F]", bg: "bg-[#A8631F]/10", stripe: "bg-[#A8631F]" },
  poor: { text: "text-[#C0483F]", bg: "bg-[#C0483F]/10", stripe: "bg-[#C0483F]" },
};

const COMPONENT_DOT = {
  good: "bg-[#3D8B5F]",
  average: "bg-[#A8631F]",
  bad: "bg-[#C0483F]",
};

const COMPONENT_TEXT = {
  good: "text-[#3D8B5F]",
  average: "text-[#A8631F]",
  bad: "text-[#C0483F]",
};

export default function InspectionReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedReviewReport, setSelectedReviewReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await inspectionReportService.getAll();

      setReports(response.data.reports || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Failed to load inspection reports."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (report) => {
    try {
      setDownloadingId(report.id);

      const response = await inspectionReportService.downloadPdf(report.id);

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `carcheck-inspection-report-${report.id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);

      setError(
        err.response?.data?.message || "Failed to download PDF report."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const handleReviewSuccess = (review) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === review.inspection_report_id
          ? { ...report, review }
          : report
      )
    );

    setSelectedReviewReport(null);
  };

  const getConditionStyle = (condition) =>
    CONDITION_STYLES[condition] || {
      text: "text-[#6B655C]",
      bg: "bg-[#F1EDE7]",
      stripe: "bg-[#D8D2C8]",
    };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-[#8A8478]">
          <Loader2 size={22} className="animate-spin" />
          Loading reports…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-[#B8632E]">
          <FileText size={17} strokeWidth={1.75} />
          Vehicle reports
        </div>

        <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#201F1D]">
          Inspection reports
        </h1>

        <p className="mt-2 text-sm text-[#8A8478]">
          Review the inspection results of your vehicles.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#C0483F]/20 bg-[#C0483F]/10 p-4 text-sm text-[#C0483F]">
          <AlertCircle size={18} strokeWidth={1.75} />
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && reports.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#D8D2C8] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EDE7] text-[#B5AFA5]">
            <FileText size={26} strokeWidth={1.5} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[#201F1D]">
            No inspection reports yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#8A8478]">
            Your inspection reports will appear here after a mechanic completes
            an inspection.
          </p>
        </div>
      )}

      {/* Reports */}
      <div className="grid gap-6 xl:grid-cols-2">
        {reports.map((report) => {
          const vehicle = report.inspection_request?.vehicle;
          const condition = getConditionStyle(report.overall_condition);

          const components = [
            ["Engine", report.engine_status],
            ["Transmission", report.transmission_status],
            ["Brakes", report.brakes_status],
            ["Suspension", report.suspension_status],
            ["Tires", report.tires_status],
            ["Body", report.body_status],
            ["Electrical", report.electrical_status],
          ];

          return (
            <div
              key={report.id}
              className="group overflow-hidden rounded-3xl border border-[#E8E3DC] bg-white transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(32,31,29,0.15)]"
            >
              {/* Condition stripe */}
              <div className={`h-1 w-full ${condition.stripe}`} />

              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 pb-5 pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B8632E]/10 text-[#B8632E]">
                    <Car size={22} strokeWidth={1.75} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold leading-tight text-[#201F1D]">
                      {vehicle?.brand || "Vehicle"} {vehicle?.model || ""}
                    </h2>

                    <div className="mt-1 flex items-center gap-2 text-sm text-[#9A948B]">
                      {vehicle?.year && <span className="font-mono">{vehicle.year}</span>}
                      <span className="h-1 w-1 rounded-full bg-[#D8D2C8]" />
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 size={13} strokeWidth={2} className="text-[#3D8B5F]" />
                        Completed
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${condition.bg} ${condition.text}`}
                >
                  {report.overall_condition}
                </span>
              </div>

              {/* Mechanic strip */}
              <div className="flex items-center gap-2.5 px-6 pb-5 text-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1EDE7] text-[#6B655C]">
                  <User size={13} strokeWidth={1.75} />
                </div>
                <span className="text-[#8A8478]">Inspected by</span>
                <span className="font-medium text-[#3A3733]">
                  {report.mechanic?.name || "Mechanic"}
                </span>
              </div>

              {/* Components checklist */}
              <div className="mx-6 grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-[#F1EDE7] py-5">
                {components.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-0.5">
                    <span className="flex items-center gap-2 text-sm text-[#6B655C]">
                      <Circle
                        size={7}
                        strokeWidth={0}
                        className={`${COMPONENT_DOT[value] || "bg-[#D8D2C8]"} rounded-full fill-current`}
                      />
                      {label}
                    </span>

                    <span className={`text-xs font-semibold ${COMPONENT_TEXT[value] || "text-[#9A948B]"}`}>
                      {statusLabel[value] || value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {report.recommendations && (
                <div className="mx-6 border-t border-[#F1EDE7] py-5">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9A948B]">
                    Recommendations
                  </h3>
                  <p className="border-l-2 border-[#B8632E]/30 pl-3 text-sm leading-6 text-[#6B655C]">
                    {report.recommendations}
                  </p>
                </div>
              )}

              {/* Mechanic Comment */}
              {report.mechanic_comment && (
                <div className="mx-6 border-t border-[#F1EDE7] py-5">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9A948B]">
                    Mechanic comment
                  </h3>
                  <p className="border-l-2 border-[#E8E3DC] pl-3 text-sm leading-6 text-[#6B655C]">
                    {report.mechanic_comment}
                  </p>
                </div>
              )}

              {/* Footer actions */}
              <div className="flex items-center justify-between gap-3 border-t border-[#F1EDE7] bg-[#FAF8F5] px-6 py-4">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(report)}
                  disabled={downloadingId === report.id}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#B8632E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A6572A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloadingId === report.id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Downloading…
                    </>
                  ) : (
                    <>
                      <Download size={16} strokeWidth={1.75} />
                      Download PDF
                    </>
                  )}
                </button>

                {!report.review ? (
                  <button
                    type="button"
                    onClick={() => setSelectedReviewReport(report)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#C99A3D]/30 px-4 py-2.5 text-sm font-semibold text-[#B88A30] transition-colors hover:bg-[#C99A3D]/10"
                  >
                    <Star size={15} strokeWidth={1.75} />
                    Rate mechanic
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#C99A3D]/10 px-4 py-2.5 text-sm font-semibold text-[#B88A30]">
                    <Star size={15} className="fill-[#C99A3D] text-[#C99A3D]" />
                    {report.review.rating}/5
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedReviewReport && (
        <ReviewModal
          report={selectedReviewReport}
          onClose={() => setSelectedReviewReport(null)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}