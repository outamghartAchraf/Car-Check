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
                'message' => 'Only administrators can access this dashboard.',
            ], 403);
        }

        // Basic statistics
        $totalClients = User::where('role', 'client')->count();

        $totalMechanics = User::where('role', 'mechanic')->count();

        $totalVehicles = Vehicle::count();

        $totalInspectionRequests = InspectionRequest::count();

        $totalAppointments = Appointment::count();

        $totalCompletedInspections = InspectionReport::count();

        // Inspection request statistics
        $pendingRequests = InspectionRequest::where(
            'status',
            'pending'
        )->count();

        $acceptedRequests = InspectionRequest::where(
            'status',
            'accepted'
        )->count();

        $scheduledRequests = InspectionRequest::where(
            'status',
            'scheduled'
        )->count();

        $completedRequests = InspectionRequest::where(
            'status',
            'completed'
        )->count();

        $cancelledRequests = InspectionRequest::where(
            'status',
            'cancelled'
        )->count();

        $rejectedRequests = InspectionRequest::where(
            'status',
            'rejected'
        )->count();

        // Appointment statistics
        $pendingAppointments = Appointment::where(
            'status',
            'pending'
        )->count();

        $confirmedAppointments = Appointment::where(
            'status',
            'confirmed'
        )->count();

        $completedAppointments = Appointment::where(
            'status',
            'completed'
        )->count();

        $cancelledAppointments = Appointment::where(
            'status',
            'cancelled'
        )->count();

        // Mechanics waiting for certification
        $pendingMechanics = User::where('role', 'mechanic')
            ->whereHas('mechanicProfile', function ($query) {
                $query->where(
                    'certification_status',
                    'pending'
                );
            })
            ->count();

        return response()->json([
            'statistics' => [
                'total_clients' => $totalClients,
                'total_mechanics' => $totalMechanics,
                'total_vehicles' => $totalVehicles,
                'total_inspection_requests' => $totalInspectionRequests,
                'total_appointments' => $totalAppointments,
                'total_completed_inspections' => $totalCompletedInspections,
                'pending_mechanics' => $pendingMechanics,
            ],

            'inspection_requests' => [
                'pending' => $pendingRequests,
                'accepted' => $acceptedRequests,
                'scheduled' => $scheduledRequests,
                'completed' => $completedRequests,
                'cancelled' => $cancelledRequests,
                'rejected' => $rejectedRequests,
            ],

            'appointments' => [
                'pending' => $pendingAppointments,
                'confirmed' => $confirmedAppointments,
                'completed' => $completedAppointments,
                'cancelled' => $cancelledAppointments,
            ],
        ]);
    }
}
