<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\InspectionRequest;
use App\Models\Appointment;
use App\Models\InspectionReport;


class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Only admins can access this dashboard
        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }



        $clientsCount = User::where(
            'role',
            'client'
        )->count();

        $mechanicsCount = User::where(
            'role',
            'mechanic'
        )->count();

        $inspectionRequestsCount = InspectionRequest::count();

        $appointmentsCount = Appointment::count();

        $completedInspectionsCount = InspectionReport::count();
        $recentRequests = InspectionRequest::with([
            'client:id,name',
            'vehicle:id,brand,model,year',
            'mechanic:id,name',
        ])
            ->latest()
            ->take(5)
            ->get();

        $pendingMechanics = User::where('role', 'mechanic')
            ->whereHas('mechanicProfile', function ($query) {
                $query->where('certification_status', 'pending');
            })
            ->with('mechanicProfile')
            ->latest()
            ->take(5)
            ->get();

        $upcomingAppointments = Appointment::with([
            'client:id,name',
            'mechanic:id,name',
            'inspectionRequest:id,vehicle_id,package,status',
            'inspectionRequest.vehicle:id,brand,model,year',
        ])
            ->whereIn('status', [
                'pending',
                'confirmed'
            ])
            ->whereDate(
                'appointment_date',
                '>=',
                now()->toDateString()
            )
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->take(5)
            ->get();

        return response()->json([
            'statistics' => [
                'clients' => $clientsCount,
                'mechanics' => $mechanicsCount,
                'inspection_requests' => $inspectionRequestsCount,
                'appointments' => $appointmentsCount,
                'completed_inspections' => $completedInspectionsCount,
            ],

            'recent_requests' => $recentRequests,
            'pending_mechanics' => $pendingMechanics,
            'upcoming_appointments' => $upcomingAppointments,
        ]);
    }
}
