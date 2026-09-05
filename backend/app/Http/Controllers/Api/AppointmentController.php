<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\InspectionRequest;
use App\Models\MechanicAvailability;
use Carbon\Carbon;

class AppointmentController extends Controller
{
     public function index(Request $request)
    {
        $user = $request->user();

        $appointments = Appointment::with([
            'inspectionRequest.vehicle',
            'mechanic:id,name,email',
        ])
            ->where('client_id', $user->id)
            ->latest('appointment_date')
            ->latest('start_time')
            ->get();

        return response()->json([
            'appointments' => $appointments,
        ]);
    }

    /**
     * Create an appointment.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'inspection_request_id' => [
                'required',
                'integer',
                'exists:inspection_requests,id',
            ],

            'appointment_date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],

            'start_time' => [
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ]);

        $inspectionRequest = InspectionRequest::with([
            'vehicle',
            'mechanic',
            'appointment',
        ])->findOrFail(
            $validated['inspection_request_id']
        );

        // Make sure the request belongs to the current client
        if ($inspectionRequest->client_id !== $user->id) {
            return response()->json([
                'message' =>
                    'You cannot create an appointment for this request.',
            ], 403);
        }

        // Make sure a mechanic has accepted the request
        if (!$inspectionRequest->mechanic_id) {
            return response()->json([
                'message' =>
                    'This request has not been assigned to a mechanic yet.',
            ], 422);
        }

        // Only accepted requests can be scheduled
        if ($inspectionRequest->status !== 'accepted') {
            return response()->json([
                'message' =>
                    'Only accepted inspection requests can be scheduled.',
            ], 422);
        }

        // Prevent duplicate appointment
        if ($inspectionRequest->appointment) {
            return response()->json([
                'message' =>
                    'This inspection request already has an appointment.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Check mechanic schedule conflict
        |--------------------------------------------------------------------------
        */

        $conflict = Appointment::where(
            'mechanic_id',
            $inspectionRequest->mechanic_id
        )
            ->where(
                'appointment_date',
                $validated['appointment_date']
            )
            ->whereIn('status', [
                'pending',
                'confirmed',
            ])
            ->where(function ($query) use ($validated) {
                $query
                    ->where(
                        'start_time',
                        '<',
                        $validated['end_time']
                    )
                    ->where(
                        'end_time',
                        '>',
                        $validated['start_time']
                    );
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' =>
                    'This time slot is already booked.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Create appointment
        |--------------------------------------------------------------------------
        */

        $appointment = Appointment::create([
            'inspection_request_id' =>
                $inspectionRequest->id,

            'client_id' =>
                $user->id,

            'mechanic_id' =>
                $inspectionRequest->mechanic_id,

            'appointment_date' =>
                $validated['appointment_date'],

            'start_time' =>
                $validated['start_time'],

            'end_time' =>
                $validated['end_time'],

            'status' =>
                'confirmed',

            'notes' =>
                $validated['notes'] ?? null,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Update inspection request
        |--------------------------------------------------------------------------
        */

        $inspectionRequest->update([
            'status' => 'scheduled',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Load relationships
        |--------------------------------------------------------------------------
        */

        $appointment->load([
            'inspectionRequest.vehicle',
            'client:id,name,email',
            'mechanic:id,name,email',
        ]);

        return response()->json([
            'message' =>
                'Appointment created successfully.',

            'appointment' =>
                $appointment,
        ], 201);
    }

    /**
     * Show one appointment.
     */
    public function show(
        Request $request,
        Appointment $appointment
    ) {
        $user = $request->user();

        // Only client or mechanic can view it
        if (
            $appointment->client_id !== $user->id &&
            $appointment->mechanic_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $appointment->load([
            'inspectionRequest.vehicle',
            'client:id,name,email',
            'mechanic:id,name,email',
        ]);

        return response()->json([
            'appointment' => $appointment,
        ]);
    }

    /**
     * Cancel appointment.
     */
    public function cancel(
        Request $request,
        Appointment $appointment
    ) {
        $user = $request->user();

        // Only client can cancel
        if ($appointment->client_id !== $user->id) {
            return response()->json([
                'message' =>
                    'Only the client can cancel this appointment.',
            ], 403);
        }

        // Cannot cancel completed/cancelled appointment
        if (
            in_array(
                $appointment->status,
                ['completed', 'cancelled']
            )
        ) {
            return response()->json([
                'message' =>
                    'This appointment cannot be cancelled.',
            ], 422);
        }

        $appointment->update([
            'status' => 'cancelled',
        ]);

        // Make request available for scheduling again
        $appointment->inspectionRequest()->update([
            'status' => 'accepted',
        ]);

        return response()->json([
            'message' =>
                'Appointment cancelled successfully.',
        ]);
    }

    public function availableSlots(
    Request $request,
    InspectionRequest $inspectionRequest
) {
    $user = $request->user();

    // Only the client who owns the request can access its slots
    if ($inspectionRequest->client_id !== $user->id) {
        return response()->json([
            'message' => 'Unauthorized.'
        ], 403);
    }

    // A mechanic must already be assigned
    if (!$inspectionRequest->mechanic_id) {
        return response()->json([
            'message' => 'This inspection request has not been assigned to a mechanic yet.'
        ], 422);
    }

    // Request must be accepted
    if ($inspectionRequest->status !== 'accepted') {
        return response()->json([
            'message' => 'Only accepted inspection requests can be scheduled.'
        ], 422);
    }

    $validated = $request->validate([
        'date' => [
            'required',
            'date',
            'after_or_equal:today'
        ],
    ]);

    $date = Carbon::parse($validated['date']);

    /*
    |--------------------------------------------------------------------------
    | Get mechanic availability for this day
    |--------------------------------------------------------------------------
    */

    $availabilities = MechanicAvailability::where(
        'mechanic_id',
        $inspectionRequest->mechanic_id
    )
        ->where('day_of_week', $date->dayOfWeek)
        ->where('is_available', true)
        ->orderBy('start_time')
        ->get();

    /*
    |--------------------------------------------------------------------------
    | Get existing appointments for this mechanic/date
    |--------------------------------------------------------------------------
    */

    $appointments = Appointment::where(
        'mechanic_id',
        $inspectionRequest->mechanic_id
    )
        ->whereDate('appointment_date', $date->toDateString())
        ->whereIn('status', ['pending', 'confirmed'])
        ->orderBy('start_time')
        ->get();

    /*
    |--------------------------------------------------------------------------
    | Generate 1-hour slots
    |--------------------------------------------------------------------------
    */

    $slots = [];

    foreach ($availabilities as $availability) {

        $start = Carbon::parse(
            $date->toDateString() . ' ' . $availability->start_time
        );

        $end = Carbon::parse(
            $date->toDateString() . ' ' . $availability->end_time
        );

        while ($start->copy()->addHour()->lte($end)) {

            $slotStart = $start->copy();
            $slotEnd = $start->copy()->addHour();

            /*
            |--------------------------------------------------------------------------
            | Check if slot conflicts with an existing appointment
            |--------------------------------------------------------------------------
            */

            $isBooked = $appointments->contains(function ($appointment) use (
                $slotStart,
                $slotEnd
            ) {
                $appointmentStart = Carbon::parse(
                    $appointment->appointment_date->toDateString()
                    . ' '
                    . $appointment->start_time
                );

                $appointmentEnd = Carbon::parse(
                    $appointment->appointment_date->toDateString()
                    . ' '
                    . $appointment->end_time
                );

                return $appointmentStart->lt($slotEnd)
                    && $appointmentEnd->gt($slotStart);
            });

            $slots[] = [
                'start_time' => $slotStart->format('H:i'),
                'end_time' => $slotEnd->format('H:i'),
                'available' => !$isBooked,
            ];

            $start->addHour();
        }
    }

    return response()->json([
        'date' => $date->toDateString(),
        'slots' => $slots,
    ]);
}

public function mechanicIndex(Request $request)
{
    $user = $request->user();

    // Only mechanics can access their appointments
    if ($user->role !== 'mechanic') {
        return response()->json([
            'message' => 'Only mechanics can access appointments.',
        ], 403);
    }

    $appointments = Appointment::with([
        'inspectionRequest.vehicle',
        'client:id,name,email',
        'mechanic:id,name,email',
    ])
        ->where('mechanic_id', $user->id)
        ->latest('appointment_date')
        ->latest('start_time')
        ->get();

    return response()->json([
        'appointments' => $appointments,
    ]);
}

}
