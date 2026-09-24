<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\InspectionRequest;
use App\Models\Appointment;
use App\Models\InspectionReport;
use App\Models\Review;

class ClientDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Make sure only clients can access this dashboard
        if ($user->role !== 'client') {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

  
        $vehiclesCount = Vehicle::where('user_id', $user->id)
            ->count();

        $inspectionRequestsCount = InspectionRequest::where(
            'client_id',
            $user->id
        )->count();

        $appointmentsCount = Appointment::where(
            'client_id',
            $user->id
        )->count();

        $reportsCount = InspectionReport::where(
            'client_id',
            $user->id
        )->count();
    

        $requestsByStatus = [
            'pending' => InspectionRequest::where('client_id', $user->id)
                ->where('status', 'pending')
                ->count(),

            'accepted' => InspectionRequest::where('client_id', $user->id)
                ->where('status', 'accepted')
                ->count(),

            'scheduled' => InspectionRequest::where('client_id', $user->id)
                ->where('status', 'scheduled')
                ->count(),

            'completed' => InspectionRequest::where('client_id', $user->id)
                ->where('status', 'completed')
                ->count(),

            'cancelled' => InspectionRequest::where('client_id', $user->id)
                ->where('status', 'cancelled')
                ->count(),

            'rejected' => InspectionRequest::where('client_id', $user->id)
                ->where('status', 'rejected')
                ->count(),
        ];

  

        $recentRequests = InspectionRequest::where(
            'client_id',
            $user->id
        )
            ->with([
                'vehicle:id,brand,model,year',
                'mechanic:id,name',
            ])
            ->latest()
            ->take(5)
            ->get();



        $upcomingAppointments = Appointment::where(
            'client_id',
            $user->id
        )
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('appointment_date', '>=', now()->toDateString())
            ->with([
                'vehicle' => function ($query) {
                    $query->select(
                        'vehicles.id',
                        'vehicles.brand',
                        'vehicles.model',
                        'vehicles.year'
                    );
                },
                'mechanic:id,name',
                'inspectionRequest:id,vehicle_id,package,status',
            ])
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->take(5)
            ->get();

      $averageRating = Review::where(
    'client_id',
    $user->id
)->avg('rating');

        return response()->json([
            'statistics' => [
                'vehicles' => $vehiclesCount,
                'inspection_requests' => $inspectionRequestsCount,
                'appointments' => $appointmentsCount,
                'reports' => $reportsCount,
                'average_rating' => round($averageRating ?? 0, 1),
            ],

            'requests_by_status' => $requestsByStatus,

            'recent_requests' => $recentRequests,

            'upcoming_appointments' => $upcomingAppointments,
        ]);
    }
}
