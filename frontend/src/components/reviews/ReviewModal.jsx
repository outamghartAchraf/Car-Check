import { useEffect, useState } from "react";
import {
  Star,
  X,
  Loader2,
  MessageSquareText,
} from "lucide-react";

import reviewService from "../../services/reviewService";

export default function ReviewModal({
  report,
  onClose,
  onSuccess,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setError("");
  }, [report]);

  if (!report) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await reviewService.create(
        report.id,
        {
          rating,
          comment: comment.trim() || null,
        }
      );

      onSuccess(response.data.review);
    } catch (err) {
      console.error("Failed to submit review:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  };

  const vehicle =
    report.inspection_request?.vehicle;

  const mechanic = report.mechanic;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Rate your mechanic
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Share your experience with this inspection.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Mechanic
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {mechanic?.name || "Mechanic"}
              </p>

              {vehicle && (
                <p className="mt-3 text-sm text-slate-500">
                  {vehicle.brand} {vehicle.model}{" "}
                  {vehicle.year
                    ? `• ${vehicle.year}`
                    : ""}
                </p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Your Rating
              </label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active =
                    star <= (hoverRating || rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                      onClick={() => setRating(star)}
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={36}
                        className={
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  );
                })}
              </div>

              {rating > 0 && (
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MessageSquareText size={17} />

                Comment
              </label>

              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                rows={5}
                maxLength={2000}
                placeholder="Tell us about your experience..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <div className="mt-1 text-right text-xs text-slate-400">
                {comment.length}/2000
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || rating === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Submitting...
                </>
              ) : (
                <>
                  <Star size={17} />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}