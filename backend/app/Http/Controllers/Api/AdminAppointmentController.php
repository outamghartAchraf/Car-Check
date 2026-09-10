<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;

class AdminAppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can access appointments.',
            ], 403);
        }

        $appointments = Appointment::with([
            'client:id,name,email',
            'mechanic:id,name,email',
            'inspectionRequest.vehicle',
            'inspectionReport',
        ])
            ->latest('appointment_date')
            ->latest('start_time')
            ->get();

        return response()->json([
            'appointments' => $appointments,
        ]);
    }

    /**
     * Display a specific appointment.
     */
    public function show(
        Request $request,
        Appointment $appointment
    ) {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can access appointments.',
            ], 403);
        }

        $appointment->load([
            'client:id,name,email',
            'mechanic:id,name,email',
            'inspectionRequest.vehicle',
            'inspectionReport',
        ]);

        return response()->json([
            'appointment' => $appointment,
        ]);
    }
}
