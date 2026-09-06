<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InspectionReport;
use App\Models\Review;

class ReviewController extends Controller
{
    public function store(
        Request $request,
        InspectionReport $inspectionReport
    ) {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json([
                'message' => 'Only clients can create reviews.',
            ], 403);
        }

        if ($inspectionReport->client_id !== $user->id) {
            return response()->json([
                'message' => 'You cannot review this inspection.',
            ], 403);
        }

 
        if ($inspectionReport->review()->exists()) {
            return response()->json([
                'message' => 'You have already reviewed this inspection.',
            ], 422);
        }

        $validated = $request->validate([
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],

            'comment' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ]);

        $review = Review::create([
            'inspection_report_id' => $inspectionReport->id,
            'client_id' => $user->id,
            'mechanic_id' => $inspectionReport->mechanic_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        $review->load([
            'client:id,name,email',
            'mechanic:id,name,email',
            'inspectionReport.inspectionRequest.vehicle',
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review,
        ], 201);
    }

 
    public function mechanicIndex(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' => 'Only mechanics can access these reviews.',
            ], 403);
        }

        $reviews = Review::with([
            'client:id,name,email',
            'inspectionReport.inspectionRequest.vehicle',
        ])
            ->where('mechanic_id', $user->id)
            ->latest()
            ->get();

        $totalReviews = $reviews->count();

        $averageRating = $totalReviews > 0
            ? round($reviews->avg('rating'), 1)
            : 0;

        $ratingBreakdown = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        return response()->json([
            'reviews' => $reviews,

            'stats' => [
                'average_rating' => $averageRating,
                'total_reviews' => $totalReviews,
                'rating_breakdown' => $ratingBreakdown,
            ],
        ]);
    }
}
