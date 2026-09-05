<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MechanicAvailability;

class MechanicAvailabilityController extends Controller
{
     public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' =>
                    'Only mechanics can access availability.',
            ], 403);
        }

        $availabilities = MechanicAvailability::where(
            'mechanic_id',
            $user->id
        )
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'availabilities' => $availabilities,
        ]);
    }

    /**
     * Create availability.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' =>
                    'Only mechanics can create availability.',
            ], 403);
        }

        $validated = $request->validate([
            'day_of_week' => [
                'required',
                'integer',
                'between:0,6',
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

            'is_available' => [
                'sometimes',
                'boolean',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Check duplicate
        |--------------------------------------------------------------------------
        */

        $exists = MechanicAvailability::where(
            'mechanic_id',
            $user->id
        )
            ->where(
                'day_of_week',
                $validated['day_of_week']
            )
            ->where(
                'start_time',
                $validated['start_time']
            )
            ->where(
                'end_time',
                $validated['end_time']
            )
            ->exists();

        if ($exists) {
            return response()->json([
                'message' =>
                    'This availability already exists.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Create availability
        |--------------------------------------------------------------------------
        */

        $availability = MechanicAvailability::create([
            'mechanic_id' =>
                $user->id,

            'day_of_week' =>
                $validated['day_of_week'],

            'start_time' =>
                $validated['start_time'],

            'end_time' =>
                $validated['end_time'],

            'is_available' =>
                $validated['is_available'] ?? true,
        ]);

        return response()->json([
            'message' =>
                'Availability created successfully.',

            'availability' =>
                $availability,
        ], 201);
    }

    /**
     * Update availability.
     */
    public function update(
        Request $request,
        MechanicAvailability $availability
    ) {
        $user = $request->user();

        if (
            $user->role !== 'mechanic' ||
            $availability->mechanic_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'day_of_week' => [
                'sometimes',
                'required',
                'integer',
                'between:0,6',
            ],

            'start_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'is_available' => [
                'sometimes',
                'boolean',
            ],
        ]);

        if (
            isset($validated['start_time']) &&
            isset($validated['end_time']) &&
            $validated['end_time'] <= $validated['start_time']
        ) {
            return response()->json([
                'message' =>
                    'End time must be after start time.',
            ], 422);
        }

        $availability->update($validated);

        return response()->json([
            'message' =>
                'Availability updated successfully.',

            'availability' =>
                $availability->fresh(),
        ]);
    }

    /**
     * Delete availability.
     */
    public function destroy(
        Request $request,
        MechanicAvailability $availability
    ) {
        $user = $request->user();

        if (
            $user->role !== 'mechanic' ||
            $availability->mechanic_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $availability->delete();

        return response()->json([
            'message' =>
                'Availability deleted successfully.',
        ]);
    }
}
