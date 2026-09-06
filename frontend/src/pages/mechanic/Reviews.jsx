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

      const response =
        await reviewService.getMechanicReviews();

      setReviews(response.data.reviews || []);

      setStats(
        response.data.stats || {
          average_rating: 0,
          total_reviews: 0,
          rating_breakdown: {},
        }
      );
    } catch (err) {
      console.error(
        "Failed to load reviews:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load reviews."
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
            size={17}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-blue-600">
          Mechanic Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Reviews & Ratings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          See what your clients think about your
          inspection services.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Average Rating
          </p>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-bold text-slate-900">
              {Number(
                stats.average_rating || 0
              ).toFixed(1)}
            </span>

            <span className="pb-1 text-sm text-slate-400">
              / 5
            </span>
          </div>

          <div className="mt-3">
            {renderStars(
              Math.round(
                stats.average_rating || 0
              )
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Reviews
          </p>

          <p className="mt-4 text-4xl font-bold text-slate-900">
            {stats.total_reviews || 0}
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MessageSquareText size={17} />

            Client feedback
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-slate-500">
            Rating Breakdown
          </p>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                className="flex items-center gap-3"
              >
                <span className="w-3 text-sm font-semibold text-slate-600">
                  {rating}
                </span>

                <Star
                  size={15}
                  className="fill-amber-400 text-amber-400"
                />

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{
                      width:
                        stats.total_reviews > 0
                          ? `${
                              ((stats.rating_breakdown?.[
                                rating
                              ] || 0) /
                                stats.total_reviews) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>

                <span className="w-6 text-right text-xs font-medium text-slate-500">
                  {stats.rating_breakdown?.[
                    rating
                  ] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Client Reviews
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest feedback from your completed
          inspections.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Star
              size={26}
              className="text-slate-400"
            />
          </div>

          <h3 className="mt-4 font-semibold text-slate-900">
            No reviews yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Client reviews will appear here after
            completed inspections.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const vehicle =
              review.inspection_report
                ?.inspection_request?.vehicle;

            return (
              <article
                key={review.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserRound size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {review.client?.name ||
                            "Client"}
                        </h3>

                        <p className="text-xs text-slate-400">
                          {review.created_at
                            ? new Date(
                                review.created_at
                              ).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    {renderStars(review.rating)}

                    <p className="mt-1 text-right text-xs font-semibold text-slate-500">
                      {review.rating}/5
                    </p>
                  </div>
                </div>

                {vehicle && (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <Car size={16} />

                    {vehicle.brand} {vehicle.model}

                    {vehicle.year && (
                      <span>• {vehicle.year}</span>
                    )}
                  </div>
                )}

                {review.comment ? (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {review.comment}
                    </p>
                  </div>
                ) : (
                  <p className="mt-5 text-sm italic text-slate-400">
                    No written comment.
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