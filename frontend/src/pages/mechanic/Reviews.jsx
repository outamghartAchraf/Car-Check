import { useEffect, useState } from "react";
import {
  Star,
  MessageSquareText,
  Loader2,
  UserRound,
  Car,
} from "lucide-react";

import reviewService from "../../services/reviewService";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const [stats, setStats] = useState({
    average_rating: 0,
    total_reviews: 0,
    rating_breakdown: {},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await reviewService.getMechanicReviews();

      setReviews(response.data.reviews || []);

      setStats(
        response.data.stats || {
          average_rating: 0,
          total_reviews: 0,
          rating_breakdown: {},
        }
      );
    } catch (err) {
      console.error("Failed to load reviews:", err);

      setError(
        err.response?.data?.message || "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-[#E2ECE6]"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-[#065F46]" />
          <p className="mt-4 text-xs font-medium text-[#5A6E63]">
            Loading reviews and feedback...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#111915]">
          Reviews & Ratings
        </h1>
        <p className="mt-1 text-xs text-[#5A6E63]">
          See what your clients think about your vehicle inspection services.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      {/* Metrics & Breakdown Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Average Rating Card */}
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm shadow-[#065F46]/5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5A6E63]">
            Average Rating
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#111915]">
              {Number(stats.average_rating || 0).toFixed(1)}
            </span>
            <span className="text-xs font-medium text-[#5A6E63]">/ 5</span>
          </div>

          <div className="mt-2.5">
            {renderStars(Math.round(stats.average_rating || 0))}
          </div>
        </div>

        {/* Total Reviews Card */}
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm shadow-[#065F46]/5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5A6E63]">
            Total Reviews
          </p>

          <p className="mt-3 text-3xl font-extrabold text-[#111915]">
            {stats.total_reviews || 0}
          </p>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#5A6E63]">
            <MessageSquareText size={14} className="text-[#8BA094]" />
            Verified client feedback
          </div>
        </div>

        {/* Rating Breakdown Card */}
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm shadow-[#065F46]/5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5A6E63]">
            Rating Breakdown
          </p>

          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 font-mono text-[11px] font-semibold text-[#111915]">
                  {rating}
                </span>

                <Star size={13} className="fill-amber-400 text-amber-400" />

                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F0F7F2]">
                  <div
                    className="h-full rounded-full bg-[#065F46]"
                    style={{
                      width:
                        stats.total_reviews > 0
                          ? `${
                              ((stats.rating_breakdown?.[rating] || 0) /
                                stats.total_reviews) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>

                <span className="w-5 text-right font-mono text-[10px] text-[#5A6E63]">
                  {stats.rating_breakdown?.[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Section Header */}
      <div>
        <h2 className="text-sm font-bold text-[#111915]">
          Client Feedback
        </h2>
        <p className="mt-0.5 text-xs text-[#5A6E63]">
          Latest ratings and comments submitted for completed jobs.
        </p>
      </div>

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-[#E2ECE6] bg-white px-6 py-16 text-center shadow-sm shadow-[#065F46]/5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F4EA] text-[#065F46]">
            <Star size={24} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-[#111915]">
            No Reviews Yet
          </h3>

          <p className="mx-auto mt-1 max-w-xs text-xs text-[#5A6E63]">
            Client reviews and star ratings will appear here after you complete inspection services.
          </p>
        </div>
      ) : (
        /* Reviews Feed */
        <div className="space-y-4">
          {reviews.map((review) => {
            const vehicle =
              review.inspection_report?.inspection_request?.vehicle;

            return (
              <article
                key={review.id}
                className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm shadow-[#065F46]/5 transition-all hover:border-[#065F46]/30"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#065F46]">
                      <UserRound size={18} />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[#111915]">
                        {review.client?.name || "Client"}
                      </h3>

                      <p className="text-[11px] font-mono text-[#5A6E63]">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="font-mono text-xs font-bold text-[#111915]">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                {/* Inspected Vehicle Tag */}
                {vehicle && (
                  <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg border border-[#E2ECE6]/60 bg-[#F0F7F2]/40 px-2.5 py-1 text-xs text-[#5A6E63]">
                    <Car size={14} className="text-[#8BA094]" />
                    <span className="font-medium text-[#111915]">
                      {vehicle.brand} {vehicle.model}
                    </span>
                    {vehicle.year && (
                      <span className="font-mono text-[11px] text-[#5A6E63]">
                        ({vehicle.year})
                      </span>
                    )}
                  </div>
                )}

                {/* Comment / Review Text */}
                {review.comment ? (
                  <div className="mt-3.5 rounded-xl border border-[#E2ECE6]/60 bg-[#F0F7F2]/20 p-3.5">
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-[#5A6E63]">
                      "{review.comment}"
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-xs italic text-[#8BA094]">
                    No written comment left by client.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}