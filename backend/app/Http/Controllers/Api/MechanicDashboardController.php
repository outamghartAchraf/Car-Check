<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InspectionRequest;
use App\Models\Appointment;
use App\Models\InspectionReport;
use App\Models\Review;

class MechanicDashboardController extends Controller
{
     public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        $pendingRequestsCount = InspectionRequest::where(
            'status',
            'pending'
        )->count();

        $acceptedRequestsCount = InspectionRequest::where(
            'mechanic_id',
            $user->id
        )
            ->where('status', 'accepted')
            ->count();

        $appointmentsCount = Appointment::where(
            'mechanic_id',
            $user->id
        )->count();

        $completedInspectionsCount = InspectionReport::where(
            'mechanic_id',
            $user->id
        )->count();

 
        $averageRating = Review::where(
            'mechanic_id',
            $user->id
        )->avg('rating');

 
        $recentRequests = InspectionRequest::where(function ($query) use ($user) {

            $query->where('status', 'pending')
                ->orWhere('mechanic_id', $user->id);

        })
            ->with([
                'client:id,name',
                'vehicle:id,brand,model,year',
            ])
            ->latest()
            ->take(5)
            ->get();

 
        $upcomingAppointments = Appointment::where(
            'mechanic_id',
            $user->id
        )
            ->whereIn('status', [
                'pending',
                'confirmed'
            ])
            ->whereDate(
                'appointment_date',
                '>=',
                now()->toDateString()
            )
            ->with([
                'client:id,name',

                'inspectionRequest:id,vehicle_id,package,status',

                'inspectionRequest.vehicle:id,brand,model,year',
            ])
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->take(5)
            ->get();

 
        return response()->json([
            
            'statistics' => [
                'pending_requests' => $pendingRequestsCount,
                'accepted_requests' => $acceptedRequestsCount,
                'appointments' => $appointmentsCount,
                'completed_inspections' => $completedInspectionsCount,
                'average_rating' => round(
                    $averageRating ?? 0,
                    1
                ),

                
            ],
            'recent_requests' => $recentRequests,
            'upcoming_appointments' => $upcomingAppointments,
        ]);
    }
}
