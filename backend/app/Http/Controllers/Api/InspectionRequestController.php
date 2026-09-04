<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InspectionRequest;
use App\Models\Vehicle;

class InspectionRequestController extends Controller
{
    public function index(Request $request)
    {
        $requests = InspectionRequest::with([
            'vehicle',
            'mechanic:id,name,email',
        ])
            ->where(
                'client_id',
                $request->user()->id
            )
            ->latest()
            ->get();

        return response()->json([
            'inspection_requests' => $requests,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => [
                'required',
                'integer',
                'exists:vehicles,id',
            ],

            'package' => [
                'required',
                'in:standard,complete',
            ],

            'location' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'preferred_date' => [
                'nullable',
                'date',
                'after_or_equal:today',
            ],

            'preferred_time' => [
                'nullable',
                'date_format:H:i',
            ],
        ]);

        $vehicle = Vehicle::findOrFail(
            $validated['vehicle_id']
        );

        if (
            $vehicle->user_id !==
            $request->user()->id
        ) {
            return response()->json([
                'message' =>
                'You cannot create an inspection request for this vehicle.',
            ], 403);
        }

        $inspectionRequest =
            InspectionRequest::create([
                'client_id' =>
                $request->user()->id,

                'vehicle_id' =>
                $vehicle->id,

                'package' =>
                $validated['package'],

                'location' =>
                $validated['location'],

                'description' =>
                $validated['description'] ?? null,

                'preferred_date' =>
                $validated['preferred_date'] ?? null,

                'preferred_time' =>
                $validated['preferred_time'] ?? null,

                'status' => 'pending',
            ]);

        $inspectionRequest->load('vehicle');

        return response()->json([
            'message' =>
            'Inspection request created successfully.',

            'inspection_request' =>
            $inspectionRequest,
        ], 201);
    }

    public function show(
        Request $request,
        InspectionRequest $inspectionRequest
    ) {
        $this->ensureOwner(
            $request,
            $inspectionRequest
        );

        $inspectionRequest->load([
            'vehicle',
            'mechanic:id,name,email',
        ]);

        return response()->json([
            'inspection_request' =>
            $inspectionRequest,
        ]);
    }

    public function update(
        Request $request,
        InspectionRequest $inspectionRequest
    ) {
        $this->ensureOwner(
            $request,
            $inspectionRequest
        );

        if (
            !in_array(
                $inspectionRequest->status,
                ['pending']
            )
        ) {
            return response()->json([
                'message' =>
                'This inspection request can no longer be edited.',
            ], 422);
        }

        $validated = $request->validate([
            'package' => [
                'sometimes',
                'required',
                'in:standard,complete',
            ],

            'location' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'preferred_date' => [
                'nullable',
                'date',
                'after_or_equal:today',
            ],

            'preferred_time' => [
                'nullable',
                'date_format:H:i',
            ],
        ]);

        $inspectionRequest->update(
            $validated
        );

        return response()->json([
            'message' =>
            'Inspection request updated successfully.',

            'inspection_request' =>
            $inspectionRequest->fresh('vehicle'),
        ]);
    }

    public function cancel(
        Request $request,
        InspectionRequest $inspectionRequest
    ) {
        $this->ensureOwner(
            $request,
            $inspectionRequest
        );

        if (
            in_array(
                $inspectionRequest->status,
                ['completed', 'cancelled']
            )
        ) {
            return response()->json([
                'message' =>
                'This request cannot be cancelled.',
            ], 422);
        }

        $inspectionRequest->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' =>
            'Inspection request cancelled successfully.',

            'inspection_request' =>
            $inspectionRequest,
        ]);
    }

    private function ensureOwner(
        Request $request,
        InspectionRequest $inspectionRequest
    ): void {
        if (
            $inspectionRequest->client_id !==
            $request->user()->id
        ) {
            abort(403, 'Unauthorized.');
        }
    }
}
