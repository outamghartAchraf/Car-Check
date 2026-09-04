<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $vehicles = Vehicle::where(
            'user_id',
            $request->user()->id
        )
            ->latest()
            ->get();

        return response()->json([
            'vehicles' => $vehicles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],

            'year' => [
                'required',
                'integer',
                'min:1950',
                'max:' . now()->year,
            ],

            'mileage' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'registration_number' => [
                'nullable',
                'string',
                'max:100',
            ],

            'fuel_type' => [
                'nullable',
                'string',
                'max:50',
            ],

            'transmission' => [
                'nullable',
                'string',
                'max:50',
            ],
        ]);

        $vehicle = $request
            ->user()
            ->vehicles()
            ->create($validated);

        return response()->json([
            'message' => 'Vehicle created successfully.',
            'vehicle' => $vehicle,
        ], 201);
    }

    public function show(Request $request, Vehicle $vehicle)
    {
        $this->ensureOwner($request, $vehicle);

        return response()->json([
            'vehicle' => $vehicle,
        ]);
    }

    public function update(
        Request $request,
        Vehicle $vehicle
    ) {
        $this->ensureOwner($request, $vehicle);

        $validated = $request->validate([
            'brand' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'model' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'year' => [
                'sometimes',
                'required',
                'integer',
                'min:1950',
                'max:' . now()->year,
            ],

            'mileage' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'registration_number' => [
                'nullable',
                'string',
                'max:100',
            ],

            'fuel_type' => [
                'nullable',
                'string',
                'max:50',
            ],

            'transmission' => [
                'nullable',
                'string',
                'max:50',
            ],
        ]);

        $vehicle->update($validated);

        return response()->json([
            'message' => 'Vehicle updated successfully.',
            'vehicle' => $vehicle,
        ]);
    }

    public function destroy(
        Request $request,
        Vehicle $vehicle
    ) {
        $this->ensureOwner($request, $vehicle);

        $vehicle->delete();

        return response()->json([
            'message' => 'Vehicle deleted successfully.',
        ]);
    }

    private function ensureOwner(
        Request $request,
        Vehicle $vehicle
    ): void {
        if (
            $vehicle->user_id !==
            $request->user()->id
        ) {
            abort(403, 'Unauthorized.');
        }
    }
}
